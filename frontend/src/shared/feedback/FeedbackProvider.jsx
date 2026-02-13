import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import { pushFeedback as broadcastFeedback, subscribeFeedback } from "./store";

function toneClasses(type) {
  if (type === "success") {
    return "border-l-emerald-400 border-emerald-400/30 bg-card/90 text-emerald-400";
  }

  if (type === "error") {
    return "border-l-destructive border-destructive/30 bg-card/90 text-destructive";
  }

  return "border-l-primary border-border bg-card/90 text-foreground";
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
          <div key={item.id} className={`pointer-events-auto animate-fade-up rounded-md border border-l-[3px] p-3 shadow-elevated backdrop-blur-xl ${toneClasses(item.type)}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">{item.message}</p>
              <button
                type="button"
                className="shrink-0 rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground opacity-80 transition-opacity hover:opacity-100 hover:text-foreground"
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
