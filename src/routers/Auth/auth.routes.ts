import { Router } from "express";
import {
  signupLimiter,
  loginLimiter,
} from "@/middlewares/rate_limiter.middleware";
import {
  SignUpController,
  LoginController,
} from "@/controllers/Auth/auth.controller";
import {
  SignUpSchema,
  LoginSchema,
} from "@/validations/Auth/auth.validation";
import { validate } from "@/middlewares/validate.middleware";

const router = Router();

router.post("/signup", signupLimiter, validate(SignUpSchema), SignUpController);
router.post("/login", loginLimiter, validate(LoginSchema), LoginController);

export { router as AuthRouter };
