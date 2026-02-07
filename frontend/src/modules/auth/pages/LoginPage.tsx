import { Box } from "@mui/material";
import { LoginForm } from "../components/LoginForm";

export function LoginPage(): JSX.Element {
  return (
    <Box sx={{ minHeight: "100vh", background: "radial-gradient(circle at top left, #f5e6d7, #f1f5ef 45%, #e4ece7)" }}>
      <LoginForm />
    </Box>
  );
}
