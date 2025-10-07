import { BadRequestError, UnAuthorizedError } from "@/Errors/error";
import { generateToken } from "@/services/jwt.service";
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
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.is_deleted || !user.is_active) {
      throw new UnAuthorizedError("Invalid credentials");
    }

    const isPasswordValid = await ComparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnAuthorizedError("Invalid credentials");
    }

    const token = generateToken(
      user.name,
      user.email,
      user.phone,
      user._id.toString()
    );

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
      token,
    });
  } catch (error) {
    next(error);
  }
};
