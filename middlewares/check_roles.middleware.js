import { ForbiddenError, UnAuthorizedError } from "../Errors/error.js";

export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!userRole) {
      return new UnAuthorizedError("Unauthorized");
    }

    if (!allowedRoles.includes(userRole)) {
      return new ForbiddenError("Forbidden: You don't have permission");
    }
    next();
  };
};
