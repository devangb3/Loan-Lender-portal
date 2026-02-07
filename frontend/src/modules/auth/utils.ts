import type { UserRole } from "../../shared/types";

export function homeRouteForRole(role: UserRole): string {
  if (role === "admin") return "/admin/pipeline";
  if (role === "borrower") return "/borrower";
  return "/partner";
}
