import { verifyToken } from "@/services/jwt.service";
import User from "@/models/User/user.model";
import { UnAuthorizedError } from "@/Errors/error";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/types/index";

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      throw new UnAuthorizedError("Token Not provided");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UnAuthorizedError("Token Not provided");
    }

    const decodedToken = verifyToken(token);

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new UnAuthorizedError("Invalid or expired Token");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
