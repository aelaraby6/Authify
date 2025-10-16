import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AuthService } from "@/core/services/Auth.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { setAccessToken } from "@/core/utils/auth.utils";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Handle OAuth redirect parameters
    const token = searchParams.get("token");
    const authStatus = searchParams.get("auth");

    if (token && authStatus === "success") {
      // Store the token using utility function
      setAccessToken(token);

      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);

      console.log("OAuth authentication successful");
    }
  }, [searchParams]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await AuthService.logout();
      console.log("Logout successful");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, redirect to login (since we cleared local storage)
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to Dashboard</CardTitle>
            <CardDescription>
              You are now logged in successfully!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                This is a protected route that can only be accessed by
                authenticated users.
              </p>
              <Button
                onClick={handleLogout}
                className="w-full"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
