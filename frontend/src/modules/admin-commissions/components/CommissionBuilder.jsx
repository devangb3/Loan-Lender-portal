import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";

import { Alert, Button, MenuItem, Stack, TextField, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";

import { createCommission } from "../api";

export function CommissionBuilder({ deals, onCreated, onRefresh }) {
  const [dealId, setDealId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const hasDeals = deals.length > 0;

  useEffect(() => {
    if (!hasDeals) {
      if (dealId) setDealId("");
      return;
    }

    const currentExists = deals.some((deal) => deal.id === dealId);
    if (!currentExists) {
      setDealId(deals[0].id);
    }
  }, [deals, hasDeals, dealId]);

  const isAmountValid = useMemo(() => {
    const numeric = Number(amount);
    return Number.isFinite(numeric) && numeric > 0;
  }, [amount]);

  const handleCreate = async () => {
    if (!dealId) {
      setError("Please select a deal");
      return;
    }

    if (!isAmountValid) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const item = await createCommission(dealId, Number(amount));
      setSuccess(true);
      setAmount("");
      onCreated(item);

      if (onRefresh) {
        await onRefresh();
      }
    } catch (err) {
      let message = "Failed to create commission";

      if (err && typeof err === "object" && "response" in err) {
        const detail = err.response?.data?.detail;

        if (typeof detail === "string") {
          message = detail;
        } else if (Array.isArray(detail)) {
          message = detail
            .map((item) => (typeof item?.msg === "string" ? item.msg : JSON.stringify(item)))
            .join("; ");
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-5">
      <Stack spacing={2}>
        <Typography variant="h5">Create Commission on Closed Deal</Typography>

        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" onClose={() => setSuccess(false)}>
            Commission created successfully!
          </Alert>
        )}

        <TextField select label="Deal" value={dealId} onChange={(event) => setDealId(event.target.value)} disabled={loading || !hasDeals}>
          {hasDeals ? (
            deals.map((deal) => (
              <MenuItem key={deal.id} value={deal.id}>
                {deal.property_address} ({deal.stage})
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>
              No deals available
            </MenuItem>
          )}
        </TextField>

        <TextField type="number" label="Amount" value={amount} onChange={(event) => setAmount(event.target.value)} disabled={loading || !hasDeals} />

        <Button variant="contained" onClick={() => void handleCreate()} disabled={loading || !hasDeals || !dealId || !isAmountValid}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </Stack>
    </Card>
  );
}

CommissionBuilder.propTypes = {
  deals: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCreated: PropTypes.func.isRequired,
  onRefresh: PropTypes.func,
};
