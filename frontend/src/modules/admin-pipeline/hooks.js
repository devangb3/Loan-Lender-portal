import { useCallback } from "react";
import { useAsyncResource } from "@/shared/hooks/useAsyncResource";
import { fetchKanbanBoard } from "./api";

export function useKanbanData() {
  const loader = useCallback(() => fetchKanbanBoard(), []);
  const { data: board, setData: setBoard, loading, refresh } = useAsyncResource(loader, {});

  return { board, setBoard, loading, refresh };
}
