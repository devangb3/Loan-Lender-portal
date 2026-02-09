import { Alert, Button, Stack, TextField, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api";
import { useAuth } from "../hooks";
import { homeRouteForRole } from "../utils";

export function LoginForm() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await login({ email, password });
      await refreshUser();
      navigate(homeRouteForRole(response.user.role));
    } catch {
      setError("Login failed. Check credentials or account activation.");
    }
  };

  return (
    <Card className="p-8">
      <Stack component="form" spacing={3} onSubmit={handleSubmit}>
        <div>
          <h2 className="font-display text-3xl tracking-poster">Welcome Back</h2>
          <Typography variant="body2" className="mt-1">Use your role account credentials to continue.</Typography>
        </div>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <TextField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />

        <Button type="submit" variant="contained" size="large">Login</Button>

        <Typography variant="body2" className="text-center">
          Don&apos;t have an account?{" "}
          <Link to="/auth/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </Typography>
      </Stack>
    </Card>
  );
}
