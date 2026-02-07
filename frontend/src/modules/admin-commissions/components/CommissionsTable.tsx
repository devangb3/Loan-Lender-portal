import { Button, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import { updateCommissionStatus } from "../api";
import type { Commission } from "../types";
import { toCurrency } from "../utils";

export function CommissionsTable({ commissions, onChanged }: { commissions: Commission[]; onChanged: (data: Commission[]) => void }): JSX.Element {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (commission: Commission, status: Commission["status"]): Promise<void> => {
    setUpdatingId(commission.id);
    try {
      const updated = await updateCommissionStatus(commission.id, status);
      onChanged(commissions.map((item) => (item.id === updated.id ? updated : item)));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Paper elevation={0} sx={{ border: "1px solid #d6dfd0", overflow: "hidden" }}>
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
              <TableCell>{commission.deal_id}</TableCell>
              <TableCell>{toCurrency(commission.amount)}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Select
                    size="small"
                    value={commission.status}
                    disabled={updatingId === commission.id}
                    onChange={(event) => void handleStatusChange(commission, event.target.value as Commission["status"])}
                  >
                    <MenuItem value="pending">pending</MenuItem>
                    <MenuItem value="earned">earned</MenuItem>
                    <MenuItem value="paid">paid</MenuItem>
                  </Select>
                  <Button size="small" variant="text" disabled>
                    Forward-only
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
