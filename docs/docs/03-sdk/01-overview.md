---
sidebar_position: 1
---

# SDK Overview

The Sprinter SDK is a powerful tool designed to simplify interaction with multiple blockchain networks. It provides a unified interface for aggregating balances and optimizing cross-chain operations, making it easier to build decentralized applications (DApps).

## Key Features

- **Cross-Chain Balance Aggregation**: Consolidate balances from various blockchain networks.
- **Best Single-Hop Cross-Bridge Transactions**: Optimize transactions across different blockchains.
- **TypeScript Support**: Ensure type safety and a better development experience with TypeScript.

## Installation

To install the Sprinter SDK, run the following command in your project directory:

```bash
npm install @chainsafe/sprinter-sdk
```

Or if you prefer using yarn:

```bash
yarn add @chainsafe/sprinter-sdk
```

## Basic Usage

Here's a quick example to get you started with the SDK:

### 1. Import the Sprinter SDK

```typescript
import { Sprinter } from '@chainsafe/sprinter-sdk';
```

### 2. Initialize the Sprinter SDK

To initialize the SDK, create a new instance of the `Sprinter` class with an Ethereum provider:

```typescript
const sprinter = new Sprinter(window.ethereum);
```

### 3. Fetch User Balances

Once initialized, you can fetch the user's balances across multiple blockchains:

```typescript
sprinter.getUserBalances().then(console.log);
```

### 4. Get Solution

Retrieve the optimal solution for managing cross-chain transactions:

```typescript
sprinter.getSolution({
  token: "USDC",
  destinationChain: 42161,  // Destination chain ID
  amount: "1000000000"      // Amount in the smallest unit (e.g., wei)
}).then(console.log);
```

## Detailed Example

Here's a more detailed example that combines all the basic operations:

```typescript
import { Sprinter } from '@chainsafe/sprinter-sdk';

const sprinter = new Sprinter(window.ethereum);

// Fetch user balances
sprinter.getUserBalances().then(balances => {
  console.log('User balances:', balances);

  // Get solution for transactions
  return sprinter.getSolution({
    token: "USDC",
    destinationChain: 42161,  // Destination chain ID
    amount: "1000000000"      // Amount in the smallest unit (e.g., wei)
  });
}).then(solution => {
  console.log('Transaction solution:', solution);

  // Execute the transaction (handled by DApp)
  const bestOption = solution[0];
  executeTransaction(bestOption);
}).catch(error => {
  console.error('An error occurred:', error);
});
```