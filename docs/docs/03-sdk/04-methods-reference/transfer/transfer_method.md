---
id: transfer
title: transfer
sidebar_position: 1
---

# `transfer`

The `transfer` method generates a solution for performing a token transfer from a single source chain. It returns the necessary transaction details to initiate the transfer on the source chain and complete it on the destination chain.

## Usage

```typescript
import { Sprinter, Environment } from '@chainsafe/sprinter-sdk';

const sprinter = new Sprinter({ baseUrl: Environment.TESTNET });

const settings = {
  account: '0xYourAddressHere',
  destinationChain: 11155111,  // Sepolia testnet
  token: 'USDC',
  amount: 1000000,  // In smallest denomination (e.g., 1 USDC = 1,000,000 in USDC with 6 decimals)
};

sprinter.transfer(settings).then(solution => {
  console.log(solution);
});
```

## Parameters

- `settings`: *(Required)* An object containing the following fields:
  - `account`: The user’s address.
  - `destinationChain`: The ID of the destination chain.
  - `token`: The symbol of the token to be transferred (e.g., `USDC`, `ETH`).
  - `amount`: The amount of the token to be transferred in the smallest denomination (e.g., for USDC with 6 decimals, 1 USDC = 1,000,000).
  - `recipient?`: *(Optional)* The address of the recipient of any leftover tokens.
  - `sourceChains?`: *(Optional)* An array of source chain IDs to be considered for the transfer. If omitted, Sprinter will use all available chains for the solution. To limit the solution to a specific chain, provide an array containing only that chain's ID.
  - `threshold?`: *(Optional)* The minimum amount of tokens required to trigger the transfer solution. If not met, the transfer solution will not proceed.

- `fetchOptions?`: *(Optional)* An object containing `baseUrl` to override the default API endpoint for this request.

### Example: Using `sourceChains` for a Specific Chain

To get a transfer solution from a specific chain (e.g., BaseSepolia with chain ID `84532`), you can set `sourceChains` to an array with that chain's ID.

```typescript
const settings = {
  account: '0xYourAddressHere',
  destinationChain: 11155111,  // Sepolia testnet
  token: 'USDC',
  amount: 1000000,
  sourceChains: [84532],  // Limit to BaseSepolia as the source chain
};

sprinter.transfer(settings).then(solution => {
  console.log(solution);
});
```

### Example: Using `fetchOptions`

```typescript
sprinter.transfer(settings, { baseUrl: 'https://custom.api.url' }).then(solution => {
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
  duration: number;  // Time estimate in seconds
  fee: Amount;
  gasCost: Amount;
  senderAddress: string;
  sourceChain: number;
  sourceTokenAddress: string;
  amount: string;
  tool: Tool;
  transaction: Transaction;
  approvals?: Array<Transaction>;
}

interface FailedSolution {
  error: string;
}
```

### Example Response

import GasTip from "../_gas-tip.md"

<GasTip />

```json
[
  {
    "sourceChain": 84532,
    "destinationChain": 11155111,
    "sourceTokenAddress": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    "destinationTokenAddress": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    "senderAddress": "0x3e101ec02e7a48d16dade204c96bff842e7e2519",
    "tool": {
      "name": "Sygma-Testnet",
      "logoURI": "https://scan.buildwithsygma.com/assets/images/logo1.svg"
    },
    "gasCost": {
      "amount": "221055913000",
      "amountUSD": 0
    },
    "fee": {
      "amount": "1000000000000000",
      "amountUSD": 0
    },
    "amount": "100000000",
    "duration": 60000000000,
    "transaction": {
      "data": "0x73c45c98000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000540000000000000000000000000000000000000000000000000000000005f5e10000000000000000000000000000000000000000000000000000000000000000143e101ec02e7a48d16dade204c96bff842e7e251900000000000000000000000000000000000000000000000000000000000000000000000000000000000000023078000000000000000000000000000000000000000000000000000000000000",
      "to": "0x9D5C332Ebe0DaE36e07a4eD552Ad4d8c5067A61F",
      "from": "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519",
      "value": "0x38d7ea4c68000",
      "gasPrice": "0xf433d",
      "gasLimit": "0x35f48",
      "chainId": 84532
    },
    "approvals": [
      {
        "data": "0x095ea7b30000000000000000000000003b0f996c474c91de56617da13a52b22bb659d18e0000000000000000000000000000000000000000000000000000000005f5e100",
        "to": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        "from": "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519",
        "value": "0x0",
        "gasPrice": "0xf433d",
        "gasLimit": "0xe484",
        "chainId": 84532
      }
    ]
  }
]
```
