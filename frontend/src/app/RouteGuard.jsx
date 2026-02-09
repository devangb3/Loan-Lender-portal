import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

import { CircularProgress, Stack } from "@/components/ui/mui";
import { APP_ROUTES } from "@/shared/constants";
import { useAuthContext } from "./AuthContext";

const AUTH_DEBUG_PREFIX = "[AUTH_DEBUG]";

export function RouteGuard({ role, roles, children }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    console.log(`${AUTH_DEBUG_PREFIX} route_guard:loading`, { role, roles });
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="50vh">
        <CircularProgress />
      </Stack>
    );
  }

  if (!user) {
    console.warn(`${AUTH_DEBUG_PREFIX} route_guard:redirect_no_user`, { role, roles });
    return <Navigate to={APP_ROUTES.AUTH_LOGIN} replace />;
  }

  if (role && user.role !== role) {
    console.warn(`${AUTH_DEBUG_PREFIX} route_guard:redirect_wrong_role`, {
      expectedRole: role,
      actualRole: user.role,
    });
    return <Navigate to={APP_ROUTES.AUTH_LOGIN} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    console.warn(`${AUTH_DEBUG_PREFIX} route_guard:redirect_role_not_allowed`, {
      allowedRoles: roles,
      actualRole: user.role,
    });
    return <Navigate to={APP_ROUTES.AUTH_LOGIN} replace />;
  }

  console.log(`${AUTH_DEBUG_PREFIX} route_guard:allow`, { role: user.role });

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
