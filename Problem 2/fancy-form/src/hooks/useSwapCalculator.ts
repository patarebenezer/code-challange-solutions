import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { PricesMap, Token } from "@/types";

type TokenItem = Token;

export function useSwapCalculator(tokens: TokenItem[], prices: PricesMap) {
 const [fromToken, setFromToken] = useState("");
 const [toToken, setToToken] = useState("");
 const [fromAmount, setFromAmount] = useState("");
 const [touched, setTouched] = useState(false);

 const debouncedFromAmount = useDebouncedValue(fromAmount, 300);

 const balances = useMemo(() => {
  const map: Record<string, number> = {};
  for (const t of tokens) {
   map[t.symbol] = Math.max(0, (t.symbol.length * 7.13) % 50);
  }
  return map;
 }, [tokens]);

 useEffect(() => {
  if (!tokens.length) return;
  setFromToken((prev) => prev || tokens[0].symbol);
  setToToken((prev) => prev || tokens[1]?.symbol || tokens[0].symbol);
 }, [tokens]);

 const parsedFrom = useMemo(
  () => Number(debouncedFromAmount),
  [debouncedFromAmount]
 );

 const isFromValid = useMemo(
  () =>
   debouncedFromAmount !== "" && Number.isFinite(parsedFrom) && parsedFrom > 0,
  [debouncedFromAmount, parsedFrom]
 );

 const hasPrices = useMemo(
  () =>
   Boolean(
    fromToken && toToken && prices[fromToken] != null && prices[toToken] != null
   ),
  [fromToken, toToken, prices]
 );

 const rate = useMemo(() => {
  if (!hasPrices) return 0;
  if (fromToken === toToken) return 1;
  return prices[fromToken] / prices[toToken];
 }, [hasPrices, prices, fromToken, toToken]);

 const toAmount = useMemo(() => {
  if (!isFromValid || !hasPrices) return 0;
  return parsedFrom * rate;
 }, [isFromValid, hasPrices, parsedFrom, rate]);

 const fromBalance = balances[fromToken] ?? 0;
 const isOverBalance = isFromValid && parsedFrom > fromBalance;

 const usdValue = useMemo(() => {
  if (!isFromValid || !hasPrices) return 0;
  return parsedFrom * prices[fromToken];
 }, [isFromValid, hasPrices, parsedFrom, prices, fromToken]);

 const priceImpactPct = useMemo(() => {
  if (!usdValue) return 0;
  const balanceRatio = fromBalance > 0 ? parsedFrom / fromBalance : 0;
  const sizeFactor = Math.log10(usdValue + 1) / 10;
  return Math.min(15, balanceRatio * 6 + sizeFactor * 5);
 }, [usdValue, parsedFrom, fromBalance]);

 const selectFromToken = useCallback((sym: string) => setFromToken(sym), []);
 const selectToToken = useCallback((sym: string) => setToToken(sym), []);
 const updateFromAmount = useCallback((val: string) => setFromAmount(val), []);
 const markTouched = useCallback(() => setTouched(true), []);
 const resetAmount = useCallback(() => {
  setFromAmount("");
  setTouched(false);
 }, []);
 const flipTokens = useCallback(() => {
  setFromToken((prevFrom) => {
   setToToken(prevFrom);
   return toToken;
  });
 }, [toToken]);

 const setMax = useCallback(() => {
  if (!fromToken) return;
  setFromAmount(String(fromBalance));
  setTouched(true);
 }, [fromToken, fromBalance]);

 return {
  state: { fromToken, toToken, fromAmount, touched },
  derived: {
   parsedFrom,
   isFromValid,
   hasPrices,
   rate,
   toAmount,
   balances,
   fromBalance,
   isOverBalance,
   usdValue,
   priceImpactPct,
  },
  actions: {
   selectFromToken,
   selectToToken,
   updateFromAmount,
   flipTokens,
   markTouched,
   resetAmount,
   setMax,
  },
 };
}
