import { z } from "zod";

const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long")
  .refine(
    (val) => /[a-z]/.test(val),
    "Password must contain a lowercase letter"
  )
  .refine(
    (val) => /[A-Z]/.test(val),
    "Password must contain an uppercase letter"
  )
  .refine((val) => /\d/.test(val), "Password must contain a number")
  .refine(
    (val) => /[!@#$%^&*(),.?":{}|<>_\-\\/[\]]/.test(val),
    "Password must contain a special character"
  );

export const signUpSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Invalid email"),
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username can't exceed 30 characters")
      .regex(
        /^[a-zA-Z0-9\-_]+$/,
        "Username can contain letters, numbers, - and _ only"
      ),
    password: passwordRules,
    confirmPassword: z.string(),
    displayName: z.string().max(50).optional(),
    captchaToken: z.string().optional(),
    termsAccepted: z
      .boolean()
      .refine((v) => v === true, "You must accept the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
  captchaToken: z.string().optional(),
});
