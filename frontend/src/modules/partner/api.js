import { apiClient } from "../../shared/api/client";

export async function fetchPartnerDashboard() {
  const response = await apiClient.get("/partner/dashboard");
  return response.data;
}

export async function fetchPartnerDeals() {
  const response = await apiClient.get("/partner/deals");
  return response.data;
}

export async function submitDeal(formData) {
  const response = await apiClient.post("/partner/deals", formData, {
    feedback: { success: "Deal submitted successfully." },
  });
  return response.data;
}

export async function fetchCommissionSummary() {
  const response = await apiClient.get("/partner/commissions/summary");
  return response.data;
}
