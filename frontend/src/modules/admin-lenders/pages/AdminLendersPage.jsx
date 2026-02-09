import { Button, Stack, TextField } from "@/components/ui/mui";
import { LenderAssignForm } from "../components/LenderAssignForm";
import { LenderImportForm } from "../components/LenderImportForm";
import { LendersTable } from "../components/LendersTable";
import { useLenders } from "../hooks";
import { PageHeader } from "@/shared/ui/PageHeader";

export function AdminLendersPage() {
  const { lenders, deals, query, setQuery, refresh } = useLenders();

  return (
    <Stack spacing={3} className="page-enter">
      <PageHeader
        title="Lender Database"
        actions={<Button variant="contained" onClick={() => void refresh()}>Refresh</Button>}
      />

      <TextField label="Search lenders" value={query} onChange={(event) => setQuery(event.target.value)} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LenderImportForm onImported={() => void refresh()} />
        <LenderAssignForm deals={deals} lenders={lenders} onAssigned={() => void refresh()} />
      </div>

      <LendersTable lenders={lenders} onDeleted={() => void refresh()} />
    </Stack>
  );
}
