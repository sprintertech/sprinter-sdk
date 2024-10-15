---
id: quickstart
title: Quick Start
sidebar_position: 2
---

## Quick Examples

Jump to the section that fits your development needs:

- [Using the SDK](#using-the-sdk)
- [Using the React SDK](#using-the-react-sdk)
- [Calling API Endpoints Directly](#calling-api-endpoints-directly)

You have three main options for interacting with Sprinter, depending on your development environment and the level of control you need:

- **Using the SDK**: Ideal for developers working in TypeScript or modern JavaScript frameworks. The SDK provides a simple, unified interface for retrieving intent-based solutions from Sprinter, helping developers easily determine the actions or transactions users should execute on the blockchain.

- **Using the React SDK**: Designed for React developers, this option offers hooks and context that make it simple to access intent-based solutions provided by Sprinter within React components, allowing seamless interaction with the intent engine.

- **Calling API Endpoints Directly**: This option is best suited for developers who want full control over API interactions. It’s flexible and can be used in any programming environment, but requires a deeper understanding of the Sprinter protocol. We recommend this for advanced users or those working in non-JavaScript environments.

### Using the SDK

The Sprinter SDK provides a streamlined interface for retrieving intent-based solutions from Sprinter, with built-in TypeScript support to ensure type safety and an enhanced development experience. This approach is recommended for developers who are comfortable with TypeScript or those working in modern web frameworks.

**Quick Example**

Here’s a quick example of how to use the SDK in your project:

```typescript
import { Sprinter } from '@chainsafe/sprinter-sdk';

const sprinter = new Sprinter({ baseUrl: 'https://api.sprinter.buildwithsygma.com' });

sprinter.getUserBalances('0xYourAddressHere').then(console.log);
```

For more details on using the SDK, refer to the [SDK Documentation](./sdk).

### Using the React SDK

If you're building a React application, you can use the Sprinter React SDK (`@chainsafe/sprinter-react`), which provides hooks and context to interact with the Sprinter core SDK.

**Quick Example**

Here’s how to set up a simple React component to fetch user balances:

```typescript
import React, { useEffect } from 'react';
import { SprinterContext, useSprinterBalances } from '@chainsafe/sprinter-react';

function BalancesComponent() {
  const { balances, getUserBalances } = useSprinterBalances('0xYourAddressHere');

  useEffect(() => {
    getUserBalances();
  }, [getUserBalances]);

  if (balances.loading) return <div>Loading...</div>;
  if (balances.error) return <div>Error: {balances.error}</div>;

  return (
    <ul>
      {Object.entries(balances.data || {}).map(([symbol, balanceEntry]) => (
        <li key={symbol}>{symbol}: {balanceEntry.total}</li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <SprinterContext baseUrl="https://api.sprinter.buildwithsygma.com">
      <BalancesComponent />
    </SprinterContext>
  );
}

export default App;
```

For detailed usage, check the [React SDK Documentation](./react-sdk).

### Calling API Endpoints Directly

This approach provides more control over how you interact with the API but is generally suited for advanced users or developers working in non-JavaScript environments.

:::caution For Advanced Users
Calling the API directly provides the most flexibility but requires a deeper understanding of the Sprinter protocol and how to structure API requests. It's recommended for experienced developers who need full control over API interactions.
:::

**Quick Example**

Here’s how you can call the API directly using JavaScript's Fetch API:

```javascript
const ownerAddress = "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519";
const tokenSymbol = "USDC";
const baseUrl = "https://api.sprinter.buildwithsygma.com/";

fetch(`${baseUrl}/accounts/${ownerAddress}/assets/fungible/${tokenSymbol}`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error fetching user fungible tokens:', error));
```

For a comprehensive list of available endpoints and how to use them, check out the [API Documentation](https://api.sprinter.buildwithsygma.com/swagger/index.html).
