import axios from "axios";
import { extractErrorMessage, pushFeedback } from "../feedback/store";

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";
const AUTH_DEBUG_PREFIX = "[AUTH_DEBUG]";

export const apiClient = axios.create({
  baseURL: apiBase,
  withCredentials: true,
});

function isAuthRequest(url) {
  return typeof url === "string" && url.includes("/auth");
}

function currentPath() {
  if (typeof window === "undefined") return null;
  return window.location.pathname;
}

apiClient.interceptors.request.use(
  (config) => {
    if (isAuthRequest(config.url)) {
      console.log(`${AUTH_DEBUG_PREFIX} request`, {
        method: (config.method || "get").toUpperCase(),
        baseURL: config.baseURL,
        url: config.url,
        withCredentials: config.withCredentials,
        currentPath: currentPath(),
      });
    }
    return config;
  },
  (error) => {
    console.error(`${AUTH_DEBUG_PREFIX} request_error`, error);
    return Promise.reject(error);
  },
);

function defaultSuccessMessage(method) {
  if (method === "post") return "Created successfully.";
  if (method === "patch" || method === "put") return "Updated successfully.";
  if (method === "delete") return "Deleted successfully.";
  return "Action completed successfully.";
}

apiClient.interceptors.response.use(
  (response) => {
    if (isAuthRequest(response.config?.url)) {
      console.log(`${AUTH_DEBUG_PREFIX} response`, {
        status: response.status,
        method: (response.config?.method || "get").toUpperCase(),
        url: response.config?.url,
        currentPath: currentPath(),
      });
    }

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
    if (isAuthRequest(error.config?.url)) {
      console.error(`${AUTH_DEBUG_PREFIX} response_error`, {
        status: error.response?.status,
        method: (error.config?.method || "get").toUpperCase(),
        url: error.config?.url,
        data: error.response?.data,
        currentPath: currentPath(),
      });
    }

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
