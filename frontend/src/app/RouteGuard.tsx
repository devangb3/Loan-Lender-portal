import { CircularProgress, Stack } from "@mui/material";
import { Navigate } from "react-router-dom";
import type { UserRole } from "../shared/types";
import { useAuthContext } from "./AuthContext";

export function RouteGuard({ role, children }: { role: UserRole; children: JSX.Element }): JSX.Element {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="50vh">
        <CircularProgress />
      </Stack>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}
