---
id: sweep
title: sweep
sidebar_position: 3
---

# `sweep`

The `sweep` method generates a quote to transfer the full token balances of source chains to a destination chain.

## Usage

```typescript
import { Sprinter, Environment } from "@chainsafe/sprinter-sdk";

const sprinter = new Sprinter({ baseUrl: Environment.TESTNET });

const settings = {
  account: "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519",
  destinationChain: 11155111,
  token: "USDC",
};

sprinter.sweep(settings).then((solution) => {
  console.log(solution);
});
```

## Parameters

- `settings`: _(Required)_ An object containing the following fields:

  - `account`: The user’s address.
  - `destinationChain`: The ID of the destination chain.
  - `token`: The symbol of the token to be transferred (e.g., `USDC`, `ETH`).
  - `recipient?`: _(Optional)_ The address of the recipient of the tokens on the destination chain.
  - `whitelistedSourceChains?`: _(Optional)_ An array of source chain IDs to be considered for the sweep. If omitted, Sprinter will use all available chains for the solution. To limit the solution to a specific chain, provide an array containing only that chain's ID.

- `fetchOptions?`: _(Optional)_ An object containing `baseUrl` to override the default API endpoint for this request.

### Example: Using `whitelistedSourceChains` for sweeping from specific chains

To get a sweep solution from specific chains, you can set `whitelistedSourceChains` to an array with chain IDs.

```typescript
const settings = {
  account: "0xYourAddressHere",
  destinationChain: 11155111, // Sepolia testnet
  token: "USDC",
  whitelistedSourceChains: [84532, 137],
};

sprinter.sweep(settings).then((solution) => {
  console.log(solution);
});
```

### Example: Using `fetchOptions`

```typescript
sprinter.sweep(settings, { baseUrl: "https://custom.api.url" }).then((solution) => {
  console.log(solution);
});
```

## Response

Returns a promise that resolves to a `SolutionResponse`.

```typescript
type SolutionResponse = Array<Solution> | FailedSolution;

interface Solution {
  destinationChain: number;
  destinationTokenAddress: string;
  duration: number; // Time estimate in seconds
  fee: Amount;
  gasCost: Amount;
  senderAddress: string;
  sourceChain: number;
  sourceTokenAddress: string;
  tool: Tool;
  transaction: Transaction;
  approvals?: Array<Transaction>;
  amount: Amount;
}

interface FailedSolution {
  error: string;
}
```

### Example Response

import GasTip from "../\_gas-tip.md"

<GasTip />

```json
[
  {
    "sourceChain": 84532,
    "destinationChain": 11155111,
    "sourceTokenAddress": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    "destinationTokenAddress": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    "senderAddress": "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519",
    "tool": {
      "name": "Across",
      "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/bridges/acrossv2.png"
    },
    "gasCost": {
      "amount": "130680140710000",
      "amountUSD": 0
    },
    "fee": {
      "amount": "6239846",
      "amountUSD": 0
    },
    "amount": "1178950000",
    "duration": 120000000000,
    "transaction": {
      "data": "0x7b9392320000000000000000000000003e101ec02e7a48d16dade204c96bff842e7e25190000000000000000000000003e101ec02e7a48d16dade204c96bff842e7e2519000000000000000000000000036cbd53842c5426634e7929541ec2318f3dcf7e0000000000000000000000001c7d4b196cb0c7b01d743fbc6116a902379c723800000000000000000000000000000000000000000000000000000000464559700000000000000000000000000000000000000000000000000000000045e6230a0000000000000000000000000000000000000000000000000000000000aa36a70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006780030c000000000000000000000000000000000000000000000000000000006780576c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000000001dc0de",
      "to": "0x82B564983aE7274c86695917BBf8C99ECb6F0F8F",
      "from": "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519",
      "value": "0x0",
      "gasLimit": "0x16378",
      "chainId": 84532
    },
    "approvals": [
      {
        "data": "0x095ea7b300000000000000000000000082b564983ae7274c86695917bbf8c99ecb6f0f8f0000000000000000000000000000000000000000000000000000000046455970",
        "to": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        "from": "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519",
        "value": "0x0",
        "gasLimit": "0xe484",
        "chainId": 84532
      }
    ]
  }
]
```
