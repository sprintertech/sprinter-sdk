---
id: get-user-balances
title: getUserBalances
sidebar_position: 3
---

# `getUserBalances`

The `getUserBalances` method retrieves the aggregated balance of a user across multiple chains for specified tokens or native assets.

## Usage

```typescript
import { Sprinter, Environment } from '@chainsafe/sprinter-sdk';

const sprinter = new Sprinter({ baseUrl: Environment.TESTNET });

const ownerAddress = "0xYourAddressHere";
sprinter.getUserBalances(ownerAddress).then((balances) => {
  console.log(balances);
});
```

## Parameters

- `account`: *(Required)* The wallet address of the user whose balances will be retrieved.
- `tokens?`: *(Optional)* An array of tokens for which balances will be retrieved. Each token should include its `symbol` and `decimals`.
    - **If omitted**: Balances for all supported tokens and native assets will be retrieved.
    - **If an empty array**: Only native token balances (e.g., ETH) will be returned.
    - **If specific tokens are provided**: Balances will be fetched only for those tokens and native assets.
- `sourceChains?`: *(Optional)* An array of chain IDs to filter balances from specific chains. If omitted, balances will be retrieved from all supported chains.
- `fetchOptions?`: *(Optional)* An object containing options for customizing the fetch request, such as `baseUrl`.

### Example: Using `tokens` and `fetchOptions`

```typescript
const tokens = [
  { symbol: 'USDC', decimals: 6, addresses: { '11155111': '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' } }
];

sprinter.getUserBalances(ownerAddress, tokens, undefined, { baseUrl: 'https://custom.api.url' }).then((balances) => {
  console.log(balances);
});
```

## Behavior of the `tokens` Parameter

- **If `tokens` is omitted**: The method will return balances for all supported tokens and native assets.
- **If `tokens` is specified**: The method will return balances only for the specified tokens and native assets.
- **If `tokens` is an empty array**: The method will return only native token balances.

Providing specific tokens or an empty array can help reduce the response time, as fewer tokens need to be fetched.

## Response

Returns a promise that resolves to an `AggregateBalances` object.

```typescript
type AggregateBalances = {
  [symbol: string]: {
    balances: Array<TokenBalance>;
    total: string;
  };
};

interface TokenBalance {
  balance: string; // Token balance in its smallest denomination (e.g., wei for ETH, smallest unit for tokens)
  chainId: number; // Chain ID where the balance is located
  tokenDecimals: number; // Number of decimals for the token
}
```

### Example Response

```json
{
  "ETH": {
    "balances": [
      {
        "balance": "1234567890000000000",
        "chainId": 11155111,
        "tokenDecimals": 18
      },
      {
        "balance": "9876543210000000000",
        "chainId": 84532,
        "tokenDecimals": 18
      }
    ],
    "total": "11111111100000000000"
  },
  "USDC": {
    "balances": [
      {
        "balance": "1000000",
        "chainId": 11155111,
        "tokenDecimals": 6
      },
      {
        "balance": "2000000",
        "chainId": 84532,
        "tokenDecimals": 6
      }
    ],
    "total": "3000000"
  }
}
```

## Notes

- Native token balances (e.g., ETH) are always included in the response, regardless of the tokens specified.
- Specifying tokens or an empty array can result in faster responses, as fewer tokens need to be fetched.
- Use the `sourceChains` parameter to limit balances to specific chains.
