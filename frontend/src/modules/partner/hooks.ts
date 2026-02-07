import { useEffect, useState } from "react";
import { fetchCommissionSummary, fetchPartnerDashboard, fetchPartnerDeals } from "./api";
import type { CommissionSummary, DealItem, PartnerDashboard } from "./types";

export function usePartnerData() {
  const [dashboard, setDashboard] = useState<PartnerDashboard | null>(null);
  const [commissionSummary, setCommissionSummary] = useState<CommissionSummary | null>(null);
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async (): Promise<void> => {
    setLoading(true);
    try {
      const [dashboardData, dealsData, commissionData] = await Promise.all([
        fetchPartnerDashboard(),
        fetchPartnerDeals(),
        fetchCommissionSummary(),
      ]);
      setDashboard(dashboardData);
      setDeals(dealsData);
      setCommissionSummary(commissionData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { dashboard, commissionSummary, deals, loading, refresh };
}
