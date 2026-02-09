import { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Stack, Typography } from "@/components/ui/mui";
import { Trash2 as DeleteIcon } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { deleteDeal } from "../api";

export function DealCardOverlay({ deal }) {
  return (
    <Paper sx={{ p: 1.5 }} className="shadow-drag-lift">
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Stack spacing={0.5} sx={{ flex: 1 }}>
          <Typography variant="body2" fontWeight={700}>{deal.property_address}</Typography>
          <Chip size="small" label={deal.loan_amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} />
        </Stack>
      </Stack>
    </Paper>
  );
}

DealCardOverlay.propTypes = {
  deal: PropTypes.object.isRequired,
};

export function DraggableDealCard({ deal, onDeleted }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: deal.id, data: { stage: deal.stage } });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setDeleteDialogOpen(true);
    setError(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDeal(deal.id);
      setDeleteDialogOpen(false);
      setError(null);
      onDeleted();
    } catch (err) {
      let message = "Failed to delete deal";
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err;
        if (axiosError.response?.data?.detail) {
          message = axiosError.response.data.detail;
        } else if (axiosError.response?.status === 403) {
          message = "Access denied. Please ensure you are logged in as an admin user.";
        }
      }
      setError(message);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <Fragment>
      <Paper
        ref={setNodeRef}
        {...attributes}
        sx={{ p: 1.5 }}
        className={isDragging ? "opacity-40" : ""}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Stack spacing={0.5} sx={{ flex: 1, cursor: "grab" }} {...listeners}>
            <Typography variant="body2" fontWeight={700}>{deal.property_address}</Typography>
            <Chip size="small" label={deal.loan_amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} />
          </Stack>
          <IconButton
            size="small"
            color="error"
            onClick={handleDeleteClick}
            onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onPointerDown={(e) => { e.stopPropagation(); }}
            sx={{ flexShrink: 0, cursor: "pointer" }}
          >
            <DeleteIcon size={16} />
          </IconButton>
        </Stack>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Deal</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <DialogContentText>
            Are you sure you want to delete the deal for &quot;{deal.property_address}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={() => void handleDeleteConfirm()} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

DraggableDealCard.propTypes = {
  deal: PropTypes.object.isRequired,
  onDeleted: PropTypes.func.isRequired,
};
