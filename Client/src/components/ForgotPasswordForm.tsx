import { useState } from "react";
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

export function ForgotPasswordForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Simple email validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) return;
    console.log("Password reset email sent to:", email);
    setSubmitted(true);
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
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FieldDescription>
                We’ll send a password reset link to this email.
              </FieldDescription>
            </Field>

            <Button type="submit" disabled={!isValidEmail}>
              Send Reset Link
            </Button>

            {submitted && (
              <p className="text-green-600 text-sm text-center mt-2">
                ✅ Reset link sent! Check your inbox.
              </p>
            )}
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
