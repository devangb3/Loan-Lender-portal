import { apiClient } from "../../shared/api/client";
import type { CommissionSummary, DealDetail, DealItem, PartnerDashboard } from "./types";

export async function fetchPartnerDashboard(): Promise<PartnerDashboard> {
  const response = await apiClient.get<PartnerDashboard>("/partner/dashboard");
  return response.data;
}

export async function fetchPartnerDeals(): Promise<DealItem[]> {
  const response = await apiClient.get<DealItem[]>("/partner/deals");
  return response.data;
}

export async function submitDeal(formData: FormData): Promise<DealDetail> {
  const response = await apiClient.post<DealDetail>("/partner/deals", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function fetchCommissionSummary(): Promise<CommissionSummary> {
  const response = await apiClient.get<CommissionSummary>("/partner/commissions/summary");
  return response.data;
}
