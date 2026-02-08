import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Stack, Typography } from "@/components/ui/mui";
import { BorrowerDealsList } from "../components/BorrowerDealsList";
import { useBorrowerData } from "../hooks";
export function BorrowerDashboardPage() {
    const { data, refresh } = useBorrowerData();
    return (_jsxs(Stack, { spacing: 3, children: [_jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", children: [_jsx(Typography, { variant: "h2", children: "Borrower Portal" }), _jsx(Button, { variant: "contained", onClick: () => void refresh(), children: "Refresh" })] }), _jsx(BorrowerDealsList, { deals: data.deals })] }));
}
