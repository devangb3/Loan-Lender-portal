import { Alert, Button, Stack, TextField, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { APP_ROUTES } from "@/shared/constants";
import { resetPassword } from "../api";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("Reset token is missing.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({ token, new_password: password });
      navigate(APP_ROUTES.AUTH_LOGIN, { replace: true });
    } catch {
      setError("Reset failed. The link may be expired or invalid.");
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
              <h2 className="font-display text-3xl font-bold tracking-tight">Set New Password</h2>
              <Typography variant="body2" className="mt-1">
                Choose a strong password to finish resetting your account.
              </Typography>
            </div>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <TextField
              label="New Password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />

            <Button type="submit" variant="contained">
              Reset Password
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
