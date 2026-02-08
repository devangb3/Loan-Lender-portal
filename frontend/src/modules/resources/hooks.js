import { useEffect, useState } from "react";
import { listPartnerResources } from "./api";
export function usePartnerResources() {
    const [resources, setResources] = useState([]);
    const refresh = async () => {
        setResources(await listPartnerResources());
    };
    useEffect(() => {
        void refresh();
    }, []);
    return { resources, refresh };
}
