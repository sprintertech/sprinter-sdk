---
id: get-available-tokens
title: getAvailableTokens
sidebar_position: 2
---

# `getAvailableTokens`

The `getAvailableTokens` method retrieves a list of supported fungible tokens across multiple blockchain networks.

## Usage

```typescript
import { Sprinter } from '@chainsafe/sprinter-sdk';

const sprinter = new Sprinter({
  baseUrl: 'https://api.test.sprinter.buildwithsygma.com',  // Testnet URL
});

sprinter.getAvailableTokens().then(tokens => {
  console.log(tokens);
});
```

## Parameters

- `fetchOptions?`: *(Optional)* An object containing `baseUrl` to override the default API endpoint for this request.

### Example: Using `fetchOptions`

```typescript
sprinter.getAvailableTokens({ baseUrl: 'https://custom.api.url' }).then(tokens => {
  console.log(tokens);
});
```

## Response

Returns a promise that resolves to an `Array<FungibleToken>`.

```typescript
type Response = Array<FungibleToken>;

interface FungibleToken {
  addresses: Record<ChainID, Address>;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: TokenSymbol;
}
```

### Example Response

```json
{
  "data": [
    {
      "name": "USDC",
      "decimals": 6,
      "symbol": "USDC",
      "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/8cee462de2cc16eed81ded90ced5dbd64f7145cb/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      "addresses": {
        "11155111": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        "1993": "0xE61e5ed4c4f198c5384Ef57E69aAD1eF0c911004",
        "84532": "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
      }
    },
    {
      "name": "Wrapped ETH",
      "decimals": 18,
      "symbol": "WETH",
      "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/8cee462de2cc16eed81ded90ced5dbd64f7145cb/blockchains/optimism/assets/0x4200000000000000000000000000000000000006/logo.png",
      "addresses": {
        "11155111": "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
        "1993": "0x3538f4C55893eDca690D1e4Cf9Fb61FB70cd0DD8",
        "84532": "0x4200000000000000000000000000000000000006"
      }
    }
  ]
}
```
