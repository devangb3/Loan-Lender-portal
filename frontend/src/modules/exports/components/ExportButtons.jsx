import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Paper, Stack, Typography } from "@/components/ui/mui";
import { useExports } from "../hooks";
import { EXPORTS } from "../utils";
export function ExportButtons() {
    const { loadingEntity, runExport } = useExports();
    return (_jsxs(Paper, { elevation: 0, sx: { p: 2, border: "1px solid #d6dfd0" }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: "CSV Exports" }), _jsx(Stack, { direction: "row", spacing: 1, flexWrap: "wrap", children: EXPORTS.map((entity) => (_jsxs(Button, { variant: "contained", disabled: loadingEntity === entity, onClick: () => void runExport(entity), children: ["Export ", entity] }, entity))) })] }));
}
