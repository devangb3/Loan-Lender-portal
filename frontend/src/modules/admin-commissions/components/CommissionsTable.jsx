import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from "prop-types";
import { Button, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/mui";
import { useState } from "react";
import { updateCommissionStatus } from "../api";
import { toCurrency } from "../utils";
export function CommissionsTable({ commissions, onChanged }) {
    const [updatingId, setUpdatingId] = useState(null);
    const handleStatusChange = async (commission, status) => {
        setUpdatingId(commission.id);
        try {
            const updated = await updateCommissionStatus(commission.id, status);
            onChanged(commissions.map((item) => (item.id === updated.id ? updated : item)));
        }
        finally {
            setUpdatingId(null);
        }
    };
    return (_jsx(Paper, { elevation: 0, sx: { border: "1px solid #d6dfd0", overflow: "hidden" }, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Deal" }), _jsx(TableCell, { children: "Amount" }), _jsx(TableCell, { children: "Status" })] }) }), _jsx(TableBody, { children: commissions.map((commission) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: commission.deal_id }), _jsx(TableCell, { children: toCurrency(commission.amount) }), _jsx(TableCell, { children: _jsxs(Stack, { direction: "row", spacing: 1, alignItems: "center", children: [_jsxs(Select, { size: "small", value: commission.status, disabled: updatingId === commission.id, onChange: (event) => void handleStatusChange(commission, event.target.value), children: [_jsx(MenuItem, { value: "pending", children: "pending" }), _jsx(MenuItem, { value: "earned", children: "earned" }), _jsx(MenuItem, { value: "paid", children: "paid" })] }), _jsx(Button, { size: "small", variant: "text", disabled: true, children: "Forward-only" })] }) })] }, commission.id))) })] }) }));
}
CommissionsTable.propTypes = {
    commissions: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChanged: PropTypes.func.isRequired,
};
