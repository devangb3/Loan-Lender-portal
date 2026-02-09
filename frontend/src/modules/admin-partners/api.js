import { apiClient } from "../../shared/api/client";

export async function fetchAdminPartners() {
  const response = await apiClient.get("/admin/partners");
  return response.data;
}

export async function updatePartner(partnerId, payload) {
  let message = "Partner updated successfully.";
  const hasGoal = Object.prototype.hasOwnProperty.call(payload, "commission_goal");
  const hasTier = Object.prototype.hasOwnProperty.call(payload, "tier");

  if (hasGoal && hasTier) {
    message = "Partner details updated successfully.";
  } else if (hasGoal) {
    message = "Commission goal updated successfully.";
  } else if (hasTier) {
    message = "Partner tier updated successfully.";
  } else if (payload.is_approved === true) {
    message = "Partner approved successfully.";
  } else if (payload.is_active === true) {
    message = "Partner reactivated successfully.";
  } else if (payload.is_active === false) {
    message = "Partner deactivated successfully.";
  }

  await apiClient.patch(`/admin/partners/${partnerId}`, payload, {
    feedback: { success: message },
  });
}

export async function deactivatePartner(partnerId) {
  await apiClient.post(
    `/admin/partners/${partnerId}/deactivate`,
    null,
    {
      feedback: { success: "Partner deactivated successfully." },
    },
  );
}
