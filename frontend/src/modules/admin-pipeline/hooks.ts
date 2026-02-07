import { useEffect, useState } from "react";
import { fetchKanbanBoard } from "./api";
import type { KanbanBoard } from "./types";

export function useKanbanData() {
  const [board, setBoard] = useState<KanbanBoard>({});
  const [loading, setLoading] = useState(true);

  const refresh = async (): Promise<void> => {
    setLoading(true);
    try {
      setBoard(await fetchKanbanBoard());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { board, setBoard, loading, refresh };
}
