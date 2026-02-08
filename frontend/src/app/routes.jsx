import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "../shared/ui/AppShell";
import { LoginPage } from "../modules/auth/pages/LoginPage";
import { SignupPage } from "../modules/auth/pages/SignupPage";
import { BorrowerDashboardPage } from "../modules/borrower/pages/BorrowerDashboardPage";
import { AdminCommissionsPage } from "../modules/admin-commissions/pages/AdminCommissionsPage";
import { AdminLendersPage } from "../modules/admin-lenders/pages/AdminLendersPage";
import { AdminPartnersPage } from "../modules/admin-partners/pages/AdminPartnersPage";
import { AdminPipelinePage } from "../modules/admin-pipeline/pages/AdminPipelinePage";
import { PartnerDashboardPage } from "../modules/partner/pages/PartnerDashboardPage";
import { PartnerResourcesPage } from "../modules/resources/pages/PartnerResourcesPage";
import { ExportsPage } from "../modules/exports/pages/ExportsPage";
import { RouteGuard } from "./RouteGuard";
export const router = createBrowserRouter([
    { path: "/", element: _jsx(Navigate, { to: "/auth/login", replace: true }) },
    { path: "/auth/login", element: _jsx(LoginPage, {}) },
    { path: "/auth/signup", element: _jsx(SignupPage, {}) },
    {
        path: "/",
        element: _jsx(AppShell, {}),
        children: [
            {
                path: "partner",
                element: (_jsx(RouteGuard, { role: "partner", children: _jsx(PartnerDashboardPage, {}) })),
            },
            {
                path: "partner/resources",
                element: (_jsx(RouteGuard, { role: "partner", children: _jsx(PartnerResourcesPage, {}) })),
            },
            {
                path: "borrower",
                element: (_jsx(RouteGuard, { role: "borrower", children: _jsx(BorrowerDashboardPage, {}) })),
            },
            {
                path: "admin/pipeline",
                element: (_jsx(RouteGuard, { role: "admin", children: _jsx(AdminPipelinePage, {}) })),
            },
            {
                path: "admin/partners",
                element: (_jsx(RouteGuard, { role: "admin", children: _jsx(AdminPartnersPage, {}) })),
            },
            {
                path: "admin/lenders",
                element: (_jsx(RouteGuard, { role: "admin", children: _jsx(AdminLendersPage, {}) })),
            },
            {
                path: "admin/commissions",
                element: (_jsx(RouteGuard, { role: "admin", children: _jsx(AdminCommissionsPage, {}) })),
            },
            {
                path: "admin/exports",
                element: (_jsx(RouteGuard, { role: "admin", children: _jsx(ExportsPage, {}) })),
            },
        ],
    },
]);
