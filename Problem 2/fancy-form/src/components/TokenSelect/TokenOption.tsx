// src/components/TokenSelect/TokenOption.tsx
import { TokenIcon } from "@/components/TokenIcon";
import type { Token } from "@/types";

type Props = {
 token: Token;
 active: boolean;
 selected: boolean;
 onHover: () => void;
 onPick: () => void;
};

export function TokenOption({
 token,
 active,
 selected,
 onHover,
 onPick,
}: Props) {
 return (
  <li role='option' aria-selected={selected}>
   <button
    type='button'
    onMouseEnter={onHover}
    onClick={onPick}
    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-800 ${
     active ? "bg-slate-800/70" : ""
    }`}
   >
    <TokenIcon symbol={token.symbol} />
    <div className='flex-1'>
     <div className='font-medium'>{token.symbol}</div>
     <div className='text-xs text-slate-400'>${token.price.toFixed(6)}</div>
    </div>
   </button>
  </li>
 );
}
