import { useEffect, useState } from "react";
import { listAdminDealsLite, listLenders } from "./api";
import type { AdminDealLite, Lender } from "./types";

export function useLenders() {
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [deals, setDeals] = useState<AdminDealLite[]>([]);
  const [query, setQuery] = useState("");

  const refresh = async (): Promise<void> => {
    const [lendersData, dealsData] = await Promise.all([listLenders(query), listAdminDealsLite()]);
    setLenders(lendersData);
    setDeals(dealsData);
  };

  useEffect(() => {
    void refresh();
  }, [query]);

  return { lenders, deals, query, setQuery, refresh };
}
