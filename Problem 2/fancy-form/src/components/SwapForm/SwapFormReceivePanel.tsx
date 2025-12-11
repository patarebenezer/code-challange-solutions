// src/components/SwapForm/SwapFormReceivePanel.tsx
import { useMemo } from "react";
import type { ReceivePanelProps } from "@/components/SwapForm/types";

export function SwapFormReceivePanel({
 fromToken,
 toToken,
 hasPrices,
 isFromValid,
 rate,
 toAmount,
 slippagePct,
 usdValue,
}: ReceivePanelProps) {
 const receiveText = useMemo(
  () => (isFromValid && hasPrices ? toAmount.toFixed(6) : "0.000000"),
  [isFromValid, hasPrices, toAmount]
 );

 const minReceived = useMemo(() => {
  if (!isFromValid || !hasPrices) return 0;
  return toAmount * (1 - slippagePct / 100);
 }, [isFromValid, hasPrices, toAmount, slippagePct]);

 return (
  <section className='rounded-xl bg-slate-900 border border-slate-800 p-3'>
   <div className='text-sm text-slate-400'>You receive</div>

   <div className='text-2xl font-semibold break-all'>
    {receiveText} <span className='text-slate-400 text-lg'>{toToken}</span>
   </div>

   {hasPrices ? (
    <>
     <div className='text-xs text-slate-500 mt-1'>
      1 {fromToken} ≈ {rate.toFixed(6)} {toToken}
     </div>

     <div className='text-xs text-slate-500 mt-1'>
      Minimum received (after {slippagePct}%):{" "}
      <span className='text-slate-200'>
       {minReceived.toFixed(6)} {toToken}
      </span>
     </div>

     {!!usdValue && (
      <div className='text-xs text-slate-500 mt-1 break-all'>
       Order size: ~${usdValue.toFixed(2)}
      </div>
     )}
    </>
   ) : (
    <div className='text-xs text-slate-500 mt-1'>Select tokens with prices</div>
   )}
  </section>
 );
}
