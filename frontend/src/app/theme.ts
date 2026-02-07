import { createTheme } from "@mui/material";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f4d3f",
    },
    secondary: {
      main: "#b24c3d",
    },
    background: {
      default: "#f4f7f1",
    },
  },
  typography: {
    fontFamily: "'Source Serif 4', serif",
    h1: { fontFamily: "'Bebas Neue', sans-serif" },
    h2: { fontFamily: "'Bebas Neue', sans-serif" },
    h3: { fontFamily: "'Bebas Neue', sans-serif" },
    h4: { fontFamily: "'Bebas Neue', sans-serif" },
    h5: { fontFamily: "'Bebas Neue', sans-serif" },
    h6: { fontFamily: "'Bebas Neue', sans-serif" },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 14,
  },
});
