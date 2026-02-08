import { useEffect, useState } from "react";
import { fetchKanbanBoard } from "./api";
export function useKanbanData() {
    const [board, setBoard] = useState({});
    const [loading, setLoading] = useState(true);
    const refresh = async () => {
        setLoading(true);
        try {
            setBoard(await fetchKanbanBoard());
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        void refresh();
    }, []);
    return { board, setBoard, loading, refresh };
}
