import PropTypes from "prop-types";
import { MenuItem, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { updateCommissionStatus } from "../api";
import { toCurrency } from "../utils";

export function CommissionsTable({ commissions, onChanged }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (commission, status) => {
    setUpdatingId(commission.id);
    try {
      const updated = await updateCommissionStatus(commission.id, status);
      onChanged(commissions.map((item) => (item.id === updated.id ? updated : item)));
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Deal</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {commissions.map((commission) => (
            <TableRow key={commission.id}>
              <TableCell>{commission.deal_property_address ?? commission.deal_id}</TableCell>
              <TableCell>{toCurrency(commission.amount)}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Select
                    size="small"
                    value={commission.status}
                    disabled={updatingId === commission.id}
                    onChange={(event) => void handleStatusChange(commission, event.target.value)}
                  >
                    <MenuItem value="pending">pending</MenuItem>
                    <MenuItem value="earned">earned</MenuItem>
                    <MenuItem value="paid">paid</MenuItem>
                  </Select>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

CommissionsTable.propTypes = {
  commissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChanged: PropTypes.func.isRequired,
};
