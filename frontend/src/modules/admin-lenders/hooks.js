import { useEffect, useState } from "react";
import { listAdminDealsLite, listLenders } from "./api";

export function useLenders() {
  const [lenders, setLenders] = useState([]);
  const [deals, setDeals] = useState([]);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [minLoan, setMinLoan] = useState("");
  const [maxLoan, setMaxLoan] = useState("");

  const refresh = async () => {
    try {
      const parsedMin = minLoan.trim() ? Number(minLoan) : undefined;
      const parsedMax = maxLoan.trim() ? Number(maxLoan) : undefined;

      const [lendersData, dealsData] = await Promise.all([
        listLenders({
          page: 1,
          pageSize: 200,
          query: query.trim() || undefined,
          specialty: specialty.trim() || undefined,
          state: stateFilter.trim() || undefined,
          property_type: propertyType || undefined,
          min_loan: Number.isFinite(parsedMin) ? parsedMin : undefined,
          max_loan: Number.isFinite(parsedMax) ? parsedMax : undefined,
        }),
        listAdminDealsLite(),
      ]);
      setLenders(lendersData);
      setDeals(dealsData);
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    }
  };

  useEffect(() => {
    void refresh();
  }, [query, specialty, stateFilter, propertyType, minLoan, maxLoan]);

  return {
    lenders,
    deals,
    query,
    setQuery,
    specialty,
    setSpecialty,
    stateFilter,
    setStateFilter,
    propertyType,
    setPropertyType,
    minLoan,
    setMinLoan,
    maxLoan,
    setMaxLoan,
    refresh,
  };
}
