import { Button, Stack } from "@/components/ui/mui";
import { CommissionBuilder } from "../components/CommissionBuilder";
import { CommissionsTable } from "../components/CommissionsTable";
import { useCommissionData } from "../hooks";
import { listCommissions } from "../api";
import { PageHeader } from "@/shared/ui/PageHeader";

export function AdminCommissionsPage() {
  const { deals, commissions, setCommissions, refresh } = useCommissionData();

  const refreshCommissions = async () => {
    try {
      const commissionsData = await listCommissions();
      setCommissions(commissionsData);
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    }
  };

  return (
    <Stack spacing={3} className="page-enter">
      <PageHeader
        title="Commissions"
        actions={<Button variant="contained" onClick={() => void refresh()}>Refresh</Button>}
      />
      <CommissionBuilder deals={deals} onCreated={(item) => setCommissions((prev) => [item, ...prev])} onRefresh={refreshCommissions} />
      <CommissionsTable commissions={commissions} onChanged={setCommissions} />
    </Stack>
  );
}
