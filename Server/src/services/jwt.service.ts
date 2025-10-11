import Jwt, { Secret, SignOptions } from "jsonwebtoken";
import { UnAuthorizedError, BadRequestError } from "@/Errors/error";
import { IJWTPayload } from "@/types/index";

/**
 * Generate Access Token
 */
export const generateAccessToken = (payload: IJWTPayload): string => {
  const secret: Secret = process.env.ACCESS_TOKEN_SECRET as Secret;

  if (!secret) throw new BadRequestError("ACCESS_TOKEN_SECRET is not defined");

  const expiresIn =
    (process.env.ACCESS_TOKEN_EXPIRE as unknown as
      | number
      | `${number}${"s" | "m" | "h" | "d"}`) || "15m";

  const options: SignOptions = { expiresIn };
  return Jwt.sign(payload, secret, options);
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (payload: IJWTPayload): string => {
  const refreshSecret: Secret = process.env.REFRESH_TOKEN_SECRET as Secret;

  if (!refreshSecret)
    throw new BadRequestError("REFRESH_TOKEN_SECRET is not defined");

  const expiresIn =
    (process.env.REFRESH_TOKEN_EXPIRE as unknown as
      | number
      | `${number}${"s" | "m" | "h" | "d"}`) || "7d";

  const options: SignOptions = { expiresIn };

  return Jwt.sign(payload, refreshSecret, options);
};

/**
 * Verify Access Token
 */
export const verifyToken = (token: string): IJWTPayload => {
  try {
    const secret: Secret = process.env.ACCESS_TOKEN_SECRET as Secret;

    if (!secret)
      throw new BadRequestError("ACCESS_TOKEN_SECRET is not defined");

    return Jwt.verify(token, secret) as IJWTPayload;
  } catch {
    throw new UnAuthorizedError("Invalid or expired access token");
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): IJWTPayload => {
  try {
    const refreshSecret: Secret = process.env.REFRESH_TOKEN_SECRET as Secret;

    if (!refreshSecret)
      throw new BadRequestError("REFRESH_TOKEN_SECRET is not defined");

    return Jwt.verify(token, refreshSecret) as IJWTPayload;
  } catch {
    throw new UnAuthorizedError("Invalid or expired refresh token");
  }
};

/**
 * Helper — Generate both tokens
 */
export const generateTokens = (payload: IJWTPayload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  return { accessToken, refreshToken };
};
