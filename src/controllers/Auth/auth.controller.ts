import { BadRequestError, UnAuthorizedError } from "@/Errors/error";
import {
  generateAccessToken,
  generateTokens,
  verifyRefreshToken,
} from "@/services/jwt.service";
import User from "@/models/User/user.model";
import { ComparePassword, hashPassword } from "@/services/password.service";
import { Request, Response, NextFunction } from "express";

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

      await existingUser.save();
      newUser = existingUser;
    } else {
      newUser = new User({
        ...data,
        email,
        password: hashedPassword,
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
      accessToken,
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
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.is_deleted || !user.is_active) {
      throw new UnAuthorizedError("Invalid credentials");
    }

    const isPasswordValid: boolean = await ComparePassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnAuthorizedError("Invalid credentials");
    }

    const payload = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      _id: user._id.toString(),
      role: user.role,
    };

    const { accessToken, refreshToken } = generateTokens(payload);

    // Store refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userResponse = {
      ...user.toObject(),
      password: undefined,
      __v: undefined,
      is_deleted: undefined,
      is_active: undefined,
    };

    res.status(200).json({
      message: "Login successful",
      data: userResponse,
      accessToken,
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

// logout
export const LogoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
