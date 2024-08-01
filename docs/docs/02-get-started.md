---
id: gettingstarted
title: Getting Started
sidebar_position: 2
---

Depending on your needs, you have two main options for using the Sprinter SDK:

1. **Using the SDK (Recommended for TypeScript and Web Framework Developers)**
2. **Calling APIs Directly**

### Using the SDK

Using the Sprinter SDK provides a convenient and unified interface for blockchain interactions, complete with TypeScript support for enhanced type safety and a better development experience. This approach is particularly recommended for developers working with TypeScript or popular web frameworks.

#### Quick Example

Here's a quick example of how to use the SDK in your project:

```typescript
import { Sprinter } from '@chainsafe/sprinter-sdk';

const sprinter = new Sprinter(window.ethereum);

sprinter.getUserBalances().then(console.log);
```

For a more detailed guide on setting up and using the SDK, refer to the [SDK Documentation](03-sdk/01-overview.md).

### Calling API Endpoints Directly

If you prefer more control or wish to implement the solution in a different programming language, you can directly interact with the API endpoints provided by Sprinter.

#### Quick Example

Here’s how you can call the API directly using JavaScript's Fetch API:

```javascript
const ownerAddress = "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519";
const tokenSymbol = "USDC";
const baseUrl = "https://your-api-url.com";  // Replace with your API base URL

fetch(`${baseUrl}/accounts/${ownerAddress}/assets/fungible/${tokenSymbol}`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error fetching user fungible tokens:', error));
```

For a comprehensive list of available endpoints and how to use them, check out the [API Documentation](04-api/01-api-usage.md).

# Getting Started

Welcome to the Sprinter SDK! This guide will introduce you to the application flow of Sprinter, explaining how it integrates with your application to manage cross-chain balances and transactions.

## Sprinter Application Flow

The Sprinter SDK is designed to streamline the process of interacting with multiple blockchain networks. Here's an overview of the typical flow of a sprinter-integrated application:

### 1. Prepare User (Authentication or Connect to DApp)

Before using Sprinter, the user must authenticate or connect to the decentralized application (DApp). This step is handled by your application, ensuring that the user is authenticated and their wallet is connected.

### 2. Balance Aggregation (Optional)

Once the user is prepared, Sprinter can optionally aggregate the user's balances across multiple blockchains. This involves fetching data from different networks and consolidating it into a single view.

### 3. Get Quota

The next step is to get the transaction quota. This provides the necessary information for the DApp to execute the required transactions. Sprinter finds the best single-hop cross-bridge transaction to optimize the process.

### 4. Execute Transaction (Handled by DApp)

After obtaining the transaction quota, the DApp executes the transaction. Sprinter provides the best options for the transaction, but the actual execution and following the transaction status are handled by the DApp.

### 5. Error Handling (Handled by DApp)

Error handling is managed by the DApp. Sprinter ensures that it provides accurate data and options, but the DApp is responsible for handling any errors that may arise during the transaction process.

## Diagram of the Sprinter Flow

Below is a simplified diagram illustrating the Sprinter application flow:

```plaintext
+------------------------+
|  Prepare User (Auth)   |
+-----------+------------+
            |
            v
+------------------------+
| Balance Aggregation    | (Optional)
+-----------+------------+
            |
            v
+------------------------+
|       Get Quota        |
+-----------+------------+
            |
            v
+------------------------+
|   Execute Transaction  | (Handled by DApp)
+-----------+------------+
            |
            v
+------------------------+
|    Error Handling      | (Handled by DApp)
+------------------------+
```

## Further Reading

Now that you understand the Sprinter application flow, here are some next steps to dive deeper into specific areas:

- **[SDK Documentation](03-sdk/01-overview.md)**: Learn how to set up and use the SDK in your application.
- **[API Documentation](04-api/04-user-assets.md)**: Explore the API endpoints provided by Sprinter for direct integration.

We hope this guide provides a clear understanding of the Sprinter application flow. If you have any questions or need further assistance, feel free to reach out. Happy coding!
