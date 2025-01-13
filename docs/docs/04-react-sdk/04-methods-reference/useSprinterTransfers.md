---
id: use-sprinter-transfers
title: useSprinterTransfers
sidebar_position: 5
---

# `useSprinterTransfers`

The `useSprinterTransfers` hook provides a simplified interface for generating cross-chain transfer solutions and contract calls using the Sprinter Intent Engine. This hook wraps the following SDK methods:

- `getTransfer`: Single-hop token transfers across chains.
- `getTransferWithHook`: Single-hop token transfers combined with a contract call on the destination chain.
- `getPoolAssetOnDestination`: Aggregates token balances across multiple chains into a single destination.
- `getPoolAssetOnDestinationWithHook`: Aggregates token balances and performs a contract call on the destination chain.
- `getSweep`: A function that generates a quote to transfer the full token balances of source chains to a destination chain

You can trigger any of these methods via the hook to fetch a cross-chain solution.

## Usage

### Example

```tsx
import { useSprinterTransfers } from "@chainsafe/sprinter-react";
import React, { useEffect } from "react";

function TransferComponent() {
  const { solution, getPoolAssetOnDestination } = useSprinterTransfers();

  useEffect(() => {
    const settings = {
      account: "0xYourAddress",
      destinationChain: 11155111, // Sepolia Testnet
      token: "USDC",
      amount: 1000000, // 1 USDC (smallest denomination)
      sourceChains: [84532, 1993], // Optional: source chains to consider
    };

    getPoolAssetOnDestination(settings); // Fetch transfer solution when the component mounts
  }, [getPoolAssetOnDestination]);

  if (solution.loading) return <div>Loading transfer solution...</div>;
  if (solution.error) return <div>Error fetching transfer solution: {solution.error}</div>;

  return <div>Transfer Solution: {JSON.stringify(solution.data)}</div>;
}
```

## Return Value

The `useSprinterTransfers` hook returns an object with the following properties:

- **`solution`**: An object containing:

  - `data`: The transfer solution, or `null` if not yet retrieved.
  - `loading`: A boolean indicating if the solution is being fetched.
  - `error`: A string containing the error message if the fetch fails.

- **`getTransfer`**: A function that generates a single-hop token transfer solution.
- **`getTransferWithHook`**: A function that generates a single-hop token transfer combined with a contract call.
- **`getPoolAssetOnDestination`**: A function that generates a solution to aggregate balances from multiple chains into a single destination.
- **`getPoolAssetOnDestinationWithHook`**: A function that generates a solution to aggregate balances and execute a contract call on the destination chain.
- **`getSweep`**: A function that generates a quote to transfer the full token balances of source chains to a destination chain

## Example Response

Here’s an example of what the `solution.data` might look like after calling `getPoolAssetOnDestination()`:

```json
[
  {
    "sourceChain": 84532,
    "destinationChain": 11155111,
    "sourceTokenAddress": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    "destinationTokenAddress": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    "amount": "1000000",
    "duration": 60000,
    "fee": { "amount": "100000", "amountUSD": 0.1 },
    "gasCost": { "amount": "200000", "amountUSD": 0.02 },
    "tool": {
      "name": "Sygma",
      "logoURI": "https://sygma.com/logo.png"
    },
    "transaction": {
      "from": "0xYourAddress",
      "to": "0xBridgeContractAddress",
      "value": "0",
      "data": "0x...",
      "gasPrice": "0x...",
      "gasLimit": "0x..."
    }
  }
]
```

## Parameters

Each method accepts a `settings` parameter, which varies depending on the operation:

- **`getTransfer`**: See [SDK Transfer Method Reference](../../sdk/methods-reference/transfer/transfer).
- **`getTransferWithHook`**: See [SDK Transfer with Contract Call Method Reference](../../sdk/methods-reference/transfer/transfer-with-hook).
- **`getPoolAssetOnDestination`**: See [SDK Pool Asset Method Reference](../../sdk/methods-reference/pool-asset-on-destination/pool-asset-on-destination).
- **`getPoolAssetOnDestinationWithHook`**: See [SDK Pool Asset with Contract Call Method Reference](../../sdk/methods-reference/pool-asset-on-destination/pool-asset-on-destination-with-hook).
- **`getSweep`**: See [Sweep Method Reference](../../sdk/methods-reference/transfer/sweep).

Each method calls the Sprinter SDK's corresponding function and returns the intent-based solution for cross-chain transfers or contract calls.
