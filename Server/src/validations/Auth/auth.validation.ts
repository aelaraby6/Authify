import Joi from "joi";
import { ROLES, DEFAULT_ROLE } from "@/utils/constants";

// Signup
export const SignUpSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 1 characters",
    "string.max": "Name must be less than or equal to 100 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).max(128).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password must be less than or equal to 128 characters",
    "any.required": "Password is required",
  }),

  role: Joi.string()
    .valid(...Object.values(ROLES))
    .default(DEFAULT_ROLE)
    .messages({
      "any.only": "Role must be either 'user' or 'admin'",
      "string.base": "Role must be a string",
    }),
});

// login
export const LoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email",
    "any.required": "Email is mandatory",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is mandatory",
  }),
});

// Forgot Password
export const ForgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email",
    "any.required": "Email is mandatory",
  }),
});

// Verify Reset OTP
export const VerifyResetOTPSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email",
    "any.required": "Email is mandatory",
  }),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.empty": "OTP is required",
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "any.required": "OTP is mandatory",
    }),
});

// Reset Password
export const ResetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email",
    "any.required": "Email is mandatory",
  }),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.empty": "OTP is required",
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "any.required": "OTP is mandatory",
    }),
  newPassword: Joi.string().min(6).max(128).required().messages({
    "string.min": "New password must be at least 6 characters",
    "string.max": "New password must be less than or equal to 128 characters",
    "string.empty": "New password is required",
    "any.required": "New password is mandatory",
  }),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password must match new password",
      "string.empty": "Confirm password is required",
      "any.required": "Confirm password is mandatory",
    }),
});

// Update Password (for authenticated users)
export const UpdatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Current password is required",
    "any.required": "Current password is mandatory",
  }),
  newPassword: Joi.string().min(6).max(128).required().messages({
    "string.min": "New password must be at least 6 characters",
    "string.max": "New password must be less than or equal to 128 characters",
    "string.empty": "New password is required",
    "any.required": "New password is mandatory",
  }),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password must match new password",
      "string.empty": "Confirm password is required",
      "any.required": "Confirm password is mandatory",
    }),
});
