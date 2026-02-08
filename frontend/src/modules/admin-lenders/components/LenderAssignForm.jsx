import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from "prop-types";
import { Button, MenuItem, Paper, Stack, TextField, Typography } from "@/components/ui/mui";
import { useState } from "react";
import { assignLender } from "../api";
export function LenderAssignForm({ deals, lenders, onAssigned }) {
    const [dealId, setDealId] = useState("");
    const [lenderId, setLenderId] = useState("");
    const submit = async () => {
        if (!dealId || !lenderId)
            return;
        await assignLender(dealId, lenderId);
        onAssigned();
    };
    return (_jsx(Paper, { elevation: 0, sx: { p: 2, border: "1px solid #d6dfd0" }, children: _jsxs(Stack, { spacing: 2, children: [_jsx(Typography, { variant: "h5", children: "Assign Lender to Deal" }), _jsx(TextField, { select: true, label: "Deal", value: dealId, onChange: (event) => setDealId(event.target.value), children: deals.map((deal) => (_jsx(MenuItem, { value: deal.id, children: deal.property_address }, deal.id))) }), _jsx(TextField, { select: true, label: "Lender", value: lenderId, onChange: (event) => setLenderId(event.target.value), children: lenders.map((lender) => (_jsx(MenuItem, { value: lender.id, children: lender.lender_name }, lender.id))) }), _jsx(Button, { variant: "contained", onClick: () => void submit(), children: "Assign" })] }) }));
}
LenderAssignForm.propTypes = {
    deals: PropTypes.arrayOf(PropTypes.object).isRequired,
    lenders: PropTypes.arrayOf(PropTypes.object).isRequired,
    onAssigned: PropTypes.func.isRequired,
};
