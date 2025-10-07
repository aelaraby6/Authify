import { Request, Response, NextFunction } from "express";
import { CustomError } from "@/types/index";

interface ErrorResponse {
  status: number;
  message: string;
  errors?: any;
}

const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  const errorResponse: ErrorResponse = {
    status,
    message,
  };

  if ((err as any).data) {
    errorResponse.errors = (err as any).data;
  }

  res.status(status).json(errorResponse);
};

export default globalErrorHandler;
