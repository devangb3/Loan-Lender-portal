import { useState } from "react";
import { downloadExport } from "./api";

export function useExports() {
  const [loadingEntity, setLoadingEntity] = useState(null);

  const runExport = async (entity) => {
    setLoadingEntity(entity);
    try {
      await downloadExport(entity);
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    } finally {
      setLoadingEntity(null);
    }
  };

  return { loadingEntity, runExport };
}
