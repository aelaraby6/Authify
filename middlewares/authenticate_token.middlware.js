import { verifyToken } from "../services/jwt.service.js";
import User from "../models/User/user.model.js";
import { UnAuthorizedError } from "../Errors/error.js";

export const authenticateToken = async (req, res, next) => {
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
