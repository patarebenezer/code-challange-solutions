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
