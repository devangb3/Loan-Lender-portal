import PropTypes from "prop-types";
import { Button, Grid, MenuItem, Stack, TextField, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { PROPERTY_TYPES, TRANSACTION_TYPES } from "@/shared/constants";
import { submitDeal } from "../api";
import { AddressAutocomplete } from "./AddressAutocomplete";

export function DealSubmitForm({ onSubmitted }) {
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const form = new FormData(event.currentTarget);
      form.set("property_address", address);
      await submitDeal(form);
      event.currentTarget.reset();
      setAddress("");
      onSubmitted();
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-5">
      <Typography variant="h4" gutterBottom>
        Submit Deal in 60 Seconds
      </Typography>
      <Stack component="form" spacing={2} onSubmit={handleSubmit}>
        <Typography className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Property Info</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField select name="property_type" fullWidth defaultValue="multifamily" label="Property Type">
              {PROPERTY_TYPES.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField select name="transaction_type" fullWidth defaultValue="purchase" label="Transaction Type">
              {TRANSACTION_TYPES.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <AddressAutocomplete value={address} onChange={setAddress} />
            <input type="hidden" name="property_address" value={address} />
          </Grid>
        </Grid>

        <Typography className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Loan Details</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField name="loan_amount" label="Loan Amount" fullWidth type="number" required />
          </Grid>
        </Grid>

        <Typography className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Borrower Info</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField name="borrower_name" label="Borrower Name" fullWidth required />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField name="borrower_phone" label="Borrower Phone (optional)" fullWidth />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField name="borrower_email" label="Borrower Email" fullWidth required type="email" />
          </Grid>
        </Grid>

        <Button type="submit" variant="contained" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Deal"}
        </Button>
      </Stack>
    </Card>
  );
}

DealSubmitForm.propTypes = {
  onSubmitted: PropTypes.func.isRequired,
};
