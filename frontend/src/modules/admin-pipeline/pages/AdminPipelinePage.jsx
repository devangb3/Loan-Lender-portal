import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Alert, Button, Stack } from "@/components/ui/mui";
import { useState } from "react";
import { moveDealStage } from "../api";
import { DealDetailDialog } from "../components/DealDetailDialog";
import { KanbanColumn } from "../components/KanbanColumn";
import { DealCardOverlay } from "../components/DraggableDealCard";
import { useKanbanData } from "../hooks";
import { STAGE_ORDER, stageTitle } from "../utils";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

export function AdminPipelinePage() {
  const { board, refresh } = useKanbanData();
  const [error, setError] = useState(null);
  const [activeDeal, setActiveDeal] = useState(null);
  const [selectedDealId, setSelectedDealId] = useState(null);

  const handleDragStart = (event) => {
    const dealId = String(event.active.id);
    for (const stage of STAGE_ORDER) {
      const found = (board[stage] ?? []).find((d) => String(d.id) === dealId);
      if (found) {
        setActiveDeal(found);
        break;
      }
    }
  };

  const handleDragEnd = async (event) => {
    setActiveDeal(null);
    const dealId = String(event.active.id);
    const targetStage = event.over ? String(event.over.id) : null;
    if (!targetStage) return;
    const sourceStage = String(event.active.data.current?.stage || "");
    if (sourceStage === targetStage) return;
    try {
      await moveDealStage(dealId, targetStage);
      await refresh();
    } catch {
      setError("Unable to move deal stage.");
    }
  };

  const totalDeals = STAGE_ORDER.reduce((sum, stage) => sum + (board[stage]?.length ?? 0), 0);

  return (
    <div className="full-bleed page-enter">
      <div className="pb-2">
        <PageHeader
          title="Pipeline"
          subtitle={`${totalDeals} deal${totalDeals !== 1 ? "s" : ""} across ${STAGE_ORDER.length} stages`}
          actions={
            <Stack direction="row" spacing={1}>
              <Link to="/admin/pipeline/substages">
                <Button variant="outlined" size="small" className="gap-1.5">
                  <Settings size={14} />
                  Sub-Stages
                </Button>
              </Link>
              <Button variant="contained" onClick={() => void refresh()}>Refresh</Button>
            </Stack>
          }
        />
      </div>

      {error && <Alert severity="error">{error}</Alert>}

      <DndContext onDragStart={handleDragStart} onDragEnd={(event) => void handleDragEnd(event)}>
        <div className="grid auto-rows-min grid-cols-7 gap-3 pb-6">
          {STAGE_ORDER.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              title={stageTitle(stage)}
              deals={board[stage] ?? []}
              onDealOpen={(dealId) => setSelectedDealId(dealId)}
            />
          ))}
        </div>
        <DragOverlay dropAnimation={null}>
          {activeDeal ? <DealCardOverlay deal={activeDeal} /> : null}
        </DragOverlay>
      </DndContext>

      <DealDetailDialog
        open={Boolean(selectedDealId)}
        dealId={selectedDealId}
        onClose={() => setSelectedDealId(null)}
        onChanged={() => void refresh()}
      />
    </div>
  );
}
