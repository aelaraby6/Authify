import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/Pages/Login";
import SignupPage from "@/Pages/Signup";
import ForgotPasswordPage from "@/Pages/ForgotPasswordPage";
import OTPPage from "@/Pages/OTP";
import ResetPasswordPage from "@/Pages/ResetPassword";
import DashboardPage from "@/Pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/otp",
    element: <OTPPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
