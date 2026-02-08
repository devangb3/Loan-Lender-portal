import { useEffect, useState } from "react";
import { fetchAdminPartners } from "./api";
export function useAdminPartners() {
    const [partners, setPartners] = useState([]);
    const refresh = async () => {
        setPartners(await fetchAdminPartners());
    };
    useEffect(() => {
        void refresh();
    }, []);
    return { partners, refresh };
}
