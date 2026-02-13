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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      {/* Animated gradient mesh background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] animate-glow-pulse rounded-full bg-primary/[0.07] blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] animate-glow-pulse rounded-full bg-secondary/[0.05] blur-[100px] [animation-delay:2s]" />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(hsl(var(--muted-foreground)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">LRP</h1>
          <p className="mt-1 text-sm text-muted-foreground">Loan Referral Platform</p>
        </div>

        <Card className="p-8">
          <Stack component="form" spacing={3} onSubmit={handleSubmit}>
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight">Reset Password</h2>
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

        <p className="mt-8 text-center text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Loan Referral Platform</p>
      </div>
    </div>
  );
}
