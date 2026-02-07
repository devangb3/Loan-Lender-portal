import { Button, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { assignLender } from "../api";
import type { AdminDealLite, Lender } from "../types";

export function LenderAssignForm({ deals, lenders, onAssigned }: { deals: AdminDealLite[]; lenders: Lender[]; onAssigned: () => void }): JSX.Element {
  const [dealId, setDealId] = useState("");
  const [lenderId, setLenderId] = useState("");

  const submit = async (): Promise<void> => {
    if (!dealId || !lenderId) return;
    await assignLender(dealId, lenderId);
    onAssigned();
  };

  return (
    <Paper elevation={0} sx={{ p: 2, border: "1px solid #d6dfd0" }}>
      <Stack spacing={2}>
        <Typography variant="h5">Assign Lender to Deal</Typography>
        <TextField select label="Deal" value={dealId} onChange={(event) => setDealId(event.target.value)}>
          {deals.map((deal) => (
            <MenuItem key={deal.id} value={deal.id}>
              {deal.property_address}
            </MenuItem>
          ))}
        </TextField>
        <TextField select label="Lender" value={lenderId} onChange={(event) => setLenderId(event.target.value)}>
          {lenders.map((lender) => (
            <MenuItem key={lender.id} value={lender.id}>
              {lender.lender_name}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={() => void submit()}>
          Assign
        </Button>
      </Stack>
    </Paper>
  );
}
