import { Box } from "@mui/material";
import { SignupForm } from "../components/SignupForm";

export function SignupPage(): JSX.Element {
  return (
    <Box sx={{ minHeight: "100vh", background: "radial-gradient(circle at top right, #fce9d7, #f2f8f0 40%, #e8efe7)" }}>
      <SignupForm />
    </Box>
  );
}
