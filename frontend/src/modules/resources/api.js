import { apiClient } from "../../shared/api/client";
export async function listPartnerResources() {
    const response = await apiClient.get("/partner/resources");
    return response.data;
}
