import PropTypes from "prop-types";
import { Button, Chip, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { DEAL_STAGE_BADGE_VARIANTS } from "@/shared/constants";
import { currency } from "../utils";
import { Link } from "react-router-dom";

function stageLabel(stage) {
  return stage.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

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
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {deals.map((deal) => (
            <TableRow key={deal.id}>
              <TableCell>{deal.property_address}</TableCell>
              <TableCell>{currency(deal.loan_amount)}</TableCell>
              <TableCell>
                <Chip label={stageLabel(deal.stage)} variant={DEAL_STAGE_BADGE_VARIANTS[deal.stage] || "muted"} />
              </TableCell>
              <TableCell>{new Date(deal.created_at).toLocaleDateString()}</TableCell>
              <TableCell align="right">
                <Button component={Link} to={`/partner/deals/${deal.id}`} size="small" variant="outlined">
                  View
                </Button>
              </TableCell>
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
