import PropTypes from "prop-types";
import { useRef } from "react";
import { Chip, Paper, Stack, Typography } from "@/components/ui/mui";
import { ArrowUpRight } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { Link, useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/shared/constants";

export function DealCardOverlay({ deal }) {
  return (
    <Paper sx={{ p: 2 }} className="shadow-drag-lift">
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

export function DraggableDealCard({ deal }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: deal.id, data: { stage: deal.stage } });
  const navigate = useNavigate();
  const detailPath = APP_ROUTES.ADMIN_DEAL_DETAIL.replace(":dealId", deal.id);
  const pointerStart = useRef(null);

  const handlePointerDown = (e) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
    listeners?.onPointerDown?.(e);
  };

  const handleClick = () => {
    if (isDragging) return;
    if (!pointerStart.current) return;
    navigate(detailPath);
  };

  return (
    <Paper
      ref={setNodeRef}
      sx={{ p: 0 }}
      className={isDragging ? "opacity-40 cursor-grabbing" : "cursor-grab active:cursor-grabbing"}
      {...attributes}
      {...listeners}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      <div className="px-4 py-3.5">
        <Stack spacing={0.75} sx={{ minWidth: 0 }}>
          <div className="flex items-start justify-between gap-1">
            <Typography variant="body2" fontWeight={700} className="min-w-0 text-[13px]">{deal.property_address}</Typography>
            <Link
              to={detailPath}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Go to deal"
            >
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <Chip size="small" label={deal.loan_amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} />
        </Stack>
      </div>
    </Paper>
  );
}

DraggableDealCard.propTypes = {
  deal: PropTypes.object.isRequired,
};
