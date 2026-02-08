import { USER_ROLES } from "@/shared/constants";

export function homeRouteForRole(role) {
    if (role === USER_ROLES.ADMIN)
        return "/admin/pipeline";
    if (role === USER_ROLES.BORROWER)
        return "/borrower";
    return "/partner";
}
