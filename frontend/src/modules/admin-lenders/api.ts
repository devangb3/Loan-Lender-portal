import { apiClient } from "../../shared/api/client";
import type { AdminDealLite, Lender, LenderImportResult } from "./types";

export async function listLenders(query = ""): Promise<Lender[]> {
  const response = await apiClient.get<Lender[]>("/admin/lenders", { params: { query } });
  return response.data;
}

export async function importLenders(file: File): Promise<LenderImportResult> {
  const form = new FormData();
  form.append("file", file);
  const response = await apiClient.post<LenderImportResult>("/admin/lenders/import", form);
  return response.data;
}

export async function listAdminDealsLite(): Promise<AdminDealLite[]> {
  const response = await apiClient.get<Array<{ id: string; property_address: string }>>("/admin/deals");
  return response.data;
}

export async function assignLender(dealId: string, lenderId: string): Promise<void> {
  await apiClient.patch(`/admin/deals/${dealId}/assign-lender`, { lender_id: lenderId });
}

export async function deleteLender(lenderId: string): Promise<void> {
  await apiClient.delete(`/admin/lenders/${lenderId}`);
}

export async function deleteDeal(dealId: string): Promise<void> {
  await apiClient.delete(`/admin/deals/${dealId}`);
}
