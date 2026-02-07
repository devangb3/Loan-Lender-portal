import { Button, Stack, Typography } from "@mui/material";
import { CommissionBuilder } from "../components/CommissionBuilder";
import { CommissionsTable } from "../components/CommissionsTable";
import { useCommissionData } from "../hooks";

export function AdminCommissionsPage(): JSX.Element {
  const { deals, commissions, setCommissions, refresh } = useCommissionData();

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">Admin Commissions</Typography>
        <Button variant="contained" onClick={() => void refresh()}>
          Refresh Deals
        </Button>
      </Stack>
      <CommissionBuilder deals={deals} onCreated={(item) => setCommissions((prev) => [item, ...prev])} />
      <CommissionsTable commissions={commissions} onChanged={setCommissions} />
    </Stack>
  );
}
