import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/core/services/Auth.service";
import { useAuth } from "@/core/context/AuthContext";

export function ForgotPasswordForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const [email, setEmailLocal] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { setEmail } = useAuth(); // ***
  const navigate = useNavigate();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) return;

    await AuthService.forgetPassword(email);
    setEmail(email); // **
    console.log("Password reset email sent to:", email);

    setSubmitted(true);

    setTimeout(() => {
      navigate("/otp");
    }, 1500);
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Forgot your password?</CardTitle>
        <CardDescription>
          Enter your email and we’ll send you a reset link.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmailLocal(e.target.value)}
                required
              />
              <FieldDescription>
                We’ll send a password reset link to this email.
              </FieldDescription>
            </Field>

            <Button type="submit" disabled={!isValidEmail}>
              Send Reset Link
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
              >
                ← Back to Login
              </Link>
            </div>

            {submitted && (
              <p className="text-green-600 text-sm text-center mt-2">
                ✅ Reset link sent! Check your inbox. Redirecting to
                verification...
              </p>
            )}
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
