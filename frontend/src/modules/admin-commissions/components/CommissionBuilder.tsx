import { Button, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { createCommission } from "../api";
import type { AdminDeal, Commission } from "../types";

export function CommissionBuilder({ deals, onCreated }: { deals: AdminDeal[]; onCreated: (item: Commission) => void }): JSX.Element {
  const [dealId, setDealId] = useState("");
  const [amount, setAmount] = useState("0");

  const handleCreate = async (): Promise<void> => {
    if (!dealId) return;
    const item = await createCommission(dealId, Number(amount));
    onCreated(item);
  };

  return (
    <Paper elevation={0} sx={{ p: 2, border: "1px solid #d6dfd0" }}>
      <Stack spacing={2}>
        <Typography variant="h5">Create Commission on Closed Deal</Typography>
        <TextField select label="Deal" value={dealId} onChange={(event) => setDealId(event.target.value)}>
          {deals.map((deal) => (
            <MenuItem key={deal.id} value={deal.id}>
              {deal.property_address} ({deal.stage})
            </MenuItem>
          ))}
        </TextField>
        <TextField type="number" label="Amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
        <Button variant="contained" onClick={() => void handleCreate()}>
          Create
        </Button>
      </Stack>
    </Paper>
  );
}
