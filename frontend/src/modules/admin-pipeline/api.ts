import { apiClient } from "../../shared/api/client";
import type { KanbanBoard, SubStage } from "./types";

export async function fetchKanbanBoard(): Promise<KanbanBoard> {
  const response = await apiClient.get<KanbanBoard>("/admin/kanban");
  return response.data;
}

export async function moveDealStage(dealId: string, stage: string, reason?: string): Promise<void> {
  await apiClient.patch(`/admin/deals/${dealId}/stage`, { stage, reason });
}

export async function listSubstages(): Promise<SubStage[]> {
  const response = await apiClient.get<SubStage[]>("/admin/substages");
  return response.data;
}

export async function createSubstage(payload: {
  name: string;
  main_stage: string;
  order_index: number;
  is_active: boolean;
}): Promise<SubStage> {
  const response = await apiClient.post<SubStage>("/admin/substages", payload);
  return response.data;
}

export async function deleteSubstage(substageId: string): Promise<void> {
  await apiClient.delete(`/admin/substages/${substageId}`);
}
