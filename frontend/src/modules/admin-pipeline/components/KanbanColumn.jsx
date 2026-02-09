import PropTypes from "prop-types";
import { Stack, Typography } from "@/components/ui/mui";
import { useDroppable } from "@dnd-kit/core";
import { DraggableDealCard } from "./DraggableDealCard";
import { stageColor, stageIcon } from "../utils";
import { cn } from "@/lib/utils";

export function KanbanColumn({ stage, title, deals, onDealDeleted }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const Icon = stageIcon(stage);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "editorial-shell flex min-h-[calc(100vh-12rem)] min-w-0 flex-col rounded-lg border-t-[3px] p-2.5 transition-all",
        stageColor(stage),
        isOver && "ring-2 ring-primary/40 ring-offset-2",
      )}
    >
      <div className="mb-2 flex items-center gap-1.5">
        <Icon size={14} className="shrink-0 text-muted-foreground" />
        <Typography variant="body2" className="flex-1 truncate font-semibold">{title}</Typography>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1 text-[10px] font-semibold text-muted-foreground">
          {deals.length}
        </span>
      </div>
      <Stack spacing={1} className="flex-1 overflow-y-auto">
        {deals.map((deal) => (
          <DraggableDealCard key={deal.id} deal={deal} onDeleted={onDealDeleted} />
        ))}
      </Stack>
    </div>
  );
}

KanbanColumn.propTypes = {
  stage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  deals: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDealDeleted: PropTypes.func.isRequired,
};
