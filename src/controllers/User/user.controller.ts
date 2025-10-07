import { NotFoundError } from "@/Errors/error";
import User from "@/models/User/user.model";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/types/index";

export const GetUserProfileController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new NotFoundError("User not authenticated");
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
