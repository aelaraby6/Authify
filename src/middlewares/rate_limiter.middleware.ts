import rateLimit from "express-rate-limit";

// Signup limiter
export const signupLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: {
    status: 429,
    error: "Too many signup attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login limiter
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    status: 429,
    error: "Too many login attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
