import { Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import type { DealItem } from "../types";
import { currency } from "../utils";

export function DealsTable({ deals }: { deals: DealItem[] }): JSX.Element {
  return (
    <Paper elevation={0} sx={{ border: "1px solid #d6dfd0", overflow: "hidden" }}>
      <Typography variant="h5" sx={{ p: 2 }}>
        Submitted Deals
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell>Loan Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deals.map((deal) => (
            <TableRow key={deal.id}>
              <TableCell>{deal.property_address}</TableCell>
              <TableCell>{currency(deal.loan_amount)}</TableCell>
              <TableCell>
                <Chip label={deal.stage} color="primary" variant="outlined" />
              </TableCell>
              <TableCell>{new Date(deal.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
