import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Stack, Typography } from "@/components/ui/mui";
import { ExportButtons } from "../components/ExportButtons";
export function ExportsPage() {
    return (_jsxs(Stack, { spacing: 2, children: [_jsx(Typography, { variant: "h2", children: "Admin Exports" }), _jsx(ExportButtons, {})] }));
}
