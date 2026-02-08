import { apiClient } from "../../shared/api/client";

export async function listAdminDeals() {
  const response = await apiClient.get("/admin/deals");
  return response.data;
}

export async function createCommission(dealId, amount) {
  const response = await apiClient.post(
    `/admin/deals/${dealId}/commission`,
    { amount },
    { feedback: { success: "Commission created successfully." } },
  );
  return response.data;
}

export async function updateCommissionStatus(commissionId, status) {
  const response = await apiClient.patch(
    `/admin/commissions/${commissionId}/status`,
    { status },
    { feedback: { success: "Commission status updated successfully." } },
  );
  return response.data;
}

export async function listCommissions() {
  const response = await apiClient.get("/admin/commissions");
  return response.data;
}
