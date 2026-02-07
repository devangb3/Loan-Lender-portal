import { useEffect, useState } from "react";
import { listPartnerResources } from "./api";
import type { ResourceItem } from "./types";

export function usePartnerResources() {
  const [resources, setResources] = useState<ResourceItem[]>([]);

  const refresh = async (): Promise<void> => {
    setResources(await listPartnerResources());
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { resources, refresh };
}
