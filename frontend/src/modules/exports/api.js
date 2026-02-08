import { apiClient } from "../../shared/api/client";
export async function downloadExport(entity) {
    const response = await apiClient.get(`/admin/exports/${entity}`, { responseType: "blob" });
    const blob = new Blob([response.data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${entity}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
}
