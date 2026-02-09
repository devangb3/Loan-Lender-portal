import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";

import { Alert, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@/components/ui/mui";
import { fetchAdminDealDetail, fetchAdminDealEvents, deleteDeal, listSubstages, updateDealSubstage } from "../api";
import { stageBadgeVariant, stageTitle } from "../utils";
import { X, Trash2 } from "lucide-react";

function toCurrency(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateTime(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

function Field({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-2 text-xs">
      <span className="shrink-0 font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-right text-foreground" title={value || "N/A"}>{value || "N/A"}</span>
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

Field.defaultProps = {
  value: undefined,
};

function Section({ title, children }) {
  return (
    <div className="rounded-lg border border-[hsl(154_30%_72%/0.45)] bg-background/60 p-3">
      <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</h4>
      {children}
    </div>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const selectClass =
  "w-full rounded-md border border-border/80 bg-background px-2.5 py-1.5 text-xs text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30";

export function DealDetailDialog({ open, dealId, onClose, onChanged }) {
  const [deal, setDeal] = useState(null);
  const [events, setEvents] = useState([]);
  const [substages, setSubstages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Substage
  const [savingSubstage, setSavingSubstage] = useState(false);

  // Delete
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!open || !dealId) return;

    setConfirmingDelete(false);
    setDeleteError(null);

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [detail, timeline, subs] = await Promise.all([
          fetchAdminDealDetail(dealId),
          fetchAdminDealEvents(dealId),
          listSubstages(),
        ]);
        setDeal(detail);
        setEvents(timeline || []);
        setSubstages(subs || []);
      } catch {
        setError("Unable to load deal details.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [open, dealId]);

  const stageLabel = useMemo(() => {
    if (!deal?.stage) return "";
    return stageTitle(deal.stage);
  }, [deal]);

  const stageVariant = useMemo(() => {
    if (!deal?.stage) return "muted";
    return stageBadgeVariant(deal.stage);
  }, [deal]);

  const formatLabel = (value) => {
    if (!value) return "N/A";
    return stageTitle(String(value));
  };

  // Substages filtered for current deal stage
  const availableSubstages = useMemo(() => {
    if (!deal) return [];
    return substages.filter((s) => s.main_stage === deal.stage && s.is_active);
  }, [deal, substages]);

  // Find current substage name
  const currentSubstageName = useMemo(() => {
    if (!deal?.substage_id) return null;
    const found = substages.find((s) => s.id === deal.substage_id);
    return found?.name || null;
  }, [deal, substages]);

  const handleSubstageChange = async (substageId) => {
    setSavingSubstage(true);
    try {
      await updateDealSubstage(dealId, substageId || null);
      setDeal((prev) => ({ ...prev, substage_id: substageId || null }));
      onChanged?.();
    } catch {
      // Feedback toast handled by API client
    } finally {
      setSavingSubstage(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteDeal(dealId);
      setConfirmingDelete(false);
      onClose();
      onChanged?.();
    } catch (err) {
      let message = "Failed to delete deal.";
      if (err?.response?.data?.detail) {
        message = err.response.data.detail;
      } else if (err?.response?.status === 403) {
        message = "Access denied.";
      }
      setDeleteError(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto rounded-2xl border-[hsl(154_30%_72%/0.6)] p-0 ring-1 ring-[hsl(154_30%_72%/0.25)]">
        {/* Header */}
        {!loading && !error && deal ? (
          <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-[hsl(154_30%_72%/0.4)] bg-card/95 px-5 py-4 backdrop-blur">
            <div className="min-w-0">
              <h3 className="truncate font-display text-lg leading-tight tracking-poster">{deal.property_address}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {toCurrency(deal.loan_amount)} &middot; {stageLabel}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Chip label={stageLabel} variant={stageVariant} />
              <button onClick={onClose} className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <DialogTitle className="px-5 pt-4">Deal Details</DialogTitle>
        )}

        {/* Body */}
        <div className="space-y-3 px-5 py-4">
          {loading ? (
            <div className="flex min-h-[120px] items-center justify-center">
              <CircularProgress />
            </div>
          ) : null}

          {!loading && error ? <Alert severity="error">{error}</Alert> : null}

          {!loading && !error && deal ? (
            <>
              {/* Sub-Stage */}
              <Section title="Sub-Stage">
                {availableSubstages.length > 0 ? (
                  <select
                    className={selectClass}
                    value={deal.substage_id || ""}
                    disabled={savingSubstage}
                    onChange={(e) => void handleSubstageChange(e.target.value)}
                  >
                    <option value="">None</option>
                    {availableSubstages.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-muted-foreground/70">No sub-stages configured for {stageLabel}.</p>
                )}
              </Section>

              <div className="grid grid-cols-2 gap-3">
                <Section title="Snapshot">
                  <div className="space-y-1.5">
                    <Field label="Type" value={formatLabel(deal.property_type)} />
                    <Field label="Transaction" value={formatLabel(deal.transaction_type)} />
                    <Field label="Days in Stage" value={String(deal.days_in_current_stage)} />
                    <Field label="Sub-stage" value={currentSubstageName || "None"} />
                    <Field label="Lender" value={deal.lender_id || "None"} />
                  </div>
                </Section>

                <Section title="Borrower">
                  <div className="space-y-1.5">
                    <Field label="Name" value={deal.borrower_name} />
                    <Field label="Email" value={deal.borrower_email} />
                    <Field label="Phone" value={deal.borrower_phone} />
                  </div>
                </Section>
              </div>

              {deal.internal_notes ? (
                <Section title="Notes">
                  <p className="text-xs leading-relaxed text-foreground">{deal.internal_notes}</p>
                </Section>
              ) : null}

              {events.length > 0 ? (
                <Section title="Timeline">
                  <div className="space-y-1.5">
                    {events.map((event) => (
                      <div key={event.id} className="flex items-baseline justify-between gap-2 text-xs">
                        <span className="font-medium text-foreground">
                          {event.from_stage ? `${stageTitle(event.from_stage)} → ` : ""}
                          {stageTitle(event.to_stage)}
                        </span>
                        <span className="shrink-0 text-muted-foreground">
                          {formatDateTime(event.created_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null}

              <div className="flex gap-4 text-[11px] text-muted-foreground">
                <span>Created {formatDateTime(deal.created_at)}</span>
                <span>Updated {formatDateTime(deal.updated_at)}</span>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        {!loading && !error && deal ? (
          <div className="border-t border-[hsl(154_30%_72%/0.4)] px-5 py-3">
            {deleteError ? <Alert severity="error" className="mb-2">{deleteError}</Alert> : null}

            {confirmingDelete ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-destructive">Delete this deal permanently?</p>
                <div className="flex gap-2">
                  <Button onClick={() => setConfirmingDelete(false)} variant="outlined" size="small" disabled={deleting}>
                    Cancel
                  </Button>
                  <Button onClick={() => void handleDelete()} color="error" variant="contained" size="small" disabled={deleting}>
                    {deleting ? "Deleting…" : "Confirm"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => { setConfirmingDelete(true); setDeleteError(null); }}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
                <Button onClick={onClose} variant="outlined" size="small">Close</Button>
              </div>
            )}
          </div>
        ) : (
          <DialogActions className="border-t border-[hsl(154_30%_72%/0.4)] px-5 py-3">
            <Button onClick={onClose} variant="outlined" size="small">Close</Button>
          </DialogActions>
        )}
      </DialogContent>
    </Dialog>
  );
}

DealDetailDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  dealId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onChanged: PropTypes.func,
};

DealDetailDialog.defaultProps = {
  dealId: null,
  onChanged: undefined,
};
