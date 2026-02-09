import { Alert, Button, Stack, TextField, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { APP_ROUTES } from "@/shared/constants";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api";
import { useAuth } from "../hooks";
import { homeRouteForRole } from "../utils";

const AUTH_DEBUG_PREFIX = "[AUTH_DEBUG]";

function extractAuthUser(data) {
  if (!data || typeof data !== "object") return null;
  if (data.user && typeof data.user === "object") return data.user;
  if (data.email && data.role) return data;
  return null;
}

export function LoginForm() {
  const navigate = useNavigate();
  const { refreshUser, setAuthenticatedUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    console.log(`${AUTH_DEBUG_PREFIX} login:submit`, { email });
    try {
      const response = await login({ email, password });
      const nextUser = extractAuthUser(response);
      if (!nextUser) {
        throw new Error("Malformed /auth/login response payload");
      }
      console.log(`${AUTH_DEBUG_PREFIX} login:success`, {
        role: nextUser?.role,
        email: nextUser?.email,
        payloadKeys: Object.keys(response || {}),
      });
      setAuthenticatedUser(nextUser);
      navigate(homeRouteForRole(nextUser.role), { replace: true });
      window.setTimeout(() => {
        void refreshUser({ source: "post_login_verify", preserveUserOnError: true });
      }, 1200);
    } catch (error) {
      console.error(`${AUTH_DEBUG_PREFIX} login:failed`, {
        status: error?.response?.status,
        data: error?.response?.data,
      });
      const detail = error?.response?.data?.detail;
      if (typeof detail === "string" && detail.trim()) {
        setError(detail);
      } else {
        setError("Login failed. Check credentials or account status.");
      }
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

        <div className="text-right">
          <Link to={APP_ROUTES.AUTH_FORGOT_PASSWORD} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="contained" size="large">Login</Button>

        <Typography variant="body2" className="text-center">
          Don&apos;t have an account?{" "}
          <Link to={APP_ROUTES.AUTH_SIGNUP} className="font-semibold text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </Typography>
      </Stack>
    </Card>
  );
}
