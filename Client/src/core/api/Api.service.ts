import {
  GET,
  POST,
  Body,
  BasePath,
  BaseService,
  ServiceBuilder,
} from "ts-retrofit";

import { ApiConstants } from "@/core/constants/AppString";
import { AuthRoutes } from "@/core/constants/router/routes";

import type {
  LoginRequest,
  RegisterRequest,
  ForgetPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  Enable2FARequest,
  Verify2FARequest,
  Reset2FARequest,
  RegisterResponse,
  AuthResponse,
  StatusResponse,
  LogoutResponse,
  ForgetPasswordResponse,
  VerifyOtpResponse,
  SimpleMessageResponse,
  TwoFASetupResponse,
  TwoFAVerifyResponse,
} from "@/core/models/AuthModel";

@BasePath(ApiConstants.BASE_URL)
class ApiService extends BaseService {
  @POST(AuthRoutes.SIGNUP)
  async register(@Body _body: RegisterRequest): Promise<RegisterResponse> {
    return {} as RegisterResponse;
  }

  @POST(AuthRoutes.LOGIN)
  async login(@Body _body: LoginRequest): Promise<AuthResponse> {
    return {} as AuthResponse;
  }

  @GET(AuthRoutes.STATUS)
  async getStatus(): Promise<StatusResponse> {
    return {} as StatusResponse;
  }

  @POST(AuthRoutes.LOGOUT)
  async logout(): Promise<LogoutResponse> {
    return {} as LogoutResponse;
  }

  @POST("/github/revoke")
  async revokeGithubAuth(): Promise<SimpleMessageResponse> {
    return {} as SimpleMessageResponse;
  }

  // --- Password Reset ---
  @POST(AuthRoutes.FORGET_PASSWORD)
  async forgetPassword(
    @Body _body: ForgetPasswordRequest
  ): Promise<ForgetPasswordResponse> {
    return {} as ForgetPasswordResponse;
  }

  @POST(AuthRoutes.VERIFY_PASSWORD_OTP)
  async verifyPasswordOtp(
    @Body _body: VerifyOtpRequest
  ): Promise<VerifyOtpResponse> {
    return {} as VerifyOtpResponse;
  }

  @POST(AuthRoutes.RESET_PASSWORD)
  async resetPassword(
    @Body _body: ResetPasswordRequest
  ): Promise<SimpleMessageResponse> {
    return {} as SimpleMessageResponse;
  }

  @POST(AuthRoutes.UPDATE_PASSWORD)
  async updatePassword(
    @Body _body: UpdatePasswordRequest
  ): Promise<SimpleMessageResponse> {
    return {} as SimpleMessageResponse;
  }

  // --- 2FA ---
  @POST(AuthRoutes.ENABLE_2FA)
  async enable2FA(@Body _body: Enable2FARequest): Promise<TwoFASetupResponse> {
    return {} as TwoFASetupResponse;
  }

  @POST(AuthRoutes.VERIFY_2FA)
  async verify2FA(@Body _body: Verify2FARequest): Promise<TwoFAVerifyResponse> {
    return {} as TwoFAVerifyResponse;
  }

  @POST(AuthRoutes.RESET_2FA)
  async reset2FA(@Body _body: Reset2FARequest): Promise<SimpleMessageResponse> {
    return {} as SimpleMessageResponse;
  }

  @GET(AuthRoutes.SIGNUP_GOOGLE)
  async signUpWithGoogle(): Promise<any> {
    return {} as any;
  }

  @GET(AuthRoutes.SIGNUP_GITHUB)
  async signUpWithGithub(): Promise<any> {
    return {} as any;
  }
}

const baseAuthApi = new ServiceBuilder().build(ApiService);

export const AuthApi = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await baseAuthApi.login(data);
    return (response as any).data || response;
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await baseAuthApi.register(data);
    return (response as any).data || response;
  },

  async getStatus(): Promise<StatusResponse> {
    const response = await baseAuthApi.getStatus();
    return (response as any).data || response;
  },

  async logout(): Promise<LogoutResponse> {
    const response = await baseAuthApi.logout();
    return (response as any).data || response;
  },

  async forgetPassword(
    data: ForgetPasswordRequest
  ): Promise<ForgetPasswordResponse> {
    const response = await baseAuthApi.forgetPassword(data);
    return (response as any).data || response;
  },

  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const response = await baseAuthApi.verifyPasswordOtp(data);
    return (response as any).data || response;
  },

  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<SimpleMessageResponse> {
    const response = await baseAuthApi.resetPassword(data);
    return (response as any).data || response;
  },

  async updatePassword(
    data: UpdatePasswordRequest
  ): Promise<SimpleMessageResponse> {
    const response = await baseAuthApi.updatePassword(data);
    return (response as any).data || response;
  },

  async setup2FA(data: Enable2FARequest): Promise<TwoFASetupResponse> {
    const response = await baseAuthApi.enable2FA(data);
    return (response as any).data || response;
  },

  async verify2FA(data: Verify2FARequest): Promise<TwoFAVerifyResponse> {
    const response = await baseAuthApi.verify2FA(data);
    return (response as any).data || response;
  },

  async reset2FA(data: Reset2FARequest): Promise<SimpleMessageResponse> {
    const response = await baseAuthApi.reset2FA(data);
    return (response as any).data || response;
  },

  async signUpWithGoogle() {
    const response = await baseAuthApi.signUpWithGoogle();
    return (response as any).data || response;
  },

  async signUpWithGithub() {
    const response = await baseAuthApi.signUpWithGithub();
    return (response as any).data || response;
  },

  async revokeGithubAuth(): Promise<SimpleMessageResponse> {
    const response = await baseAuthApi.revokeGithubAuth();
    return (response as any).data || response;
  },
};
