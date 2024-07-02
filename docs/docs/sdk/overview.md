---
sidebar_position: 1
---

# SDK Overview

The Gopher SDK is a powerful tool designed to simplify interaction with multiple blockchain networks. It provides a unified interface for aggregating balances and optimizing cross-chain operations, making it easier to build decentralized applications (DApps).

## Key Features

- **Cross-Chain Balance Aggregation**: Consolidate balances from various blockchain networks.
- **Best Single-Hop Cross-Bridge Transactions**: Optimize transactions across different blockchains.
- **TypeScript Support**: Ensure type safety and a better development experience with TypeScript.

## Installation

To install the Gopher SDK, run the following command in your project directory:

```bash
npm install gopher-sdk
```

Or if you prefer using yarn:

```bash
yarn add gopher-sdk
```

## Basic Usage

Here's a quick example to get you started with the SDK:

### 1. Import the Gopher SDK

```typescript
import { Gopher } from 'gopher-sdk';
```

### 2. Initialize the Gopher SDK

To initialize the SDK, create a new instance of the `Gopher` class with an Ethereum provider:

```typescript
const gopher = new Gopher(window.ethereum);
```

### 3. Fetch User Balances

Once initialized, you can fetch the user's balances across multiple blockchains:

```typescript
gopher.getUserBalances().then(console.log);
```

### 4. Get Solution

Retrieve the optimal solution for managing cross-chain transactions:

```typescript
gopher.getSolution({
  token: "USDC",
  destinationChain: 42161,  // Destination chain ID
  amount: "1000000000"      // Amount in the smallest unit (e.g., wei)
}).then(console.log);
```

## Detailed Example

Here's a more detailed example that combines all the basic operations:

```typescript
import { Gopher } from 'gopher-sdk';

const gopher = new Gopher(window.ethereum);

// Fetch user balances
gopher.getUserBalances().then(balances => {
  console.log('User balances:', balances);

  // Get solution for transactions
  return gopher.getSolution({
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

## Next Steps

- **[Core Concepts](../get-started.md)**: Understand the fundamental concepts and operations of the Gopher SDK.
- **[Advanced Usage](advanced-usage.md)**: Explore advanced features and best practices.
- **[Class API Reference](class-reference.md)**: Get detailed information about the classes and methods provided by the SDK.
- **[API Reference](api-functions.md)**: Get detailed information about the classes and methods provided by the SDK.
