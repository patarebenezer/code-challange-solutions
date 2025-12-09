// src/components/SwapForm/SwapFormSlippageSelector.tsx
import { useMemo, useState } from "react";
import type { SlippageSelectorProps } from "@/types";

const SLIPPAGE_PRESETS = [0.1, 0.5, 1.5];

export function SwapFormSlippageSelector({
 value,
 onChange,
}: SlippageSelectorProps) {
 const [customSlip, setCustomSlip] = useState("");

 const isPresetActive = useMemo(
  () => SLIPPAGE_PRESETS.includes(value) && customSlip === "",
  [value, customSlip]
 );

 const onCustomBlur = () => {
  const n = Number(customSlip);
  if (Number.isFinite(n) && n >= 0 && n <= 50) onChange(n);
  else setCustomSlip("");
 };

 return (
  <div className='rounded-xl bg-slate-900 border border-slate-800 p-3'>
   <div className='text-sm text-slate-400 mb-2'>Slippage tolerance</div>

   <div className='flex gap-2 flex-wrap'>
    {SLIPPAGE_PRESETS.map((p) => (
     <button
      key={p}
      type='button'
      onClick={() => {
       onChange(p);
       setCustomSlip("");
      }}
      className={`px-3 py-1 rounded-lg border text-sm ${
       isPresetActive && value === p
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
      onBlur={onCustomBlur}
      placeholder='Custom'
      className='w-20 rounded-lg bg-slate-800 px-2 py-1 text-sm border border-slate-700 focus:border-slate-500 outline-none'
     />
     <span className='text-xs text-slate-400'>%</span>
    </div>
   </div>
  </div>
 );
}
