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
router.post("/logout", logoutController);

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

// Auth With Github
router.get("/github", async (req, res, next) => {
  console.log("GitHub auth route hit, query params:", req.query);

  // Try to clear any existing sessions/cookies that might interfere
  res.clearCookie("connect.sid");

  // Force GitHub to show authorization screen by using a different approach
  // We'll construct the URL manually with specific parameters
  try {
    const state = `auth_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    // GitHub OAuth URL with parameters that might help force re-authorization
    const githubAuthUrl =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${process.env.GITHUB_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(
        process.env.GITHUB_CALLBACK_URL ||
          "http://localhost:3000/api/auth/github/callback"
      )}` +
      `&scope=user:email,user` +
      `&state=${state}` +
      `&response_type=code` +
      `&allow_signup=true`;

    console.log("Forcing GitHub OAuth with URL:", githubAuthUrl);
    res.redirect(githubAuthUrl);
  } catch (error) {
    console.error("Error in GitHub auth route:", error);
    next(error);
  }
});

// Add a route to revoke GitHub authorization (call this before login if needed)
router.post("/github/revoke", async (req, res) => {
  try {
    const githubAccessToken = req.cookies.githubAccessToken;

    if (githubAccessToken) {
      // Revoke the GitHub app authorization using GitHub API
      const revokeUrl = `https://api.github.com/applications/${process.env.GITHUB_CLIENT_ID}/grant`;

      const response = await fetch(revokeUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.GITHUB_CLIENT_ID}:${process.env.GITHUB_CLIENT_SECRET}`
          ).toString("base64")}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: githubAccessToken,
        }),
      });

      if (response.ok) {
        console.log("GitHub authorization revoked successfully");
      } else {
        console.log("Failed to revoke GitHub authorization:", response.status);
      }
    }

    // Clear all cookies regardless of revocation success
    res.clearCookie("refreshToken");
    res.clearCookie("connect.sid");
    res.clearCookie("githubAccessToken");

    res.json({
      message: "GitHub authorization revoked and cookies cleared",
      note: "Next login will show the GitHub authorization screen",
    });
  } catch (error) {
    console.error("Error revoking GitHub auth:", error);
    // Still clear cookies even if revocation fails
    res.clearCookie("refreshToken");
    res.clearCookie("connect.sid");
    res.clearCookie("githubAccessToken");

    res.json({
      message: "Cookies cleared (revocation may have failed)",
      error:
        "You may need to manually revoke the app at https://github.com/settings/applications",
    });
  }
});

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:5173/login?error=github_auth_failed",
    session: false,
  }),
  (req, res) => {
    try {
      console.log("GitHub callback - User object:", req.user);
      const { accessToken, refreshToken, user, githubAccessToken }: any =
        req.user;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Store GitHub access token for potential revocation
      if (githubAccessToken) {
        res.cookie("githubAccessToken", githubAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      console.log("GitHub callback - Redirecting to dashboard with token");
      // Redirect to client with success and token in URL params
      res.redirect(
        `http://localhost:5173/dashboard?token=${accessToken}&auth=success&provider=github`
      );
    } catch (error) {
      console.error("Error in GitHub callback:", error);
      res.redirect("http://localhost:5173/login?error=github_callback_failed");
    }
  }
);

// Auth With Google

router.get("/google", (req, res, next) => {
  console.log("Google auth route hit, query params:", req.query);

  // Try to clear any existing sessions/cookies that might interfere
  res.clearCookie("connect.sid");

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login?error=google_auth_failed",
    session: false,
  }),
  async (req, res) => {
    try {
      console.log("Google callback - User object:", req.user);
      const { accessToken, refreshToken, user }: any = req.user;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      console.log("Google callback - Redirecting to dashboard with token");
      // Redirect to client with success and token in URL params
      res.redirect(
        `http://localhost:5173/dashboard?token=${accessToken}&auth=success&provider=google`
      );
    } catch (error) {
      console.error("Error in Google callback:", error);
      res.redirect("http://localhost:5173/login?error=google_auth_failed");
    }
  }
);

export { router as AuthRouter };
