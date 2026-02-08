import { apiClient } from "../../shared/api/client";
import type { AdminPartner } from "./types";

export async function fetchAdminPartners(): Promise<AdminPartner[]> {
  const response = await apiClient.get<AdminPartner[]>("/admin/partners");
  return response.data;
}

export async function updatePartner(partnerId: string, payload: Partial<AdminPartner>): Promise<void> {
  await apiClient.patch(`/admin/partners/${partnerId}`, payload);
}

export async function deactivatePartner(partnerId: string): Promise<void> {
  await apiClient.post(`/admin/partners/${partnerId}/deactivate`);
}
