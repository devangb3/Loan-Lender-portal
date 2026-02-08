import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@/components/ui/mui";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../modules/auth/hooks";
export function AppShell() {
    const { user, logout } = useAuth();
    const links = user?.role === "admin"
        ? [
            { to: "/admin/pipeline", label: "Pipeline" },
            { to: "/admin/partners", label: "Partners" },
            { to: "/admin/lenders", label: "Lenders" },
            { to: "/admin/commissions", label: "Commissions" },
            { to: "/admin/exports", label: "Exports" },
        ]
        : user?.role === "partner"
            ? [
                { to: "/partner", label: "Dashboard" },
                { to: "/partner/resources", label: "Resources" },
            ]
            : [{ to: "/borrower", label: "Applications" }];
    return (_jsxs(Box, { sx: { minHeight: "100vh", background: "linear-gradient(120deg, #f4f7f1 0%, #fef9ef 45%, #f1ebe7 100%)" }, children: [_jsx(AppBar, { position: "sticky", color: "transparent", elevation: 0, sx: { backdropFilter: "blur(10px)" }, children: _jsxs(Toolbar, { children: [_jsx(Typography, { variant: "h5", sx: { flexGrow: 1, letterSpacing: 1.2 }, children: "Loan Referral Platform" }), _jsxs(Stack, { direction: "row", spacing: 2, alignItems: "center", children: [user && _jsx(Typography, { variant: "body2", children: user.email }), _jsx(Button, { onClick: logout, color: "inherit", variant: "outlined", size: "small", children: "Logout" })] })] }) }), _jsxs(Container, { maxWidth: "xl", sx: { pt: 4, pb: 6 }, children: [_jsx(Stack, { direction: "row", spacing: 2, mb: 3, flexWrap: "wrap", children: links.map((link) => (_jsx(Button, { component: Link, to: link.to, variant: "contained", children: link.label }, link.to))) }), _jsx(Outlet, {})] })] }));
}
