import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Stack, TextField, Typography } from "@/components/ui/mui";
import { LenderAssignForm } from "../components/LenderAssignForm";
import { LenderImportForm } from "../components/LenderImportForm";
import { LendersTable } from "../components/LendersTable";
import { useLenders } from "../hooks";
export function AdminLendersPage() {
    const { lenders, deals, query, setQuery, refresh } = useLenders();
    return (_jsxs(Stack, { spacing: 2, children: [_jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", children: [_jsx(Typography, { variant: "h2", children: "Admin Lender Database" }), _jsx(Button, { variant: "contained", onClick: () => void refresh(), children: "Refresh" })] }), _jsx(TextField, { label: "Search lenders", value: query, onChange: (event) => setQuery(event.target.value) }), _jsx(LenderImportForm, { onImported: () => void refresh() }), _jsx(LenderAssignForm, { deals: deals, lenders: lenders, onAssigned: () => void refresh() }), _jsx(LendersTable, { lenders: lenders, onDeleted: () => void refresh() })] }));
}
