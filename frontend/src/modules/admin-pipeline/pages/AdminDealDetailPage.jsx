import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Chip, CircularProgress, Stack, TextField } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Trash2, XCircle } from "lucide-react";
import { PageHeader } from "@/shared/ui/PageHeader";
import { APP_ROUTES } from "@/shared/constants";
import {
  acceptDeal,
  assignLender,
  declineDeal,
  deleteDeal,
  fetchAdminDealDetail,
  fetchAdminDealEvents,
  listLenders,
  listSubstages,
  updateDealNotes,
  updateDealSubstage,
} from "../api";
import { stageBadgeVariant, stageTitle } from "../utils";

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

function eventLabel(event) {
  if (!event) return "";
  if (!event.from_stage) return stageTitle(event.to_stage);
  if (event.from_stage !== event.to_stage) {
    return `${stageTitle(event.from_stage)} → ${stageTitle(event.to_stage)}`;
  }
  if (event.reason) return event.reason;
  return stageTitle(event.to_stage);
}

function Field({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-2 text-xs">
      <span className="shrink-0 font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-right text-foreground" title={value || "N/A"}>{value || "N/A"}</span>
    </div>
  );
}

const selectClass =
  "w-full rounded-md border border-border/80 bg-background px-2.5 py-1.5 text-xs text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30";

