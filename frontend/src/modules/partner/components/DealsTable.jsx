import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from "prop-types";
import { Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@/components/ui/mui";
import { currency } from "../utils";
export function DealsTable({ deals }) {
    return (_jsxs(Paper, { elevation: 0, sx: { border: "1px solid #d6dfd0", overflow: "hidden" }, children: [_jsx(Typography, { variant: "h5", sx: { p: 2 }, children: "Submitted Deals" }), _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Address" }), _jsx(TableCell, { children: "Loan Amount" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { children: "Created" })] }) }), _jsx(TableBody, { children: deals.map((deal) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: deal.property_address }), _jsx(TableCell, { children: currency(deal.loan_amount) }), _jsx(TableCell, { children: _jsx(Chip, { label: deal.stage, color: "primary", variant: "outlined" }) }), _jsx(TableCell, { children: new Date(deal.created_at).toLocaleDateString() })] }, deal.id))) })] })] }));
}
DealsTable.propTypes = {
    deals: PropTypes.arrayOf(PropTypes.object).isRequired,
};
