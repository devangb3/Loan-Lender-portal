import { Alert, Button, Stack, TextField, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { useState } from "react";

import { PageHeader } from "@/shared/ui/PageHeader";
import { changePassword } from "../api";
import { useAuth } from "../hooks";

export function AccountPasswordPage() {
  const { user, refreshUser } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation must match.");
      return;
    }

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      await refreshUser();
    } catch {
      setError("Unable to change password. Check your current password and try again.");
    }
  };

  return (
    <Stack spacing={3} className="page-enter">
      <PageHeader
        title="Account Security"
        subtitle={user?.must_reset_password ? "Please reset your temporary password." : "Update your password anytime."}
      />

      <Card className="max-w-2xl p-6">
        <Stack component="form" spacing={3} onSubmit={handleSubmit}>
          {user?.must_reset_password ? (
            <Alert severity="warning">
              You are using a temporary password. Please set a new password now.
            </Alert>
          ) : null}

          {error ? <Alert severity="error">{error}</Alert> : null}

          <TextField
            label="Current Password"
            type="password"
            required
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />

          <TextField
            label="New Password"
            type="password"
            required
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />

          <TextField
            label="Confirm New Password"
            type="password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          <Typography variant="body2" className="text-muted-foreground">
            Password must be at least 8 characters and include upper/lowercase letters and a number.
          </Typography>

          <div>
            <Button type="submit" variant="contained">
              Update Password
            </Button>
          </div>
        </Stack>
      </Card>
    </Stack>
  );
}
