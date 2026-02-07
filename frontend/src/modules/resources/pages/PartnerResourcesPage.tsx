import { Button, Stack, Typography } from "@mui/material";
import { ResourceGroup } from "../components/ResourceGroup";
import { usePartnerResources } from "../hooks";
import { groupByCategory } from "../utils";

export function PartnerResourcesPage(): JSX.Element {
  const { resources, refresh } = usePartnerResources();
  const grouped = groupByCategory(resources);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">Partner Resources</Typography>
        <Button variant="contained" onClick={() => void refresh()}>
          Refresh
        </Button>
      </Stack>
      <ResourceGroup title="Scripts" items={grouped.scripts ?? []} />
      <ResourceGroup title="FAQ" items={grouped.faq ?? []} />
      <ResourceGroup title="Loan Types" items={grouped.loan_types ?? []} />
    </Stack>
  );
}
