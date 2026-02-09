import { ROLE_HOME_ROUTES, USER_ROLES } from "@/shared/constants";

export function homeRouteForRole(role) {
    return ROLE_HOME_ROUTES[role] || ROLE_HOME_ROUTES[USER_ROLES.PARTNER];
}
