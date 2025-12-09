// src/components/SwapForm/SwapFormToast.tsx
import { motion, AnimatePresence } from "framer-motion";
import type { Toast } from "@/types";

export function SwapFormToast({ toasts }: { toasts: Toast[] }) {
 return (
  <div className='absolute -top-12 left-0 right-0 flex flex-col gap-2 z-50'>
   <AnimatePresence>
    {toasts.map((t) => (
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
   </AnimatePresence>
  </div>
 );
}
