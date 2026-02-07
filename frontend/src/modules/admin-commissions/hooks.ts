import { useEffect, useState } from "react";
import { listAdminDeals, listCommissions } from "./api";
import type { AdminDeal, Commission } from "./types";

export function useCommissionData() {
  const [deals, setDeals] = useState<AdminDeal[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);

  const refresh = async (): Promise<void> => {
    const [dealsData, commissionsData] = await Promise.all([listAdminDeals(), listCommissions()]);
    setDeals(dealsData);
    setCommissions(commissionsData);
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { deals, commissions, setCommissions, refresh };
}
