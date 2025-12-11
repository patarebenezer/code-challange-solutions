type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

interface WalletBalance {
 currency: string;
 amount: number;
 blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
 formatted: string;
}

interface PricesMap {
 [currency: string]: number;
}

interface Props extends BoxProps {}

const BLOCKCHAIN_PRIORITY: Record<Blockchain, number> = {
 Osmosis: 100,
 Ethereum: 50,
 Arbitrum: 30,
 Zilliqa: 20,
 Neo: 20,
};

const getPriority = (blockchain: Blockchain): number => {
 return BLOCKCHAIN_PRIORITY[blockchain] ?? -99;
};

const WalletPage = (props: Props) => {
 const { children, ...rest } = props;
 const balances = useWalletBalances() as WalletBalance[];
 const prices = usePrices() as PricesMap;

 const sortedBalances: FormattedWalletBalance[] = React.useMemo(() => {
  return balances
   .filter((balance) => {
    const priority = getPriority(balance.blockchain);
    return priority > -99 && balance.amount > 0;
   })
   .sort((a, b) => {
    return getPriority(b.blockchain) - getPriority(a.blockchain);
   })
   .map((balance) => ({
    ...balance,
    formatted: balance.amount.toFixed(2),
   }));
 }, [balances]);

 const rows = React.useMemo(
  () =>
   sortedBalances.map((balance) => {
    const price = prices[balance.currency] ?? 0;
    const usdValue = price * balance.amount;

    return (
     <WalletRow
      className={classes.row}
      key={balance.currency}
      amount={balance.amount}
      usdValue={usdValue}
      formattedAmount={balance.formatted}
     />
    );
   }),
  [sortedBalances, prices]
 );

 return (
  <div {...rest}>
   {rows}
   {children}
  </div>
 );
};

export default WalletPage;
