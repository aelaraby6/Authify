import mongoose from "mongoose";
import { ROLES, DEFAULT_ROLE } from "@/utils/constants";
import { IUser } from "@/types/index";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      required: false,
    },

    password: {
      type: String,
      required: false,
    },

    phone: {
      type: String,
      required: false,
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: DEFAULT_ROLE,
      required: true,
    },

    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    avatar: {
      type: String,
    },

    provider: {
      type: String,
      enum: ["local", "github", "google"], 
      default: "local",
    },

    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },

    isMfaActive: {
      type: Boolean,
      required: false,
    },
    twoFactorSecret: {
      type: String,
    },
    resetOTP: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    isVerifiedForReset: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
