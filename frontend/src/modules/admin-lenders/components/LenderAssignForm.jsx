import PropTypes from "prop-types";
import { Button, MenuItem, Stack, TextField, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { assignLender } from "../api";

export function LenderAssignForm({ deals, lenders, onAssigned }) {
  const [dealId, setDealId] = useState("");
  const [lenderId, setLenderId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const normalizedDeals = useMemo(
    () => deals.filter((deal) => deal?.id).map((deal) => ({ id: String(deal.id), property_address: deal.property_address })),
    [deals],
  );
  const normalizedLenders = useMemo(
    () => lenders.filter((lender) => lender?.id).map((lender) => ({ id: String(lender.id), lender_name: lender.lender_name })),
    [lenders],
  );

  useEffect(() => {
    if (normalizedDeals.length === 0) {
      setDealId("");
      return;
    }
    const selectedStillValid = normalizedDeals.some((deal) => deal.id === dealId);
    if (!selectedStillValid) {
      setDealId(normalizedDeals[0].id);
    }
  }, [normalizedDeals, dealId]);

  useEffect(() => {
    if (normalizedLenders.length === 0) {
      setLenderId("");
      return;
    }
    const selectedStillValid = normalizedLenders.some((lender) => lender.id === lenderId);
    if (!selectedStillValid) {
      setLenderId(normalizedLenders[0].id);
    }
  }, [normalizedLenders, lenderId]);

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
          {normalizedDeals.map((deal) => (
            <MenuItem key={deal.id} value={deal.id}>{deal.property_address}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Lender" value={lenderId} onChange={(event) => setLenderId(event.target.value)}>
          {normalizedLenders.map((lender) => (
            <MenuItem key={lender.id} value={lender.id}>{lender.lender_name}</MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          onClick={() => void submit()}
          disabled={assigning || normalizedDeals.length === 0 || normalizedLenders.length === 0 || !dealId || !lenderId}
        >
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
