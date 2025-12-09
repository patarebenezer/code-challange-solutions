// src/components/SwapForm/SwapFormPriceImpact.tsx
export function SwapFormPriceImpact({
 priceImpactPct,
}: {
 priceImpactPct: number;
}) {
 if (!priceImpactPct || priceImpactPct < 2) return null;

 return (
  <div className='mb-3 rounded-lg bg-amber-950/40 border border-amber-900 px-3 py-2 text-sm text-amber-100'>
   Price impact ~{priceImpactPct.toFixed(2)}%. Consider smaller size.
  </div>
 );
}
