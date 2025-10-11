import { verifyToken } from "@/services/jwt.service";
import User from "@/models/User/user.model";
import { UnAuthorizedError } from "@/Errors/error";
import { Request, Response, NextFunction } from "express";

export const authenticateToken = async (
  req: Request,
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

    (req as any).user = user;
    
    next();
  } catch (error) {
    next(error);
  }
};
