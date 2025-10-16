import { LoginForm } from "@/components/login-form";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function LoginPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      let errorMessage = "Authentication failed";
      if (error === "google_auth_failed") {
        errorMessage = "Google authentication failed. Please try again.";
      } else if (error === "github_auth_failed") {
        errorMessage = "GitHub authentication failed. Please try again.";
      }

      // You could show this error in a toast or alert
      console.error(errorMessage);

      // Clear the error from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
