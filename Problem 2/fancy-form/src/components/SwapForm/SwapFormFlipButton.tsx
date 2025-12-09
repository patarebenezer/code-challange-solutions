// src/components/SwapForm/SwapFormFlipButton.tsx
import { motion } from "framer-motion";

export function SwapFormFlipButton({ onFlip }: { onFlip: () => void }) {
 return (
  <div className='flex justify-center'>
   <motion.button
    type='button'
    onClick={onFlip}
    whileTap={{ scale: 0.92, rotate: 10 }}
    className='rounded-full bg-slate-800 border border-slate-700 h-10 w-10 grid place-items-center hover:bg-slate-700 transition'
    aria-label='Flip tokens'
   >
    ⇅
   </motion.button>
  </div>
 );
}
