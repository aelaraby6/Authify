import mongoose from "mongoose";
import { BadRequestError } from "../Errors/error.js";

export const validateObjectId = (id, fieldName = "id") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError(`Invalid ${fieldName}`);
  }
};
