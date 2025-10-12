// Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface Enable2FARequest {
  // No body needed for 2FA setup
}

export interface Verify2FARequest {
  token: string;
}

export interface Reset2FARequest {
  // No body needed for 2FA reset
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  provider: string;
  is_deleted?: boolean;
  is_active?: boolean;
  isMfaActive: boolean;
  isVerifiedForReset: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface AuthResponse {
  message: string;
  data: UserProfile;
  token: string;
}

export interface RegisterResponse {
  message: string;
  data: {
    name: string;
    email: string;
    role: string;
    provider: string;
    isMfaActive: boolean;
    isVerifiedForReset: boolean;
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

export interface StatusResponse {
  message: string;
  data: UserProfile;
  verification?: {
    hasUser: boolean;
    isAuthenticated: boolean;
    hasSession: boolean;
    sessionId: string | null;
    hasCookies: boolean;
    timestamp: string;
  };
}

export interface LogoutResponse {
  message: string;
  data: null;
  verification?: {
    userCleared: boolean;
    sessionDestroyed: boolean;
    cookiesCleared: boolean;
    timestamp: string;
  };
}

export interface ForgetPasswordResponse {
  message: string;
  email: string;
}

export interface VerifyOtpResponse {
  message: string;
  verified: boolean;
}

export interface SimpleMessageResponse {
  message: string;
}

export interface TwoFASetupResponse {
  message: string;
  secret: string;
  qrCodeDataURL: string;
  manualEntryKey: string;
}

export interface TwoFAVerifyResponse {
  message: string;
  token: string;
}
