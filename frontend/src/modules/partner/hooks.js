import { useCallback } from "react";
import { useAsyncResource } from "@/shared/hooks/useAsyncResource";
import { fetchCommissionSummary, fetchPartnerDashboard, fetchPartnerDeals } from "./api";

export function usePartnerDashboard() {
  const loader = useCallback(async () => {
    const [dashboard, commissionSummary] = await Promise.all([
      fetchPartnerDashboard(),
      fetchCommissionSummary(),
    ]);
    return { dashboard, commissionSummary };
  }, []);

  const { data, loading, refresh } = useAsyncResource(loader, {
    dashboard: null,
    commissionSummary: null,
  });

  return { dashboard: data.dashboard, commissionSummary: data.commissionSummary, loading, refresh };
}

export function usePartnerDeals() {
  const loader = useCallback(() => fetchPartnerDeals(), []);
  const { data: deals, loading, refresh } = useAsyncResource(loader, []);

  return { deals, loading, refresh };
}

export function usePartnerData() {
  const loader = useCallback(async () => {
    const [dashboard, deals, commissionSummary] = await Promise.all([
      fetchPartnerDashboard(),
      fetchPartnerDeals(),
      fetchCommissionSummary(),
    ]);
    return { dashboard, deals, commissionSummary };
  }, []);

  const { data, loading, refresh } = useAsyncResource(loader, {
    dashboard: null,
    commissionSummary: null,
    deals: [],
  });

  return {
    dashboard: data.dashboard,
    commissionSummary: data.commissionSummary,
    deals: data.deals,
    loading,
    refresh,
  };
}
