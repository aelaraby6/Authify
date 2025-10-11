import { Document } from "mongoose";
import { Request } from "express";

// User interface extending Mongoose Document
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: string;
  is_deleted: boolean;
  is_active: boolean;
  isMfaActive?: boolean;
  twoFactorSecret?: string;
  resetOTP?: string;
  otpExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// JWT Payload interface
export interface IJWTPayload {
  name: string;
  email: string;
  phone?: string;
  _id: string;
  role?: string;
}

// Extended Request interface with user
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// Custom Error interface
export interface CustomError extends Error {
  statusCode: number;
}
