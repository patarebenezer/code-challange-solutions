// src/components/SwapForm/SwapForm.tsx
import React, { useCallback, useMemo, useState } from "react";
import { usePrices } from "@/hooks/usePrices";
import { useToast } from "@/hooks/useToast";
import { useSwapCalculator } from "@/hooks/useSwapCalculator";
import { TokenSelect } from "@/components/TokenSelect";
import { SwapFormToast } from "@/components/SwapForm/SwapFormToast";
import { SwapFormPriceImpact } from "@/components/SwapForm/SwapFormPriceImpact";
import { SwapFormAmountInput } from "@/components/SwapForm/SwapFormAmountInput";
import { SwapFormFlipButton } from "@/components/SwapForm/SwapFormFlipButton";
import { SwapFormSlippageSelector } from "@/components/SwapForm/SwapFormSlippageSelector";
import { SwapFormReceivePanel } from "@/components/SwapForm/SwapFormReceivePanel";

const baseButton =
 "w-full rounded-2xl py-3 font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400/40";

const buttonClass = (enabled: boolean) =>
 baseButton +
 (enabled
  ? " bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer"
  : " bg-slate-800 text-slate-500 cursor-not-allowed");

export function SwapForm() {
 const { tokens, prices, loading, error } = usePrices();
 const { state, derived, actions } = useSwapCalculator(tokens, prices);
 const toast = useToast();

 const [submitting, setSubmitting] = useState(false);
 const [slippagePct, setSlippagePct] = useState<number>(0.5);

 const tokensWithBalance = useMemo(
  () =>
   tokens.map((t) => ({
    ...t,
    balance: derived.balances?.[t.symbol] ?? 0,
   })),
  [tokens, derived.balances]
 );

 const ownedTokens = useMemo(
  () => tokensWithBalance.filter((t) => t.balance > 0),
  [tokensWithBalance]
 );

 const fromTokens = ownedTokens.length ? ownedTokens : tokensWithBalance;

 const notOwnedTokens = useMemo(
  () => tokensWithBalance.filter((t) => t.balance <= 0),
  [tokensWithBalance]
 );

 const toTokens = notOwnedTokens.length ? notOwnedTokens : tokensWithBalance;

 const isSameToken =
  !!state.fromToken && !!state.toToken && state.fromToken === state.toToken;

 const canSubmit = useMemo(
  () =>
   derived.isFromValid &&
   derived.hasPrices &&
   !derived.isOverBalance &&
   !isSameToken &&
   !loading &&
   !submitting,
  [
   derived.isFromValid,
   derived.hasPrices,
   derived.isOverBalance,
   isSameToken,
   loading,
   submitting,
  ]
 );

 const handleAmountChange = useCallback(
  (rawValue: string) => actions.updateFromAmount(rawValue),
  [actions]
 );

 const handleSubmit = useCallback(
  async (e: React.FormEvent) => {
   e.preventDefault();
   actions.markTouched();

   if (!canSubmit) {
    if (isSameToken) {
     toast.error("Cannot swap the same token. Please choose different tokens.");
    } else if (derived.isOverBalance) {
     toast.error("Insufficient balance.");
    }
    return;
   }

   setSubmitting(true);
   try {
    await new Promise((r) => setTimeout(r, 1200));
    toast.success(
     `Swapped ${derived.parsedFrom} ${
      state.fromToken
     } → ${derived.toAmount.toFixed(6)} ${state.toToken}`
    );
    actions.resetAmount();
   } finally {
    setSubmitting(false);
   }
  },
  [
   canSubmit,
   actions,
   isSameToken,
   derived.isOverBalance,
   derived.parsedFrom,
   derived.toAmount,
   state.fromToken,
   state.toToken,
   toast,
  ]
 );

 return (
  <div className='w-full max-w-md relative'>
   <SwapFormToast toasts={toast.toasts} />

   <form
    onSubmit={handleSubmit}
    className='w-full rounded-3xl bg-slate-950/70 border border-slate-800 p-5 shadow-2xl'
   >
    {error && (
     <div className='mb-3 rounded-lg bg-red-950/50 border border-red-900 px-3 py-2 text-sm text-red-200'>
      Failed to load prices: {error}
     </div>
    )}

    <SwapFormPriceImpact priceImpactPct={derived.priceImpactPct} />

    <div className='space-y-3'>
     <TokenSelect
      tokens={fromTokens}
      value={state.fromToken}
      onChange={actions.selectFromToken}
      label='From'
     />

     <SwapFormAmountInput
      value={state.fromAmount}
      token={state.fromToken}
      balance={derived.fromBalance}
      touched={state.touched}
      isValid={derived.isFromValid}
      isOverBalance={derived.isOverBalance}
      onChange={handleAmountChange}
      onBlur={actions.markTouched}
      onMax={actions.setMax}
     />

     <SwapFormFlipButton onFlip={actions.flipTokens} />

     <TokenSelect
      tokens={toTokens}
      value={state.toToken}
      onChange={actions.selectToToken}
      label='To'
     />

     {isSameToken && state.fromToken && (
      <p className='text-xs text-amber-300'>
       Please select a different token to swap into.
      </p>
     )}

     <SwapFormSlippageSelector value={slippagePct} onChange={setSlippagePct} />

     <SwapFormReceivePanel
      fromToken={state.fromToken}
      toToken={state.toToken}
      hasPrices={derived.hasPrices}
      isFromValid={derived.isFromValid}
      rate={derived.rate}
      toAmount={derived.toAmount}
      slippagePct={slippagePct}
      usdValue={derived.usdValue}
     />

     <button disabled={!canSubmit} className={buttonClass(canSubmit) + " mt-2"}>
      {submitting ? "Swapping…" : loading ? "Loading prices…" : "Swap"}
     </button>
    </div>
   </form>
  </div>
 );
}
