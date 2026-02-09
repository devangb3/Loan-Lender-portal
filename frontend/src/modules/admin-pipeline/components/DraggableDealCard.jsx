import PropTypes from "prop-types";
import { Chip, Paper, Stack, Typography } from "@/components/ui/mui";
import { GripHorizontal } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

export function DealCardOverlay({ deal }) {
  return (
    <Paper sx={{ p: 1.5 }} className="shadow-drag-lift">
      <Stack spacing={0.5}>
        <Typography variant="body2" fontWeight={700}>{deal.property_address}</Typography>
        <Chip size="small" label={deal.loan_amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} />
      </Stack>
    </Paper>
  );
}

DealCardOverlay.propTypes = {
  deal: PropTypes.object.isRequired,
};

export function DraggableDealCard({ deal, onOpenDetails }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: deal.id, data: { stage: deal.stage } });

  const handleCardClick = () => {
    if (isDragging) return;
    if (onOpenDetails) {
      onOpenDetails(deal.id);
    }
  };

  return (
    <Paper
      ref={setNodeRef}
      sx={{ p: 0 }}
      className={isDragging ? "opacity-40" : ""}
    >
      {/* Clickable card body */}
      <div
        className="cursor-pointer px-3 pt-2.5 pb-1.5"
        onClick={handleCardClick}
      >
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={700} className="truncate">{deal.property_address}</Typography>
          <Chip size="small" label={deal.loan_amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} />
        </Stack>
      </div>

      {/* Drag handle strip at bottom */}
      <div
        role="button"
        aria-label="Hold to drag this deal to another stage"
        tabIndex={0}
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="flex cursor-grab items-center justify-center gap-1.5 border-t border-dashed border-primary/30 bg-primary/[0.04] px-3 py-1 active:cursor-grabbing"
      >
        <GripHorizontal size={11} className="text-primary/70" />
        <span className="select-none text-[10px] font-semibold uppercase tracking-widest text-primary/70">
          Hold to move
        </span>
        <GripHorizontal size={11} className="text-primary/70" />
      </div>
    </Paper>
  );
}

DraggableDealCard.propTypes = {
  deal: PropTypes.object.isRequired,
  onOpenDetails: PropTypes.func,
};

DraggableDealCard.defaultProps = {
  onOpenDetails: undefined,
};
