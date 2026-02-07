import { apiClient } from "../../shared/api/client";
import type { AuthResponse, LoginRequest, SignupRequest } from "./types";

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function signup(payload: SignupRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/partner/signup", payload);
  return response.data;
}

export async function forgotPassword(email: string): Promise<void> {
  await apiClient.post("/auth/password/forgot", { email });
}
