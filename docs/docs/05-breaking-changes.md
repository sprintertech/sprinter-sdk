---
id: breaking-changes
title: Breaking Changes
sidebar_position: 5
---

# Breaking Changes

## SDK from Version 0.3.0 to 0.4.0

### Summary of Changes:

- **New Methods**:
  - `poolAssetOnDestination`, `poolAssetOnDestinationWithHook`, `transfer`, and `transferWithHook` replace the old `getSolution` and `getCallSolution` methods.
- **Simplified API**: Each method now has a focused purpose, making it easier to understand and use.
- **Parameter Renaming**: `whitelistedSourceChains` has been renamed to `sourceChains` for clarity.

<details>
  <summary>**1. Method Refactoring**</summary>

#### Old API:

Previously, there were two primary methods:

- `getSolution`: Used for both **balance aggregation** and **contract calls**.
- `getCallSolution`: Focused on **bridging with contract calls**.

These methods were generalized, accepting complex and multifaceted parameters, which often led to confusion about the exact functionality.

#### New API:

The methods have been **separated and simplified** to offer more clarity and specialization. Now, there are four distinct methods:

1. **`poolAssetOnDestination`**:

   - Used to **aggregate token balances** from multiple chains without contract interaction.

2. **`poolAssetOnDestinationWithHook`**:

   - Used to **aggregate balances and perform a contract call** on the destination chain.

3. **`transfer`**:

   - Focuses on a **single-hop token transfer** from one chain to another, without any contract call.

4. **`transferWithHook`**:
   - Transfers tokens with an **additional contract call** on the destination chain.

#### Impact:

- **Simpler API**: Users no longer need to handle complex or overloaded methods like `getSolution` or `getCallSolution`. Now, they can choose the right method for their needs.

##### Example Change:

- **Old usage (`getSolution`)**:

  ```ts
  sprinter.getSolution({
    account: "0xYourAddressHere",
    destinationChain: 11155111,
    token: "USDC",
    amount: 1000000,
    contractCall: {
      callData: "0xabcdef",
      contractAddress: "0xContractAddress",
      gasLimit: 21000,
    },
  });
  ```

- **New usage (`poolAssetOnDestinationWithHook`)**:
  ```ts
  sprinter.poolAssetOnDestinationWithHook({
    account: "0xYourAddressHere",
    destinationChain: 11155111,
    token: "USDC",
    amount: 1000000,
    contractCall: {
      callData: "0xabcdef",
      contractAddress: "0xContractAddress",
      gasLimit: 21000,
    },
  });
  ```

</details>

<details>
  <summary>**2. Parameter Name Changes**</summary>

#### Old API:

- **`whitelistedSourceChains`**: A parameter that allowed users to specify which source chains were eligible for the solution.

#### New API:

- **`sourceChains`**: The same functionality has been retained but with a **simpler, cleaner name**.

#### Impact:

- **No change in functionality**: The purpose of this parameter remains the same.
- **Migration Tip**: Users should simply update the parameter name in their code.

##### Example Change:

- **Old usage (`whitelistedSourceChains`)**:

  ```ts
  sprinter.getSolution({
    account: "0xYourAddressHere",
    destinationChain: 11155111,
    token: "USDC",
    amount: 1000000,
    whitelistedSourceChains: [84532, 137],
  });
  ```

- **New usage (`sourceChains`)**:
  ```ts
  sprinter.poolAssetOnDestination({
    account: "0xYourAddressHere",
    destinationChain: 11155111,
    token: "USDC",
    amount: 1000000,
    sourceChains: [84532, 137],
  });
  ```

</details>

---

## React SDK Refactor: From Version 0.2.1 to 0.3.0

### Summary of Changes:

- **New Methods**:
  - `getTransfer`, `getTransferWithHook`, `getPoolAssetOnDestination`, and `getPoolAssetOnDestinationWithHook` replace the old `getSolution` and `getCallSolution` methods.
- **Parameter Structure**: Methods now accept a single object as a parameter, instead of individual arguments.
- **Parameter Renaming**: `whitelistedSourceChains` has been renamed to `sourceChains`.
- **SDK as Peer Dependency**: The `@chainsafe/sprinter-sdk` is now a peer dependency, simplifying updates.

