import PropTypes from "prop-types";
import { Button, Grid, MenuItem, Paper, Stack, TextField, Typography } from "@/components/ui/mui";
import { useState } from "react";
import { submitDeal } from "../api";
import { AddressAutocomplete } from "./AddressAutocomplete";

const propertyTypes = ["multifamily", "retail", "office", "industrial", "mixed_use", "land", "hospitality", "other"];
const transactionTypes = ["purchase", "refinance", "cash_out_refinance", "construction", "bridge"];

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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, border: "1px solid #d6dfd0" }}>
      <Typography variant="h4" gutterBottom>
        Submit Deal in 60 Seconds
      </Typography>
      <Stack component="form" spacing={2} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField select name="property_type" fullWidth defaultValue="multifamily" label="Property Type">
              {propertyTypes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField select name="transaction_type" fullWidth defaultValue="purchase" label="Transaction Type">
              {transactionTypes.map((option) => (
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

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField name="loan_amount" label="Loan Amount" fullWidth type="number" required />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField name="borrower_name" label="Borrower Name" fullWidth required />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField name="borrower_phone" label="Borrower Phone" fullWidth required />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField name="borrower_email" label="Borrower Email" fullWidth required type="email" />
          </Grid>
        </Grid>

        <Button type="submit" variant="contained" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Deal"}
        </Button>
      </Stack>
    </Paper>
  );
}

DealSubmitForm.propTypes = {
  onSubmitted: PropTypes.func.isRequired,
};
