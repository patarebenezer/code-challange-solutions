// src/components/SwapForm/SwapFormAmountInput.tsx
import type { AmountInputProps } from "@/types";
import React, { useCallback } from "react";

export function SwapFormAmountInput({
 value,
 token,
 balance,
 touched,
 isValid,
 isOverBalance,
 onChange,
 onBlur,
 onMax,
}: AmountInputProps) {
 const handleChange = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
   const raw = e.target.value.replace(/[, ]+/g, "");
   if (raw === "") return onChange("");
   if (raw.startsWith("-")) return;
   if (!/^\d*\.?\d*$/.test(raw)) return;
   onChange(raw);
  },
  [onChange]
 );

 return (
  <div>
   <div className='flex items-center justify-between mb-1'>
    <label htmlFor='fromAmount' className='block text-sm text-slate-300'>
     Amount
    </label>

    <div className='text-xs text-slate-400 flex items-center gap-2'>
     <span>
      Balance: {balance.toFixed(4)} {token}
     </span>
     <button
      type='button'
      onClick={onMax}
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
    value={value}
    onChange={handleChange}
    onBlur={onBlur}
    aria-invalid={(touched && !isValid) || isOverBalance}
   />

   {touched && !isValid && (
    <p className='mt-1 text-xs text-red-300'>
     Enter a valid amount greater than 0
    </p>
   )}

   {isOverBalance && (
    <p className='mt-1 text-xs text-red-300'>Insufficient balance</p>
   )}
  </div>
 );
}
