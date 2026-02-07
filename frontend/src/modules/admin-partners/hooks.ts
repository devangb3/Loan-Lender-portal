import { useEffect, useState } from "react";
import { fetchAdminPartners } from "./api";
import type { AdminPartner } from "./types";

export function useAdminPartners() {
  const [partners, setPartners] = useState<AdminPartner[]>([]);

  const refresh = async (): Promise<void> => {
    setPartners(await fetchAdminPartners());
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { partners, refresh };
}
