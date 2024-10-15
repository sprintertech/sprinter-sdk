---
id: get-user-balances
title: getUserBalances
sidebar_position: 3
---

# `getUserBalances`

The `getUserBalances` method retrieves the aggregated balance of a user across multiple chains for specified tokens or native assets.

## Usage

```typescript
import { Sprinter } from '@chainsafe/sprinter-sdk';

const sprinter = new Sprinter({
  baseUrl: 'https://api.test.sprinter.buildwithsygma.com',  // Testnet URL
});

const ownerAddress = "0xYourAddressHere";
sprinter.getUserBalances(ownerAddress).then(balances => {
  console.log(balances);
});
```

## Parameters

- `account`: *(Required)* The address of the user whose balances will be retrieved.
- `tokens?`: *(Optional)* An array of tokens for which balances will be retrieved. If omitted, the method will return balances for all tokens and native assets. If an empty array is provided, only native token balances will be returned.
- `fetchOptions?`: *(Optional)* An object containing `baseUrl` to override the default API endpoint for this request.

### Example: Using `tokens` and `fetchOptions`

```typescript
const tokens = [
  { symbol: 'USDC', decimals: 6, addresses: { '11155111': '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' } }
];

sprinter.getUserBalances(ownerAddress, tokens, { baseUrl: 'https://custom.api.url' }).then(balances => {
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
  balance: string;
  chainId: number;
  tokenDecimals: number;
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

- If the `tokens` array is omitted, balances for all tokens and native assets will be returned.
- If you provide specific tokens, balances will be fetched only for those tokens and native assets.
- If you provide an empty `tokens` array, only native token balances will be returned.
- Specifying tokens or an empty array can result in faster responses, as fewer tokens need to be fetched.
