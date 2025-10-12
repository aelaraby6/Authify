import { AuthApi } from "@/core/api/Api.service";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgetPasswordRequest,
  ForgetPasswordResponse,
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

  async getStatus() {
    try {
      return AuthApi.getStatus();
    } catch (error) {
      ErrorHandler.handle(error);
      throw error;
    }
  }
}
