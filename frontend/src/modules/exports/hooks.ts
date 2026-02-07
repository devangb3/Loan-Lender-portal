import { useState } from "react";
import { downloadExport } from "./api";
import type { ExportEntity } from "./types";

export function useExports() {
  const [loadingEntity, setLoadingEntity] = useState<ExportEntity | null>(null);

  const runExport = async (entity: ExportEntity): Promise<void> => {
    setLoadingEntity(entity);
    try {
      await downloadExport(entity);
    } finally {
      setLoadingEntity(null);
    }
  };

  return { loadingEntity, runExport };
}
