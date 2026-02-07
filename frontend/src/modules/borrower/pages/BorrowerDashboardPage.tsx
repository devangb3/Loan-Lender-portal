import { Button, Stack, Typography } from "@mui/material";
import { BorrowerDealsList } from "../components/BorrowerDealsList";
import { useBorrowerData } from "../hooks";

export function BorrowerDashboardPage(): JSX.Element {
  const { data, refresh } = useBorrowerData();

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">Borrower Portal</Typography>
        <Button variant="contained" onClick={() => void refresh()}>
          Refresh
        </Button>
      </Stack>
      <BorrowerDealsList deals={data.deals} />
    </Stack>
  );
}
