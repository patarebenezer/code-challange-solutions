import { useEffect, useMemo, useState } from "react";
import { fetchLatestPrices } from "@/services/api";
import type { PricesMap, Token } from "@/types";

export function usePrices() {
 const [prices, setPrices] = useState<PricesMap>({});
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const controller = new AbortController();

  (async () => {
   try {
    setLoading(true);
    const latest = await fetchLatestPrices(controller.signal);
    setPrices(latest);
    setError(null);
   } catch (e: any) {
    if (controller.signal.aborted) return;
    setError(e?.message ?? "Failed to load prices");
   } finally {
    if (!controller.signal.aborted) setLoading(false);
   }
  })();

  return () => controller.abort();
 }, []);

 const tokens = useMemo<Token[]>(() => {
  return Object.entries(prices)
   .map(([symbol, price]) => ({ symbol, price }))
   .sort((a, b) => a.symbol.localeCompare(b.symbol));
 }, [prices]);

 return { prices, tokens, loading, error };
}
