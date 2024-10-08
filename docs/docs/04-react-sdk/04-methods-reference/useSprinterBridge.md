---
id: use-sprinter-bridge
title: useSprinterBridge
sidebar_position: 5
---

# `useSprinterBridge`

The `useSprinterBridge` hook provides a simplified interface for generating cross-chain transfer solutions and contract calls using the Sprinter Intent Engine. This hook wraps the following SDK methods:

- `getBridge`: Single-hop token transfers across chains.
- `getBridgeAndCall`: Single-hop token transfers combined with a contract call on the destination chain.
- `getBridgeAggregateBalance`: Aggregates token balances across multiple chains into a single destination.
- `getBridgeAggregateBalanceAndCall`: Aggregates token balances and performs a contract call on the destination chain.

You can trigger any of these methods via the hook to fetch a cross-chain solution.

## Usage

### Example

```tsx
import { useSprinterBridge } from '@chainsafe/sprinter-react';
import React, { useEffect } from 'react';

function BridgeComponent() {
  const { solution, getBridgeAggregateBalance } = useSprinterBridge();

  useEffect(() => {
    const settings = {
      account: '0xYourAddress',
      destinationChain: 11155111,  // Sepolia Testnet
      token: 'USDC',
      amount: 1000000,  // 1 USDC (smallest denomination)
    };

    getBridgeAggregateBalance(settings);  // Fetch bridge solution when the component mounts
  }, [getBridgeAggregateBalance]);

  if (solution.loading) return <div>Loading bridge solution...</div>;
  if (solution.error) return <div>Error fetching bridge solution: {solution.error}</div>;

  return (
    <div>
      Bridge Solution: {JSON.stringify(solution.data)}
    </div>
  );
}
```

## Return Value

The `useSprinterBridge` hook returns an object with the following properties:

- **`solution`**: An object containing:
    - `data`: The bridge solution, or `null` if not yet retrieved.
    - `loading`: A boolean indicating if the solution is being fetched.
    - `error`: A string containing the error message if the fetch fails.

- **`getBridge`**: A function that generates a single-hop token transfer solution.
- **`getBridgeAndCall`**: A function that generates a single-hop token transfer combined with a contract call.
- **`getBridgeAggregateBalance`**: A function that generates a solution to aggregate balances from multiple chains into a single destination.
- **`getBridgeAggregateBalanceAndCall`**: A function that generates a solution to aggregate balances and execute a contract call on the destination chain.

## Example Response

Here’s an example of what the `solution.data` might look like after calling `getBridgeAggregateBalance()`:

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

- **`getBridge`**: See [SDK Bridge Method Reference](../../sdk/methods-reference/bridge/bridge).
- **`getBridgeAndCall`**: See [SDK Bridge and Call Method Reference](../../sdk/methods-reference/bridge/bridgeAndCall).
- **`getBridgeAggregateBalance`**: See [SDK Aggregate Balance Method Reference](../../sdk/methods-reference/bridge-aggregate/bridgeAggregateBalance).
- **`getBridgeAggregateBalanceAndCall`**: See [SDK Aggregate Balance and Call Method Reference](../../sdk/methods-reference/bridge-aggregate/bridgeAggregateBalanceAndCall).

Each method calls the Sprinter SDK's corresponding function and returns the intent-based solution for cross-chain transfers or contract calls.
