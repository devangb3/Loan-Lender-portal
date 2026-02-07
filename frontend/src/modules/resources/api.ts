import { apiClient } from "../../shared/api/client";
import type { ResourceItem } from "./types";

export async function listPartnerResources(): Promise<ResourceItem[]> {
  const response = await apiClient.get<ResourceItem[]>("/partner/resources");
  return response.data;
}
