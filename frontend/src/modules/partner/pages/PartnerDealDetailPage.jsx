import { Alert, Button, Chip, CircularProgress, Stack, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { APP_ROUTES, DEAL_STAGE_BADGE_VARIANTS } from "@/shared/constants";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";
import { usePartnerDealDetail } from "../hooks";
import { currency } from "../utils";
import { ArrowLeft } from "lucide-react";

function stageLabel(stage) {
  return String(stage || "").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDateTime(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

function eventLabel(event) {
  if (!event) return "";
  if (event.from_stage && event.from_stage !== event.to_stage) {
    return `${stageLabel(event.from_stage)} -> ${stageLabel(event.to_stage)}`;
  }
  return stageLabel(event.to_stage);
}

function Field({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-2 text-xs">
      <span className="shrink-0 font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-right text-foreground" title={value || "N/A"}>{value || "N/A"}</span>
    </div>
  );
}

export function PartnerDealDetailPage() {
  const { dealId } = useParams();
  const { deal, events, loading, refresh } = usePartnerDealDetail(dealId);

  const filteredEvents = useMemo(() => {
    const timeline = Array.isArray(events) ? events : [];
    return timeline.filter((event) => !event?.from_stage || event.from_stage !== event.to_stage);
  }, [events]);

  const declineReason = useMemo(() => {
    const timeline = Array.isArray(events) ? events : [];
    for (let index = timeline.length - 1; index >= 0; index -= 1) {
      const event = timeline[index];
      if (event?.to_stage === "declined" && typeof event.reason === "string" && event.reason.trim()) {
        return event.reason.trim();
      }
    }
    return null;
  }, [events]);

  const stageVariant = deal?.stage ? (DEAL_STAGE_BADGE_VARIANTS[deal.stage] || "muted") : "muted";

  return (
    <Stack spacing={3} className="page-enter">
      <PageHeader
        title={deal?.property_address || "Deal Details"}
        subtitle={deal ? `${currency(deal.loan_amount)} · ${stageLabel(deal.stage)}` : "View status, timeline, and lender assignment."}
        actions={(
          <>
            <Button component={Link} to={APP_ROUTES.PARTNER_DEALS} variant="outlined" size="small" className="gap-1.5">
              <ArrowLeft size={14} />
              Back
            </Button>
            <Button variant="contained" size="small" onClick={() => void refresh()}>
              Refresh
            </Button>
          </>
        )}
      />

      {loading ? (
        <Card className="flex min-h-[140px] items-center justify-center">
          <CircularProgress />
        </Card>
      ) : null}

      {!loading && !deal ? (
        <Alert severity="error">Unable to load this deal.</Alert>
      ) : null}

      {!loading && deal ? (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <Typography variant="h5">Snapshot</Typography>
                <Chip label={stageLabel(deal.stage)} variant={stageVariant} />
              </div>
              <div className="space-y-2">
                <Field label="Property Type" value={stageLabel(deal.property_type)} />
                <Field label="Transaction" value={stageLabel(deal.transaction_type)} />
                <Field label="Sub-stage" value={deal.substage_name || "None"} />
                <Field label="Lender" value={deal.lender_name || "Unassigned"} />
                <Field label="Days in Stage" value={String(deal.days_in_current_stage)} />
              </div>
            </Card>

            <Card className="p-5">
              <Typography variant="h5" className="mb-3">Borrower</Typography>
              <div className="space-y-2">
                <Field label="Name" value={deal.borrower_name} />
                <Field label="Email" value={deal.borrower_email} />
                <Field label="Phone" value={deal.borrower_phone} />
              </div>
            </Card>
          </div>

          <Card className="p-5">
            <Typography variant="h5">Timeline</Typography>
            {filteredEvents.length > 0 ? (
              <div className="mt-3 space-y-2">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="flex items-start justify-between gap-3 border-l-2 border-primary/20 py-1 pl-3 text-xs">
                    <div className="min-w-0">
                      <span className="font-medium text-foreground">{eventLabel(event)}</span>
                      {event.reason ? (
                        <p className="mt-0.5 truncate text-muted-foreground" title={event.reason}>
                          Reason: {event.reason}
                        </p>
                      ) : null}
                    </div>
                    <span className="shrink-0 text-muted-foreground">{formatDateTime(event.created_at)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <Typography variant="body2" className="mt-2 text-muted-foreground">
                No timeline events yet.
              </Typography>
            )}

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
              <span>Created: {formatDateTime(deal.created_at)}</span>
              <span>Last update: {formatDateTime(deal.updated_at)}</span>
            </div>
          </Card>

          {deal.stage === "declined" ? (
            <Alert severity="warning">
              {declineReason ? `Rejection reason: ${declineReason}` : "This deal was declined."}
            </Alert>
          ) : null}
        </>
      ) : null}
    </Stack>
  );
}
