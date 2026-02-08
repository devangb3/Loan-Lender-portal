import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from "prop-types";
import { Paper, Stack, Typography } from "@/components/ui/mui";
import { useDroppable } from "@dnd-kit/core";
import { DraggableDealCard } from "./DraggableDealCard";
export function KanbanColumn({ stage, title, deals, onDealDeleted }) {
    const { setNodeRef } = useDroppable({ id: stage });
    return (_jsxs(Paper, { ref: setNodeRef, elevation: 0, sx: { p: 2, border: "1px solid #d6dfd0", minHeight: 320, width: 260 }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, children: title }), _jsx(Stack, { spacing: 1, children: deals.map((deal) => (_jsx(DraggableDealCard, { deal: deal, onDeleted: onDealDeleted }, deal.id))) })] }));
}
KanbanColumn.propTypes = {
    stage: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    deals: PropTypes.arrayOf(PropTypes.object).isRequired,
    onDealDeleted: PropTypes.func.isRequired,
};
