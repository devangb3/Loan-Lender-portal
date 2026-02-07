import { Button, Stack, Typography } from "@mui/material";
import { PartnersTable } from "../components/PartnersTable";
import { useAdminPartners } from "../hooks";

export function AdminPartnersPage(): JSX.Element {
  const { partners, refresh } = useAdminPartners();

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">Admin Partner Management</Typography>
        <Button variant="contained" onClick={() => void refresh()}>
          Refresh
        </Button>
      </Stack>
      <PartnersTable partners={partners} onChanged={() => void refresh()} />
    </Stack>
  );
}
