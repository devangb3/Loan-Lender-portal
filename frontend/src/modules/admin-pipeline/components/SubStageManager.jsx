import PropTypes from "prop-types";
import { Alert, Button, MenuItem, Stack, TextField, Typography } from "@/components/ui/mui";
import { useEffect, useMemo, useState } from "react";
import { createSubstage, deleteSubstage, updateSubstage } from "../api";
import { STAGE_ORDER, stageTitle } from "../utils";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";

function buildDraft(substage) {
  return {
    name: substage.name,
    main_stage: substage.main_stage,
    order_index: String(substage.order_index ?? 0),
    is_active: String(Boolean(substage.is_active)),
  };
}

export function SubStageManager({ substages, onChanged }) {
  const [name, setName] = useState("");
  const [mainStage, setMainStage] = useState(STAGE_ORDER[0]);
  const [draftById, setDraftById] = useState({});
  const [expandedByStage, setExpandedByStage] = useState(() => (
    Object.fromEntries(STAGE_ORDER.map((stage, index) => [stage, index === 0]))
  ));
  const [savingId, setSavingId] = useState(null);
  const [rowError, setRowError] = useState(null);

  useEffect(() => {
    const next = {};
    for (const substage of substages) {
      next[substage.id] = buildDraft(substage);
    }
    setDraftById(next);
  }, [substages]);

  const groupedSubstages = useMemo(() => {
    const grouped = Object.fromEntries(STAGE_ORDER.map((stage) => [stage, []]));
    for (const substage of substages) {
      if (grouped[substage.main_stage]) {
        grouped[substage.main_stage].push(substage);
      }
    }
    for (const stage of STAGE_ORDER) {
      grouped[stage].sort((left, right) => {
        const orderDiff = (left.order_index ?? 0) - (right.order_index ?? 0);
        if (orderDiff !== 0) return orderDiff;
        return String(left.name || "").localeCompare(String(right.name || ""));
      });
    }
    return grouped;
  }, [substages]);

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      await createSubstage({ name, main_stage: mainStage, order_index: 0, is_active: true });
      setName("");
      onChanged();
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    }
  };

  const isRowDirty = (substage) => {
    const draft = draftById[substage.id];
    if (!draft) return false;
    const orderIndex = Number(draft.order_index);
    const isActive = draft.is_active === "true";
    return (
      draft.name !== substage.name
      || draft.main_stage !== substage.main_stage
      || (Number.isFinite(orderIndex) ? orderIndex : 0) !== substage.order_index
      || isActive !== substage.is_active
    );
  };

  const handleSave = async (substage) => {
    const draft = draftById[substage.id];
    if (!draft) return;

    const nextName = String(draft.name || "").trim();
    const orderIndex = Number(draft.order_index);
    const isActive = draft.is_active === "true";

    if (!nextName) {
      setRowError("Sub-stage name is required.");
      return;
    }
    if (!STAGE_ORDER.includes(draft.main_stage)) {
      setRowError("Main stage must be a valid pipeline stage.");
      return;
    }
    if (!Number.isFinite(orderIndex) || orderIndex < 0) {
      setRowError("Order index must be a number greater than or equal to 0.");
      return;
    }

    setSavingId(substage.id);
    setRowError(null);
    try {
      await updateSubstage(substage.id, {
        name: nextName,
        main_stage: draft.main_stage,
        order_index: orderIndex,
        is_active: isActive,
      });
      onChanged();
    } catch {
      setRowError("Failed to update sub-stage.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (substageId) => {
    try {
      await deleteSubstage(substageId);
      onChanged();
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    }
  };

  const toggleStage = (stage) => {
    setExpandedByStage((prev) => ({ ...prev, [stage]: !prev[stage] }));
  };

  const updateDraft = (substage, field, value) => {
    setDraftById((prev) => {
      const current = prev[substage.id] || buildDraft(substage);
      return { ...prev, [substage.id]: { ...current, [field]: value } };
    });
  };

  return (
    <Card className="p-5">
      <Typography variant="h5" gutterBottom>Sub-Stage Manager</Typography>
      {rowError ? <Alert severity="error" className="mb-2">{rowError}</Alert> : null}
      <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
        <TextField label="Sub-stage name" value={name} onChange={(event) => setName(event.target.value)} size="small" />
        <TextField select size="small" label="Main stage" value={mainStage} onChange={(event) => setMainStage(event.target.value)}>
          {STAGE_ORDER.map((stage) => (
            <MenuItem key={stage} value={stage}>{stageTitle(stage)}</MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={() => void handleCreate()}>Add Sub-stage</Button>
      </Stack>
      <Stack spacing={1.5}>
        {STAGE_ORDER.map((stage) => {
          const stageSubstages = groupedSubstages[stage] || [];
          const expanded = Boolean(expandedByStage[stage]);
          return (
            <div key={stage} className="rounded-md border border-border/60 bg-muted/20">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
                onClick={() => toggleStage(stage)}
              >
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  {stageTitle(stage)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stageSubstages.length} sub-stage{stageSubstages.length === 1 ? "" : "s"}
                </span>
              </button>

              {expanded ? (
                stageSubstages.length > 0 ? (
                  <Stack spacing={1} className="border-t border-border/60 p-2">
                    {stageSubstages.map((substage) => (
                      <Stack
                        key={substage.id}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        className="rounded-md border border-border/60 bg-muted/30 p-2"
                      >
                        <div className="flex flex-1 flex-wrap items-center gap-2">
                          <TextField
                            size="small"
                            label="Name"
                            value={draftById[substage.id]?.name ?? substage.name}
                            onChange={(event) => updateDraft(substage, "name", event.target.value)}
                            disabled={savingId === substage.id}
                          />
                          <TextField
                            select
                            size="small"
                            label="Main stage"
                            value={draftById[substage.id]?.main_stage ?? substage.main_stage}
                            onChange={(event) => updateDraft(substage, "main_stage", event.target.value)}
                            disabled={savingId === substage.id}
                          >
                            {STAGE_ORDER.map((stageValue) => (
                              <MenuItem key={stageValue} value={stageValue}>{stageTitle(stageValue)}</MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            size="small"
                            type="number"
                            label="Order"
                            value={draftById[substage.id]?.order_index ?? String(substage.order_index)}
                            onChange={(event) => updateDraft(substage, "order_index", event.target.value)}
                            disabled={savingId === substage.id}
                            className="w-28"
                          />
                          <TextField
                            select
                            size="small"
                            label="Status"
                            value={draftById[substage.id]?.is_active ?? String(Boolean(substage.is_active))}
                            onChange={(event) => updateDraft(substage, "is_active", event.target.value)}
                            disabled={savingId === substage.id}
                            className="w-32"
                          >
                            <MenuItem value="true">Active</MenuItem>
                            <MenuItem value="false">Inactive</MenuItem>
                          </TextField>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="small"
                            variant="outlined"
                            disabled={savingId === substage.id || !isRowDirty(substage)}
                            onClick={() => void handleSave(substage)}
                          >
                            {savingId === substage.id ? "Saving…" : "Save"}
                          </Button>
                          <Button size="small" color="error" onClick={() => void handleDelete(substage.id)} disabled={savingId === substage.id}>
                            Delete
                          </Button>
                        </div>
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <p className="border-t border-border/60 px-3 py-2 text-xs text-muted-foreground">No sub-stages yet.</p>
                )
              ) : null}
            </div>
          );
        })}
      </Stack>
    </Card>
  );
}

SubStageManager.propTypes = {
  substages: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChanged: PropTypes.func.isRequired,
};
