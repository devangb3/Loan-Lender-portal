const listeners = new Set();

export function subscribeFeedback(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function pushFeedback(event) {
  for (const listener of listeners) {
    listener(event);
  }
}

export function extractErrorMessage(error, fallback = "Request failed. Please try again.") {
  if (!error || typeof error !== "object") return fallback;

  const maybeResponse = error.response;
  const detail = maybeResponse?.data?.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item?.msg === "string") return item.msg;
        if (typeof item === "string") return item;
        return "";
      })
      .filter(Boolean);

    if (messages.length) return messages.join("; ");
  }

  if (typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
