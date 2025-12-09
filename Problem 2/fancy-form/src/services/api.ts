// src/services/api.ts
import type { PriceRow, PricesMap } from "@/types";

const PRICES_URL = "https://interview.switcheo.com/prices.json";
const TOKEN_ICON_BASE =
 "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";

export async function fetchPriceRows(
 signal?: AbortSignal
): Promise<PriceRow[]> {
 const res = await fetch(PRICES_URL, { signal });
 if (!res.ok) throw new Error(`HTTP ${res.status}`);
 return res.json();
}

export function toLatestPrices(rows: PriceRow[]): PricesMap {
 const latestByCurrency = new Map<string, PriceRow>();

 for (const r of rows) {
  const prev = latestByCurrency.get(r.currency);
  if (!prev || new Date(r.date) > new Date(prev.date)) {
   latestByCurrency.set(r.currency, r);
  }
 }

 const map: PricesMap = {};
 for (const [currency, row] of latestByCurrency) {
  if (Number.isFinite(row.price)) map[currency] = row.price;
 }

 return map;
}

export async function fetchLatestPrices(
 signal?: AbortSignal
): Promise<PricesMap> {
 const rows = await fetchPriceRows(signal);
 return toLatestPrices(rows);
}

export function getTokenIconSvgUrl(symbol: string) {
 return `${TOKEN_ICON_BASE}/${symbol}.svg`;
}

export function getTokenIconPngUrl(symbol: string) {
 return `${TOKEN_ICON_BASE}/${symbol}.png`;
}

export function getTokenIconUrls(symbol: string) {
 return {
  svg: getTokenIconSvgUrl(symbol),
  png: getTokenIconPngUrl(symbol),
 };
}
