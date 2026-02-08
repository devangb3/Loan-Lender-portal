import { useEffect, useState } from "react";
import { listAdminDealsLite, listLenders } from "./api";

export function useLenders() {
  const [lenders, setLenders] = useState([]);
  const [deals, setDeals] = useState([]);
  const [query, setQuery] = useState("");

  const refresh = async () => {
    try {
      const [lendersData, dealsData] = await Promise.all([listLenders(query), listAdminDealsLite()]);
      setLenders(lendersData);
      setDeals(dealsData);
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    }
  };

  useEffect(() => {
    void refresh();
  }, [query]);

  return { lenders, deals, query, setQuery, refresh };
}
