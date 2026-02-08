import { useEffect, useState } from "react";
import { listAdminDeals, listCommissions } from "./api";
export function useCommissionData() {
    const [deals, setDeals] = useState([]);
    const [commissions, setCommissions] = useState([]);
    const refresh = async () => {
        const [dealsData, commissionsData] = await Promise.all([listAdminDeals(), listCommissions()]);
        setDeals(dealsData);
        setCommissions(commissionsData);
    };
    useEffect(() => {
        void refresh();
    }, []);
    return { deals, commissions, setCommissions, refresh };
}
