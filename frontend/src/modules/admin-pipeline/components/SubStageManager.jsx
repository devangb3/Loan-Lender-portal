import PropTypes from "prop-types";
import { Alert, Button, MenuItem, Stack, TextField, Typography } from "@/components/ui/mui";
import { useEffect, useState } from "react";
import { createSubstage, deleteSubstage, updateSubstage } from "../api";
import { STAGE_ORDER } from "../utils";
import { Card } from "@/components/ui/card";

export function SubStageManager({ substages, onChanged }) {
  const [name, setName] = useState("");
  const [mainStage, setMainStage] = useState(STAGE_ORDER[0]);
  const [draftById, setDraftById] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [rowError, setRowError] = useState(null);

  useEffect(() => {
    const next = {};
    for (const substage of substages) {
      next[substage.id] = {
        name: substage.name,
        main_stage: substage.main_stage,
        order_index: String(substage.order_index ?? 0),
        is_active: String(Boolean(substage.is_active)),
      };
    }
    setDraftById(next);
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

  return (
    <Card className="p-5">
      <Typography variant="h5" gutterBottom>Sub-Stage Manager</Typography>
      {rowError ? <Alert severity="error" className="mb-2">{rowError}</Alert> : null}
      <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
        <TextField label="Sub-stage name" value={name} onChange={(event) => setName(event.target.value)} size="small" />
        <TextField select size="small" label="Main stage" value={mainStage} onChange={(event) => setMainStage(event.target.value)}>
          {STAGE_ORDER.map((stage) => (
            <MenuItem key={stage} value={stage}>{stage}</MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={() => void handleCreate()}>Add Sub-stage</Button>
      </Stack>
      <Stack spacing={1}>
        {substages.map((substage) => (
          <Stack
            key={substage.id}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="rounded-md border border-border/60 bg-muted/20 p-2"
          >
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <TextField
                size="small"
                label="Name"
                value={draftById[substage.id]?.name ?? substage.name}
                onChange={(event) => {
                  const value = event.target.value;
                  setDraftById((prev) => {
                    const current = prev[substage.id] || {
                      name: substage.name,
                      main_stage: substage.main_stage,
                      order_index: String(substage.order_index ?? 0),
                      is_active: String(Boolean(substage.is_active)),
                    };
                    return { ...prev, [substage.id]: { ...current, name: value } };
                  });
                }}
                disabled={savingId === substage.id}
              />
              <TextField
                select
                size="small"
                label="Main stage"
                value={draftById[substage.id]?.main_stage ?? substage.main_stage}
                onChange={(event) => {
                  const value = event.target.value;
                  setDraftById((prev) => {
                    const current = prev[substage.id] || {
                      name: substage.name,
                      main_stage: substage.main_stage,
                      order_index: String(substage.order_index ?? 0),
                      is_active: String(Boolean(substage.is_active)),
                    };
                    return { ...prev, [substage.id]: { ...current, main_stage: value } };
                  });
                }}
                disabled={savingId === substage.id}
              >
                {STAGE_ORDER.map((stage) => (
                  <MenuItem key={stage} value={stage}>{stage}</MenuItem>
                ))}
              </TextField>
              <TextField
                size="small"
                type="number"
                label="Order"
                value={draftById[substage.id]?.order_index ?? String(substage.order_index)}
                onChange={(event) => {
                  const value = event.target.value;
                  setDraftById((prev) => {
                    const current = prev[substage.id] || {
                      name: substage.name,
                      main_stage: substage.main_stage,
                      order_index: String(substage.order_index ?? 0),
                      is_active: String(Boolean(substage.is_active)),
                    };
                    return { ...prev, [substage.id]: { ...current, order_index: value } };
                  });
                }}
                disabled={savingId === substage.id}
                className="w-28"
              />
              <TextField
                select
                size="small"
                label="Status"
                value={draftById[substage.id]?.is_active ?? String(Boolean(substage.is_active))}
                onChange={(event) => {
                  const value = event.target.value;
                  setDraftById((prev) => {
                    const current = prev[substage.id] || {
                      name: substage.name,
                      main_stage: substage.main_stage,
                      order_index: String(substage.order_index ?? 0),
                      is_active: String(Boolean(substage.is_active)),
                    };
                    return { ...prev, [substage.id]: { ...current, is_active: value } };
                  });
                }}
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
    </Card>
  );
}

SubStageManager.propTypes = {
  substages: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChanged: PropTypes.func.isRequired,
};
