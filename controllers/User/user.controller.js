import { NotFoundError } from "../../Errors/error.js";
import User from "../../models/User/user.model.js";

export const GetUserProfileController = async (req, res, next) => {
  try {
    const userId = req.user._id;

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
