import { ForbiddenError, UnAuthorizedError } from "@/Errors/error.js";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/types/index.js";

export const checkRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return next(new UnAuthorizedError("Unauthorized"));
    }

    if (!allowedRoles.includes(userRole)) {
      return next(new ForbiddenError("Forbidden: You don't have permission"));
    }
    next();
  };
};
