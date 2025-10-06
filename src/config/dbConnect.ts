import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const URL: string = process.env.MONGODB_URL || "";

  if (!URL) {
    throw new Error("MONGODB_URL is not defined in environment variables");
  }

  try {
    await mongoose.connect(URL);
    console.log("Connected to Database");
  } catch (error) {
    console.error("Error connecting to Database:", error);
    throw error;
  }
};
