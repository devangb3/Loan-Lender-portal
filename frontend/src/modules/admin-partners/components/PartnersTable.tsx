import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import { deactivatePartner, updatePartner } from "../api";
import type { AdminPartner } from "../types";
import { pct } from "../utils";

export function PartnersTable({ partners, onChanged }: { partners: AdminPartner[]; onChanged: () => void }): JSX.Element {
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [partnerToDeactivate, setPartnerToDeactivate] = useState<AdminPartner | null>(null);

  const handleDeactivateClick = (partner: AdminPartner): void => {
    setPartnerToDeactivate(partner);
    setDeactivateDialogOpen(true);
  };

  const handleDeactivateConfirm = async (): Promise<void> => {
    if (partnerToDeactivate) {
      try {
        await deactivatePartner(partnerToDeactivate.id);
        setDeactivateDialogOpen(false);
        setPartnerToDeactivate(null);
        onChanged();
      } catch (error) {
        console.error("Failed to deactivate partner:", error);
      }
    }
  };

  const handleDeactivateCancel = (): void => {
    setDeactivateDialogOpen(false);
    setPartnerToDeactivate(null);
  };

  return (
    <>
      <Paper elevation={0} sx={{ border: "1px solid #d6dfd0", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Tier</TableCell>
              <TableCell>Deals</TableCell>
              <TableCell>Conversion</TableCell>
              <TableCell>Volume</TableCell>
              <TableCell>Status</TableCell>
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
                  <Chip label={partner.is_active ? "Active" : "Inactive"} color={partner.is_active ? "success" : "default"} size="small" />
                </TableCell>
                <TableCell>
                  {partner.is_active ? (
                    <Button size="small" color="error" variant="outlined" onClick={() => handleDeactivateClick(partner)}>
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        void updatePartner(partner.id, { is_active: true }).then(onChanged);
                      }}
                    >
                      Activate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={deactivateDialogOpen} onClose={handleDeactivateCancel}>
        <DialogTitle>Deactivate Partner</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to deactivate "{partnerToDeactivate?.company}"? This will disable their account and prevent them from logging in. This action can be reversed by activating them again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeactivateCancel}>Cancel</Button>
          <Button onClick={() => void handleDeactivateConfirm()} color="error" variant="contained">
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
