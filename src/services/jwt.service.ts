import Jwt from "jsonwebtoken";
import { UnAuthorizedError } from "@/Errors/error";
import { IJWTPayload } from "@/types/index";

export const generateToken = (
  name: string,
  email: string,
  phone: string | undefined,
  _id: string,
  role?: string
): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const expiresIn = "30d";
  const payload: IJWTPayload = { name, email, phone, _id, role };
  const token = Jwt.sign(payload, secret, { expiresIn });
  return token;
};

export const verifyToken = (token: string): IJWTPayload => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decodedToken = Jwt.verify(token, secret) as IJWTPayload;
    return decodedToken;
  } catch (error) {
    throw new UnAuthorizedError("Invalid or expired Token");
  }
};
