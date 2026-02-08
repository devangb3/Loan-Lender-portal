import { apiClient } from "../../shared/api/client";
export async function fetchAdminPartners() {
    const response = await apiClient.get("/admin/partners");
    return response.data;
}
export async function updatePartner(partnerId, payload) {
    await apiClient.patch(`/admin/partners/${partnerId}`, payload);
}
export async function deactivatePartner(partnerId) {
    await apiClient.post(`/admin/partners/${partnerId}/deactivate`);
}
