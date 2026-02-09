import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

import { CircularProgress, Stack } from "@/components/ui/mui";
import { APP_ROUTES } from "@/shared/constants";
import { useAuthContext } from "./AuthContext";

export function RouteGuard({ role, roles, children }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="50vh">
        <CircularProgress />
      </Stack>
    );
  }

  if (!user) {
    return <Navigate to={APP_ROUTES.AUTH_LOGIN} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={APP_ROUTES.AUTH_LOGIN} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={APP_ROUTES.AUTH_LOGIN} replace />;
  }

  return children;
}

RouteGuard.propTypes = {
  role: PropTypes.string,
  roles: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node.isRequired,
};

RouteGuard.defaultProps = {
  role: undefined,
  roles: undefined,
};
