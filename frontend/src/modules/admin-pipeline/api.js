import { apiClient } from "../../shared/api/client";
export async function fetchKanbanBoard() {
    const response = await apiClient.get("/admin/kanban");
    return response.data;
}
export async function moveDealStage(dealId, stage, reason) {
    await apiClient.patch(`/admin/deals/${dealId}/stage`, { stage, reason });
}
export async function listSubstages() {
    const response = await apiClient.get("/admin/substages");
    return response.data;
}
export async function createSubstage(payload) {
    const response = await apiClient.post("/admin/substages", payload);
    return response.data;
}
export async function deleteSubstage(substageId) {
    await apiClient.delete(`/admin/substages/${substageId}`);
}
export async function deleteDeal(dealId) {
    await apiClient.delete(`/admin/deals/${dealId}`);
}
