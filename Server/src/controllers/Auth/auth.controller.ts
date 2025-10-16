import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} from "@/Errors/error";
import User from "@/models/User/user.model";
import { ComparePassword, hashPassword } from "@/services/password.service";
import { Request, Response, NextFunction } from "express";
import { generateOTP, expireOTP } from "@/services/otp.service";
import { sendOTPEmail } from "@/services/email.service";
import {
  generateAccessToken,
  generateTokens,
  verifyRefreshToken,
} from "@/services/jwt.service";
import { calcTime } from "@/helper/calcTime";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import Jwt from "jsonwebtoken";

// Signup Controller
export const SignUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const email = data.email.toLowerCase();

    if (!data.name || !data.email || !data.password) {
      throw new BadRequestError("All fields are required");
    }

    const existingUser = await User.findOne({ email });

    if (
      existingUser &&
      existingUser.is_deleted === false &&
      existingUser.is_active === true
    ) {
      throw new BadRequestError("user already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    let newUser;

    if (existingUser && existingUser.is_deleted === true) {
      existingUser.name = data.name;
      existingUser.password = hashedPassword;
      existingUser.phone = data.phone;
      existingUser.role = data.role || "user";
      existingUser.is_deleted = false;
      existingUser.isMfaActive = false;
      existingUser.is_active = true;

      await existingUser.save();
      newUser = existingUser;
    } else {
      newUser = new User({
        ...data,
        email,
        password: hashedPassword,
        isMfaActive: false,
        role: data.role || "user",
      });
      await newUser.save();
    }

    const payload = {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      _id: newUser._id.toString(),
      role: newUser.role,
    };

    const { accessToken, refreshToken } = generateTokens(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: calcTime(7, "day"),
    });

    const userResponse = {
      ...newUser.toObject(),
      password: undefined,
      __v: undefined,
      is_deleted: undefined,
      is_active: undefined,
    };

    res.status(201).json({
      message: "User registered successfully",
      data: userResponse,
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// Login Controller
export const LoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as any;

  const payload = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    _id: user._id.toString(),
    role: user.role,
  };

  const { accessToken, refreshToken } = generateTokens(payload);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: calcTime(7, "day"),
  });

  res.status(200).json({
    message: "Login successful",
    data: user,
    token: accessToken,
  });
};

export const authStatusController = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(200).json({ message: "Not Authenticated", data: null });
  }
  res.status(200).json({ message: "user authenticated", data: req.user });
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user is authenticated (either session or OAuth)
    if (!req.user && !req.headers.authorization) {
      return res.status(200).json({
        success: true,
        message: "Already logged out",
        data: null,
      });
    }

    // Handle session-based logout (includes OAuth users with sessions)
    if (req.user) {
      req.logout((err) => {
        if (err) {
          console.error("Passport logout error:", err);
          return res.status(500).json({
            success: false,
            message: "Error during logout",
            error: err.message,
          });
        }
      });
    }

    // Clear all authentication cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.clearCookie("connect.sid", cookieOptions); // Express session cookie

    // Destroy session if it exists
    if (req.session) {
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          console.error("Session destruction error:", sessionErr);
          return res.status(500).json({
            success: false,
            message: "Error destroying session",
            error: sessionErr.message,
          });
        }

        res.status(200).json({
          success: true,
          message: "Logout successful",
          data: null,
        });
      });
    } else {
      // No session to destroy
      res.status(200).json({
        success: true,
        message: "Logout successful",
        data: null,
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
    next(error);
  }
};

export const twoFASetupController = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    // Generate a new secret
    const secret = speakeasy.generateSecret({
      name: `Authify (${user.email})`,
      issuer: "Authify",
      length: 32,
    });

    // Save the secret to the user
    user.twoFactorSecret = secret.base32;
    user.isMfaActive = true;
    await user.save();

    // Generate QR code URL
    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `Authify (${user.email})`,
      issuer: "Authify",
      encoding: "base32",
    });

    // Generate QR code
    const qrCodeDataURL = await qrcode.toDataURL(url);

    res.status(200).json({
      message: "2FA setup successful",
      secret: secret.base32,
      qrCodeDataURL,
      manualEntryKey: secret.base32, // For manual entry in authenticator apps
    });
  } catch (err) {
    console.error("Error setting up 2FA:", err);
    res.status(500).json({ message: "Error setting up 2FA", error: err });
  }
};

