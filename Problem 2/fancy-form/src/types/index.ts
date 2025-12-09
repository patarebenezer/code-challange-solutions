// src/types/index.ts

export type PriceRow = {
 currency: string;
 date: string;
 price: number;
};

export type PricesMap = Record<string, number>;

export type Token = {
 symbol: string;
 price: number;
};

export type Toast = {
 id: string;
 type: "success" | "error" | "info";
 message: string;
};

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

export type TokenSelectProps = {
 tokens: Token[];
 value: string;
 onChange: (sym: string) => void;
 label: string;
};

export type TokenOptionProps = {
 token: Token;
 active: boolean;
 selected: boolean;
 onHover: () => void;
 onPick: () => void;
};

export type TokenSelectButtonProps = {
 label: string;
 value: string;
 open: boolean;
 onToggle: () => void;
 onKeyDown: (e: React.KeyboardEvent) => void;
};

export type TokenSelectDropdownProps = {
 label: string;
 value: string;
 q: string;
 filtered: Token[];
 activeIdx: number;
 inputRef: React.RefObject<HTMLInputElement | null>;
 onQueryChange: (v: string) => void;
 onKeyDown: (e: React.KeyboardEvent) => void;
 onHoverIdx: (idx: number) => void;
 onPick: (sym: string) => void;
};
