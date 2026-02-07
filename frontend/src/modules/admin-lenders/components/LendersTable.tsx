import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import type { Lender } from "../types";
import { rangeLabel } from "../utils";

export function LendersTable({ lenders }: { lenders: Lender[] }): JSX.Element {
  return (
    <Paper elevation={0} sx={{ border: "1px solid #d6dfd0", overflow: "hidden" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Lender</TableCell>
            <TableCell>Specialty</TableCell>
            <TableCell>States</TableCell>
            <TableCell>Loan Range</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lenders.map((lender) => (
            <TableRow key={lender.id}>
              <TableCell>{lender.lender_name}</TableCell>
              <TableCell>{lender.specialty}</TableCell>
              <TableCell>{lender.states}</TableCell>
              <TableCell>{rangeLabel(lender.min_loan, lender.max_loan)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
