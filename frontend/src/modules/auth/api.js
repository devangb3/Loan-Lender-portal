import { apiClient } from "../../shared/api/client";

export async function login(payload) {
  const response = await apiClient.post(
    "/auth/login",
    payload,
    { feedback: { success: "Logged in successfully.", error: "Login failed. Check credentials or account status." } },
  );
  return response.data;
}

export async function signup(payload) {
  const response = await apiClient.post(
    "/auth/partner/signup",
    payload,
    { feedback: { success: "Account created. Wait for admin activation before login." } },
  );
  return response.data;
}

export async function forgotPassword(email) {
  await apiClient.post(
    "/auth/password/forgot",
    { email },
    { feedback: { success: "Password reset email sent if account exists." } },
  );
}
