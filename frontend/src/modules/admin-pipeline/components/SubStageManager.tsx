import { Button, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { createSubstage, deleteSubstage } from "../api";
import type { SubStage } from "../types";
import { STAGE_ORDER } from "../utils";

export function SubStageManager({ substages, onChanged }: { substages: SubStage[]; onChanged: () => void }): JSX.Element {
  const [name, setName] = useState("");
  const [mainStage, setMainStage] = useState("submitted");

  const handleCreate = async (): Promise<void> => {
    if (!name.trim()) return;
    await createSubstage({ name, main_stage: mainStage, order_index: 0, is_active: true });
    setName("");
    onChanged();
  };

  return (
    <Paper elevation={0} sx={{ p: 2, border: "1px solid #d6dfd0" }}>
      <Typography variant="h5" gutterBottom>
        Sub-Stage Manager
      </Typography>
      <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
        <TextField label="Sub-stage name" value={name} onChange={(event) => setName(event.target.value)} size="small" />
        <TextField
          select
          size="small"
          label="Main stage"
          value={mainStage}
          onChange={(event) => setMainStage(event.target.value)}
        >
          {STAGE_ORDER.map((stage) => (
            <MenuItem key={stage} value={stage}>
              {stage}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={() => void handleCreate()}>
          Add Sub-stage
        </Button>
      </Stack>
      <Stack spacing={1}>
        {substages.map((substage) => (
          <Stack key={substage.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1, border: "1px solid #e3e9de" }}>
            <Typography variant="body2">
              {substage.main_stage} • {substage.name}
            </Typography>
            <Button size="small" color="error" onClick={() => void deleteSubstage(substage.id).then(onChanged)}>
              Delete
            </Button>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
