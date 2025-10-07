import { calcTime } from "@/helper/calcTime";
import dotenv from "dotenv";

dotenv.config();

export const loadSessionConfig = () => {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error("SESSION_SECRET is not defined in environment variables");
  }
  const sessionConfig = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: calcTime(1, "hour") // 1 hour
    },
  };
  return sessionConfig;
};
