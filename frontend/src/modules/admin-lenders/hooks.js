import { useEffect, useState } from "react";
import { listAdminDealsLite, listLenders } from "./api";
export function useLenders() {
    const [lenders, setLenders] = useState([]);
    const [deals, setDeals] = useState([]);
    const [query, setQuery] = useState("");
    const refresh = async () => {
        const [lendersData, dealsData] = await Promise.all([listLenders(query), listAdminDealsLite()]);
        setLenders(lendersData);
        setDeals(dealsData);
    };
    useEffect(() => {
        void refresh();
    }, [query]);
    return { lenders, deals, query, setQuery, refresh };
}