<details>
  <summary>**1. Method Refactoring**</summary>

#### Old API:

Previously, there were two primary methods in the React SDK:

- `getSolution`: Used for both **balance aggregation** and **contract calls**.
- `getCallSolution`: Focused on **bridging with contract calls**.

These methods were generalized, requiring multiple parameters, leading to confusion about their exact purpose.

#### New API:

The methods have been split into specialized methods to clarify their purpose:

1. **`getPoolAssetOnDestination`**:

   - Handles **balance aggregation** from multiple chains without contract interaction.

2. **`getPoolAssetOnDestinationWithHook`**:

   - Handles **balance aggregation** from multiple chains with a contract call on the destination chain.

3. **`getTransfer`**:

   - Used for **single-hop transfers** between chains without any contract call.

4. **`getTransferWithHook`**:
   - Used for **single-hop transfers** with a contract call on the destination chain.

#### Impact:

- **Simplified API**: Users no longer need to manage overloaded methods. Instead, each method has a clear, focused purpose, reducing complexity.

##### Example Change:

- **Old usage (`getSolution`)**:

  ```ts
  getSolution(account, destinationChain, token, amount, threshold, whitelistedSourceChains);
  ```

- **New usage (`getTransferWithHook`)**:
  ```ts
  getTransferWithHook({
    account,
    destinationChain,
    token,
    amount,
    threshold,
    sourceChains,
  });
  ```

</details>

<details>
  <summary>**2. Parameter Structure Changes**</summary>

#### Old API:

In previous versions, parameters were passed individually for each method:

```typescript
getSolution(
  account: Address,
  destinationChain: ChainID,
  token: TokenSymbol,
  amount: number,
  threshold?: number,
  whitelistedSourceChains?: ChainID[]
)
```

#### New API:

Now, methods accept a **single object** as an argument (e.g., `settings`). This aligns with the SDK design, making it easier to manage and extend.

```typescript
getTransfer({
  account,
  destinationChain,
  token,
  amount,
  threshold,
  sourceChains,
});
```

#### Impact:

- **Migration Tip**: Instead of passing individual parameters, pass a single object that encapsulates all the necessary values.

##### Example Change:

- **Old Usage**:

  ```typescript
  getSolution(account, destinationChain, token, amount, threshold, whitelistedSourceChains);
  ```

- **New Usage**:
  ```typescript
  getTransfer({
    account,
    destinationChain,
    token,
    amount,
    threshold,
    sourceChains,
  });
  ```

</details>

<details>
  <summary>**3. Parameter Renaming**</summary>

#### Old API:

- **`whitelistedSourceChains`**: This parameter allowed users to specify the source chains for bridging.

#### New API:

- **`sourceChains`**: The functionality remains the same, but the name has been simplified for clarity.

#### Impact:

- **No change in functionality**: Users just need to update their code to use the new parameter name.

##### Example Change:

- **Old usage**:

  ```ts
  getSolution({
    account: "0xYourAddressHere",
    destinationChain: 11155111,
    token: "USDC",
    amount: 1000000,
    whitelistedSourceChains: [84532, 137],
  });
  ```

- **New usage**:
  ```ts
  getTransfer({
    account: "0xYourAddressHere",
    destinationChain: 11155111,
    token: "USDC",
    amount: 1000000,
    sourceChains: [84532, 137],
  });
  ```

</details>

<details>
  <summary>**4. SDK as Peer Dependency**</summary>

#### Old Setup:

Previously, the React SDK bundled the `@chainsafe/sprinter-sdk` as a regular dependency. This meant that updating the SDK required updating the React SDK at the same time.

#### New Setup:

`@chainsafe/sprinter-sdk` is now a **peer dependency**, which allows independent updates to the SDK without needing to update the React SDK.

#### Impact:

- **Migration Tip**: Ensure that `@chainsafe/sprinter-sdk` is installed as a dependency in your project.

##### Example (`package.json`):

```json
{
  "peerDependencies": {
    "@chainsafe/sprinter-sdk": "^0.4.0"
  }
}
```

</details>
