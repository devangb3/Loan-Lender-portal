import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import PropTypes from "prop-types";
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/mui";
import { useState } from "react";
import { deactivatePartner, updatePartner } from "../api";
import { pct } from "../utils";
export function PartnersTable({ partners, onChanged }) {
    const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
    const [partnerToDeactivate, setPartnerToDeactivate] = useState(null);
    const handleDeactivateClick = (partner) => {
        setPartnerToDeactivate(partner);
        setDeactivateDialogOpen(true);
    };
    const handleDeactivateConfirm = async () => {
        if (partnerToDeactivate) {
            try {
                await deactivatePartner(partnerToDeactivate.id);
                setDeactivateDialogOpen(false);
                setPartnerToDeactivate(null);
                onChanged();
            }
            catch (error) {
                console.error("Failed to deactivate partner:", error);
            }
        }
    };
    const handleDeactivateCancel = () => {
        setDeactivateDialogOpen(false);
        setPartnerToDeactivate(null);
    };
    return (_jsxs(_Fragment, { children: [_jsx(Paper, { elevation: 0, sx: { border: "1px solid #d6dfd0", overflow: "hidden" }, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Company" }), _jsx(TableCell, { children: "Tier" }), _jsx(TableCell, { children: "Deals" }), _jsx(TableCell, { children: "Conversion" }), _jsx(TableCell, { children: "Volume" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { children: "Actions" })] }) }), _jsx(TableBody, { children: partners.map((partner) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: partner.company }), _jsx(TableCell, { children: _jsx(Chip, { label: partner.tier, size: "small" }) }), _jsx(TableCell, { children: partner.deal_count }), _jsx(TableCell, { children: pct(partner.conversion_rate) }), _jsx(TableCell, { children: partner.total_volume.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }), _jsx(TableCell, { children: _jsx(Chip, { label: partner.is_active ? "Active" : "Inactive", color: partner.is_active ? "success" : "default", size: "small" }) }), _jsx(TableCell, { children: partner.is_active ? (_jsx(Button, { size: "small", color: "error", variant: "outlined", onClick: () => handleDeactivateClick(partner), children: "Deactivate" })) : (_jsx(Button, { size: "small", variant: "contained", onClick: () => {
                                                void updatePartner(partner.id, { is_active: true }).then(onChanged);
                                            }, children: "Activate" })) })] }, partner.id))) })] }) }), _jsxs(Dialog, { open: deactivateDialogOpen, onClose: handleDeactivateCancel, children: [_jsx(DialogTitle, { children: "Deactivate Partner" }), _jsx(DialogContent, { children: _jsxs(DialogContentText, { children: ["Are you sure you want to deactivate \"", partnerToDeactivate?.company, "\"? This will disable their account and prevent them from logging in. This action can be reversed by activating them again."] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleDeactivateCancel, children: "Cancel" }), _jsx(Button, { onClick: () => void handleDeactivateConfirm(), color: "error", variant: "contained", children: "Deactivate" })] })] })] }));
}
PartnersTable.propTypes = {
    partners: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChanged: PropTypes.func.isRequired,
};
