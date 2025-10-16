import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireEmail?: boolean;
  requireOtpVerification?: boolean;
}

export function ProtectedRoute({
  children,
  requireAuth = false,
  requireEmail = false,
  requireOtpVerification = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, forgotPasswordEmail, otpVerified } = useAuth();
  const location = useLocation();

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires email (for password reset flow) and no email is set
  if (requireEmail && !forgotPasswordEmail) {
    return <Navigate to="/forgot-password" replace />;
  }

  // If route requires OTP verification and OTP is not verified
  if (requireOtpVerification && !otpVerified) {
    // If no email is set, go to forgot password
    if (!forgotPasswordEmail) {
      return <Navigate to="/forgot-password" replace />;
    }
    // If email is set but OTP not verified, go to OTP
    return <Navigate to="/otp" replace />;
  }

  return <>{children}</>;
}

// Public route that redirects authenticated users away
export function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  // If user is already authenticated, redirect to dashboard/home
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
