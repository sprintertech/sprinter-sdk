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

To initialize the SDK, create a new instance of the `Sprinter` class:

```typescript
const sprinter = new Sprinter();
```

### 3. Fetch User Balances

Once initialized, you can fetch the user's balances across multiple blockchains:

```typescript
const ownerAddress = "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519";
sprinter.getUserBalances(ownerAddress).then(console.log);
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

const sprinter = new Sprinter();

const ownerAddress = "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519";

// Fetch user balances
sprinter.getUserBalances(ownerAddress).then(balances => {
  console.log('User balances:', balances);

  // Get solution for transactions
  return sprinter.getSolution({
    account: ownerAddress,
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