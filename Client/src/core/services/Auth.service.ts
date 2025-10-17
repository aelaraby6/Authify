import { AuthRepository } from "@/core/repository/AuthRepository";
import {
  AuthResponse,
  Enable2FARequest,
  ForgetPasswordResponse,
  LogoutResponse,
  Reset2FARequest,
  SimpleMessageResponse,
  StatusResponse,
  TwoFASetupResponse,
  TwoFAVerifyResponse,
  VerifyOtpResponse,
} from "../models/AuthModel";
import {
  clearAuthStorage,
  isGithubAuth,
  setAuthProvider,
} from "../utils/auth.utils";

const repo = new AuthRepository();

export class AuthService {
  static async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const result = await repo.register({ name, email, password });
    // Set auth provider for local registration
    setAuthProvider("local");
    return result;
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const result = await repo.login({ email, password });
    // Set auth provider for local login
    setAuthProvider("local");
    return result;
  }

  static async getUserProfile(): Promise<StatusResponse> {
    return repo.getStatus();
  }

  static async logout(): Promise<LogoutResponse> {
    try {
      // Check if user logged in with GitHub and revoke authorization if so
      if (isGithubAuth()) {
        try {
          console.log("Revoking GitHub authorization...");
          await repo.revokeGithubAuth();
          console.log("GitHub authorization revoked successfully");
        } catch (error) {
          console.warn("Failed to revoke GitHub authorization:", error);
          // Continue with logout even if revocation fails
        }
      }

      // Call the backend logout endpoint
      const result = await repo.logout();

      // Clear all authentication storage using utility function
      clearAuthStorage();

      return result;
    } catch (error) {
      // Even if the backend call fails, clear local storage
      clearAuthStorage();

      // Re-throw the error for the caller to handle
      throw error;
    }
  }

  static async forgetPassword(email: string): Promise<ForgetPasswordResponse> {
    const result = await repo.forgetPassword({ email });
    return result;
  }

  static async verifyOtp(
    email: string,
    otp: string
  ): Promise<VerifyOtpResponse> {
    const result = await repo.verifyOtp({ email, otp });
    return result;
  }

  static async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
    confirmNewPassword: string
  ) {
    const result = await repo.resetPassword({
      email,
      otp,
      newPassword,
      confirmNewPassword,
    });
    return result;
  }

  static async updatePassword(
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) {
    const result = await repo.updatePassword({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
    return result;
  }

  static async setup2FA(
    credentials: Enable2FARequest
  ): Promise<TwoFASetupResponse> {
    const result = await repo.setup2FA(credentials);
    return result;
  }

  static async verify2FA(token: string): Promise<TwoFAVerifyResponse> {
    const result = await repo.verify2FA({ token });
    return result;
  }

  static async reset2FA(
    credentials: Reset2FARequest
  ): Promise<SimpleMessageResponse> {
    const result = await repo.reset2FA(credentials);
    return result;
  }

  static async signUpWithGoogle() {
    // Redirect directly to Google OAuth URL
    window.location.href = "http://localhost:3000/api/auth/google";
  }

  static async signUpWithGithub() {
    // Redirect directly to GitHub OAuth URL
    window.location.href = "http://localhost:3000/api/auth/github";
  }

  static async forceGithubReauth() {
    try {
      // First revoke GitHub authorization
      await repo.revokeGithubAuth();
      console.log("GitHub authorization revoked, redirecting to fresh auth...");
    } catch (error) {
      console.warn("Failed to revoke GitHub authorization:", error);
    }

    // Then redirect to GitHub OAuth (will show consent screen)
    window.location.href = "http://localhost:3000/api/auth/github";
  }
}
