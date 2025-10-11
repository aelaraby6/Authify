import { BadRequestError } from "@/Errors/error";
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: true });

    if (error) {
      return next(
        new BadRequestError(
          error.details
            .map((err: Joi.ValidationErrorItem) => err.message)
            .join(", ")
        )
      );
    }

    req.body = value;
    next();
  };
};
