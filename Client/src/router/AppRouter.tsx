import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/Pages/Login";
import SignupPage from "@/Pages/Signup";
import ForgotPasswordPage from "@/Pages/ForgotPasswordPage";
import OTPPage from "@/Pages/OTP";
import ResetPasswordPage from "@/Pages/ResetPassword";
import DashboardPage from "@/Pages/Dashboard";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignupPage />
      </PublicRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: "/otp",
    element: (
      <PublicRoute>
        <ProtectedRoute requireEmail>
          <OTPPage />
        </ProtectedRoute>
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <PublicRoute>
        <ProtectedRoute requireEmail requireOtpVerification>
          <ResetPasswordPage />
        </ProtectedRoute>
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requireAuth>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
