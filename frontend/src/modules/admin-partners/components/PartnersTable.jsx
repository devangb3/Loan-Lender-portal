import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@/components/ui/mui";

import { deactivatePartner, updatePartner } from "../api";
import { pct } from "../utils";

export function PartnersTable({ partners, onChanged }) {
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [partnerToDeactivate, setPartnerToDeactivate] = useState(null);

  const [goalByPartnerId, setGoalByPartnerId] = useState({});
  const [goalSavingPartnerId, setGoalSavingPartnerId] = useState(null);
  const [goalError, setGoalError] = useState(null);

  useEffect(() => {
    const nextGoals = {};
    for (const partner of partners) {
      nextGoals[partner.id] = String(partner.commission_goal ?? 0);
    }
    setGoalByPartnerId(nextGoals);
  }, [partners]);

  const handleDeactivateClick = (partner) => {
    setPartnerToDeactivate(partner);
    setDeactivateDialogOpen(true);
  };

  const handleDeactivateConfirm = async () => {
    if (!partnerToDeactivate) return;

    try {
      await deactivatePartner(partnerToDeactivate.id);
      setDeactivateDialogOpen(false);
      setPartnerToDeactivate(null);
      onChanged();
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    }
  };

  const handleDeactivateCancel = () => {
    setDeactivateDialogOpen(false);
    setPartnerToDeactivate(null);
  };

  const handleGoalSave = async (partnerId) => {
    const raw = goalByPartnerId[partnerId] ?? "";
    const parsed = Number(raw);

    if (!Number.isFinite(parsed) || parsed < 0) {
      setGoalError("Commission goal must be a number greater than or equal to 0.");
      return;
    }

    setGoalSavingPartnerId(partnerId);
    setGoalError(null);

    try {
      await updatePartner(partnerId, { commission_goal: parsed });
      await onChanged();
    } catch {
      setGoalError("Failed to update commission goal. Please try again.");
    } finally {
      setGoalSavingPartnerId(null);
    }
  };

  const handleActivate = async (partnerId) => {
    try {
      await updatePartner(partnerId, { is_active: true });
      await onChanged();
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    }
  };

  return (
    <>
      {goalError ? <Alert severity="error">{goalError}</Alert> : null}

      <Paper elevation={0} sx={{ border: "1px solid #d6dfd0", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Tier</TableCell>
              <TableCell>Deals</TableCell>
              <TableCell>Conversion</TableCell>
              <TableCell>Volume</TableCell>
              <TableCell>Commission Goal</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {partners.map((partner) => {
              const savingGoal = goalSavingPartnerId === partner.id;

              return (
                <TableRow key={partner.id}>
                  <TableCell>{partner.company}</TableCell>
                  <TableCell>
                    <Chip label={partner.tier} size="small" />
                  </TableCell>
                  <TableCell>{partner.deal_count}</TableCell>
                  <TableCell>{pct(partner.conversion_rate)}</TableCell>
                  <TableCell>
                    {partner.total_volume.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TextField
                        type="number"
                        size="small"
                        value={goalByPartnerId[partner.id] ?? ""}
                        onChange={(event) => {
                          const value = event.target.value;
                          setGoalByPartnerId((prev) => ({ ...prev, [partner.id]: value }));
                        }}
                        disabled={savingGoal}
                      />
                      <Button size="small" variant="outlined" disabled={savingGoal} onClick={() => void handleGoalSave(partner.id)}>
                        {savingGoal ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </TableCell>
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
                          void handleActivate(partner.id);
                        }}
                      >
                        Activate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={deactivateDialogOpen} onClose={handleDeactivateCancel}>
        <DialogTitle>Deactivate Partner</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to deactivate "{partnerToDeactivate?.company}"? This will disable their account and prevent them from
            logging in. This action can be reversed by activating them again.
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

PartnersTable.propTypes = {
  partners: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChanged: PropTypes.func.isRequired,
};
