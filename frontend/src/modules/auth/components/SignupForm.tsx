import { Alert, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { signup } from "../api";

export function SignupForm(): JSX.Element {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    branch: "",
    phone_number: "",
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: string): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSuccess(null);
    setError(null);
    try {
      await signup(form);
      setSuccess("Account created. Wait for admin activation before login.");
    } catch {
      setError("Signup failed. Verify inputs and retry.");
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, border: "1px solid #d6dfd0", maxWidth: 720, mx: "auto", mt: 6 }}>
      <Stack component="form" spacing={2} onSubmit={handleSubmit}>
        <Typography variant="h3" sx={{ color: "primary.main" }}>
          Partner Signup
        </Typography>
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Full Name" required value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
        <TextField label="Email" required type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
        <TextField
          label="Password"
          required
          type="password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />
        <TextField label="Company" required value={form.company} onChange={(e) => handleChange("company", e.target.value)} />
        <TextField label="Branch" value={form.branch} onChange={(e) => handleChange("branch", e.target.value)} />
        <TextField label="Phone Number" required value={form.phone_number} onChange={(e) => handleChange("phone_number", e.target.value)} />
        <Button type="submit" variant="contained">
          Create Account
        </Button>
      </Stack>
    </Paper>
  );
}
