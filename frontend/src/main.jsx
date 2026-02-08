import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "./app/AuthContext";
import { router } from "./app/routes";
import { FeedbackProvider } from "./shared/feedback/FeedbackProvider";
import "./styles/globals.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Missing root element");
}

createRoot(rootElement).render(
  <FeedbackProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </FeedbackProvider>,
);
