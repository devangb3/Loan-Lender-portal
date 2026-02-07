import { Chip, Paper, Typography } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import type { KanbanDeal } from "../types";

export function DraggableDealCard({ deal }: { deal: KanbanDeal }): JSX.Element {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: deal.id, data: { stage: deal.stage } });

  return (
    <Paper
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        p: 1.5,
        border: "1px solid #ced8ca",
        cursor: "grab",
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : "none",
      }}
    >
      <Typography variant="body2" fontWeight={700}>
        {deal.property_address}
      </Typography>
      <Chip size="small" label={deal.loan_amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} />
    </Paper>
  );
}
