import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from "prop-types";
import { Chip, List, ListItem, ListItemText, Paper, Stack, Typography } from "@/components/ui/mui";
import { toCurrency } from "../utils";
export function BorrowerDealsList({ deals }) {
    return (_jsxs(Paper, { elevation: 0, sx: { border: "1px solid #d6dfd0", p: 2 }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: "Loan Applications" }), _jsx(List, { children: deals.map((deal) => (_jsxs(ListItem, { divider: true, children: [_jsx(ListItemText, { primary: deal.property_address, secondary: `${toCurrency(deal.loan_amount)} • Referred by ${deal.referring_partner_name ?? "Partner"}` }), _jsx(Stack, { direction: "row", spacing: 1, children: _jsx(Chip, { label: deal.stage, color: "primary", variant: "outlined" }) })] }, deal.id))) })] }));
}
BorrowerDealsList.propTypes = {
    deals: PropTypes.arrayOf(PropTypes.object).isRequired,
};
