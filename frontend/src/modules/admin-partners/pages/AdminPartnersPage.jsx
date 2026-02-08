import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Stack, Typography } from "@/components/ui/mui";
import { PartnersTable } from "../components/PartnersTable";
import { useAdminPartners } from "../hooks";
export function AdminPartnersPage() {
    const { partners, refresh } = useAdminPartners();
    return (_jsxs(Stack, { spacing: 2, children: [_jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", children: [_jsx(Typography, { variant: "h2", children: "Admin Partner Management" }), _jsx(Button, { variant: "contained", onClick: () => void refresh(), children: "Refresh" })] }), _jsx(PartnersTable, { partners: partners, onChanged: () => void refresh() })] }));
}
