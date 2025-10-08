import { Request, Response, NextFunction } from "express";

export const authenticateSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    message: "Not Authenticated",
    data: null,
  });
};
