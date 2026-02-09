import { Button, LinearProgress, Stack, Typography } from "@/components/ui/mui";
import { Link } from "react-router-dom";
import { usePartnerDashboard } from "../hooks";
import { currency } from "../utils";
import { PageHeader } from "@/shared/ui/PageHeader";
import { MetricCard } from "@/shared/ui/MetricCard";
import { Card } from "@/components/ui/card";
import { FileText, FilePlus, Briefcase, DollarSign, TrendingUp, Clock } from "lucide-react";

export function PartnerDashboardPage() {
  const { dashboard, commissionSummary, refresh } = usePartnerDashboard();

  return (
    <Stack spacing={4} className="page-enter">
      <PageHeader
        title="Partner Dashboard"
        actions={
          <Button onClick={() => void refresh()} variant="contained">Refresh Data</Button>
        }
      />

      {dashboard ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard label="Deals Submitted" value={dashboard.deals_submitted.toString()} icon={Briefcase} />
          <MetricCard label="Deals Closed" value={dashboard.deals_closed.toString()} icon={TrendingUp} />
          <MetricCard label="Total Volume" value={currency(dashboard.total_loan_volume)} icon={DollarSign} />
          <MetricCard label="Pending Commission" value={currency(dashboard.pending_commission)} icon={Clock} />
          <MetricCard label="YTD Earnings" value={currency(dashboard.ytd_earnings)} icon={DollarSign} />
        </div>
      ) : null}

      {commissionSummary ? (
        <Card className="p-5">
          <Typography variant="h5">Commission Goal Progress</Typography>
          <Typography variant="body2" className="mb-2 mt-1">
            Goal: {currency(commissionSummary.commission_goal)} &bull; Paid: {currency(commissionSummary.paid)}
          </Typography>
          <LinearProgress variant="determinate" value={Math.min(commissionSummary.progress_pct, 100)} />
          <Typography variant="body2" className="mt-2">
            Pending: {currency(commissionSummary.pending)} &bull; Earned: {currency(commissionSummary.earned)} &bull; Paid: {currency(commissionSummary.paid)}
          </Typography>
        </Card>
      ) : null}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="p-5 transition-shadow hover:shadow-card-hover">
          <Stack spacing={2}>
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <FileText size={22} />
              </div>
              <div>
                <Typography variant="h6">My Deals</Typography>
                <Typography variant="body2">View and manage your submitted deals</Typography>
              </div>
            </div>
            <Button component={Link} to="/partner/deals" variant="outlined" size="small">View Deals</Button>
          </Stack>
        </Card>

        <Card className="p-5 transition-shadow hover:shadow-card-hover">
          <Stack spacing={2}>
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-secondary/10 p-2 text-secondary">
                <FilePlus size={22} />
              </div>
              <div>
                <Typography variant="h6">Submit Deal</Typography>
                <Typography variant="body2">Submit a new commercial loan deal</Typography>
              </div>
            </div>
            <Button component={Link} to="/partner/deals/new" variant="outlined" size="small">New Deal</Button>
          </Stack>
        </Card>
      </div>
    </Stack>
  );
}
