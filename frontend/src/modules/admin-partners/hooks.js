import { useEffect, useState } from "react";
import { fetchAdminPartners } from "./api";

export function useAdminPartners() {
  const [partners, setPartners] = useState([]);

  const refresh = async () => {
    try {
      setPartners(await fetchAdminPartners());
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { partners, refresh };
}
