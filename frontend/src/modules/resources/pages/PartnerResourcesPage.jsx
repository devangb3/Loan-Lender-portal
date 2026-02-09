import { Button, Stack } from "@/components/ui/mui";
import { ResourceGroup } from "../components/ResourceGroup";
import { usePartnerResources } from "../hooks";
import { groupByCategory } from "../utils";
import { PageHeader } from "@/shared/ui/PageHeader";

export function PartnerResourcesPage() {
  const { resources, refresh } = usePartnerResources();
  const grouped = groupByCategory(resources);

  return (
    <Stack spacing={3} className="page-enter">
      <PageHeader
        title="Partner Resources"
        actions={<Button variant="contained" onClick={() => void refresh()}>Refresh</Button>}
      />
      <ResourceGroup title="Scripts" items={grouped.scripts ?? []} />
      <ResourceGroup title="FAQ" items={grouped.faq ?? []} />
      <ResourceGroup title="Loan Types" items={grouped.loan_types ?? []} />
    </Stack>
  );
}
