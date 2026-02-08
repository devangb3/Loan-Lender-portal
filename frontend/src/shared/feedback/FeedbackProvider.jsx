import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import { pushFeedback as broadcastFeedback, subscribeFeedback } from "./store";

function toneClasses(type) {
  if (type === "success") {
    return "border-emerald-500/50 bg-emerald-50 text-emerald-900";
  }

  if (type === "error") {
    return "border-destructive/60 bg-destructive/10 text-destructive";
  }

  return "border-border bg-card text-foreground";
}

export function FeedbackProvider({ children }) {
  const [items, setItems] = useState([]);
  const timersRef = useRef({});

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeFeedback((event) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const duration = event.type === "error" ? 5500 : 3200;
      const item = {
        id,
        type: event.type || "info",
        message: event.message || "Done.",
      };

      setItems((prev) => [...prev, item]);
      timersRef.current[id] = setTimeout(() => removeItem(id), duration);
    });

    return () => {
      unsubscribe();
      Object.values(timersRef.current).forEach((timer) => clearTimeout(timer));
      timersRef.current = {};
    };
  }, []);

  const value = useMemo(
    () => ({
      success: (message) => broadcastFeedback({ type: "success", message }),
      error: (message) => broadcastFeedback({ type: "error", message }),
      info: (message) => broadcastFeedback({ type: "info", message }),
    }),
    [],
  );

  return (
    <>
      <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className={`pointer-events-auto rounded-md border p-3 shadow-editorial ${toneClasses(item.type)}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">{item.message}</p>
              <button
                type="button"
                className="shrink-0 rounded-md border border-current/25 px-2 py-0.5 text-xs opacity-80 transition-opacity hover:opacity-100"
                onClick={() => removeItem(item.id)}
              >
                x
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const FeedbackContext = createContext(undefined);

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within FeedbackProvider");
  }
  return context;
}

FeedbackProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
