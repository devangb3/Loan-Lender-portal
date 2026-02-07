import { Button, Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { updatePartner } from "../api";
import type { AdminPartner } from "../types";
import { pct } from "../utils";

export function PartnersTable({ partners, onChanged }: { partners: AdminPartner[]; onChanged: () => void }): JSX.Element {
  return (
    <Paper elevation={0} sx={{ border: "1px solid #d6dfd0", overflow: "hidden" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Company</TableCell>
            <TableCell>Tier</TableCell>
            <TableCell>Deals</TableCell>
            <TableCell>Conversion</TableCell>
            <TableCell>Volume</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell>{partner.company}</TableCell>
              <TableCell>
                <Chip label={partner.tier} size="small" />
              </TableCell>
              <TableCell>{partner.deal_count}</TableCell>
              <TableCell>{pct(partner.conversion_rate)}</TableCell>
              <TableCell>{partner.total_volume.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  onClick={() => {
                    void updatePartner(partner.id, { is_approved: !partner.is_approved, is_active: !partner.is_active }).then(onChanged);
                  }}
                >
                  {partner.is_active ? "Deactivate" : "Activate"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
