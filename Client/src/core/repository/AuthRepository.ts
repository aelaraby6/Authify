import { AuthApi } from "@/core/api/Api.service";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgetPasswordRequest,
  ForgetPasswordResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  TwoFASetupResponse,
  Enable2FARequest,
  TwoFAVerifyResponse,
  Verify2FARequest,
  Reset2FARequest,
  SimpleMessageResponse,
} from "@/core/models/AuthModel";
import { ErrorHandler } from "../api/network/ErrorHandler";
import { getUserFriendlyMessage } from "@/core/api/network/DataSource";

export class AuthRepository {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await AuthApi.login(credentials);
      return response;
    } catch (error) {
      const errorModel = ErrorHandler.handle(error);
      const userMessage = getUserFriendlyMessage(errorModel);
      throw new Error(userMessage);
    }
  }

  async register(credentials: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await AuthApi.register(credentials);
      return response;
    } catch (error) {
      ErrorHandler.handle(error);
      throw error;
    }
  }

  async getStatus() {
    try {
      return AuthApi.getStatus();
    } catch (error) {
      ErrorHandler.handle(error);
      throw error;
    }
  }

  async logout() {
    try {
      return AuthApi.logout();
    } catch (error) {
      ErrorHandler.handle(error);
      throw error;
    }
  }

  async forgetPassword(
    credentials: ForgetPasswordRequest
  ): Promise<ForgetPasswordResponse> {
    try {
      const response = await AuthApi.forgetPassword(credentials);
      return response;
    } catch (error) {
      ErrorHandler.handle(error);
      throw error;
    }
  }

  async verifyOtp(credentials: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    try {
      const response = await AuthApi.verifyOtp(credentials);
      return response;
    } catch (error) {
      ErrorHandler.handle(error);
      throw error;
    }
  }

  async resetPassword(credentials: ResetPasswordRequest) {
    try {
      const response = await AuthApi.resetPassword(credentials);
      return response;
    } catch (error) {
      ErrorHandler.handle(error);
      throw error;
    }
  }

  async updatePassword(credentials: UpdatePasswordRequest) {
    try {
      const response = await AuthApi.updatePassword(credentials);
      return response;
    } catch (error) {
      ErrorHandler.handle(error);
      throw error;
    }
  }

  async setup2FA(credentials: Enable2FARequest): Promise<TwoFASetupResponse> {
    try {
      const response = await AuthApi.setup2FA(credentials);
      return response;
    } catch (error) {
      ErrorHandler.handle(error);
      throw error;
    }
  }

  async verify2FA(credentials: Verify2FARequest): Promise<TwoFAVerifyResponse> {
    try {
      const response = await AuthApi.verify2FA(credentials);
      return response;
    } catch (error) {
      ErrorHandler.handle(error);
      throw error;
    }
  }

  async reset2FA(credentials: Reset2FARequest): Promise<SimpleMessageResponse> {
    try {
      const response = await AuthApi.reset2FA(credentials);
      return response;
    } catch (error) {
      ErrorHandler.handle(error);
      throw error;
    }
  }

  async signUpWithGoogle(){
    try {
      const response = await AuthApi.signUpWithGoogle();
      return response;
    } catch (error) {
      ErrorHandler.handle(error);
      throw error;
    }
  }
  
  async signUpWithGithub(){
    try {
      const response = await AuthApi.signUpWithGithub();
      return response;
    } catch (error) {
      ErrorHandler.handle(error);
      throw error;
    }
  }
}
