---
sidebar_position: 2
---

# Networks

This section explains how to get a list of networks available on the service and their details.

## /networks

### Description

Returns a list of supported networks. Each network includes information such as the network ID, name, type, and RPC URLs.

### Endpoint

`GET /networks`

### Response

The response is a JSON object containing an array of network objects.

### Example Request

```shell
curl -X 'GET' \
  'https://gopher.test.buildwithsygma.com/networks' \
  -H 'accept: application/json'
```

### Example Response

```json
{
  "data": [
    {
      "chainID": 1,
      "chainType": "EVM",
      "name": "Ethereum Mainnet",
      "logoURI": "https://example.com/logos/ethereum.png",
      "rpcurls": [
        "https://mainnet.ethereumnode.com",
        "https://rpc.ankr.com/eth"
      ]
    },
    {
      "chainID": 42161,
      "chainType": "EVM",
      "name": "Arbitrum One",
      "logoURI": "https://example.com/logos/arbitrum.png",
      "rpcurls": [
        "https://arb1.arbitrum.io/rpc",
        "https://arbitrum.node.com/rpc"
      ]
    }
  ]
}
```

### Fields

- `chainID`: The unique identifier for the blockchain network.
- `chainType`: The type of the blockchain (e.g., EVM).
- `name`: The name of the blockchain network.
- `logoURI`: The URI of the network's logo.
- `rpcurls`: An array of RPC URLs for the network.

### Usage Notes

- The response includes multiple RPC URLs for redundancy and reliability.

The above command returns a JSON object with the list of supported networks and their details.
