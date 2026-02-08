import { apiClient } from "../../shared/api/client";
export async function fetchBorrowerDashboard() {
    const response = await apiClient.get("/borrower/dashboard");
    return response.data;
}
