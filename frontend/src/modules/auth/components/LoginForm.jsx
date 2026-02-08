import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@/components/ui/mui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import { useAuth } from "../hooks";
import { homeRouteForRole } from "../utils";
export function LoginForm() {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        try {
            const response = await login({ email, password });
            await refreshUser();
            navigate(homeRouteForRole(response.user.role));
        }
        catch {
            setError("Login failed. Check credentials or account activation.");
        }
    };
    return (_jsx(Paper, { elevation: 0, sx: { p: 4, border: "1px solid #d6dfd0", maxWidth: 560, mx: "auto", mt: 8 }, children: _jsxs(Stack, { component: "form", spacing: 2, onSubmit: handleSubmit, children: [_jsx(Typography, { variant: "h3", sx: { color: "primary.main" }, children: "Partner Portal Login" }), _jsx(Typography, { variant: "body2", children: "Use your role account credentials to continue." }), error && _jsx(Alert, { severity: "error", children: error }), _jsx(TextField, { label: "Email", value: email, onChange: (e) => setEmail(e.target.value), type: "email", required: true }), _jsx(TextField, { label: "Password", value: password, onChange: (e) => setPassword(e.target.value), type: "password", required: true }), _jsx(Box, { children: _jsx(Button, { type: "submit", variant: "contained", size: "large", children: "Login" }) })] }) }));
}
