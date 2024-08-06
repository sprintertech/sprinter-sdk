---
id: quickstart
title: Quick Start
sidebar_position: 2
---

You have two main options for interacting with Sprinter:

- [Using the SDK](#using-the-sdk)
- [Calling API Endpoints Directly](#calling-api-endpoints-directly)

### Using the SDK

Using the Sprinter SDK provides a convenient and unified interface for blockchain interactions, complete with TypeScript support for enhanced type safety and a better development experience. This approach is recommended for developers working with TypeScript or popular web frameworks.

**Quick Example**

Here's a quick example of how to use the SDK in your project:

```typescript
import { Sprinter } from '@chainsafe/sprinter-sdk';

const sprinter = new Sprinter(window.ethereum);

sprinter.getUserBalances().then(console.log);
```

For a more detailed guide on setting up and using the SDK, refer to the [SDK Documentation](03-sdk/01-overview.md).

### Calling API Endpoints Directly

If you prefer more control or wish to implement the solution in a different programming language, you can directly interact with the API endpoints provided by Sprinter.

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

For a comprehensive list of available endpoints and how to use them, check out the [API Documentation](04-api/01-api-usage.md).