export function AdminDealDetailPage() {
  const { dealId } = useParams();
  const navigate = useNavigate();

  const [deal, setDeal] = useState(null);
  const [events, setEvents] = useState([]);
  const [substages, setSubstages] = useState([]);
  const [lenders, setLenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [savingSubstage, setSavingSubstage] = useState(false);
  const [lenderQuery, setLenderQuery] = useState("");
  const [assigningLender, setAssigningLender] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [declining, setDeclining] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!dealId) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [detail, timeline, subs, lenderList] = await Promise.all([
          fetchAdminDealDetail(dealId),
          fetchAdminDealEvents(dealId),
          listSubstages(),
          listLenders(""),
        ]);
        if (cancelled) return;
        setDeal(detail);
        setNotesDraft(detail?.internal_notes || "");
        setEvents(timeline || []);
        setSubstages(subs || []);
        setLenders(lenderList || []);
        setLenderQuery("");
      } catch {
        if (!cancelled) setError("Unable to load deal details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [dealId]);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      try {
        setLenders(await listLenders(lenderQuery));
      } catch {
        // handled globally
      }
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [lenderQuery]);

  const stageLabel = useMemo(() => (deal?.stage ? stageTitle(deal.stage) : ""), [deal]);
  const stageVariant = useMemo(() => (deal?.stage ? stageBadgeVariant(deal.stage) : "muted"), [deal]);

  const formatLabel = (value) => {
    if (!value) return "N/A";
    return stageTitle(String(value));
  };

  const availableSubstages = useMemo(() => {
    if (!deal) return [];
    return substages.filter((s) => s.main_stage === deal.stage && s.is_active);
  }, [deal, substages]);

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
    } catch {
      // Feedback toast handled by API client
    } finally {
      setSavingSubstage(false);
    }
  };

  const refreshDetail = async () => {
    const [detail, timeline] = await Promise.all([
      fetchAdminDealDetail(dealId),
      fetchAdminDealEvents(dealId),
    ]);
    setDeal(detail);
    setEvents(timeline || []);
  };

  const handleAssignLender = async (lenderId) => {
    if (!lenderId) return;
    setAssigningLender(true);
    try {
      await assignLender(dealId, lenderId);
      await refreshDetail();
    } catch {
      // handled globally
    } finally {
      setAssigningLender(false);
    }
  };

  const isNotesDirty = notesDraft !== (deal?.internal_notes || "");

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      const updated = await updateDealNotes(dealId, notesDraft);
      setDeal(updated);
      setNotesDraft(updated?.internal_notes || "");
    } catch {
      // Feedback toast handled by API client
    } finally {
      setSavingNotes(false);
    }
  };

  const canAcceptOrDecline = deal && deal.stage !== "accepted" && deal.stage !== "declined" && deal.stage !== "closed";

  const handleAccept = async () => {
    setAccepting(true);
    try {
      await acceptDeal(dealId);
      await refreshDetail();
    } catch {
      // Feedback toast handled by API client
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = async () => {
    if (declineReason.trim().length < 3) return;
    setDeclining(true);
    try {
      await declineDeal(dealId, declineReason.trim());
      setDeclineReason("");
      await refreshDetail();
    } catch {
      // Feedback toast handled by API client
    } finally {
      setDeclining(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteDeal(dealId);
      navigate(APP_ROUTES.ADMIN_DEALS);
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
    <Stack spacing={3} className="page-enter">
      <PageHeader
        title={deal?.property_address || "Deal Details"}
        subtitle={deal ? `${toCurrency(deal.loan_amount)} · ${stageLabel}` : undefined}
        actions={
          <>
            <Button component={Link} to={APP_ROUTES.ADMIN_DEALS} variant="outlined" size="small" className="gap-1.5">
              <ArrowLeft size={14} />
              Back to Deals
            </Button>
          </>
        }
      />

      {loading ? (
        <Card className="flex min-h-[140px] items-center justify-center">
          <CircularProgress />
        </Card>
      ) : null}

      {!loading && error ? <Alert severity="error">{error}</Alert> : null}

      {!loading && !error && deal ? (
        <>
          {/* Sub-Stage */}
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Sub-Stage</h4>
              <Chip label={stageLabel} variant={stageVariant} />
            </div>
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
          </Card>

          {/* Accept / Decline */}
          {canAcceptOrDecline ? (
            <Card className="overflow-hidden">
              <div className="border-b border-border/50 bg-muted/30 px-5 py-3">
                <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Review Decision</h4>
              </div>
              <div className="space-y-4 p-5">
                <p className="text-sm text-muted-foreground">
                  Accept this deal to proceed, or decline with a reason. The partner will be notified by email.
                </p>
                <textarea
                  className="w-full rounded-md border border-border/80 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
                  rows={3}
                  placeholder="Reason (required for decline)…"
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  disabled={accepting || declining}
                />
                <div className="flex gap-2">
                  <Button
                    variant="contained"
                    size="small"
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                    disabled={accepting || declining}
                    onClick={() => void handleAccept()}
                  >
                    <CheckCircle size={14} />
                    {accepting ? "Accepting…" : "Accept"}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    className="gap-1.5"
                    disabled={accepting || declining || declineReason.trim().length < 3}
                    onClick={() => void handleDecline()}
                  >
                    <XCircle size={14} />
                    {declining ? "Declining…" : "Decline"}
                  </Button>
                </div>
              </div>
            </Card>
          ) : deal?.stage === "declined" ? (
            <Card className="overflow-hidden border-destructive/30">
              <div className="flex items-center gap-2 bg-destructive/5 px-5 py-3">
                <XCircle size={14} className="text-destructive" />
                <span className="text-sm font-medium text-destructive">This deal has been declined</span>
              </div>
            </Card>
          ) : null}

          {/* Info grid */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="p-5">
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Snapshot</h4>
              <div className="space-y-1.5">
                <Field label="Type" value={formatLabel(deal.property_type)} />
                <Field label="Transaction" value={formatLabel(deal.transaction_type)} />
                <Field label="Days in Stage" value={String(deal.days_in_current_stage)} />
                <Field label="Sub-stage" value={currentSubstageName || "None"} />
                <Field label="Lender" value={deal.lender_name || deal.lender_id || "None"} />
              </div>
            </Card>

            <Card className="p-5">
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Borrower</h4>
              <div className="space-y-1.5">
                <Field label="Name" value={deal.borrower_name} />
                <Field label="Email" value={deal.borrower_email} />
                <Field label="Phone" value={deal.borrower_phone} />
              </div>
            </Card>

            <Card className="p-5">
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Partner</h4>
              <div className="space-y-1.5">
                <Field label="Company" value={deal.partner_company} />
                <Field label="Name" value={deal.partner_full_name} />
                <Field label="Email" value={deal.partner_email} />
                <Field label="Phone" value={deal.partner_phone_number} />
                <Field label="Branch" value={deal.partner_branch} />
                <Field label="Tier" value={deal.partner_tier ? formatLabel(deal.partner_tier) : null} />
              </div>
            </Card>
          </div>

          {/* Lender Assignment */}
          <Card className="p-5">
            <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Lender Assignment</h4>
            <Stack spacing={1.5}>
              <TextField
                label="Search lenders"
                size="small"
                value={lenderQuery}
                onChange={(e) => setLenderQuery(e.target.value)}
                disabled={assigningLender}
              />
              <select
                className={selectClass}
                value={deal.lender_id || ""}
                disabled={assigningLender || lenders.length === 0}
                onChange={(e) => void handleAssignLender(e.target.value)}
              >
                <option value="" disabled>{lenders.length === 0 ? "No lenders found" : "Select a lender"}</option>
                {lenders.map((l) => (
                  <option key={l.id} value={l.id}>{l.lender_name}</option>
                ))}
              </select>
            </Stack>
          </Card>

          {/* Notes */}
          <Card className="p-5">
            <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Notes (Admin-only)</h4>
            <Stack spacing={1.5}>
              <TextField
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Add internal notes (never visible to partners or borrowers)…"
                fullWidth
                multiline
                minRows={3}
                disabled={savingNotes}
              />
              <Button
                size="small"
                variant="contained"
                disabled={savingNotes || !isNotesDirty}
                onClick={() => void saveNotes()}
              >
                {savingNotes ? "Saving…" : "Save Notes"}
              </Button>
            </Stack>
          </Card>

          {/* Timeline */}
          {events.length > 0 ? (
            <Card className="p-5">
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Timeline</h4>
              <div className="space-y-1.5">
                {events.map((event) => (
                  <div key={event.id} className="flex items-baseline justify-between gap-2 text-xs">
                    <span className="font-medium text-foreground">{eventLabel(event)}</span>
                    <span className="shrink-0 text-muted-foreground">{formatDateTime(event.created_at)}</span>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          <div className="flex gap-4 text-[11px] text-muted-foreground">
            <span>Created {formatDateTime(deal.created_at)}</span>
            <span>Updated {formatDateTime(deal.updated_at)}</span>
          </div>

          {/* Delete */}
          <Card className="p-5">
            {deleteError ? <Alert severity="error" className="mb-3">{deleteError}</Alert> : null}

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
              <button
                onClick={() => { setConfirmingDelete(true); setDeleteError(null); }}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 size={13} />
                Delete Deal
              </button>
            )}
          </Card>
        </>
      ) : null}
    </Stack>
  );
}
