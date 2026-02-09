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
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@/components/ui/mui";
import { Card } from "@/components/ui/card";

import { deactivatePartner, updatePartner } from "../api";
import { pct } from "../utils";

const PARTNER_TIERS = ["bronze", "silver", "gold", "platinum"];

export function PartnersTable({ partners, onChanged }) {
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [partnerToDeactivate, setPartnerToDeactivate] = useState(null);

  const [tierByPartnerId, setTierByPartnerId] = useState({});
  const [goalByPartnerId, setGoalByPartnerId] = useState({});
  const [rowSavingPartnerId, setRowSavingPartnerId] = useState(null);
  const [rowError, setRowError] = useState(null);

  useEffect(() => {
    const nextTiers = {};
    const nextGoals = {};
    for (const partner of partners) {
      nextTiers[partner.id] = partner.tier;
      nextGoals[partner.id] = String(partner.commission_goal ?? 0);
    }
    setTierByPartnerId(nextTiers);
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

  const isRowDirty = (partner) => {
    const selectedTier = tierByPartnerId[partner.id] ?? partner.tier;
    const rawGoal = goalByPartnerId[partner.id] ?? String(partner.commission_goal ?? 0);
    const parsedGoal = Number(rawGoal);
    const currentGoal = Number(partner.commission_goal ?? 0);
    const tierChanged = selectedTier !== partner.tier;

    if (!Number.isFinite(parsedGoal)) return true;
    return tierChanged || parsedGoal !== currentGoal;
  };

  const handleRowSave = async (partner) => {
    const partnerId = partner.id;
    const tier = tierByPartnerId[partnerId] ?? partner.tier;
    const raw = goalByPartnerId[partnerId] ?? "";
    const parsed = Number(raw);

    if (!PARTNER_TIERS.includes(tier)) {
      setRowError("Partner tier must be one of: bronze, silver, gold, or platinum.");
      return;
    }

    if (!Number.isFinite(parsed) || parsed < 0) {
      setRowError("Commission goal must be a number greater than or equal to 0.");
      return;
    }

    const updatePayload = {};
    if (tier !== partner.tier) updatePayload.tier = tier;
    if (parsed !== Number(partner.commission_goal ?? 0)) updatePayload.commission_goal = parsed;
    if (Object.keys(updatePayload).length === 0) return;

    setRowSavingPartnerId(partnerId);
    setRowError(null);
    try {
      await updatePartner(partnerId, updatePayload);
      await onChanged();
    } catch {
      setRowError("Failed to save partner row changes. Please try again.");
    } finally {
      setRowSavingPartnerId(null);
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

  const handleApprove = async (partnerId) => {
    try {
      await updatePartner(partnerId, { is_approved: true });
      await onChanged();
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    }
  };

  return (
    <>
      {rowError ? <Alert severity="error">{rowError}</Alert> : null}

      <Card className="overflow-hidden">
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
              const savingRow = rowSavingPartnerId === partner.id;

              return (
                <TableRow key={partner.id}>
                  <TableCell>{partner.company}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        size="small"
                        value={tierByPartnerId[partner.id] ?? partner.tier}
                        disabled={savingRow}
                        onChange={(event) => {
                          const value = event.target.value;
                          setTierByPartnerId((prev) => ({ ...prev, [partner.id]: value }));
                        }}
                      >
                        {PARTNER_TIERS.map((tierOption) => (
                          <MenuItem key={tierOption} value={tierOption}>
                            {tierOption}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
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
                        disabled={savingRow}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={partner.is_approved ? (partner.is_active ? "Active" : "Approved (Inactive)") : "Pending Approval"}
                      color={partner.is_active ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={savingRow || !isRowDirty(partner)}
                        onClick={() => {
                          void handleRowSave(partner);
                        }}
                      >
                        {savingRow ? "Saving..." : "Save"}
                      </Button>

                      {!partner.is_approved ? (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => {
                            void handleApprove(partner.id);
                          }}
                        >
                          Approve
                        </Button>
                      ) : partner.is_active ? (
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
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={deactivateDialogOpen} onClose={handleDeactivateCancel}>
        <DialogTitle>Deactivate Partner</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to deactivate &quot;{partnerToDeactivate?.company}&quot;? This will disable their account and prevent them from
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
