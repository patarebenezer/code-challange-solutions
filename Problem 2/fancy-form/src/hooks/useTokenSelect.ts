// src/components/TokenSelect/useTokenSelect.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Token } from "@/types";

export function useTokenSelect(
 tokens: Token[],
 onChange: (sym: string) => void
) {
 const [open, setOpen] = useState(false);
 const [q, setQ] = useState("");
 const [activeIdx, setActiveIdx] = useState(0);

 const boxRef = useRef<HTMLDivElement>(null);
 const inputRef = useRef<HTMLInputElement>(null);

 const filtered = useMemo(() => {
  const s = q.trim().toLowerCase();
  return s ? tokens.filter((t) => t.symbol.toLowerCase().includes(s)) : tokens;
 }, [q, tokens]);

 const close = useCallback(() => setOpen(false), []);
 const openAndFocus = useCallback(() => {
  setOpen(true);
  queueMicrotask(() => inputRef.current?.focus());
 }, []);

 const choose = useCallback(
  (sym: string) => {
   onChange(sym);
   close();
   setQ("");
  },
  [onChange, close]
 );

 useEffect(() => {
  if (open) setActiveIdx(0);
 }, [open, q]);

 useEffect(() => {
  if (!open) return;
  const onDocClick = (e: MouseEvent) =>
   !boxRef.current?.contains(e.target as Node) && close();
  document.addEventListener("mousedown", onDocClick);
  return () => document.removeEventListener("mousedown", onDocClick);
 }, [open, close]);

 const onKeyDown = useCallback(
  (e: React.KeyboardEvent) => {
   if (!open) {
    if (e.key === "Enter" || e.key === " ") {
     e.preventDefault();
     openAndFocus();
    }
    return;
   }

   switch (e.key) {
    case "Escape":
     e.preventDefault();
     close();
     break;
    case "ArrowDown":
     e.preventDefault();
     setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
     break;
    case "ArrowUp":
     e.preventDefault();
     setActiveIdx((i) => Math.max(i - 1, 0));
     break;
    case "Enter": {
     e.preventDefault();
     const picked = filtered[activeIdx];
     if (picked) choose(picked.symbol);
     break;
    }
   }
  },
  [open, openAndFocus, close, filtered, activeIdx, choose]
 );

 return {
  state: { open, q, activeIdx },
  refs: { boxRef, inputRef },
  derived: { filtered },
  actions: {
   setOpen,
   setQ,
   setActiveIdx,
   close,
   openAndFocus,
   choose,
   onKeyDown,
  },
 };
}
