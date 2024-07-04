---
sidebar_position: 2
---

# Getting Started

Welcome to the Gopher SDK! This guide will introduce you to the application flow of Gopher, explaining how it integrates with your application to manage cross-chain balances and transactions.

## Gopher Application Flow

The Gopher SDK is designed to streamline the process of interacting with multiple blockchain networks. Here's an overview of the typical flow of a Gopher-integrated application:

### 1. Prepare User (Authentication or Connect to DApp)

Before using Gopher, the user must authenticate or connect to the decentralized application (DApp). This step is handled by your application, ensuring that the user is authenticated and their wallet is connected.

### 2. Balance Aggregation (Optional)

Once the user is prepared, Gopher can optionally aggregate the user's balances across multiple blockchains. This involves fetching data from different networks and consolidating it into a single view.

### 3. Get Quota

The next step is to get the transaction quota. This provides the necessary information for the DApp to execute the required transactions. Gopher finds the best single-hop cross-bridge transaction to optimize the process.

### 4. Execute Transaction (Handled by DApp)

After obtaining the transaction quota, the DApp executes the transaction. Gopher provides the best options for the transaction, but the actual execution and following the transaction status are handled by the DApp.

### 5. Error Handling (Handled by DApp)

Error handling is managed by the DApp. Gopher ensures that it provides accurate data and options, but the DApp is responsible for handling any errors that may arise during the transaction process.

## Diagram of the Gopher Flow

Below is a simplified diagram illustrating the Gopher application flow:

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

Now that you understand the Gopher application flow, here are some next steps to dive deeper into specific areas:

- **[SDK Documentation](sdk/overview.md)**: Learn how to set up and use the SDK in your application.
- **[API Documentation](api/user-assets.md)**: Explore the API endpoints provided by Gopher for direct integration.
- **[Introduction to Gopher SDK](introduction.md)**: Get an overview of the Gopher SDK and its key features.

We hope this guide provides a clear understanding of the Gopher application flow. If you have any questions or need further assistance, feel free to reach out. Happy coding!
