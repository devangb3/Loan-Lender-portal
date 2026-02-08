import { apiClient } from "../../shared/api/client";

export async function listLenders(query = "") {
  const response = await apiClient.get("/admin/lenders", { params: { query } });
  return response.data;
}

export async function importLenders(file) {
  const form = new FormData();
  form.append("file", file);
  const response = await apiClient.post("/admin/lenders/import", form, {
    feedback: { success: "Lenders imported successfully." },
  });
  return response.data;
}

export async function listAdminDealsLite() {
  const response = await apiClient.get("/admin/deals");
  return response.data;
}

export async function assignLender(dealId, lenderId) {
  await apiClient.patch(
    `/admin/deals/${dealId}/assign-lender`,
    { lender_id: lenderId },
    { feedback: { success: "Lender assigned successfully." } },
  );
}

export async function deleteLender(lenderId) {
  await apiClient.delete(`/admin/lenders/${lenderId}`, {
    feedback: { success: "Lender deleted successfully." },
  });
}

export async function deleteDeal(dealId) {
  await apiClient.delete(`/admin/deals/${dealId}`, {
    feedback: { success: "Deal deleted successfully." },
  });
}
