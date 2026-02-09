import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, CircularProgress, Chip } from "@/components/ui/mui";
import { Search } from "lucide-react";
import { PageHeader } from "@/shared/ui/PageHeader";
import { APP_ROUTES } from "@/shared/constants";
import { fetchAdminDeals } from "../api";
import { stageBadgeVariant, stageTitle } from "../utils";

function toCurrency(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
}

export function AdminDealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminDeals();
        if (!cancelled) setDeals(data || []);
      } catch {
        if (!cancelled) setError("Unable to load deals.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return deals;
    const q = query.toLowerCase();
    return deals.filter(
      (d) =>
        (d.property_address || "").toLowerCase().includes(q) ||
        (d.lender_name || "").toLowerCase().includes(q),
    );
  }, [deals, query]);

  return (
    <div className="page-enter">
      <PageHeader
        title="Deals"
        subtitle={`${filtered.length} deal${filtered.length !== 1 ? "s" : ""}`}
      />

      <div className="mt-4 mb-4">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by address or lender…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <div className="flex min-h-[140px] items-center justify-center">
          <CircularProgress />
        </div>
      ) : !error && filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {query.trim() ? "No deals match your search." : "No deals found."}
        </p>
      ) : !error ? (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Loan Amount</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Lender</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((deal) => (
                <tr key={deal.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link
                      to={APP_ROUTES.ADMIN_DEAL_DETAIL.replace(":dealId", deal.id)}
                      className="font-medium text-foreground underline-offset-2 hover:underline"
                    >
                      {deal.property_address}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-foreground">{toCurrency(deal.loan_amount)}</td>
                  <td className="px-4 py-3">
                    <Chip size="small" label={stageTitle(deal.stage)} variant={stageBadgeVariant(deal.stage)} />
                  </td>
                  <td className="px-4 py-3 text-foreground">{deal.lender_name || "Unassigned"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(deal.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
