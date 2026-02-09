import PropTypes from "prop-types";
import { Button, MenuItem, Stack, TextField, Typography } from "@/components/ui/mui";
import { useState } from "react";
import { createSubstage, deleteSubstage } from "../api";
import { STAGE_ORDER } from "../utils";
import { Card } from "@/components/ui/card";

export function SubStageManager({ substages, onChanged }) {
  const [name, setName] = useState("");
  const [mainStage, setMainStage] = useState("submitted");

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
            <Typography variant="body2">{substage.main_stage} &bull; {substage.name}</Typography>
            <Button size="small" color="error" onClick={() => void handleDelete(substage.id)}>Delete</Button>
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
