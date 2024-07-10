---
sidebar_position: 4
---

# User Assets

This section explains how to get a list of assets for a specific user.

## /accounts/{"{address}"}/assets/fungible/{"{token}"}

### Description

Returns a list of fungible assets for a specified user address and token symbol.

### Endpoint

`GET /accounts/{address}/assets/fungible/{token}`

### Parameters

- `{address}`: User Address (Ethereum address of the user)
- `{token}`: Token Symbol (e.g., "USDC")

### Response

The response is a JSON object containing an array of fungible token balance objects.

### Example Request

```shell
curl -X 'GET' \
  'https://api.sprinter.buildwithsygma.com/accounts/0x123.../assets/fungible/usdc' \
  -H 'accept: application/json'
```

### Example Response

```json
{
  "data": [
    {
      "balance": "1000000000",
      "chainId": 1,
      "tokenDecimals": 6
    },
    {
      "balance": "500000000",
      "chainId": 42161,
      "tokenDecimals": 6
    }
  ]
}
```

### Fields

- `balance`: The balance amount in the smallest unit (e.g., wei).
- `chainId`: The ID of the chain where the token is held.
- `tokenDecimals`: The number of decimals the token uses.

### Usage Notes

- Replace `{address}` with the Ethereum address of the user.
- Replace `{token}` with the symbol of the token (e.g., "USDC").

The above command returns a JSON object with the list of fungible assets for the specified user address and token symbol.
