import { Alert, Button, Stack, TextField, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { APP_ROUTES } from "@/shared/constants";
import { Link } from "react-router-dom";

import { forgotPassword } from "../api";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitted(false);

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch {
      setError("Unable to send reset instructions. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="grain-texture flex flex-1 items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
          <Card className="p-8">
            <Stack component="form" spacing={3} onSubmit={handleSubmit}>
              <div>
                <h2 className="font-display text-3xl tracking-poster">Reset Password</h2>
                <Typography variant="body2" className="mt-1">
                  Enter your email and we&apos;ll send you a secure reset link.
                </Typography>
              </div>

              {submitted ? <Alert severity="success">If your account exists, a reset link has been sent.</Alert> : null}
              {error ? <Alert severity="error">{error}</Alert> : null}

              <TextField
                label="Email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <Button type="submit" variant="contained">
                Send Reset Link
              </Button>

              <Typography variant="body2" className="text-center">
                Back to{" "}
                <Link to={APP_ROUTES.AUTH_LOGIN} className="font-semibold text-primary underline-offset-4 hover:underline">
                  Login
                </Link>
              </Typography>
            </Stack>
          </Card>
        </div>
      </div>

      <div className="hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex lg:w-[45%]">
        <div>
          <h1 className="font-display text-4xl tracking-poster text-sidebar-accent-foreground">LRP</h1>
          <p className="mt-1 text-sm text-sidebar-muted-foreground">Loan Referral Platform</p>
        </div>
        <p className="text-xs text-sidebar-muted-foreground">&copy; {new Date().getFullYear()} Loan Referral Platform</p>
      </div>
    </div>
  );
}
