// src/components/TokenSelect/TokenSelectButton.tsx
import { TokenIcon } from "@/components/TokenIcon";
import type { TokenSelectButtonProps } from "@/components/TokenSelect/types";

export function TokenSelectButton({
 label,
 value,
 open,
 onToggle,
 onKeyDown,
}: TokenSelectButtonProps) {
 return (
  <>
   <label className='block text-sm text-slate-300 mb-1'>{label}</label>

   <button
    type='button'
    onClick={onToggle}
    onKeyDown={onKeyDown}
    aria-haspopup='listbox'
    aria-expanded={open}
    className='w-full flex items-center justify-between rounded-xl bg-slate-800 px-3 py-2 border border-slate-700 hover:border-slate-500 transition'
   >
    <span className='flex items-center gap-2'>
     <TokenIcon symbol={value} />
     <span className='font-medium'>{value || "Select token"}</span>
    </span>
    <span className='text-slate-400'>▾</span>
   </button>
  </>
 );
}
