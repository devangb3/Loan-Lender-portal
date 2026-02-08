import axios from "axios";
import { extractErrorMessage, pushFeedback } from "../feedback/store";

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: apiBase,
  withCredentials: true,
});

function defaultSuccessMessage(method) {
  if (method === "post") return "Created successfully.";
  if (method === "patch" || method === "put") return "Updated successfully.";
  if (method === "delete") return "Deleted successfully.";
  return "Action completed successfully.";
}

apiClient.interceptors.response.use(
  (response) => {
    const method = (response.config?.method || "get").toLowerCase();
    const feedback = response.config?.feedback || {};
    const successOption = feedback.success;

    const shouldShowSuccess = typeof successOption === "string" || successOption === true || (successOption !== false && method !== "get");
    if (shouldShowSuccess) {
      pushFeedback({
        type: "success",
        message: typeof successOption === "string" ? successOption : defaultSuccessMessage(method),
      });
    }

    return response;
  },
  (error) => {
    const feedback = error.config?.feedback || {};
    const errorOption = feedback.error;

    if (errorOption !== false) {
      pushFeedback({
        type: "error",
        message: typeof errorOption === "string" ? errorOption : extractErrorMessage(error),
      });
    }

    return Promise.reject(error);
  },
);
