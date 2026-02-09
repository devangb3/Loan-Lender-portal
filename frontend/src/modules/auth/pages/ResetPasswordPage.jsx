import { Alert, Button, Stack, TextField, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

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
      navigate("/auth/login", { replace: true });
    } catch {
      setError("Reset failed. The link may be expired or invalid.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <Stack component="form" spacing={3} onSubmit={handleSubmit}>
            <div>
              <h2 className="font-display text-3xl tracking-poster">Set New Password</h2>
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
              <Link to="/auth/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                Login
              </Link>
            </Typography>
          </Stack>
        </Card>
      </div>
    </div>
  );
}
