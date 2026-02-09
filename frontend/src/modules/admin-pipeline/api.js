import { apiClient } from "../../shared/api/client";

export async function fetchKanbanBoard() {
  const response = await apiClient.get("/admin/kanban");
  return response.data;
}

export async function fetchAdminDeals() {
  const response = await apiClient.get("/admin/deals", {
    feedback: { success: false, error: "Failed to load deals." },
  });
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

export async function acceptDeal(dealId) {
  await apiClient.post(
    `/admin/deals/${dealId}/accept`,
    null,
    { feedback: { success: "Deal accepted." } },
  );
}

export async function declineDeal(dealId, reason) {
  await apiClient.post(
    `/admin/deals/${dealId}/decline`,
    { reason },
    { feedback: { success: "Deal declined and partner notified." } },
  );
}

export async function assignLender(dealId, lenderId) {
  await apiClient.patch(
    `/admin/deals/${dealId}/assign-lender`,
    { lender_id: lenderId },
    { feedback: { success: "Lender assigned successfully." } },
  );
}

export async function updateDealNotes(dealId, internalNotes) {
  const response = await apiClient.patch(
    `/admin/deals/${dealId}/notes`,
    { internal_notes: internalNotes ?? null },
    { feedback: { success: "Notes saved." } },
  );
  return response.data;
}

export async function createCommission(dealId, amount) {
  const response = await apiClient.post(
    `/admin/deals/${dealId}/commission`,
    { amount },
    { feedback: { success: "Commission created." } },
  );
  return response.data;
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

export async function updateSubstage(substageId, payload) {
  const response = await apiClient.patch(
    `/admin/substages/${substageId}`,
    payload,
    { feedback: { success: "Sub-stage updated." } },
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

export async function listLenders(query = "") {
  const response = await apiClient.get("/admin/lenders", {
    params: { page: 1, page_size: 50, query },
    feedback: { success: false, error: "Failed to load lenders." },
  });
  return response.data;
}
