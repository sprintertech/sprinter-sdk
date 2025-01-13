---
id: using-hooks
title: Using React SDK Hooks
sidebar_position: 3
---

# Using React SDK Hooks

The Sprinter React SDK provides a set of hooks to simplify access to the core Sprinter SDK's functionality. These hooks allow you to easily retrieve and manage user balances, tokens, chains, and transfer solutions directly within your React components.

Each hook returns stateful data (`data`, `loading`, `error`) along with functions to interact with Sprinter’s Intent Engine.

## Available Hooks

### 1. `useSprinter`

Access all of the context provided by `SprinterContext`. It allows you to get access to balances, chains, tokens, and solutions across your app.

```tsx
import { useSprinter } from "@chainsafe/sprinter-react";

function YourComponent() {
  const {
    balances,
    tokens,
    chains,
    solution,
    getUserBalances,
    getAvailableTokens,
    getAvailableChains,
    getSweep,
    getTransfer,
    getTransferWithHook,
    getPoolAssetOnDestination,
    getPoolAssetOnDestinationWithHook,
  } = useSprinter();

  // You now have access to the full Sprinter context!
}
```

### 2. `useSprinterTokens`

Fetch the list of available tokens supported by Sprinter across various chains.

```tsx
import { useSprinterTokens } from "@chainsafe/sprinter-react";

function TokenList() {
  const { tokens, getAvailableTokens } = useSprinterTokens();

  useEffect(() => {
    getAvailableTokens(); // Fetch tokens on component mount
  }, []);

  if (tokens.loading) return <div>Loading tokens...</div>;
  if (tokens.error) return <div>Error: {tokens.error}</div>;

  return (
    <ul>{tokens.data && tokens.data.map((token) => <li key={token.symbol}>{token.name}</li>)}</ul>
  );
}
```

### 3. `useSprinterChains`

This hook retrieves the supported blockchain networks.

```tsx
import { useSprinterChains } from "@chainsafe/sprinter-react";

function ChainList() {
  const { chains, getAvailableChains } = useSprinterChains();

  useEffect(() => {
    getAvailableChains(); // Fetch chains on component mount
  }, []);

  if (chains.loading) return <div>Loading chains...</div>;
  if (chains.error) return <div>Error fetching chains: {chains.error}</div>;

  return (
    <ul>{chains.data && chains.data.map((chain) => <li key={chain.chainID}>{chain.name}</li>)}</ul>
  );
}
```

### 4. `useSprinterBalances`

This hook allows you to fetch user balances across multiple blockchains.

```tsx
import { useSprinterBalances } from "@chainsafe/sprinter-react";

function BalanceComponent({ account }) {
  const { balances, getUserBalances } = useSprinterBalances(account);

  useEffect(() => {
    getUserBalances(); // Fetch balances when the component mounts
  }, [account]);

  if (balances.loading) return <div>Loading balances...</div>;
  if (balances.error) return <div>Error fetching balances: {balances.error}</div>;

  return (
    <ul>
      {balances.data &&
        balances.data.map((balance) => (
          <li key={balance.symbol}>
            {balance.symbol}: {balance.amount}
          </li>
        ))}
    </ul>
  );
}
```

### 5. `useSprinterTransfers`

Generate cross-chain transfer and contract call solutions.

```tsx
import { useSprinterTransfers } from "@chainsafe/sprinter-react";

function TransferSolution() {
  const { getPoolAssetOnDestination, solution } = useSprinterTransfers();

  useEffect(() => {
    const settings = {
      account: "0xYourAddressHere",
      destinationChain: 11155111, // Sepolia testnet
      token: "USDC",
      amount: 1000000, // 1 USDC in smallest denomination
      sourceChains: [84532, 1993], // Optional: source chains to consider
    };

    getPoolAssetOnDestination(settings);
  }, []);

  if (solution.loading) return <div>Loading transfer solution...</div>;
  if (solution.error) return <div>Error: {solution.error}</div>;

  return <div>Transfer Solution: {JSON.stringify(solution.data)}</div>;
}
```

---

## Summary

The Sprinter React SDK hooks provide an easy way to interact with cross-chain balances, tokens, chains, and transfer solutions. These hooks manage state for you (`loading`, `error`, and `data`) and allow you to integrate Sprinter functionality seamlessly into your React components.
