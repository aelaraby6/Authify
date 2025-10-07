import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} from "@/Errors/error";
import { generateToken } from "@/services/jwt.service";
import User from "@/models/User/user.model";
import { ComparePassword, hashPassword } from "@/services/password.service";
import { Request, Response, NextFunction } from "express";
import { generateOTP, expireOTP } from "@/services/otp.service";
import { sendOTPEmail } from "@/services/email.service";

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
      existingUser.is_active = true;
      existingUser.isMfaActive = false;

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

    const token = generateToken(
      newUser.name,
      newUser.email,
      newUser.phone,
      newUser._id.toString(),
      newUser.role
    );

    const userResponse = {
      ...newUser.toObject(),
      password: undefined,
      __v: undefined,
      is_deleted: undefined,
      is_active: undefined,
    };

    res.status(201).json({
      message:
        existingUser && existingUser.is_deleted
          ? "User reactivated successfully"
          : "User registered successfully",
      data: userResponse,
      token,
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

  const token = generateToken(
    user.name,
    user.email,
    user.phone,
    user._id.toString()
  );

  res.status(200).json({
    message: "Login successful",
    data: user,
    token,
  });
};

export const authStatusController = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(200).json({ message: "Not Authenticated", data: null });
  }
  res.status(200).json({ message: "Auth status", data: req.user });
};

export const logoutController = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(200).json({ message: "Not Authenticated", data: null });
  }
  req.logout((err) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized user", error: err });
    }
    res.status(200).json({ message: "Logout successful", data: null });
  });
};

export const twoFASetupController = async (req: Request, res: Response) => {};

export const twoFAVerifyController = async (req: Request, res: Response) => {};

export const twoFAResetController = async (req: Request, res: Response) => {};

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
