import { useEffect, useState } from "react";
import { listPartnerResources } from "./api";

export function usePartnerResources() {
  const [resources, setResources] = useState([]);

  const refresh = async () => {
    try {
      setResources(await listPartnerResources());
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { resources, refresh };
}
