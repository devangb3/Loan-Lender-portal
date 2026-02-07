import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./app/AuthContext";
import { router } from "./app/routes";
import { appTheme } from "./app/theme";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Missing root element");
}

createRoot(rootElement).render(
  <ThemeProvider theme={appTheme}>
    <CssBaseline />
    <GlobalStyles
      styles={{
        "@import":
          "url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Source+Serif+4:opsz,wght@8..60,300..900&display=swap')",
      }}
    />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </ThemeProvider>,
);
