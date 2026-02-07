import { useEffect, useState } from "react";
import { fetchBorrowerDashboard } from "./api";
import type { BorrowerDashboard } from "./types";

export function useBorrowerData() {
  const [data, setData] = useState<BorrowerDashboard>({ deals: [] });
  const [loading, setLoading] = useState(true);

  const refresh = async (): Promise<void> => {
    setLoading(true);
    try {
      setData(await fetchBorrowerDashboard());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { data, loading, refresh };
}
