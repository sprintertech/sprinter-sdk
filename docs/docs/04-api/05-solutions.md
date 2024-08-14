---
sidebar_position: 5
---

# Solutions

This section explains how to get solutions for specific actions using the Sprinter API.

## GET - /solutions/aggregation

### Description

This endpoint calculates the best combination of single-hop transfers.

### Endpoint

`GET /solutions/aggregation`

### Response

The response is a JSON object containing an array of solutions.

### Example Request

```shell
curl -X 'GET' \
  'https://api.sprinter.buildwithsygma.com/solutions/aggregation' \
  -H 'accept: application/json'
```

### Example Response

```json
{
  "data": [
    {
      "destinationChain": 42161,
      "destinationTokenAddress": "0x...",
      "duration": 300,
      "fee": {
        "amount": "1000000",
        "amountUSD": 1.00
      },
      "gasCost": {
        "amount": "50000",
        "amountUSD": 0.05
      },
      "senderAddress": "0x...",
      "sourceChain": 1,
      "sourceTokenAddress": "0x...",
      "amount": "1000000000",
      "tool": {
        "logoURI": "https://example.com/logos/tool.png",
        "name": "ToolName"
      },
      "transaction": {
        "chainId": 1,
        "data": "0x...",
        "from": "0x...",
        "gasLimit": "21000",
        "gasPrice": "20000000000",
        "to": "0x...",
        "value": "1000000000"
      }
    }
  ]
}
```

### Fields

- `destinationChain`: The ID of the destination chain.
- `destinationTokenAddress`: The address of the destination token.
- `duration`: The estimated duration for the transaction in seconds.
- `fee`: The fee for the transaction, including the amount in the smallest unit and its equivalent in USD.
- `gasCost`: The gas cost for the transaction, including the amount in the smallest unit and its equivalent in USD.
- `senderAddress`: The sender's address.
- `sourceChain`: The ID of the source chain.
- `sourceTokenAddress`: The address of the source token.
- `amount`: The amount to be transferred in the smallest unit.
- `tool`: An object containing information about the tool used for the transaction.
    - `logoURI`: The URI for the tool's logo.
    - `name`: The name of the tool.
- `transaction`: The transaction object to be used for executing the transaction.
    - `chainId`: The ID of the chain.
    - `data`: The data for the transaction.
    - `from`: The sender's address.
    - `gasLimit`: The gas limit for the transaction.
    - `gasPrice`: The gas price for the transaction.
    - `to`: The recipient's address.
    - `value`: The value of the transaction in the smallest unit.

## POST - /solutions/aggregation

### Description

This endpoint calculates the best combination of single-hop transfers with a smart contract call.

### Endpoint

`POST /solutions/aggregation`

### Request Body

The request body should be a JSON object containing the following fields:

- `account`: The account address.
- `destinationChain`: The ID of the destination blockchain.
- `token`: The token symbol (e.g., "USDC").
- `amount`: The amount to be transferred.
- `threshold?`: An optional threshold parameter.
- `whitelistedSourceChains?`: An optional array of whitelisted source chain IDs.

### Example Request

```shell
curl -X 'POST' \
  'https://api.sprinter.buildwithsygma.com/solutions/aggregation' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
        "account": "0x123...",
        "destinationChain": 42161,
        "token": "USDC",
        "amount": 1000000000
      }'
```

### Example Response

```json
{
  "data": [
    {
      "destinationChain": 42161,
      "destinationTokenAddress": "0x...",
      "duration": 300,
      "fee": {
        "amount": "1000000",
        "amountUSD": 1.00
      },
      "gasCost": {
        "amount": "50000",
        "amountUSD": 0.05
      },
      "senderAddress": "0x...",
      "sourceChain": 1,
      "sourceTokenAddress": "0x...",
      "amount": "1000000000",
      "tool": {
        "logoURI": "https://example.com/logos/tool.png",
        "name": "ToolName"
      },
      "transaction": {
        "chainId": 1,
        "data": "0x...",
        "from": "0x...",
        "gasLimit": "21000",
        "gasPrice": "20000000000",
        "to": "0x...",
        "value": "1000000000"
      }
    }
  ]
}
```

### Usage Notes

- Replace the placeholders in the example requests with appropriate values.
- Ensure the request body is correctly formatted for the `POST` endpoint.

These endpoints return a JSON object with the best solutions for token transfers, either as a simple aggregation or with a smart contract call.
