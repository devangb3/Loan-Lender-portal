import PropTypes from "prop-types";
import { Chip, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { currency } from "../utils";

export function DealsTable({ deals }) {
  return (
    <Card className="overflow-hidden">
      <Typography variant="h5" sx={{ p: 2 }}>Submitted Deals</Typography>
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
                <Chip label={deal.stage} />
              </TableCell>
              <TableCell>{new Date(deal.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

DealsTable.propTypes = {
  deals: PropTypes.arrayOf(PropTypes.object).isRequired,
};
