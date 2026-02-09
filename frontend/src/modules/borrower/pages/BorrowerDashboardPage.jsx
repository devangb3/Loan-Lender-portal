import { Button, Stack } from "@/components/ui/mui";
import { BorrowerDealsList } from "../components/BorrowerDealsList";
import { useBorrowerData } from "../hooks";
import { PageHeader } from "@/shared/ui/PageHeader";

export function BorrowerDashboardPage() {
  const { data, refresh } = useBorrowerData();

  return (
    <Stack spacing={3} className="page-enter">
      <PageHeader
        title="Borrower Portal"
        actions={<Button variant="contained" onClick={() => void refresh()}>Refresh</Button>}
      />
      {data.deals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 py-16 text-center">
          <p className="font-display text-2xl tracking-tight text-muted-foreground">No Applications Yet</p>
          <p className="mt-2 text-sm text-muted-foreground/70">Your loan applications will appear here once a partner refers you.</p>
        </div>
      ) : (
        <BorrowerDealsList deals={data.deals} />
      )}
    </Stack>
  );
}
