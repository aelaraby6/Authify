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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { AuthService } from "@/core/services/Auth.service";

export function OTPForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Full OTP value:", otp);
    //TODO refactor to get only otp
    await AuthService.verifyOtp("ahmedalinaguib33@gmail.com", otp);
    if (otp.length === 6) {
      navigate("/reset-password");
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Enter verification code</CardTitle>
        <CardDescription>We sent a 6-digit code to your email.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp">Verification code</FieldLabel>

              <InputOTP
                maxLength={6}
                id="otp"
                required
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <FieldDescription>
                Enter the 6-digit code sent to your email.
              </FieldDescription>
            </Field>

            <FieldGroup>
              <Button type="submit" disabled={otp.length !== 6}>
                Verify Code
              </Button>

              <div className="text-center space-y-2">
                <FieldDescription>
                  Didn&apos;t receive the code?{" "}
                  <a href="#" className="underline">
                    Resend
                  </a>
                </FieldDescription>
                <div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                  >
                    ← Back to Email
                  </Link>
                </div>
              </div>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
