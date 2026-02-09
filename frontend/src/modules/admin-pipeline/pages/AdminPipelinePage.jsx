import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@/components/ui/mui";
import { useState } from "react";
import { createCommission, declineDeal, moveDealStage } from "../api";
import { KanbanColumn } from "../components/KanbanColumn";
import { DealCardOverlay } from "../components/DraggableDealCard";
import { useKanbanData } from "../hooks";
import { STAGE_ORDER, stageTitle } from "../utils";
import { APP_ROUTES } from "@/shared/constants";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

export function AdminPipelinePage() {
  const { board, refresh } = useKanbanData();
  const [error, setError] = useState(null);
  const [activeDeal, setActiveDeal] = useState(null);

  const [declineDealId, setDeclineDealId] = useState(null);
  const [declineReason, setDeclineReason] = useState("");
  const [declining, setDeclining] = useState(false);

  const [closeDealId, setCloseDealId] = useState(null);
  const [commissionAmount, setCommissionAmount] = useState("");
  const [closing, setClosing] = useState(false);

  const handleDragStart = (event) => {
    const dealId = String(event.active.id);
    for (const stage of STAGE_ORDER) {
      const found = (board[stage] ?? []).find((d) => String(d.id) === dealId);
      if (found) {
        setActiveDeal(found);
        break;
      }
    }
  };

  const handleDragEnd = async (event) => {
    setActiveDeal(null);
    const dealId = String(event.active.id);
    const targetStage = event.over ? String(event.over.id) : null;
    if (!targetStage) return;
    const sourceStage = String(event.active.data.current?.stage || "");
    if (sourceStage === targetStage) return;

    if (targetStage === "declined") {
      setDeclineDealId(dealId);
      setDeclineReason("");
      return;
    }

    if (targetStage === "closed") {
      setCloseDealId(dealId);
      setCommissionAmount("");
      return;
    }

    try {
      await moveDealStage(dealId, targetStage);
      await refresh();
    } catch {
      setError("Unable to move deal stage.");
    }
  };

  const submitDecline = async () => {
    if (!declineDealId) return;
    if (declineReason.trim().length < 3) {
      setError("Decline reason must be meaningful.");
      return;
    }

    setDeclining(true);
    try {
      await declineDeal(declineDealId, declineReason.trim());
      setDeclineDealId(null);
      setDeclineReason("");
      await refresh();
    } catch {
      setError("Unable to decline deal.");
    } finally {
      setDeclining(false);
    }
  };

  const submitClose = async () => {
    if (!closeDealId) return;
    const parsed = Number(commissionAmount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Commission amount must be a number greater than 0.");
      return;
    }

    setClosing(true);
    try {
      await moveDealStage(closeDealId, "closed");
      await createCommission(closeDealId, parsed);
      setCloseDealId(null);
      setCommissionAmount("");
      await refresh();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Unable to close deal.");
    } finally {
      setClosing(false);
    }
  };

  const totalDeals = STAGE_ORDER.reduce((sum, stage) => sum + (board[stage]?.length ?? 0), 0);

  return (
    <div className="full-bleed page-enter">
      <div className="pb-2">
        <PageHeader
          title="Pipeline"
          subtitle={`${totalDeals} deal${totalDeals !== 1 ? "s" : ""} across ${STAGE_ORDER.length} stages`}
          actions={
            <Stack direction="row" spacing={1}>
              <Link to={APP_ROUTES.ADMIN_SUBSTAGES}>
                <Button variant="outlined" size="small" className="gap-1.5">
                  <Settings size={14} />
                  Sub-Stages
                </Button>
              </Link>
              <Button variant="contained" onClick={() => void refresh()}>Refresh</Button>
            </Stack>
          }
        />
      </div>

      {error && <Alert severity="error">{error}</Alert>}

      <DndContext onDragStart={handleDragStart} onDragEnd={(event) => void handleDragEnd(event)}>
        <div className="grid auto-rows-min grid-cols-7 gap-3 pb-6">
          {STAGE_ORDER.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              title={stageTitle(stage)}
              deals={board[stage] ?? []}
            />
          ))}
        </div>
        <DragOverlay dropAnimation={null}>
          {activeDeal ? <DealCardOverlay deal={activeDeal} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Decline dialog */}
      <Dialog open={Boolean(declineDealId)} onClose={() => (declining ? null : setDeclineDealId(null))}>
        <DialogTitle>Decline Deal</DialogTitle>
        <DialogContent>
          <Typography variant="body2" className="mb-3 text-muted-foreground">
            Enter a short reason. The partner will be notified automatically.
          </Typography>
          <TextField
            label="Decline reason"
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            disabled={declining}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeclineDealId(null)} disabled={declining}>Cancel</Button>
          <Button onClick={() => void submitDecline()} variant="contained" color="error" disabled={declining || declineReason.trim().length < 3}>
            {declining ? "Declining…" : "Decline"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Close + commission dialog */}
      <Dialog open={Boolean(closeDealId)} onClose={() => (closing ? null : setCloseDealId(null))}>
        <DialogTitle>Close Deal</DialogTitle>
        <DialogContent>
          <Typography variant="body2" className="mb-3 text-muted-foreground">
            Closing a deal requires entering the partner commission amount.
          </Typography>
          <TextField
            label="Commission amount (USD)"
            type="number"
            value={commissionAmount}
            onChange={(e) => setCommissionAmount(e.target.value)}
            fullWidth
            disabled={closing}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCloseDealId(null)} disabled={closing}>Cancel</Button>
          <Button onClick={() => void submitClose()} variant="contained" disabled={closing}>
            {closing ? "Closing…" : "Close Deal"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
