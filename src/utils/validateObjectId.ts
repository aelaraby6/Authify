import mongoose from "mongoose";
import { BadRequestError } from "@/Errors/error";

export const validateObjectId = (
  id: string,
  fieldName: string = "id"
): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError(`Invalid ${fieldName}`);
  }
};
