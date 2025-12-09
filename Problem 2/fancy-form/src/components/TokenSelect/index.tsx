// src/components/TokenSelect/TokenSelect.tsx
import { useTokenSelect } from "@/hooks/useTokenSelect";
import { TokenSelectButton } from "@/components/TokenSelect/TokenSelectButton";
import { TokenSelectDropdown } from "@/components/TokenSelect/TokenSelectDropdown";
import type { Token } from "@/types";

type Props = {
 tokens: Token[];
 value: string;
 onChange: (sym: string) => void;
 label: string;
};

export function TokenSelect({ tokens, value, onChange, label }: Props) {
 const {
  state: { open, q, activeIdx },
  refs: { boxRef, inputRef },
  derived: { filtered },
  actions: { setQ, setActiveIdx, close, openAndFocus, choose, onKeyDown },
 } = useTokenSelect(tokens, onChange);

 return (
  <div ref={boxRef} className='relative'>
   <TokenSelectButton
    label={label}
    value={value}
    open={open}
    onToggle={() => (open ? close() : openAndFocus())}
    onKeyDown={onKeyDown}
   />

   {open && (
    <TokenSelectDropdown
     label={label}
     value={value}
     q={q}
     filtered={filtered}
     activeIdx={activeIdx}
     inputRef={inputRef}
     onQueryChange={setQ}
     onKeyDown={onKeyDown}
     onHoverIdx={setActiveIdx}
     onPick={choose}
    />
   )}
  </div>
 );
}
