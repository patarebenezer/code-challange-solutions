// src/components/TokenSelect/TokenSelectDropdown.tsx
import { TokenOption } from "@/components/TokenSelect/TokenOption";
import type { TokenSelectDropdownProps } from "@/components/TokenSelect/types";

export function TokenSelectDropdown({
 label,
 value,
 q,
 filtered,
 activeIdx,
 inputRef,
 onQueryChange,
 onKeyDown,
 onHoverIdx,
 onPick,
}: TokenSelectDropdownProps) {
 return (
  <div className='absolute z-20 mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 shadow-xl overflow-hidden'>
   <div className='p-2'>
    <input
     ref={inputRef}
     autoFocus
     value={q}
     onChange={(e) => onQueryChange(e.target.value)}
     onKeyDown={onKeyDown}
     placeholder='Search token…'
     className='w-full rounded-lg bg-slate-800 px-3 py-2 text-sm outline-none border border-slate-700 focus:border-slate-500'
    />
   </div>

   <ul
    role='listbox'
    aria-label={`${label} token list`}
    className='max-h-64 overflow-auto'
   >
    {filtered.length === 0 && (
     <li className='px-3 py-3 text-sm text-slate-400'>No matches</li>
    )}

    {filtered.map((t, idx) => (
     <TokenOption
      key={t.symbol}
      token={t}
      active={idx === activeIdx}
      selected={t.symbol === value}
      onHover={() => onHoverIdx(idx)}
      onPick={() => onPick(t.symbol)}
     />
    ))}
   </ul>
  </div>
 );
}
