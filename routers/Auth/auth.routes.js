import { Router } from "express";
import {
  signupLimiter,
  loginLimiter,
} from "../../middlewares/rate_limiter.middleware.js";
import {
  SignUpController,
  LoginController,
} from "../../controllers/Auth/auth.controller.js";
import {
  SignUpSchema,
  LoginSchema,
} from "../../validations/Auth/auth.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

router.post("/signup", signupLimiter, validate(SignUpSchema), SignUpController);
router.post("/login", loginLimiter, validate(LoginSchema), LoginController);

export { router as AuthRouter };
