import { createBrowserRouter, Navigate } from "react-router-dom";

import { AdminCommissionsPage } from "../modules/admin-commissions/pages/AdminCommissionsPage";
import { AdminLendersPage } from "../modules/admin-lenders/pages/AdminLendersPage";
import { AdminPartnersPage } from "../modules/admin-partners/pages/AdminPartnersPage";
import { AdminPipelinePage } from "../modules/admin-pipeline/pages/AdminPipelinePage";
import { AdminSubstagesPage } from "../modules/admin-pipeline/pages/AdminSubstagesPage";
import { AccountPasswordPage } from "../modules/auth/pages/AccountPasswordPage";
import { ForgotPasswordPage } from "../modules/auth/pages/ForgotPasswordPage";
import { LoginPage } from "../modules/auth/pages/LoginPage";
import { ResetPasswordPage } from "../modules/auth/pages/ResetPasswordPage";
import { SignupPage } from "../modules/auth/pages/SignupPage";
import { BorrowerDashboardPage } from "../modules/borrower/pages/BorrowerDashboardPage";
import { ExportsPage } from "../modules/exports/pages/ExportsPage";
import { PartnerDashboardPage } from "../modules/partner/pages/PartnerDashboardPage";
import { PartnerDealNewPage } from "../modules/partner/pages/PartnerDealNewPage";
import { PartnerDealsPage } from "../modules/partner/pages/PartnerDealsPage";
import { PartnerResourcesPage } from "../modules/resources/pages/PartnerResourcesPage";
import { AppShell } from "../shared/ui/AppShell";
import { RouteGuard } from "./RouteGuard";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/auth/login" replace /> },
  { path: "/auth/login", element: <LoginPage /> },
  { path: "/auth/signup", element: <SignupPage /> },
  { path: "/auth/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/auth/reset-password", element: <ResetPasswordPage /> },
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
        path: "partner/deals",
        element: (
          <RouteGuard role="partner">
            <PartnerDealsPage />
          </RouteGuard>
        ),
      },
      {
        path: "partner/deals/new",
        element: (
          <RouteGuard role="partner">
            <PartnerDealNewPage />
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
        path: "admin/pipeline/substages",
        element: (
          <RouteGuard role="admin">
            <AdminSubstagesPage />
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
      {
        path: "account/password",
        element: (
          <RouteGuard roles={["admin", "partner", "borrower"]}>
            <AccountPasswordPage />
          </RouteGuard>
        ),
      },
    ],
  },
]);
