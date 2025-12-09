// Fixed code

interface WalletBalance {
 currency: string;
 amount: number;
 blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
 formatted: string;
 priority: number;
}

interface Props extends BoxProps {}

const PRIORITY: Record<string, number> = {
 Osmosis: 100,
 Ethereum: 50,
 Arbitrum: 30,
 Zilliqa: 20,
 Neo: 20,
};

const getPriority = (blockchain: string): number => PRIORITY[blockchain] ?? -99;

export const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
 const balances = useWalletBalances();
 const prices = usePrices();

 const formattedBalances = useMemo<FormattedWalletBalance[]>(() => {
  return balances
   .map((b: WalletBalance) => ({
    ...b,
    priority: getPriority(b.blockchain),
    formatted: b.amount.toFixed(),
   }))
   .filter((b) => b.priority > -99 && b.amount > 0)
   .sort((a, b) => b.priority - a.priority);
 }, [balances]);

 const rows = useMemo(
  () =>
   formattedBalances.map((b) => {
    const price = prices[b.currency] ?? 0;
    const usdValue = price * b.amount;

    return (
     <WalletRow
      className={classes.row}
      key={`${b.blockchain}:${b.currency}`}
      amount={b.amount}
      usdValue={usdValue}
      formattedAmount={b.formatted}
     />
    );
   }),
  [formattedBalances, prices]
 );

 return (
  <div {...rest}>
   {rows}
   {children}
  </div>
 );
};

export default WalletPage;
