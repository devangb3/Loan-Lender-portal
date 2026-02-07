import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import { useAuth } from "../hooks";
import { homeRouteForRole } from "../utils";

export function LoginForm(): JSX.Element {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
    <Paper elevation={0} sx={{ p: 4, border: "1px solid #d6dfd0", maxWidth: 560, mx: "auto", mt: 8 }}>
      <Stack component="form" spacing={2} onSubmit={handleSubmit}>
        <Typography variant="h3" sx={{ color: "primary.main" }}>
          Partner Portal Login
        </Typography>
        <Typography variant="body2">Use your role account credentials to continue.</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        <Box>
          <Button type="submit" variant="contained" size="large">
            Login
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
