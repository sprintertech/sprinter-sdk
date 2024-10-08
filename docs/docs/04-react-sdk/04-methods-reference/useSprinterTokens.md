---
id: use-sprinter-tokens
title: useSprinterTokens
sidebar_position: 1
---

# `useSprinterTokens`

The `useSprinterTokens` hook allows you to fetch and manage the list of supported fungible tokens across different blockchain networks in the Sprinter ecosystem. It provides access to the token details and offers functionality to retrieve the tokens directly within your React components.

## Usage

### Example

```tsx
import { useSprinterTokens } from '@chainsafe/sprinter-react';

function TokenList() {
  const { tokens, getAvailableTokens } = useSprinterTokens();

  useEffect(() => {
    getAvailableTokens();  // Fetch tokens on component mount
  }, []);

  if (tokens.loading) return <div>Loading tokens...</div>;
  if (tokens.error) return <div>Error: {tokens.error}</div>;

  return (
    <ul>
      {tokens.data && tokens.data.map(token => (
        <li key={token.symbol}>
          {token.name} - {token.symbol}
        </li>
      ))}
    </ul>
  );
}
```

## Return Value

The `useSprinterTokens` hook returns an object with the following properties:

- **`tokens`**: An object containing:
    - `data`: The list of supported tokens, or `null` if tokens haven’t been loaded yet.
    - `loading`: A boolean indicating if the tokens are being fetched.
    - `error`: A string containing the error message if the fetch fails.

- **`getAvailableTokens`**: A function that triggers the retrieval of available tokens, though it is automatically called when the context is initialized.

## Example Response

Here is an example of what the `tokens.data` might look like after calling `getAvailableTokens()`:

```json
[
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
```

## Parameters

- `getAvailableTokens()`: A function that fetches the list of available tokens from the Sprinter Intent Engine. This is automatically triggered when `SprinterContext` is initialized, but can be called manually if needed.

## Notes

- **Automatic Fetch**: When `SprinterContext` is initialized, the `getAvailableTokens` function is automatically called to pre-fetch token data.
- If the tokens have already been fetched, the hook will return the cached list to optimize performance.
- Tokens are fetched from Sprinter’s supported blockchain networks.

For further details on other hooks, check the [Methods Reference](./useSprinterBalances.md).
