import PropTypes from "prop-types";
import { Chip, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";

import { formatDate } from "@/shared/utils/date";
import { BORROWER_STAGE_ORDER, stageChecklistStatus, stageLabel, toCurrency } from "../utils";

const checklistClasses = {
  complete: "bg-primary/80 text-primary-foreground",
  current: "bg-accent text-accent-foreground",
  pending: "bg-muted text-muted-foreground",
};

function stageChipColor(stage) {
  if (stage === "closed") return "success";
  if (stage === "declined") return "error";
  return "default";
}

export function BorrowerDealsList({ deals }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {deals.map((deal) => (
        <Card key={deal.id} className="flex flex-col gap-4 p-5 hover:shadow-card-hover">
          <div className="flex items-start justify-between gap-2">
            <Typography variant="h6" className="leading-snug">{deal.property_address}</Typography>
            <Chip label={stageLabel(deal.stage)} color={stageChipColor(deal.stage)} />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>{toCurrency(deal.loan_amount)}</span>
            <span>Referred by {deal.referring_partner_name ?? "Partner"}</span>
          </div>

          <div className="rounded-md border border-border/50 bg-muted/30 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Timeline</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {BORROWER_STAGE_ORDER.map((stage) => {
                const status = stageChecklistStatus(deal.stage, stage);
                return (
                  <span
                    key={stage}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${checklistClasses[status]}`}
                  >
                    {stageLabel(stage)}
                  </span>
                );
              })}

              {deal.stage === "declined" ? (
                <span className="rounded-full bg-destructive px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-destructive-foreground">
                  Declined
                </span>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
              <span>Submitted: {formatDate(deal.created_at)}</span>
              <span>Last update: {formatDate(deal.stage_changed_at)}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

BorrowerDealsList.propTypes = {
  deals: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    property_address: PropTypes.string.isRequired,
    loan_amount: PropTypes.number.isRequired,
    stage: PropTypes.string.isRequired,
    referring_partner_name: PropTypes.string,
    created_at: PropTypes.string.isRequired,
    stage_changed_at: PropTypes.string.isRequired,
  })).isRequired,
};
