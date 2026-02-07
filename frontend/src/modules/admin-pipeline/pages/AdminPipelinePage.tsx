import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { listSubstages, moveDealStage } from "../api";
import { KanbanColumn } from "../components/KanbanColumn";
import { SubStageManager } from "../components/SubStageManager";
import { useKanbanData } from "../hooks";
import type { SubStage } from "../types";
import { STAGE_ORDER, stageTitle } from "../utils";

export function AdminPipelinePage(): JSX.Element {
  const { board, refresh } = useKanbanData();
  const [substages, setSubstages] = useState<SubStage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refreshSubstages = async (): Promise<void> => {
    setSubstages(await listSubstages());
  };

  useEffect(() => {
    void refreshSubstages();
  }, []);

  const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
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

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">Admin Pipeline</Typography>
        <Button variant="contained" onClick={() => void refresh()}>
          Refresh
        </Button>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      <DndContext onDragEnd={(event) => void handleDragEnd(event)}>
        <Stack direction="row" spacing={2} sx={{ overflowX: "auto", pb: 1 }}>
          {STAGE_ORDER.map((stage) => (
            <KanbanColumn key={stage} stage={stage} title={stageTitle(stage)} deals={board[stage] ?? []} />
          ))}
        </Stack>
      </DndContext>
      <SubStageManager substages={substages} onChanged={() => void refreshSubstages()} />
    </Stack>
  );
}
