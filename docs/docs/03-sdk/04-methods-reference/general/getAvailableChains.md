---
id: get-available-chains
title: getAvailableChains
sidebar_position: 1
---

# `getAvailableChains`

The `getAvailableChains` method retrieves a list of supported blockchain networks, including chain details like chain ID, RPC URLs, and native tokens.

## Usage

```typescript
import { Sprinter, Environment } from '@chainsafe/sprinter-sdk';

const sprinter = new Sprinter({ baseUrl: Environment.TESTNET });

sprinter.getAvailableChains().then(chains => {
  console.log(chains);
});
```

## Parameters

- `fetchOptions?`: *(Optional)* An object containing `baseUrl` to override the default API endpoint for this request.

### Example: Using `fetchOptions`

```typescript
sprinter.getAvailableChains({ baseUrl: 'https://custom.api.url' }).then(chains => {
  console.log(chains);
});
```

## Response

Returns a promise that resolves to an `Array<Chain>`.

```typescript
type Response = Array<Chain>;

interface Chain {
  chainType: string;
  name: string;
  chainID: number;
  rpcURLs: Array<string>;
  logoURI: string;
  blockTime: number;
  nativeToken: {
    name: string;
    decimals: number;
  };
}
```

### Example Response

```json
{
  "data": [
    {
      "chainType": "evm",
      "name": "Sepolia",
      "chainID": 11155111,
      "rpcURLs": [
        "https://ethereum-sepolia-rpc.publicnode.com/"
      ],
      "logoURI": "https://scan.buildwithsygma.com/assets/icons/evm.svg",
      "blockTime": 12000000000,
      "nativeToken": {
        "name": "ETH",
        "decimals": 18
      }
    },
    {
      "chainType": "evm",
      "name": "B3Sepolia",
      "chainID": 1993,
      "rpcURLs": [
        "https://sepolia.b3.fun"
      ],
      "logoURI": "https://cdn.b3.fun/b3_logo.svg",
      "blockTime": 1000000000,
      "nativeToken": {
        "name": "ETH",
        "decimals": 18
      }
    },
    {
      "chainType": "evm",
      "name": "BaseSepolia",
      "chainID": 84532,
      "rpcURLs": [
        "https://sepolia.base.org"
      ],
      "logoURI": "https://scan.buildwithsygma.com/assets/icons/base.svg",
      "blockTime": 12000000000,
      "nativeToken": {
        "name": "ETH",
        "decimals": 18
      }
    }
  ]
}
```
