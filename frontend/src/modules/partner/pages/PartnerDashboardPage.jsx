import { Button, LinearProgress, Paper, Stack, Typography } from "@/components/ui/mui";
import { Link } from "react-router-dom";
import { DealSubmitForm } from "../components/DealSubmitForm";
import { DealsTable } from "../components/DealsTable";
import { usePartnerData } from "../hooks";
import { currency } from "../utils";

export function PartnerDashboardPage() {
  const { dashboard, commissionSummary, deals, refresh } = usePartnerData();

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">Partner Dashboard</Typography>
        <Stack direction="row" spacing={1}>
          <Button component={Link} to="/partner/resources" variant="outlined">
            Resources
          </Button>
          <Button onClick={() => void refresh()} variant="contained">
            Refresh Data
          </Button>
        </Stack>
      </Stack>

      {dashboard ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <MetricCard label="Deals" value={dashboard.deals_submitted.toString()} />
          <MetricCard label="Closed" value={dashboard.deals_closed.toString()} />
          <MetricCard label="Volume" value={currency(dashboard.total_loan_volume)} />
          <MetricCard label="Pending" value={currency(dashboard.pending_commission)} />
          <MetricCard label="YTD" value={currency(dashboard.ytd_earnings)} />
        </div>
      ) : null}

      {commissionSummary ? (
        <Paper elevation={0} sx={{ p: 2, border: "1px solid #d6dfd0" }}>
          <Typography variant="h5">Commission Goal Progress</Typography>
          <Typography variant="body2" mb={1}>
            Goal: {currency(commissionSummary.commission_goal)} • Paid: {currency(commissionSummary.paid)}
          </Typography>
          <LinearProgress variant="determinate" value={Math.min(commissionSummary.progress_pct, 100)} />
          <Typography variant="body2" mt={1}>
            Pending: {currency(commissionSummary.pending)} • Earned: {currency(commissionSummary.earned)} • Paid:{" "}
            {currency(commissionSummary.paid)}
          </Typography>
        </Paper>
      ) : null}

      <DealSubmitForm onSubmitted={() => void refresh()} />
      <DealsTable deals={deals} />
    </Stack>
  );
}

function MetricCard({ label, value }) {
  return (
    <Paper elevation={0} sx={{ p: 2, border: "1px solid #d6dfd0" }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </Paper>
  );
}
