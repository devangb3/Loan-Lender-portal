export const USER_ROLES = {
  ADMIN: "admin",
  PARTNER: "partner",
  BORROWER: "borrower",
};

export const APP_ROUTES = {
  ROOT: "/",
  AUTH_LOGIN: "/auth/login",
  AUTH_SIGNUP: "/auth/signup",
  AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
  AUTH_RESET_PASSWORD: "/auth/reset-password",
  PARTNER_DASHBOARD: "/partner",
  PARTNER_DEALS: "/partner/deals",
  PARTNER_DEALS_NEW: "/partner/deals/new",
  PARTNER_RESOURCES: "/partner/resources",
  BORROWER_DASHBOARD: "/borrower",
  ADMIN_PIPELINE: "/admin/pipeline",
  ADMIN_SUBSTAGES: "/admin/pipeline/substages",
  ADMIN_PARTNERS: "/admin/partners",
  ADMIN_LENDERS: "/admin/lenders",
  ADMIN_COMMISSIONS: "/admin/commissions",
  ADMIN_EXPORTS: "/admin/exports",
  ACCOUNT_PASSWORD: "/account/password",
};

export const ROLE_HOME_ROUTES = {
  [USER_ROLES.ADMIN]: APP_ROUTES.ADMIN_PIPELINE,
  [USER_ROLES.BORROWER]: APP_ROUTES.BORROWER_DASHBOARD,
  [USER_ROLES.PARTNER]: APP_ROUTES.PARTNER_DASHBOARD,
};

export const ACCOUNT_ACCESS_ROLES = [USER_ROLES.ADMIN, USER_ROLES.PARTNER, USER_ROLES.BORROWER];

export const NAV_LINKS_BY_ROLE = {
  [USER_ROLES.ADMIN]: [
    { to: APP_ROUTES.ADMIN_PIPELINE, label: "Pipeline", icon: "LayoutDashboard" },
    { to: APP_ROUTES.ADMIN_PARTNERS, label: "Partners", icon: "Users" },
    { to: APP_ROUTES.ADMIN_LENDERS, label: "Lenders", icon: "Building2" },
    { to: APP_ROUTES.ADMIN_COMMISSIONS, label: "Commissions", icon: "DollarSign" },
    { to: APP_ROUTES.ADMIN_EXPORTS, label: "Exports", icon: "Download" },
  ],
  [USER_ROLES.PARTNER]: [
    { to: APP_ROUTES.PARTNER_DASHBOARD, label: "Dashboard", icon: "LayoutDashboard", end: true },
    { to: APP_ROUTES.PARTNER_DEALS, label: "My Deals", icon: "FileText" },
    { to: APP_ROUTES.PARTNER_DEALS_NEW, label: "Submit Deal", icon: "FilePlus" },
    { to: APP_ROUTES.PARTNER_RESOURCES, label: "Resources", icon: "BookOpen" },
  ],
  [USER_ROLES.BORROWER]: [
    { to: APP_ROUTES.BORROWER_DASHBOARD, label: "Applications", icon: "LayoutDashboard" },
  ],
};

export const ACCOUNT_LINK = { to: APP_ROUTES.ACCOUNT_PASSWORD, label: "Account Security", icon: "KeyRound" };

export const DEAL_STAGES = [
  "submitted",
  "in_review",
  "accepted",
  "in_progress",
  "closing",
  "closed",
  "declined",
];

export const BORROWER_DEAL_STAGES = DEAL_STAGES.filter((stage) => stage !== "declined");

export const PROPERTY_TYPES = [
  "multifamily",
  "retail",
  "office",
  "industrial",
  "mixed_use",
  "land",
  "hospitality",
  "other",
];

export const TRANSACTION_TYPES = [
  "purchase",
  "refinance",
  "cash_out_refinance",
  "construction",
  "bridge",
];

export const DEAL_STAGE_BADGE_VARIANTS = {
  submitted: "submitted",
  in_review: "review",
  accepted: "accepted",
  in_progress: "progress",
  closing: "closing",
  closed: "closed",
  declined: "declined",
};

export const COMMISSION_STATUSES = ["pending", "earned", "paid"];

export const EXPORT_ENTITIES = ["deals", "partners", "borrowers", "commissions"];
