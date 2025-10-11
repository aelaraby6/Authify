import crypto from "crypto";
import { calcTime } from "@/helper/calcTime";

const OTPLength = 6;

export const generateOTP = (): string => {
  return crypto
    .randomInt(Math.pow(10, OTPLength - 1), Math.pow(10, OTPLength))
    .toString();
};

export const expireOTP = () => {
  return Date.now() + calcTime(5, "minute"); // OTP valid for 5 minutes
};
