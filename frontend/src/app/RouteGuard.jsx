import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from "prop-types";
import { CircularProgress, Stack } from "@/components/ui/mui";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";
export function RouteGuard({ role, children }) {
    const { user, loading } = useAuthContext();
    if (loading) {
        return (_jsx(Stack, { alignItems: "center", justifyContent: "center", minHeight: "50vh", children: _jsx(CircularProgress, {}) }));
    }
    if (!user) {
        return _jsx(Navigate, { to: "/auth/login", replace: true });
    }
    if (user.role !== role) {
        return _jsx(Navigate, { to: "/auth/login", replace: true });
    }
    return children;
}
RouteGuard.propTypes = {
    role: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};
