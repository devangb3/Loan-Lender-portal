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
import { ACCOUNT_ACCESS_ROLES, APP_ROUTES, USER_ROLES } from "../shared/constants";
import { AppShell } from "../shared/ui/AppShell";
import { RouteGuard } from "./RouteGuard";

const childPath = (absolutePath) => absolutePath.replace(/^\//, "");

export const router = createBrowserRouter([
  { path: APP_ROUTES.ROOT, element: <Navigate to={APP_ROUTES.AUTH_LOGIN} replace /> },
  { path: APP_ROUTES.AUTH_LOGIN, element: <LoginPage /> },
  { path: APP_ROUTES.AUTH_SIGNUP, element: <SignupPage /> },
  { path: APP_ROUTES.AUTH_FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
  { path: APP_ROUTES.AUTH_RESET_PASSWORD, element: <ResetPasswordPage /> },
  {
    path: APP_ROUTES.ROOT,
    element: <AppShell />,
    children: [
      {
        path: childPath(APP_ROUTES.PARTNER_DASHBOARD),
        element: (
          <RouteGuard role={USER_ROLES.PARTNER}>
            <PartnerDashboardPage />
          </RouteGuard>
        ),
      },
      {
        path: childPath(APP_ROUTES.PARTNER_DEALS),
        element: (
          <RouteGuard role={USER_ROLES.PARTNER}>
            <PartnerDealsPage />
          </RouteGuard>
        ),
      },
      {
        path: childPath(APP_ROUTES.PARTNER_DEALS_NEW),
        element: (
          <RouteGuard role={USER_ROLES.PARTNER}>
            <PartnerDealNewPage />
          </RouteGuard>
        ),
      },
      {
        path: childPath(APP_ROUTES.PARTNER_RESOURCES),
        element: (
          <RouteGuard role={USER_ROLES.PARTNER}>
            <PartnerResourcesPage />
          </RouteGuard>
        ),
      },
      {
        path: childPath(APP_ROUTES.BORROWER_DASHBOARD),
        element: (
          <RouteGuard role={USER_ROLES.BORROWER}>
            <BorrowerDashboardPage />
          </RouteGuard>
        ),
      },
      {
        path: childPath(APP_ROUTES.ADMIN_PIPELINE),
        element: (
          <RouteGuard role={USER_ROLES.ADMIN}>
            <AdminPipelinePage />
          </RouteGuard>
        ),
      },
      {
        path: childPath(APP_ROUTES.ADMIN_SUBSTAGES),
        element: (
          <RouteGuard role={USER_ROLES.ADMIN}>
            <AdminSubstagesPage />
          </RouteGuard>
        ),
      },
      {
        path: childPath(APP_ROUTES.ADMIN_PARTNERS),
        element: (
          <RouteGuard role={USER_ROLES.ADMIN}>
            <AdminPartnersPage />
          </RouteGuard>
        ),
      },
      {
        path: childPath(APP_ROUTES.ADMIN_LENDERS),
        element: (
          <RouteGuard role={USER_ROLES.ADMIN}>
            <AdminLendersPage />
          </RouteGuard>
        ),
      },
      {
        path: childPath(APP_ROUTES.ADMIN_COMMISSIONS),
        element: (
          <RouteGuard role={USER_ROLES.ADMIN}>
            <AdminCommissionsPage />
          </RouteGuard>
        ),
      },
      {
        path: childPath(APP_ROUTES.ADMIN_EXPORTS),
        element: (
          <RouteGuard role={USER_ROLES.ADMIN}>
            <ExportsPage />
          </RouteGuard>
        ),
      },
      {
        path: childPath(APP_ROUTES.ACCOUNT_PASSWORD),
        element: (
          <RouteGuard roles={ACCOUNT_ACCESS_ROLES}>
            <AccountPasswordPage />
          </RouteGuard>
        ),
      },
    ],
  },
]);
