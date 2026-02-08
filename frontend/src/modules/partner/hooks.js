import { useEffect, useState } from "react";
import { fetchCommissionSummary, fetchPartnerDashboard, fetchPartnerDeals } from "./api";

export function usePartnerData() {
  const [dashboard, setDashboard] = useState(null);
  const [commissionSummary, setCommissionSummary] = useState(null);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
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
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { dashboard, commissionSummary, deals, loading, refresh };
}
