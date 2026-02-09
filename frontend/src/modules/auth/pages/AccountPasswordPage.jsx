import { Alert, Button, Stack, TextField, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { useState } from "react";

import { PageHeader } from "@/shared/ui/PageHeader";
import { changePassword, updateProfile } from "../api";
import { useAuth } from "../hooks";

export function AccountPasswordPage() {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameError, setNameError] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleNameSubmit = async (event) => {
    event.preventDefault();
    setNameError(null);
    if (fullName.trim().length < 2) {
      setNameError("Name must be at least 2 characters.");
      return;
    }
    setNameSaving(true);
    try {
      await updateProfile({ full_name: fullName.trim() });
      await refreshUser();
    } catch {
      setNameError("Unable to update name.");
    } finally {
      setNameSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
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
        title="Account"
        subtitle={user?.must_reset_password ? "Please reset your temporary password." : "Manage your profile and security."}
      />

      <Card className="max-w-2xl p-6">
        <Typography variant="h6" gutterBottom>Profile</Typography>
        <Stack component="form" spacing={3} onSubmit={handleNameSubmit}>
          {nameError ? <Alert severity="error">{nameError}</Alert> : null}

          <TextField
            label="Full Name"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />

          <div>
            <Button type="submit" variant="contained" disabled={nameSaving || fullName.trim() === (user?.full_name || "")}>
              {nameSaving ? "Saving…" : "Update Name"}
            </Button>
          </div>
        </Stack>
      </Card>

      <Card className="max-w-2xl p-6">
        <Typography variant="h6" gutterBottom>Password</Typography>
        <Stack component="form" spacing={3} onSubmit={handlePasswordSubmit}>
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
