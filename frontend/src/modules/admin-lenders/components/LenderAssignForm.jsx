import PropTypes from "prop-types";
import { Button, MenuItem, Stack, TextField, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { assignLender } from "../api";

export function LenderAssignForm({ deals, lenders, onAssigned }) {
  const [dealId, setDealId] = useState("");
  const [lenderId, setLenderId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const submit = async () => {
    if (!dealId || !lenderId) return;

    setAssigning(true);
    try {
      await assignLender(dealId, lenderId);
      onAssigned();
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Card className="p-5">
      <Stack spacing={2}>
        <Typography variant="h5">Assign Lender to Deal</Typography>
        <TextField select label="Deal" value={dealId} onChange={(event) => setDealId(event.target.value)}>
          {deals.map((deal) => (
            <MenuItem key={deal.id} value={deal.id}>{deal.property_address}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Lender" value={lenderId} onChange={(event) => setLenderId(event.target.value)}>
          {lenders.map((lender) => (
            <MenuItem key={lender.id} value={lender.id}>{lender.lender_name}</MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={() => void submit()} disabled={assigning || !dealId || !lenderId}>
          {assigning ? "Assigning..." : "Assign"}
        </Button>
      </Stack>
    </Card>
  );
}

LenderAssignForm.propTypes = {
  deals: PropTypes.arrayOf(PropTypes.object).isRequired,
  lenders: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAssigned: PropTypes.func.isRequired,
};
