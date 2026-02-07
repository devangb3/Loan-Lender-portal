import type { UserRole } from "../../shared/types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  company: string;
  branch?: string;
  phone_number: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string | null;
}

export interface AuthResponse {
  user: AuthUser;
}
