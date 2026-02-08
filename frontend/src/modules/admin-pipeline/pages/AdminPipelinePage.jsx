import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DndContext } from "@dnd-kit/core";
import { Alert, Button, Stack, Typography } from "@/components/ui/mui";
import { useEffect, useState } from "react";
import { listSubstages, moveDealStage } from "../api";
import { KanbanColumn } from "../components/KanbanColumn";
import { SubStageManager } from "../components/SubStageManager";
import { useKanbanData } from "../hooks";
import { STAGE_ORDER, stageTitle } from "../utils";
export function AdminPipelinePage() {
    const { board, refresh } = useKanbanData();
    const [substages, setSubstages] = useState([]);
    const [error, setError] = useState(null);
    const refreshSubstages = async () => {
        try {
            setSubstages(await listSubstages());
        }
        catch {
            // Error feedback is handled globally by the API client interceptor.
        }
    };
    useEffect(() => {
        void refreshSubstages();
    }, []);
    const handleDragEnd = async (event) => {
        const dealId = String(event.active.id);
        const targetStage = event.over ? String(event.over.id) : null;
        if (!targetStage)
            return;
        const sourceStage = String(event.active.data.current?.stage || "");
        if (sourceStage === targetStage)
            return;
        try {
            await moveDealStage(dealId, targetStage);
            await refresh();
        }
        catch {
            setError("Unable to move deal stage.");
        }
    };
    return (_jsxs(Stack, { spacing: 2, children: [_jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", children: [_jsx(Typography, { variant: "h2", children: "Admin Pipeline" }), _jsx(Button, { variant: "contained", onClick: () => void refresh(), children: "Refresh" })] }), error && _jsx(Alert, { severity: "error", children: error }), _jsx(DndContext, { onDragEnd: (event) => void handleDragEnd(event), children: _jsx(Stack, { direction: "row", spacing: 2, sx: { overflowX: "auto", pb: 1 }, children: STAGE_ORDER.map((stage) => (_jsx(KanbanColumn, { stage: stage, title: stageTitle(stage), deals: board[stage] ?? [], onDealDeleted: () => void refresh() }, stage))) }) }), _jsx(SubStageManager, { substages: substages, onChanged: () => void refreshSubstages() })] }));
}
