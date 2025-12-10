export type AmountInputProps = {
 value: string;
 token: string;
 balance: number;
 touched: boolean;
 isValid: boolean;
 isOverBalance: boolean;
 onChange: (raw: string) => void;
 onBlur: () => void;
 onMax: () => void;
};

export type ReceivePanelProps = {
 fromToken: string;
 toToken: string;
 hasPrices: boolean;
 isFromValid: boolean;
 rate: number;
 toAmount: number;
 slippagePct: number;
 usdValue: number;
};

export type SlippageSelectorProps = {
 value: number;
 onChange: (n: number) => void;
};
