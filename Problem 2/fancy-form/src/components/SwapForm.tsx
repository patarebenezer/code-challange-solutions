import React, { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePrices } from "@/hooks/usePrices";
import { useToast } from "@/hooks/useToast";
import { useSwapCalculator } from "@/hooks/useSwapCalculator";
import { TokenSelect } from "@/components/TokenSelect";

const baseButton =
 "w-full rounded-2xl py-3 font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400/40";

const buttonClass = (enabled: boolean) =>
 baseButton +
 (enabled
  ? " bg-emerald-500 hover:bg-emerald-400 text-black"
  : " bg-slate-800 text-slate-500 cursor-not-allowed");

const SLIPPAGE_PRESETS = [0.1, 0.5, 1.5];

export function SwapForm() {
 const { tokens, prices, loading, error } = usePrices();
 const { state, derived, actions } = useSwapCalculator(tokens, prices);
 const toast = useToast();
 const [submitting, setSubmitting] = useState(false);

 const [slippagePct, setSlippagePct] = useState<number>(0.5);
 const [customSlip, setCustomSlip] = useState<string>("");

 const canSubmit = useMemo(
  () =>
   derived.isFromValid &&
   derived.hasPrices &&
   !derived.isOverBalance &&
   !loading &&
   !submitting,
  [
   derived.isFromValid,
   derived.hasPrices,
   derived.isOverBalance,
   loading,
   submitting,
  ]
 );

 const receiveText = useMemo(
  () =>
   derived.isFromValid && derived.hasPrices
    ? derived.toAmount.toFixed(6)
    : "0.000000",
  [derived.isFromValid, derived.hasPrices, derived.toAmount]
 );

 const minReceived = useMemo(() => {
  if (!derived.isFromValid || !derived.hasPrices) return 0;
  return derived.toAmount * (1 - slippagePct / 100);
 }, [derived.isFromValid, derived.hasPrices, derived.toAmount, slippagePct]);

 const handleAmountChange = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
   const raw = e.target.value.replace(/[, ]+/g, "");
   if (raw === "") return actions.updateFromAmount("");
   if (raw.startsWith("-")) return;
   if (!/^\d*\.?\d*$/.test(raw)) return;
   actions.updateFromAmount(raw);
  },
  [actions]
 );

 const handleSubmit = useCallback(
  async (e: React.FormEvent) => {
   e.preventDefault();
   actions.markTouched();

   if (!canSubmit) {
    if (derived.isOverBalance) toast.error("Insufficient balance.");
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
   derived.isOverBalance,
   derived.parsedFrom,
   derived.toAmount,
   state.fromToken,
   state.toToken,
   toast,
  ]
 );

 const onCustomSlipBlur = () => {
  const n = Number(customSlip);
  if (Number.isFinite(n) && n >= 0 && n <= 50) {
   setSlippagePct(n);
  } else {
   setCustomSlip("");
  }
 };

 return (
  <div className='w-full max-w-md relative'>
   {/* Toasts */}
   <div className='absolute -top-12 left-0 right-0 flex flex-col gap-2 z-50'>
    {toast.toasts.map((t) => (
     <motion.div
      key={t.id}
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      className={`rounded-xl px-3 py-2 text-sm border shadow-lg ${
       t.type === "success"
        ? "bg-emerald-950/70 border-emerald-800 text-emerald-100"
        : t.type === "error"
        ? "bg-red-950/70 border-red-800 text-red-100"
        : "bg-slate-900 border-slate-700 text-slate-100"
      }`}
     >
      {t.message}
     </motion.div>
    ))}
   </div>

   <form
    onSubmit={handleSubmit}
    className='w-full rounded-3xl bg-slate-950/70 border border-slate-800 p-5 shadow-2xl'
   >
    {error && (
     <div className='mb-3 rounded-lg bg-red-950/50 border border-red-900 px-3 py-2 text-sm text-red-200'>
      Failed to load prices: {error}
     </div>
    )}

    {!!derived.priceImpactPct && derived.priceImpactPct >= 2 && (
     <div className='mb-3 rounded-lg bg-amber-950/40 border border-amber-900 px-3 py-2 text-sm text-amber-100'>
      Price impact ~{derived.priceImpactPct.toFixed(2)}%. Consider smaller size.
     </div>
    )}

    <div className='space-y-3'>
     <TokenSelect
      tokens={tokens}
      value={state.fromToken}
      onChange={actions.selectFromToken}
      label='From'
     />

     <div>
      <div className='flex items-center justify-between mb-1'>
       <label htmlFor='fromAmount' className='block text-sm text-slate-300'>
        Amount
       </label>

       <div className='text-xs text-slate-400 flex items-center gap-2'>
        <span>
         Balance: {derived.fromBalance.toFixed(4)} {state.fromToken}
        </span>
        <button
         type='button'
         onClick={actions.setMax}
         className='px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200'
        >
         Max
        </button>
       </div>
      </div>

      <input
       id='fromAmount'
       inputMode='decimal'
       placeholder='0.0'
       className='w-full rounded-xl bg-slate-800 px-3 py-2 border border-slate-700 focus:border-slate-500 outline-none text-lg'
       value={state.fromAmount}
       onChange={handleAmountChange}
       onBlur={actions.markTouched}
       aria-invalid={
        (state.touched && !derived.isFromValid) || derived.isOverBalance
       }
      />

      {state.touched && !derived.isFromValid && (
       <p className='mt-1 text-xs text-red-300'>
        Enter a valid amount greater than 0
       </p>
      )}

      {derived.isOverBalance && (
       <p className='mt-1 text-xs text-red-300'>Insufficient balance</p>
      )}
     </div>

     <div className='flex justify-center'>
      <motion.button
       type='button'
       onClick={actions.flipTokens}
       whileTap={{ scale: 0.92, rotate: 10 }}
       className='rounded-full bg-slate-800 border border-slate-700 h-10 w-10 grid place-items-center hover:bg-slate-700 transition'
       aria-label='Flip tokens'
      >
       ⇅
      </motion.button>
     </div>

     <TokenSelect
      tokens={tokens}
      value={state.toToken}
      onChange={actions.selectToToken}
      label='To'
     />

     {/* Slippage controls */}
     <div className='rounded-xl bg-slate-900 border border-slate-800 p-3'>
      <div className='text-sm text-slate-400 mb-2'>Slippage tolerance</div>
      <div className='flex gap-2 flex-wrap'>
       {SLIPPAGE_PRESETS.map((p) => (
        <button
         key={p}
         type='button'
         onClick={() => {
          setSlippagePct(p);
          setCustomSlip("");
         }}
         className={`px-3 py-1 rounded-lg border text-sm ${
          slippagePct === p && customSlip === ""
           ? "bg-emerald-500/20 border-emerald-700 text-emerald-100"
           : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
         }`}
        >
         {p}%
        </button>
       ))}

       <div className='flex items-center gap-1'>
        <input
         value={customSlip}
         onChange={(e) => setCustomSlip(e.target.value)}
         onBlur={onCustomSlipBlur}
         placeholder='Custom'
         className='w-20 rounded-lg bg-slate-800 px-2 py-1 text-sm border border-slate-700 focus:border-slate-500 outline-none'
        />
        <span className='text-xs text-slate-400'>%</span>
       </div>
      </div>
     </div>

     {/* Receive + min received */}
     <section className='rounded-xl bg-slate-900 border border-slate-800 p-3'>
      <div className='text-sm text-slate-400'>You receive</div>

      <div className='text-2xl font-semibold'>
       {receiveText}{" "}
       <span className='text-slate-400 text-lg'>{state.toToken}</span>
      </div>

      {derived.hasPrices ? (
       <>
        <div className='text-xs text-slate-500 mt-1'>
         1 {state.fromToken} ≈ {derived.rate.toFixed(6)} {state.toToken}
        </div>
        <div className='text-xs text-slate-500 mt-1'>
         Minimum received (after {slippagePct}%):{" "}
         <span className='text-slate-200'>
          {minReceived.toFixed(6)} {state.toToken}
         </span>
        </div>
        {!!derived.usdValue && (
         <div className='text-xs text-slate-500 mt-1'>
          Order size: ~${derived.usdValue.toFixed(2)}
         </div>
        )}
       </>
      ) : (
       <div className='text-xs text-slate-500 mt-1'>
        Select tokens with prices
       </div>
      )}
     </section>

     <button
      disabled={!canSubmit}
      className={buttonClass(canSubmit) + " cursor-pointer mt-2"}
     >
      {submitting ? "Swapping…" : loading ? "Loading prices…" : "Swap"}
     </button>
    </div>
   </form>
  </div>
 );
}
