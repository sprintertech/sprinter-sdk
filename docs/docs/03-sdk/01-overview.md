---
sidebar_position: 1
---

# SDK Overview

The Sprinter SDK simplifies interactions with multiple blockchain networks. It provides a unified interface for aggregating balances and optimizing cross-chain operations, making it easier to build decentralized applications (dApps).

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

:::info
If you would like to test this without custom front-end code, you can directly do so by adding `vite` as a package. You will then need to create an `index.html` file to serve as the entry way for the following script using `<script>` tag. 
:::

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

// Mock function to represent transaction execution
function executeTransaction(option) {
  console.log('Executing transaction with option:', option);
}
```