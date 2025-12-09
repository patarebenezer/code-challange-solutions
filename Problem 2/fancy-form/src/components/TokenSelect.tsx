import React, {
 useMemo,
 useRef,
 useState,
 useEffect,
 useCallback,
} from "react";

type Token = { symbol: string; price: number };

export function TokenSelect({
 tokens,
 value,
 onChange,
 label,
}: {
 tokens: Token[];
 value: string;
 onChange: (sym: string) => void;
 label: string;
}) {
 const [open, setOpen] = useState(false);
 const [q, setQ] = useState("");
 const [activeIdx, setActiveIdx] = useState(0);
 const boxRef = useRef<HTMLDivElement>(null);
 const inputRef = useRef<HTMLInputElement>(null);

 const filtered = useMemo(() => {
  const s = q.trim().toLowerCase();
  return s ? tokens.filter((t) => t.symbol.toLowerCase().includes(s)) : tokens;
 }, [q, tokens]);

 useEffect(() => {
  setActiveIdx(0);
 }, [open, q]);

 useEffect(() => {
  if (!open) return;
  const onDocClick = (e: MouseEvent) => {
   if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
  };
  document.addEventListener("mousedown", onDocClick);
  return () => document.removeEventListener("mousedown", onDocClick);
 }, [open]);

 const choose = useCallback(
  (sym: string) => {
   onChange(sym);
   setOpen(false);
   setQ("");
  },
  [onChange]
 );

 const onKeyDown = (e: React.KeyboardEvent) => {
  if (!open) {
   if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    setOpen(true);
    queueMicrotask(() => inputRef.current?.focus());
   }
   return;
  }

  if (e.key === "Escape") {
   e.preventDefault();
   setOpen(false);
   return;
  }

  if (e.key === "ArrowDown") {
   e.preventDefault();
   setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
   return;
  }

  if (e.key === "ArrowUp") {
   e.preventDefault();
   setActiveIdx((i) => Math.max(i - 1, 0));
   return;
  }

  if (e.key === "Enter") {
   e.preventDefault();
   const picked = filtered[activeIdx];
   if (picked) choose(picked.symbol);
  }
 };

 return (
  <div className='relative' ref={boxRef}>
   <label className='block text-sm text-slate-300 mb-1'>{label}</label>

   <button
    type='button'
    onClick={() => {
     setOpen((o) => !o);
     if (!open) queueMicrotask(() => inputRef.current?.focus());
    }}
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

   {open && (
    <div className='absolute z-20 mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 shadow-xl overflow-hidden'>
     <div className='p-2'>
      <input
       ref={inputRef}
       autoFocus
       value={q}
       onChange={(e) => setQ(e.target.value)}
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
      {filtered.map((t, idx) => {
       const active = idx === activeIdx;
       return (
        <li key={t.symbol} role='option' aria-selected={t.symbol === value}>
         <button
          type='button'
          onMouseEnter={() => setActiveIdx(idx)}
          onClick={() => choose(t.symbol)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-800
                      ${active ? "bg-slate-800/70" : ""}`}
         >
          <TokenIcon symbol={t.symbol} />
          <div className='flex-1'>
           <div className='font-medium'>{t.symbol}</div>
           <div className='text-xs text-slate-400'>${t.price.toFixed(6)}</div>
          </div>
         </button>
        </li>
       );
      })}

      {filtered.length === 0 && (
       <li className='px-3 py-3 text-sm text-slate-400'>No matches</li>
      )}
     </ul>
    </div>
   )}
  </div>
 );
}

function TokenIcon({ symbol }: { symbol: string }) {
 if (!symbol) return <div className='h-6 w-6 rounded-full bg-slate-700' />;
 const svg = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.svg`;
 const png = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.png`;
 return (
  <img
   src={svg}
   alt={symbol}
   className='h-6 w-6 rounded-full bg-slate-700'
   onError={(e) => (e.currentTarget.src = png)}
  />
 );
}
