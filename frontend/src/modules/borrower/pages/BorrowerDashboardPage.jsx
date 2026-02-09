import { Alert, Button, Stack } from "@/components/ui/mui";
import { APP_ROUTES } from "@/shared/constants";
import { BorrowerDealsList } from "../components/BorrowerDealsList";
import { useBorrowerData } from "../hooks";
import { PageHeader } from "@/shared/ui/PageHeader";
import { useAuth } from "@/modules/auth/hooks";
import { Link } from "react-router-dom";

export function BorrowerDashboardPage() {
  const { user } = useAuth();
  const { data, refresh } = useBorrowerData();

  return (
    <Stack spacing={3} className="page-enter">
      <PageHeader
        title="Borrower Portal"
        actions={<Button variant="contained" onClick={() => void refresh()}>Refresh</Button>}
      />

      {user?.must_reset_password ? (
        <Alert severity="warning">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>You are using a temporary password. Reset it to secure your account.</span>
            <Button component={Link} to={APP_ROUTES.ACCOUNT_PASSWORD} variant="outlined" size="small">
              Reset Password
            </Button>
          </div>
        </Alert>
      ) : null}

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
