import { apiClient } from "../../shared/api/client";
export async function login(payload) {
    const response = await apiClient.post("/auth/login", payload);
    return response.data;
}
export async function signup(payload) {
    const response = await apiClient.post("/auth/partner/signup", payload);
    return response.data;
}
export async function forgotPassword(email) {
    await apiClient.post("/auth/password/forgot", { email });
}
