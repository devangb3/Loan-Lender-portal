import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteLender } from "../api";
import type { Lender } from "../types";
import { rangeLabel } from "../utils";

export function LendersTable({ lenders, onDeleted }: { lenders: Lender[]; onDeleted: () => void }): JSX.Element {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lenderToDelete, setLenderToDelete] = useState<Lender | null>(null);

  const handleDeleteClick = (lender: Lender): void => {
    setLenderToDelete(lender);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (lenderToDelete) {
      try {
        await deleteLender(lenderToDelete.id);
        setDeleteDialogOpen(false);
        setLenderToDelete(null);
        onDeleted();
      } catch (error) {
        console.error("Failed to delete lender:", error);
      }
    }
  };

  const handleDeleteCancel = (): void => {
    setDeleteDialogOpen(false);
    setLenderToDelete(null);
  };

  return (
    <>
      <Paper elevation={0} sx={{ border: "1px solid #d6dfd0", overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Lender</TableCell>
              <TableCell>Specialty</TableCell>
              <TableCell>States</TableCell>
              <TableCell>Loan Range</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lenders.map((lender) => (
              <TableRow key={lender.id}>
                <TableCell>{lender.lender_name}</TableCell>
                <TableCell>{lender.specialty}</TableCell>
                <TableCell>{lender.states}</TableCell>
                <TableCell>{rangeLabel(lender.min_loan, lender.max_loan)}</TableCell>
                <TableCell>
                  <IconButton size="small" color="error" onClick={() => handleDeleteClick(lender)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Lender</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{lenderToDelete?.lender_name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={() => void handleDeleteConfirm()} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
