import { Button, Stack, TextField } from "@/components/ui/mui";
import { APP_ROUTES } from "@/shared/constants";
import { Link } from "react-router-dom";
import { DealsTable } from "../components/DealsTable";
import { usePartnerDeals } from "../hooks";
import { PageHeader } from "@/shared/ui/PageHeader";
import { useState } from "react";
import { FilePlus } from "lucide-react";

export function PartnerDealsPage() {
  const { deals, refresh } = usePartnerDeals();
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");

  const filtered = deals.filter((deal) => {
    const matchesSearch = !search || deal.property_address?.toLowerCase().includes(search.toLowerCase());
    const matchesStage = !stageFilter || deal.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const stages = [...new Set(deals.map((d) => d.stage))];

  return (
    <Stack spacing={3} className="page-enter">
      <PageHeader
        title="My Deals"
        actions={
          <>
            <Button variant="contained" onClick={() => void refresh()}>Refresh</Button>
            <Button component={Link} to={APP_ROUTES.PARTNER_DEALS_NEW} variant="contained">
              <FilePlus size={16} className="mr-2" /> Submit New Deal
            </Button>
          </>
        }
      />

      <Stack direction="row" spacing={2} flexWrap="wrap">
        <TextField
          label="Search by address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="h-9 rounded-md border border-border bg-muted/50 px-3 text-sm font-body normal-case tracking-normal text-foreground transition-colors focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          <option value="">All Stages</option>
          {stages.map((s) => (
            <option key={s} value={s}>{s.replaceAll("_", " ")}</option>
          ))}
        </select>
      </Stack>

      <DealsTable deals={filtered} />
    </Stack>
  );
}
