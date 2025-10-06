import Jwt from "jsonwebtoken";
import { UnAuthorizedError } from "../Errors/error.js";

export const generateToken = (name, email, phone, _id) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = "30d";
  const token = Jwt.sign({ name, email, phone, _id }, secret, { expiresIn });
  return token;
};

export const verifyToken = (token) => {
  try {
    const decodedToken = Jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken;
  } catch (error) {
    throw new UnAuthorizedError("Invalid or expired Token");
  }
};