export const twoFAVerifyController = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const user = req.user as any;

    if (!token) {
      return res.status(400).json({ message: "2FA token is required" });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({ message: "2FA not set up for this user" });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token.toString(), // Ensure token is string
      window: 2, // Allow 2 time steps of tolerance (60 seconds before and after)
    });

    if (verified) {
      const jwtToken = Jwt.sign(
        { name: user.name },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "1hr" }
      );
      res.status(200).json({ message: "2FA verified", token: jwtToken });
    } else {
      res.status(400).json({ message: "Invalid 2FA token" });
    }
  } catch (error) {
    console.error("2FA Verification Error:", error);
    res.status(500).json({ message: "Error verifying 2FA token" });
  }
};

export const twoFAResetController = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    user.twoFactorSecret = "";
    user.isMfaActive = false;
    await user.save();
    res.status(200).json({ message: "2FA reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting 2FA" });
  }
};

// Forgot Password Controller
export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new BadRequestError("Email is required");
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      is_deleted: false,
      is_active: true,
    });

    if (!user) {
      throw new NotFoundError("User not found with this email address");
    }

    // Generate OTP and set expiry
    const otp = generateOTP();
    const otpExpiry = new Date(expireOTP());

    // Save OTP to user document
    user.resetOTP = otp;
    user.otpExpires = otpExpiry;
    await user.save();

    // Send OTP email
    await sendOTPEmail(user.email, "Reset Your Password - Authify", {
      userName: user.name,
      otpCode: otp,
      expiryTime: 5, // 5 minutes
    });

    res.status(200).json({
      message: "Password reset OTP sent to your email address",
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

// Verify Reset OTP Controller
export const verifyResetOTPController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new BadRequestError("Email and OTP are required");
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      is_deleted: false,
      is_active: true,
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Check if OTP exists and is not expired
    if (!user.resetOTP || !user.otpExpires) {
      throw new BadRequestError("No password reset request found");
    }

    const currentTime = new Date();
    const expiryTime = new Date(user.otpExpires);

    if (expiryTime < currentTime) {
      throw new BadRequestError("OTP has expired. Please request a new one");
    }

    if (user.resetOTP !== otp) {
      throw new UnAuthorizedError("Invalid OTP");
    }

    res.status(200).json({
      message: "OTP verified successfully. You can now reset your password",
      verified: true,
    });
  } catch (error) {
    next(error);
  }
};

// Reset Password Controller
export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, newPassword, confirmNewPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmNewPassword) {
      throw new BadRequestError("All fields are required");
    }

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestError("Passwords do not match");
    }

    if (newPassword.length < 6) {
      throw new BadRequestError("Password must be at least 6 characters long");
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      is_deleted: false,
      is_active: true,
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Verify OTP again
    if (!user.resetOTP || !user.otpExpires) {
      throw new BadRequestError("No password reset request found");
    }

    const currentTime = new Date();
    const expiryTime = new Date(user.otpExpires);

    if (expiryTime < currentTime) {
      throw new BadRequestError("OTP has expired. Please request a new one");
    }

    if (user.resetOTP !== otp) {
      throw new UnAuthorizedError("Invalid OTP");
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and clear OTP fields
    user.password = hashedPassword;
    user.resetOTP = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      message:
        "Password reset successfully. You can now login with your new password",
    });
  } catch (error) {
    next(error);
  }
};

// Update Password Controller (for authenticated users)
export const updatePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      throw new BadRequestError("All fields are required");
    }

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestError("New passwords do not match");
    }

    if (newPassword.length < 6) {
      throw new BadRequestError("Password must be at least 6 characters long");
    }

    const user = (req as any).user;
    if (!user) {
      throw new UnAuthorizedError("User not authenticated");
    }

    // Verify current password
    const isCurrentPasswordValid = await ComparePassword(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      throw new UnAuthorizedError("Current password is incorrect");
    }

    // Check if new password is different from current password
    const isSamePassword = await ComparePassword(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestError(
        "New password must be different from current password"
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// refresh token
export const RefreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new UnAuthorizedError("Refresh token missing");

    const payload = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(payload);

    res.status(200).json({
      message: "Access token refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};
