# Fancy Form — Token Swap UI (React + TypeScript + Vite)

A polished token swap interface built with **React**, **TypeScript**, and **Vite**.  
It fetches token prices from Switcheo, displays token icons, and provides a smooth, accessible swap experience inspired by real DEX widgets.

## Features

- **Token swap form**
  - Select “From” and “To” tokens
  - Input amount with validation
  - Flip tokens button
- **Live price + rate calculation**
  - Prices loaded from Switcheo endpoint
  - Exchange rate display
  - Safe handling of tokens without prices
- **UX polish**
  - Debounced calculations (no flicker while typing)
  - Slippage tolerance presets + custom value
  - Minimum received display
  - Mock price impact warning
  - Mock balances + **Max** button
- **Accessibility**
  - Native searchable token input using `<datalist>`
  - Keyboard friendly by default
- **UI & Animations**
  - Tailwind for styling
  - Framer Motion for subtle transitions
  - Toast notifications (no intrusive `alert`)

---

## Tech Stack

- **React 18 + TypeScript**
- **Vite** (fast dev server + HMR)
- **Tailwind CSS**
- **Framer Motion**
- **ESLint** (TypeScript-aware linting)
- **Path alias**: `@/` → `src/`

---

## Data Sources

- **Token icons repo**  
  Used in `TokenSelect` for icon preview.  
  `https://github.com/Switcheo/token-icons/tree/main/tokens`

- **Token prices JSON**  
  Used in `usePrices` to compute rates + USD values.  
  `https://interview.switcheo.com/prices.json`

---

## Project Structure (important files)

```
src/
  components/
    SwapForm.tsx          # main swap UI
    TokenSelect.tsx       # native datalist token picker + icon preview
  hooks/
    usePrices.ts          # fetch and normalize price map
    useSwapCalculator.ts  # swap math + balances + slippage + debounced calc
    useDebouncedValue.ts  # debounce helper
    useToast.ts           # lightweight toast system
  main.tsx
  index.css
```

---

## Setup

### 1) Install deps

```bash
npm install
```

### 2) Run dev server

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### 3) Build for production

```bash
npm run build
npm run preview
```

---

## Tailwind Setup

Tailwind is enabled via Vite.  
Styles live in:

- `src/index.css`
- component-level utility classes

If Tailwind isn’t working, ensure:

- `tailwind.config.js` includes:
  ```js
  content: ["./index.html", "./src/**/*.{ts,tsx}"];
  ```
- `src/index.css` contains:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

---

## Path Alias (`@/`)

The project supports clean imports like:

```ts
import { usePrices } from "@/hooks/usePrices";
import { SwapForm } from "@/components/SwapForm";
```

Ensure both TS and Vite know the alias:

### `tsconfig.app.json`

```json
{
 "compilerOptions": {
  "baseUrl": ".",
  "paths": { "@/*": ["src/*"] }
 }
}
```

### `vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
 plugins: [react()],
 resolve: {
  alias: {
   "@": path.resolve(__dirname, "src"),
  },
 },
});
```

---

## Notes on React Compiler

This project does **not require React Compiler**.  
If enabled, it may affect Vite dev/build speed.

If you don’t need it, remove the Babel compiler plugin and keep your Vite config simple.

---

## ESLint (recommended)

If you want stricter, type-aware linting (good for production), enable:

```js
// eslint.config.js
export default defineConfig([
 {
  files: ["**/*.{ts,tsx}"],
  extends: [
   tseslint.configs.recommendedTypeChecked,
   tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
   parserOptions: {
    project: ["./tsconfig.node.json", "./tsconfig.app.json"],
    tsconfigRootDir: import.meta.dirname,
   },
  },
 },
]);
```

---

## What to improve next

If extending this into a real app:

- Replace mock balances with real wallet balances
- Add error boundaries + retry for network fetch
- Add price impact from actual liquidity data
- Virtualize token list if it becomes large
- Persist “From/To token” choices in localStorage
