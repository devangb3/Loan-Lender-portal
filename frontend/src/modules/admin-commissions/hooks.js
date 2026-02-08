import { useEffect, useState } from "react";
import { listAdminDeals, listCommissions } from "./api";

export function useCommissionData() {
  const [deals, setDeals] = useState([]);
  const [commissions, setCommissions] = useState([]);

  const refresh = async () => {
    try {
      const [dealsData, commissionsData] = await Promise.all([listAdminDeals(), listCommissions()]);
      setDeals(dealsData);
      setCommissions(commissionsData);
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { deals, commissions, setCommissions, refresh };
}
