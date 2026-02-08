import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Stack, Typography } from "@/components/ui/mui";
import { CommissionBuilder } from "../components/CommissionBuilder";
import { CommissionsTable } from "../components/CommissionsTable";
import { useCommissionData } from "../hooks";
import { listCommissions } from "../api";
export function AdminCommissionsPage() {
    const { deals, commissions, setCommissions, refresh } = useCommissionData();
    const refreshCommissions = async () => {
        const commissionsData = await listCommissions();
        setCommissions(commissionsData);
    };
    return (_jsxs(Stack, { spacing: 2, children: [_jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", children: [_jsx(Typography, { variant: "h2", children: "Admin Commissions" }), _jsx(Button, { variant: "contained", onClick: () => void refresh(), children: "Refresh" })] }), _jsx(CommissionBuilder, { deals: deals, onCreated: (item) => setCommissions((prev) => [item, ...prev]), onRefresh: refreshCommissions }), _jsx(CommissionsTable, { commissions: commissions, onChanged: setCommissions })] }));
}
