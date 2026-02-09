import { apiClient } from "../../shared/api/client";

export async function fetchKanbanBoard() {
  const response = await apiClient.get("/admin/kanban");
  return response.data;
}

export async function fetchAdminDealDetail(dealId) {
  const response = await apiClient.get(
    `/admin/deals/${dealId}`,
    { feedback: { success: false, error: "Failed to load deal details." } },
  );
  return response.data;
}

export async function fetchAdminDealEvents(dealId) {
  const response = await apiClient.get(
    `/admin/deals/${dealId}/events`,
    { feedback: { success: false, error: "Failed to load deal timeline." } },
  );
  return response.data;
}

export async function moveDealStage(dealId, stage, reason) {
  await apiClient.patch(
    `/admin/deals/${dealId}/stage`,
    { stage, reason },
    { feedback: { success: "Deal stage updated successfully." } },
  );
}

export async function listSubstages() {
  const response = await apiClient.get("/admin/substages");
  return response.data;
}

export async function createSubstage(payload) {
  const response = await apiClient.post(
    "/admin/substages",
    payload,
    { feedback: { success: "Sub-stage created successfully." } },
  );
  return response.data;
}

export async function deleteSubstage(substageId) {
  await apiClient.delete(`/admin/substages/${substageId}`, {
    feedback: { success: "Sub-stage deleted successfully." },
  });
}

export async function updateDealSubstage(dealId, substageId) {
  await apiClient.patch(
    `/admin/deals/${dealId}/substage`,
    { substage_id: substageId || null },
    { feedback: { success: "Sub-stage updated." } },
  );
}

export async function deleteDeal(dealId) {
  await apiClient.delete(`/admin/deals/${dealId}`, {
    feedback: { success: "Deal deleted successfully." },
  });
}
