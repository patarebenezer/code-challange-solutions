import { getTokenIconPngUrl, getTokenIconSvgUrl } from "@/services/api";

export function TokenIcon({ symbol }: { symbol: string }) {
 if (!symbol) return <div className='h-6 w-6 rounded-full bg-slate-700' />;
 const svg = getTokenIconSvgUrl(symbol);
 const png = getTokenIconPngUrl(symbol);
 return (
  <img
   src={svg}
   alt={symbol}
   className='h-6 w-6 rounded-full bg-slate-700'
   onError={(e) => (e.currentTarget.src = png)}
  />
 );
}
