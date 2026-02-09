import { Button, Stack } from "@/components/ui/mui";
import { PartnersTable } from "../components/PartnersTable";
import { useAdminPartners } from "../hooks";
import { PageHeader } from "@/shared/ui/PageHeader";

export function AdminPartnersPage() {
  const { partners, refresh } = useAdminPartners();

  return (
    <Stack spacing={3} className="page-enter">
      <PageHeader
        title="Partner Management"
        actions={<Button variant="contained" onClick={() => void refresh()}>Refresh</Button>}
      />
      <PartnersTable partners={partners} onChanged={() => void refresh()} />
    </Stack>
  );
}
