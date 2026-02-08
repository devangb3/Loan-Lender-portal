import { Paper, Stack, Typography } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import type { KanbanDeal } from "../types";
import { DraggableDealCard } from "./DraggableDealCard";

export function KanbanColumn({ stage, title, deals, onDealDeleted }: { stage: string; title: string; deals: KanbanDeal[]; onDealDeleted: () => void }): JSX.Element {
  const { setNodeRef } = useDroppable({ id: stage });

  return (
    <Paper ref={setNodeRef} elevation={0} sx={{ p: 2, border: "1px solid #d6dfd0", minHeight: 320, width: 260 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Stack spacing={1}>
        {deals.map((deal) => (
          <DraggableDealCard key={deal.id} deal={deal} onDeleted={onDealDeleted} />
        ))}
      </Stack>
    </Paper>
  );
}
