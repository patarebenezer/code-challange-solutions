# Code Challenge Submission 

---

## Contents
Contents

### Problem 1 — Three Ways to Sum to n

***Implemented 3 unique JavaScript versions of sum_to_n(n).***

***Approaches***
	1.	Math formula (O(1))
Uses arithmetic series formula: n * (n + 1) / 2.
	2.	Iterative loop (O(n))
Standard for-loop summation from 1 to n.
	3.	Recursive (O(n))
Tail-recursive helper to accumulate sum.

Assumption
	•	If n <= 0, return 0.
(Since summation “to n” typically implies 1 + ... + n for positive integers.)

File
	•	problem1/sum-to-n.js (or wherever you placed it)


### Problem 2 — Fancy Form (Token Swap UI)
A React + TypeScript swap widget inspired by real DEX interfaces.

**Highlights**
- Token selection with search + icons
- Fetching live prices from Switcheo endpoint
- Exchange rate + “You receive” calculation
- Flip tokens action
- Validation: numeric only, >0, insufficient balance checks
- Slippage tolerance presets + custom value
- Minimum received calculation
- Price impact warning (mocked heuristic)
- Mock balances + “Max” input
- Toast notifications with Framer Motion
- Clean architecture with hooks + small UI components

**Key files**
```
src/
  components/
    SwapForm/
      index.tsx
      SwapFormToast.tsx
      SwapFormAmountInput.tsx
      SwapFormSlippageSelector.tsx
      SwapFormReceivePanel.tsx
      SwapFormPriceImpact.tsx
      SwapFormFlipButton.tsx
    TokenSelect/
      index.tsx
      TokenSelectButton.tsx
      TokenSelectDropdown.tsx
      TokenOption.tsx
    TokenIcon.tsx
  hooks/
    usePrices.ts
    useSwapCalculator.ts
    useDebouncedValue.ts
    useToast.ts
    useTokenSelect.ts
  services/
    api.ts
  types/
    index.ts
```

**Data sources**
- Token prices: `https://interview.switcheo.com/prices.json`
- Token icons: `https://github.com/Switcheo/token-icons/tree/main/tokens`

---

### Problem 3 — Code Review + Refactor
I listed computational inefficiencies and anti-patterns, then provided a corrected version.

**Deliverables**
- `code_review.txt`
- `after.tsx`
- `before.tsx`

The review includes:
- Missing/mismatched types
- Broken filtering logic + undefined variable
- Wrong memo dependencies
- Redundant mapping
- Incorrect sorting comparator
- Index as key anti-pattern
- Priority recomputation inefficiency
- Nullable price safety
- Component hygiene improvements

---

## Setup & Run

### Install
```bash
pnpm install
```

### Dev server
```bash
pnpm run dev
```

### Build & Preview
```bash
pnpm run build
pnpm run preview
```

---

## Notes / Assumptions
- Tokens without prices are omitted automatically from selection.
- Balances and price impact are mocked because liquidity + wallet data were not provided.
- UI prioritizes accessibility and keyboard friendliness where possible.
- I used the path alias `@/` for clean imports.

---

## Thank you
Thanks for reviewing my submission — happy to walk through any part of the implementation or tradeoffs.
