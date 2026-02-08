import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import PropTypes from "prop-types";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/mui";
import { useState } from "react";
import { Trash2 as DeleteIcon } from "lucide-react";
import { deleteLender } from "../api";
import { rangeLabel } from "../utils";
export function LendersTable({ lenders, onDeleted }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [lenderToDelete, setLenderToDelete] = useState(null);
    const handleDeleteClick = (lender) => {
        setLenderToDelete(lender);
        setDeleteDialogOpen(true);
    };
    const handleDeleteConfirm = async () => {
        if (lenderToDelete) {
            try {
                await deleteLender(lenderToDelete.id);
                setDeleteDialogOpen(false);
                setLenderToDelete(null);
                onDeleted();
            }
            catch (error) {
                console.error("Failed to delete lender:", error);
            }
        }
    };
    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setLenderToDelete(null);
    };
    return (_jsxs(_Fragment, { children: [_jsx(Paper, { elevation: 0, sx: { border: "1px solid #d6dfd0", overflow: "hidden" }, children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Lender" }), _jsx(TableCell, { children: "Specialty" }), _jsx(TableCell, { children: "States" }), _jsx(TableCell, { children: "Loan Range" }), _jsx(TableCell, { children: "Actions" })] }) }), _jsx(TableBody, { children: lenders.map((lender) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: lender.lender_name }), _jsx(TableCell, { children: lender.specialty }), _jsx(TableCell, { children: lender.states }), _jsx(TableCell, { children: rangeLabel(lender.min_loan, lender.max_loan) }), _jsx(TableCell, { children: _jsx(IconButton, { size: "small", color: "error", onClick: () => handleDeleteClick(lender), children: _jsx(DeleteIcon, {}) }) })] }, lender.id))) })] }) }), _jsxs(Dialog, { open: deleteDialogOpen, onClose: handleDeleteCancel, children: [_jsx(DialogTitle, { children: "Delete Lender" }), _jsx(DialogContent, { children: _jsxs(DialogContentText, { children: ["Are you sure you want to delete \"", lenderToDelete?.lender_name, "\"? This action cannot be undone."] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleDeleteCancel, children: "Cancel" }), _jsx(Button, { onClick: () => void handleDeleteConfirm(), color: "error", variant: "contained", children: "Delete" })] })] })] }));
}
LendersTable.propTypes = {
    lenders: PropTypes.arrayOf(PropTypes.object).isRequired,
    onDeleted: PropTypes.func.isRequired,
};
