import { useEffect, useMemo, useState } from "react";

type PriceRow = { currency: string; date: string; price: number };
export type PricesMap = Record<string, number>;

export function usePrices() {
 const [prices, setPrices] = useState<PricesMap>({});
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  let alive = true;

  (async () => {
   try {
    setLoading(true);
    const res = await fetch("https://interview.switcheo.com/prices.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const rows: PriceRow[] = await res.json();

    // keep latest by date per currency
    const latest: Record<string, PriceRow> = {};
    for (const r of rows) {
     const prev = latest[r.currency];
     if (!prev || new Date(r.date) > new Date(prev.date)) {
      latest[r.currency] = r;
     }
    }

    const map: PricesMap = {};
    for (const sym in latest) {
     const p = latest[sym].price;
     if (Number.isFinite(p)) map[sym] = p;
    }

    if (!alive) return;
    setPrices(map);
    setError(null);
   } catch (e: any) {
    if (!alive) return;
    setError(e?.message ?? "Failed to load prices");
   } finally {
    setLoading(false);
   }
  })();

  return () => {
   alive = false;
  };
 }, []);

 const tokens = useMemo(() => {
  return Object.entries(prices)
   .map(([symbol, price]) => ({ symbol, price }))
   .sort((a, b) => a.symbol.localeCompare(b.symbol));
 }, [prices]);

 return { prices, tokens, loading, error };
}
