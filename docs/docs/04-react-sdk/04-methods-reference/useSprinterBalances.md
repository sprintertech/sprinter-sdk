---
id: use-sprinter-balances
title: useSprinterBalances
sidebar_position: 3
---

# `useSprinterBalances`

The `useSprinterBalances` hook allows you to retrieve a user's available token balances across multiple chains. It provides access to both native and fungible token balances for the specified account.

## Usage

### Example

```tsx
import { useSprinterBalances } from '@chainsafe/sprinter-react';
import React, { useEffect } from 'react';

function BalancesComponent() {
  const { balances, getUserBalances } = useSprinterBalances("0xYourAddress");

  useEffect(() => {
    getUserBalances();  // Fetch balances when the component mounts
  }, [getUserBalances]);

  if (balances.loading) {
    return <div>Loading...</div>;
  }

  if (balances.error) {
    return <div>Error: {balances.error}</div>;
  }

  return (
    <ul>
      {Object.entries(balances.data || {}).map(([symbol, balanceEntry]) => (
        <li key={symbol}>{symbol}: {balanceEntry.total}</li>
      ))}
    </ul>
  );
}
```

## Return Value

The `useSprinterBalances` hook returns an object with the following properties:

- **`balances`**: An object containing:
    - `data`: The user's balances across chains, keyed by token symbol. Each token's balances are represented by:
        - `balances`: An array of balances on different chains.
        - `total`: The total balance for the token across all chains.
    - `loading`: A boolean indicating if the balances are being fetched.
    - `error`: A string containing the error message if the fetch fails.

- **`getUserBalances`**: A function that triggers the retrieval of the user's balances.

## Example Response

Here’s an example of what `balances.data` might look like after calling `getUserBalances()`:

```json
{
  "ETH": {
    "balances": [
      { "balance": "1000000000000000000", "chainId": 11155111, "tokenDecimals": 18 },
      { "balance": "500000000000000000", "chainId": 84532, "tokenDecimals": 18 }
    ],
    "total": "1500000000000000000"
  },
  "USDC": {
    "balances": [
      { "balance": "2000000", "chainId": 11155111, "tokenDecimals": 6 }
    ],
    "total": "2000000"
  }
}
```

## Parameters

- `getUserBalances()`: A function that fetches the user's balances across all available tokens and native token balances for the specified account.
