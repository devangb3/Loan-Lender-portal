export type UserRole = "partner" | "borrower" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string | null;
}
