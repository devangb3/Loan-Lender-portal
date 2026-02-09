import PropTypes from "prop-types";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Trash2 as DeleteIcon } from "lucide-react";
import { deleteLender } from "../api";
import { rangeLabel } from "../utils";

export function LendersTable({ lenders, onDeleted }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lenderToDelete, setLenderToDelete] = useState(null);

  const handleDeleteClick = (lender) => {
    setLenderToDelete(lender);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (lenderToDelete) {
      try {
        await deleteLender(lenderToDelete.id);
        setDeleteDialogOpen(false);
        setLenderToDelete(null);
        onDeleted();
      } catch {
        // Error feedback is handled globally by the API client interceptor.
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setLenderToDelete(null);
  };

  return (
    <>
      <Card className="overflow-hidden">
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
      </Card>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Lender</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &quot;{lenderToDelete?.lender_name}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={() => void handleDeleteConfirm()} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

LendersTable.propTypes = {
  lenders: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDeleted: PropTypes.func.isRequired,
};
