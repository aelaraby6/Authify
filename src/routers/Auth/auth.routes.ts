import { Request, Response, NextFunction, Router } from "express";
import {
  signupLimiter,
  loginLimiter,
} from "@/middlewares/rate_limiter.middleware";
import {
  SignUpController,
  LoginController,
  authStatusController,
  logoutController,
  twoFASetupController,
  twoFAVerifyController,
  twoFAResetController,
  forgotPasswordController,
  verifyResetOTPController,
  resetPasswordController,
  updatePasswordController,
} from "@/controllers/Auth/auth.controller";
import { authenticateSession } from "@/middlewares/authenticate_session.middleware";
import {
  SignUpSchema,
  LoginSchema,
  ForgotPasswordSchema,
  VerifyResetOTPSchema,
  ResetPasswordSchema,
  UpdatePasswordSchema,
} from "@/validations/Auth/auth.validation";
import { validate } from "@/middlewares/validate.middleware";
import passport from "passport";
import { authenticateToken } from "@/middlewares/authenticate_token.middlware";

const router = Router();

router.post("/signup", signupLimiter, validate(SignUpSchema), SignUpController);
router.post("/login", loginLimiter, validate(LoginSchema), (req, res, next) => {
  passport.authenticate(
    "local",
    (err: { message: any }, user: any, info: { message: any }) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Server error",
          error: err.message,
        });
      }
      if (!user) {
        return res.status(401).json({
          success: false,
          message: info?.message || "Invalid credentials",
        });
      }

      // Establish session
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Session error",
            error: err.message,
          });
        }
        return LoginController(req, res, next);
      });
    }
  )(req, res, next);
});
router.get("/status", authenticateSession, authStatusController);
router.post("/logout", authenticateSession, logoutController);

// Password Reset Routes
router.post(
  "/forgot-password",
  validate(ForgotPasswordSchema),
  forgotPasswordController
);
router.post(
  "/verify-reset-otp",
  validate(VerifyResetOTPSchema),
  verifyResetOTPController
);
router.post(
  "/reset-password",
  validate(ResetPasswordSchema),
  resetPasswordController
);

// Update Password (requires authentication)
router.post(
  "/update-password",
  authenticateToken,
  validate(UpdatePasswordSchema),
  updatePasswordController
);

// 2FA Routes
router.post("/2FA/setup", authenticateSession, twoFASetupController);
router.post("/2FA/verify", authenticateSession, twoFAVerifyController);
router.post("/2FA/reset", authenticateSession, twoFAResetController);

export { router as AuthRouter };
