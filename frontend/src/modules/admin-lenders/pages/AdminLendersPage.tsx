import { Button, Stack, TextField, Typography } from "@mui/material";
import { LenderAssignForm } from "../components/LenderAssignForm";
import { LenderImportForm } from "../components/LenderImportForm";
import { LendersTable } from "../components/LendersTable";
import { useLenders } from "../hooks";

export function AdminLendersPage(): JSX.Element {
  const { lenders, deals, query, setQuery, refresh } = useLenders();

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">Admin Lender Database</Typography>
        <Button variant="contained" onClick={() => void refresh()}>
          Refresh
        </Button>
      </Stack>
      <TextField label="Search lenders" value={query} onChange={(event) => setQuery(event.target.value)} />
      <LenderImportForm onImported={() => void refresh()} />
      <LenderAssignForm deals={deals} lenders={lenders} onAssigned={() => void refresh()} />
      <LendersTable lenders={lenders} onDeleted={() => void refresh()} />
    </Stack>
  );
}
