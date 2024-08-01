---
sidebar_position: 3
---

# Fungible Assets

This section explains how to get a list of fungible tokens available on the service.

## /assets/fungible

### Description

Returns a list of supported tokens.

### Endpoint

`GET /assets/fungible`

### Response

The response is a JSON object containing an array of fungible token objects.

### Example Request

```shell
curl -X 'GET' \
  'https://api.sprinter.buildwithsygma.com/assets/fungible' \
  -H 'accept: application/json'
```

### Example Response

```json
{
  "data": [
    {
      "symbol": "USDC",
      "name": "USD Coin",
      "decimals": 6,
      "addresses": {
        "1": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48",
        "42161": "0xFF970A61A04b1Ca14834A43f5de4533eBdDB5CC8"
      },
      "logoURI": "https://example.com/logos/usdc.png"
    },
    {
      "symbol": "DAI",
      "name": "Dai Stablecoin",
      "decimals": 18,
      "addresses": {
        "1": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "42161": "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1"
      },
      "logoURI": "https://example.com/logos/dai.png"
    }
  ]
}
```

### Fields

- `symbol`: The symbol of the token (e.g., "USDC").
- `name`: The name of the token (e.g., "USD Coin").
- `decimals`: The number of decimals the token uses.
- `addresses`: An object mapping chain IDs to token contract addresses.
- `logoURI`: The URI for the token's logo.

### Usage Notes

- The response includes all supported fungible tokens along with their details and addresses on different blockchain networks.

## /assets/fungible/{"{token}"}

### Description

Returns information about a specific token.

### Endpoint

`GET /assets/fungible/{token}`

### Parameters

- `{token}`: The symbol of the token (e.g., "USDC").

### Response

The response is a JSON object containing the details of the specified token.

### Example Request

```shell
curl -X 'GET' \
  'https://api.sprinter.buildwithsygma.com/assets/fungible/usdc' \
  -H 'accept: application/json'
```

### Example Response

```json
{
  "symbol": "USDC",
  "name": "USD Coin",
  "decimals": 6,
  "addresses": {
    "1": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48",
    "42161": "0xFF970A61A04b1Ca14834A43f5de4533eBdDB5CC8"
  },
  "logoURI": "https://example.com/logos/usdc.png"
}
```

### Fields

- `symbol`: The symbol of the token (e.g., "USDC").
- `name`: The name of the token (e.g., "USD Coin").
- `decimals`: The number of decimals the token uses.
- `addresses`: An object mapping chain IDs to token contract addresses.
- `logoURI`: The URI for the token's logo.

### Usage Notes

- Replace `{token}` with the symbol of the token you want to retrieve information about.

## /networks/{"{chainID}"}/assets/fungible

### Description

Returns a list of supported tokens for a specific network.

### Endpoint

`GET /networks/{chainID}/assets/fungible`

### Parameters

- `{chainID}`: The ID of the blockchain network.

### Response

The response is a JSON object containing an array of fungible token objects for the specified network.

### Example Request

```shell
curl -X 'GET' \
  'https://api.sprinter.buildwithsygma.com/networks/1/assets/fungible' \
  -H 'accept: application/json'
```

### Example Response

```json
{
  "data": [
    {
      "symbol": "USDC",
      "name": "USD Coin",
      "decimals": 6,
      "addresses": {
        "1": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48"
      },
      "logoURI": "https://example.com/logos/usdc.png"
    },
    {
      "symbol": "DAI",
      "name": "Dai Stablecoin",
      "decimals": 18,
      "addresses": {
        "1": "0x6B175474E89094C44Da98b954EedeAC495271d0F"
      },
      "logoURI": "https://example.com/logos/dai.png"
    }
  ]
}
```

### Fields

- `symbol`: The symbol of the token (e.g., "USDC").
- `name`: The name of the token (e.g., "USD Coin").
- `decimals`: The number of decimals the token uses.
- `addresses`: An object mapping chain IDs to token contract addresses.
- `logoURI`: The URI for the token's logo.

### Usage Notes

- Replace `{chainID}` with the ID of the blockchain network you want to retrieve supported tokens for.

The above commands return JSON objects with the list of fungible tokens, details about specific tokens, or supported tokens for a specific network.
