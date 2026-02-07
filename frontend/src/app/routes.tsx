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
  { path: "/", element: <Navigate to="/auth/login" replace /> },
  { path: "/auth/login", element: <LoginPage /> },
  { path: "/auth/signup", element: <SignupPage /> },
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        path: "partner",
        element: (
          <RouteGuard role="partner">
            <PartnerDashboardPage />
          </RouteGuard>
        ),
      },
      {
        path: "partner/resources",
        element: (
          <RouteGuard role="partner">
            <PartnerResourcesPage />
          </RouteGuard>
        ),
      },
      {
        path: "borrower",
        element: (
          <RouteGuard role="borrower">
            <BorrowerDashboardPage />
          </RouteGuard>
        ),
      },
      {
        path: "admin/pipeline",
        element: (
          <RouteGuard role="admin">
            <AdminPipelinePage />
          </RouteGuard>
        ),
      },
      {
        path: "admin/partners",
        element: (
          <RouteGuard role="admin">
            <AdminPartnersPage />
          </RouteGuard>
        ),
      },
      {
        path: "admin/lenders",
        element: (
          <RouteGuard role="admin">
            <AdminLendersPage />
          </RouteGuard>
        ),
      },
      {
        path: "admin/commissions",
        element: (
          <RouteGuard role="admin">
            <AdminCommissionsPage />
          </RouteGuard>
        ),
      },
      {
        path: "admin/exports",
        element: (
          <RouteGuard role="admin">
            <ExportsPage />
          </RouteGuard>
        ),
      },
    ],
  },
]);
