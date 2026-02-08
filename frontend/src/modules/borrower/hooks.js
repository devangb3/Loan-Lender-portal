import { useEffect, useState } from "react";
import { fetchBorrowerDashboard } from "./api";

export function useBorrowerData() {
  const [data, setData] = useState({ deals: [] });
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      setData(await fetchBorrowerDashboard());
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { data, loading, refresh };
}
