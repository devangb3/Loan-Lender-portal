import { apiClient } from "../../shared/api/client";
import type { BorrowerDashboard } from "./types";

export async function fetchBorrowerDashboard(): Promise<BorrowerDashboard> {
  const response = await apiClient.get<BorrowerDashboard>("/borrower/dashboard");
  return response.data;
}
