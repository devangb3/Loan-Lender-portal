import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";
import { deleteDeal } from "../api";
import type { KanbanDeal } from "../types";

export function DraggableDealCard({ deal, onDeleted }: { deal: KanbanDeal; onDeleted: () => void }): JSX.Element {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: deal.id, data: { stage: deal.stage } });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteClick = (event: React.MouseEvent): void => {
    event.stopPropagation();
    event.preventDefault();
    setDeleteDialogOpen(true);
    setError(null);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    try {
      await deleteDeal(deal.id);
      setDeleteDialogOpen(false);
      setError(null);
      onDeleted();
    } catch (err) {
      let message = "Failed to delete deal";
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { status?: number; data?: { detail?: string } } };
        if (axiosError.response?.data?.detail) {
          message = axiosError.response.data.detail;
        } else if (axiosError.response?.status === 403) {
          message = "Access denied. Please ensure you are logged in as an admin user.";
        }
      }
      setError(message);
    }
  };

  const handleDeleteCancel = (): void => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Paper
        ref={setNodeRef}
        {...attributes}
        sx={{
          p: 1.5,
          border: "1px solid #ced8ca",
          transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : "none",
          position: "relative",
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Stack
            spacing={0.5}
            sx={{ flex: 1, cursor: "grab" }}
            {...listeners}
          >
            <Typography variant="body2" fontWeight={700}>
              {deal.property_address}
            </Typography>
            <Chip size="small" label={deal.loan_amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} />
          </Stack>
          <IconButton
            size="small"
            color="error"
            onClick={handleDeleteClick}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            sx={{ flexShrink: 0, cursor: "pointer" }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Paper>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Deal</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <DialogContentText>
            Are you sure you want to delete the deal for "{deal.property_address}"? This action cannot be undone.
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
