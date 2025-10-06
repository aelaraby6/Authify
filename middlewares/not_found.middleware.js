import { NotFoundError } from "../Errors/error.js";

export const notFoundMiddleware = (req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
};
