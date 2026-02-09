import { Alert, Button, Stack, TextField, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../api";

export function SignupForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    branch: "",
    phone_number: "",
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess(null);
    setError(null);
    try {
      await signup(form);
      setSuccess("Account created. Wait for admin approval email before login.");
    } catch {
      setError("Signup failed. Verify inputs and retry.");
    }
  };

  return (
    <Card className="p-8">
      <Stack component="form" spacing={3} onSubmit={handleSubmit}>
        <div>
          <h2 className="font-display text-3xl tracking-poster">Create Account</h2>
          <Typography variant="body2" className="mt-1">Fill in your details to register as a partner.</Typography>
        </div>

        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Personal Info */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Personal Info</p>
          <TextField label="Full Name" required value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
          <TextField label="Email" required type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
          <TextField label="Password" required type="password" value={form.password} onChange={(e) => handleChange("password", e.target.value)} />
          <TextField label="Phone Number" required value={form.phone_number} onChange={(e) => handleChange("phone_number", e.target.value)} />
        </div>

        {/* Company Info */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Company Info</p>
          <TextField label="Company" required value={form.company} onChange={(e) => handleChange("company", e.target.value)} />
          <TextField label="Branch" value={form.branch} onChange={(e) => handleChange("branch", e.target.value)} />
        </div>

        <Button type="submit" variant="contained">Create Account</Button>

        <Typography variant="body2" className="text-center">
          Already have an account?{" "}
          <Link to="/auth/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Login
          </Link>
        </Typography>
      </Stack>
    </Card>
  );
}
