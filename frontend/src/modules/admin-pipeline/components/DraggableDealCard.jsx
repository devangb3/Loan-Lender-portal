import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import PropTypes from "prop-types";
import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Stack, Typography } from "@/components/ui/mui";
import { Trash2 as DeleteIcon } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";
import { deleteDeal } from "../api";
export function DraggableDealCard({ deal, onDeleted }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: deal.id, data: { stage: deal.stage } });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [error, setError] = useState(null);
    const handleDeleteClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setDeleteDialogOpen(true);
        setError(null);
    };
    const handleDeleteConfirm = async () => {
        try {
            await deleteDeal(deal.id);
            setDeleteDialogOpen(false);
            setError(null);
            onDeleted();
        }
        catch (err) {
            let message = "Failed to delete deal";
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err;
                if (axiosError.response?.data?.detail) {
                    message = axiosError.response.data.detail;
                }
                else if (axiosError.response?.status === 403) {
                    message = "Access denied. Please ensure you are logged in as an admin user.";
                }
            }
            setError(message);
        }
    };
    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
    };
    return (_jsxs(_Fragment, { children: [_jsx(Paper, { ref: setNodeRef, ...attributes, sx: {
                    p: 1.5,
                    border: "1px solid #ced8ca",
                    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : "none",
                    position: "relative",
                }, children: _jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "flex-start", spacing: 1, children: [_jsxs(Stack, { spacing: 0.5, sx: { flex: 1, cursor: "grab" }, ...listeners, children: [_jsx(Typography, { variant: "body2", fontWeight: 700, children: deal.property_address }), _jsx(Chip, { size: "small", label: deal.loan_amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) })] }), _jsx(IconButton, { size: "small", color: "error", onClick: handleDeleteClick, onMouseDown: (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                            }, onPointerDown: (e) => {
                                e.stopPropagation();
                            }, sx: { flexShrink: 0, cursor: "pointer" }, children: _jsx(DeleteIcon, { size: 16 }) })] }) }), _jsxs(Dialog, { open: deleteDialogOpen, onClose: handleDeleteCancel, children: [_jsx(DialogTitle, { children: "Delete Deal" }), _jsxs(DialogContent, { children: [error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), _jsxs(DialogContentText, { children: ["Are you sure you want to delete the deal for \"", deal.property_address, "\"? This action cannot be undone."] })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleDeleteCancel, children: "Cancel" }), _jsx(Button, { onClick: () => void handleDeleteConfirm(), color: "error", variant: "contained", children: "Delete" })] })] })] }));
}
DraggableDealCard.propTypes = {
    deal: PropTypes.object.isRequired,
    onDeleted: PropTypes.func.isRequired,
};
