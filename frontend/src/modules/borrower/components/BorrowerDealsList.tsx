import { Chip, List, ListItem, ListItemText, Paper, Stack, Typography } from "@mui/material";
import type { BorrowerDeal } from "../types";
import { toCurrency } from "../utils";

export function BorrowerDealsList({ deals }: { deals: BorrowerDeal[] }): JSX.Element {
  return (
    <Paper elevation={0} sx={{ border: "1px solid #d6dfd0", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Loan Applications
      </Typography>
      <List>
        {deals.map((deal) => (
          <ListItem key={deal.id} divider>
            <ListItemText
              primary={deal.property_address}
              secondary={`${toCurrency(deal.loan_amount)} • Referred by ${deal.referring_partner_name ?? "Partner"}`}
            />
            <Stack direction="row" spacing={1}>
              <Chip label={deal.stage} color="primary" variant="outlined" />
            </Stack>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
