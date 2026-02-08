import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from "@/components/ui/mui";
import { LoginForm } from "../components/LoginForm";
export function LoginPage() {
    return (_jsx(Box, { sx: { minHeight: "100vh", background: "radial-gradient(circle at top left, #f5e6d7, #f1f5ef 45%, #e4ece7)" }, children: _jsx(LoginForm, {}) }));
}
