import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from "@/components/ui/mui";
import { SignupForm } from "../components/SignupForm";
export function SignupPage() {
    return (_jsx(Box, { sx: { minHeight: "100vh", background: "radial-gradient(circle at top right, #fce9d7, #f2f8f0 40%, #e8efe7)" }, children: _jsx(SignupForm, {}) }));
}
