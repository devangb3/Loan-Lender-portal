import { apiClient } from "../../shared/api/client";
import type { AdminDeal, Commission } from "./types";

export async function listAdminDeals(): Promise<AdminDeal[]> {
  const response = await apiClient.get<AdminDeal[]>("/admin/deals");
  return response.data;
}

export async function createCommission(dealId: string, amount: number): Promise<Commission> {
  const response = await apiClient.post<Commission>(`/admin/deals/${dealId}/commission`, { amount });
  return response.data;
}

export async function updateCommissionStatus(commissionId: string, status: Commission["status"]): Promise<Commission> {
  const response = await apiClient.patch<Commission>(`/admin/commissions/${commissionId}/status`, { status });
  return response.data;
}

export async function listCommissions(): Promise<Commission[]> {
  const response = await apiClient.get<Commission[]>("/admin/commissions");
  return response.data;
}
