import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from "prop-types";
import { Alert, Button, Paper, Stack, Typography } from "@/components/ui/mui";
import { useState } from "react";
import { importLenders } from "../api";
export function LenderImportForm({ onImported }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const handleImport = async () => {
        if (!file)
            return;
        setError(null);
        setStatus(null);
        try {
            const result = await importLenders(file);
            setStatus(`Imported: ${result.imported_count}, Skipped: ${result.skipped_count}`);
            onImported();
        }
        catch (err) {
            let message = "Failed to import lenders";
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err;
                if (axiosError.response?.status === 403) {
                    message = "Access denied. Please ensure you are logged in as an admin user.";
                }
                else if (axiosError.response?.data?.detail) {
                    message = axiosError.response.data.detail;
                }
                else if (axiosError.response?.status) {
                    message = `Request failed with status ${axiosError.response.status}`;
                }
            }
            else if (err instanceof Error) {
                message = err.message;
            }
            setError(message);
        }
    };
    return (_jsx(Paper, { elevation: 0, sx: { p: 2, border: "1px solid #d6dfd0" }, children: _jsxs(Stack, { spacing: 1, children: [_jsx(Typography, { variant: "h5", children: "Lender CSV Import" }), status && _jsx(Alert, { severity: "info", children: status }), error && _jsx(Alert, { severity: "error", children: error }), _jsxs(Button, { component: "label", variant: "outlined", children: ["Select CSV", _jsx("input", { type: "file", hidden: true, accept: ".csv", onChange: (event) => setFile(event.target.files?.[0] ?? null) })] }), file && _jsxs(Typography, { variant: "body2", children: ["Selected: ", file.name] }), _jsx(Button, { variant: "contained", onClick: () => void handleImport(), disabled: !file, children: "Import" })] }) }));
}
LenderImportForm.propTypes = {
    onImported: PropTypes.func.isRequired,
};
