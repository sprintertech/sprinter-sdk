---
id: use-sprinter-chains
title: useSprinterChains
sidebar_position: 2
---

# `useSprinterChains`

The `useSprinterChains` hook allows you to fetch and manage the list of supported blockchain networks (chains) in the Sprinter ecosystem. It provides access to details such as chain ID, name, and supported RPC URLs.

## Usage

### Example

```tsx
import { useSprinterChains } from '@chainsafe/sprinter-react';

function ChainList() {
  const { chains, getAvailableChains } = useSprinterChains();

  useEffect(() => {
    getAvailableChains();  // Fetch chains on component mount
  }, []);

  if (chains.loading) return <div>Loading chains...</div>;
  if (chains.error) return <div>Error fetching chains: {chains.error}</div>;

  return (
    <ul>
      {chains.data && chains.data.map(chain => (
        <li key={chain.chainID}>
          {chain.name} - Chain ID: {chain.chainID}
        </li>
      ))}
    </ul>
  );
}
```

## Return Value

The `useSprinterChains` hook returns an object with the following properties:

- **`chains`**: An object containing:
    - `data`: The list of supported blockchain networks, or `null` if chains haven’t been loaded yet.
    - `loading`: A boolean indicating if the chains are being fetched.
    - `error`: A string containing the error message if the fetch fails.

- **`getAvailableChains`**: A function that triggers the retrieval of available chains.

## Example Response

Here is an example of what the `chains.data` might look like after calling `getAvailableChains()`:

```json
[
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
```

## Parameters

- `getAvailableChains()`: A function that fetches the list of available blockchain networks from the Sprinter Intent Engine.

## Notes

- **Automatic Fetch**: The `getAvailableChains` function is automatically called when `SprinterContext` is initialized, so chains will be available in your app as soon as the context is ready.
- If the chains have already been fetched, the hook will return the cached list for better performance.

For more information on other hooks, refer to the [Methods Reference](./useSprinterBalances.md).
