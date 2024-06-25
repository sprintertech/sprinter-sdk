---
sidebar_position: 1
---

# Introduction

Gopher SDK is a powerful tool that aggregates cross-chain balances and assists in transaction management, helping your customers seamlessly interact with multiple blockchain networks.

## Options

You have two options for using the Gopher SDK:

1. **Using the SDK (recommended)**: This approach provides a convenient and unified interface for interacting with the blockchain using TypeScript support, making it easier to integrate with your application.
2. **Calling APIs directly**: If you prefer more control or want to implement your own solution in another language, you can directly call the provided API endpoints.

### Using the SDK

The Gopher SDK allows you to easily interact with blockchain networks using the `Gopher` class, which supports TypeScript for type safety and better development experience.

#### Example

```typescript
import { Gopher } from 'gopher-sdk';

const gopher = new Gopher(window.ethereum);

gopher.getUserBalances().then(console.log);
```

### Calling API Endpoints Directly

If you prefer to directly interact with the APIs or want to implement the solution in another language, you can use the provided API endpoints independently of the SDK.

#### Example

Here is how you can call the API directly using JavaScript's Fetch API:

```javascript
const ownerAddress = "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519";
const tokenSymbol = "USDC";
const baseUrl = "https://your-api-url.com";  // Replace with your API base URL

fetch(`${baseUrl}/accounts/${ownerAddress}/assets/fungible/${tokenSymbol}`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error fetching user fungible tokens:', error));
```