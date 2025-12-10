import type { Token } from "@/types";

export type TokenSelectProps = {
 tokens: Token[];
 value: string;
 onChange: (sym: string) => void;
 label: string;
};

export type TokenSelectButtonProps = {
 label: string;
 value: string;
 open: boolean;
 onToggle: () => void;
 onKeyDown: (e: React.KeyboardEvent) => void;
};

export type TokenOptionProps = {
 token: Token;
 active: boolean;
 selected: boolean;
 onHover: () => void;
 onPick: () => void;
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
