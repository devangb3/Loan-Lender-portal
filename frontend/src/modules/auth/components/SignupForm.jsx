import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Alert, Button, Paper, Stack, TextField, Typography } from "@/components/ui/mui";
import { useState } from "react";
import { signup } from "../api";
export function SignupForm() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        company: "",
        branch: "",
        phone_number: "",
    });
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccess(null);
        setError(null);
        try {
            await signup(form);
            setSuccess("Account created. Wait for admin activation before login.");
        }
        catch {
            setError("Signup failed. Verify inputs and retry.");
        }
    };
    return (_jsx(Paper, { elevation: 0, sx: { p: 4, border: "1px solid #d6dfd0", maxWidth: 720, mx: "auto", mt: 6 }, children: _jsxs(Stack, { component: "form", spacing: 2, onSubmit: handleSubmit, children: [_jsx(Typography, { variant: "h3", sx: { color: "primary.main" }, children: "Partner Signup" }), success && _jsx(Alert, { severity: "success", children: success }), error && _jsx(Alert, { severity: "error", children: error }), _jsx(TextField, { label: "Full Name", required: true, value: form.name, onChange: (e) => handleChange("name", e.target.value) }), _jsx(TextField, { label: "Email", required: true, type: "email", value: form.email, onChange: (e) => handleChange("email", e.target.value) }), _jsx(TextField, { label: "Password", required: true, type: "password", value: form.password, onChange: (e) => handleChange("password", e.target.value) }), _jsx(TextField, { label: "Company", required: true, value: form.company, onChange: (e) => handleChange("company", e.target.value) }), _jsx(TextField, { label: "Branch", value: form.branch, onChange: (e) => handleChange("branch", e.target.value) }), _jsx(TextField, { label: "Phone Number", required: true, value: form.phone_number, onChange: (e) => handleChange("phone_number", e.target.value) }), _jsx(Button, { type: "submit", variant: "contained", children: "Create Account" })] }) }));
}
