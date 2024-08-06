---
id: flow
title: Sprinter Application Flow
sidebar_position: 3
---

The following section showcases how cross-chain balances and transactions are managed in a Sprinter-integrated application flow.

### 1. Prepare User

Before using Sprinter, the user must authenticate or connect to the decentralized application (dApp). This step is handled by your application, ensuring that the user is authenticated and their wallet is connected.

### 2. Balance Aggregation

Once the user is prepared, Sprinter can optionally aggregate the user's balances across multiple blockchains. This involves fetching data from different networks and consolidating it into a single view.

### 3. Get Quote

The next step is to get the transaction quote. This provides the necessary information for the dApp to execute the required transactions. Sprinter finds the best single-hop cross-bridge transaction to optimize this process.

### 4. Execute Transaction

After obtaining the transaction quote, the dApp executes the transaction. Sprinter provides the best options for the transaction, but the actual execution and transaction status monitoring is handled by the dApp.

### 5. Error Handling

Error handling is managed by the dApp. Sprinter ensures that it provides accurate data and options, but the dApp is responsible for handling any errors that may arise during the transaction process.

## Diagram of the Sprinter Flow

Below is a simplified diagram illustrating the Sprinter application flow:

```plaintext
+------------------------+
|  Prepare User (Auth)   |
+-----------+------------+
            |
            v
+------------------------+
| Balance Aggregation    | 
+-----------+------------+
            |
            v
+------------------------+
|       Get Quote        |
+-----------+------------+
            |
            v
+------------------------+
|   Execute Transaction  | 
+-----------+------------+
            |
            v
+------------------------+
|    Error Handling      | 
+------------------------+
```
