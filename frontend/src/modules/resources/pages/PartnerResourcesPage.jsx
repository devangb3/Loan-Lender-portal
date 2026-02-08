import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Stack, Typography } from "@/components/ui/mui";
import { ResourceGroup } from "../components/ResourceGroup";
import { usePartnerResources } from "../hooks";
import { groupByCategory } from "../utils";
export function PartnerResourcesPage() {
    const { resources, refresh } = usePartnerResources();
    const grouped = groupByCategory(resources);
    return (_jsxs(Stack, { spacing: 2, children: [_jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", children: [_jsx(Typography, { variant: "h2", children: "Partner Resources" }), _jsx(Button, { variant: "contained", onClick: () => void refresh(), children: "Refresh" })] }), _jsx(ResourceGroup, { title: "Scripts", items: grouped.scripts ?? [] }), _jsx(ResourceGroup, { title: "FAQ", items: grouped.faq ?? [] }), _jsx(ResourceGroup, { title: "Loan Types", items: grouped.loan_types ?? [] })] }));
}
