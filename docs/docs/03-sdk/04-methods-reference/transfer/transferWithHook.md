---
id: transfer-with-hook
title: transferWithHook
sidebar_position: 2
---

# `transferWithHook`

The `transferWithHook` method generates a solution for performing a token transfer from a single source chain, followed by a contract call on the destination chain. The contract call can involve either a native token or a token transfer. This method returns the necessary transaction details to execute both the token transfer and the contract interaction.

## Usage

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="call-type" queryString>
  <TabItem value="token" label="Token Transfer with Contract Call">
    
In this example, a token transfer (e.g., `USDC`) is followed by a contract call on the destination chain. You need to provide `outputTokenAddress` and `approvalAddress` to allow the contract to move tokens on behalf of the user.

```typescript
import { Sprinter, Environment } from "@chainsafe/sprinter-sdk";

const sprinter = new Sprinter({ baseUrl: Environment.TESTNET });

const settings = {
  account: "0xYourAddressHere",
  destinationChain: 11155111, // Sepolia testnet
  token: "USDC",
  amount: 1000000, // In smallest denomination (e.g., 1 USDC = 1,000,000 in USDC with 6 decimals)
  contractCall: {
    contractAddress: "0xContractAddressHere",
    callData: "0xSomeCallData", // Encoded contract interaction data
    gasLimit: 100000,
    outputTokenAddress: "0xOutputTokenAddressHere", // Where tokens will be sent
    approvalAddress: "0xApprovalAddressHere", // Contract that needs approval to transfer tokens
  },
  recipient: "0xRecipientAddress", // Optional recipient of leftover tokens
  sourceChains: [84532], // Optional: List of source chains to be considered
};

sprinter.transferWithHook(settings).then((solution) => {
  console.log(solution);
});
```

  </TabItem>

  <TabItem value="native" label="Native Token Transfer with Contract Call">

In this example, a native token (e.g., `ETH`) is transferred to a contract on the destination chain, followed by a contract call. The contract can receive the native token in addition to executing the call.

```typescript
const settings = {
  account: "0xYourAddressHere",
  destinationChain: 11155111, // Sepolia testnet
  token: "ETH",
  amount: 5000000000000000000, // 5 ETH in the smallest denomination (wei)
  contractCall: {
    contractAddress: "0xContractAddressHere",
    callData: "0xSomeCallData", // Encoded contract interaction data
    gasLimit: 21000, // Standard gas limit for simple ETH transfers
  },
  recipient: "0xRecipientAddressHere", // The recipient of the native token transfer
  sourceChains: [84532], // Optional: List of source chains to be considered
};

sprinter.transferWithHook(settings).then((solution) => {
  console.log(solution);
});
```

  </TabItem>
</Tabs>

:::note
You can limit the solution to a specific source chain using the `sourceChains` field. For example, to use only `BaseSepolia` (chain ID `84532`), provide it as an array like this:

```typescript
sourceChains: [84532];
```

If omitted, Sprinter will consider all available source chains.
:::

### Example: Using `fetchOptions`

```typescript
sprinter.transferWithHook(settings, { baseUrl: "https://custom.api.url" }).then((solution) => {
  console.log(solution);
});
```

## Parameters

- `settings`: _(Required)_ An object containing the following fields:

  - `account`: The user’s address.
  - `destinationChain`: The ID of the destination chain.
  - `token`: The symbol of the token to be transferred (e.g., `USDC`, `ETH`).
  - `amount`: The amount of the token to be transferred in the smallest denomination (e.g., for USDC with 6 decimals, 1 USDC = 1,000,000).
  - `contractCall`: An object containing the contract call details, depending on the type of contract call:
    - **Native Contract Call**:
      - `contractAddress`: The contract address on the destination chain.
      - `callData`: The data to interact with the contract, in hex format.
      - `gasLimit`: The maximum amount of gas to use for the contract call.
    - **Token Contract Call**:
      - `contractAddress`: The contract address on the destination chain.
      - `callData`: The data to interact with the contract, in hex format.
      - `gasLimit`: The maximum amount of gas to use for the contract call.
      - `outputTokenAddress?`: _(Optional)_ The token address where tokens will be sent after the contract call.
      - `approvalAddress?`: _(Optional)_ The contract address that requires approval to transfer tokens (e.g., for `transferFrom`).
  - `recipient?`: _(Optional)_ The address of the recipient of any leftover tokens.
  - `sourceChains?`: _(Optional)_ An array of source chain IDs to be considered for the transfer. If omitted, Sprinter will use all available chains for the solution.
  - `threshold?`: _(Optional)_ The minimum amount of tokens required to trigger the transfer solution. If not met, the transfer solution will not proceed.
  - `enableSwaps`: _(Optional)_ Defaults to `false`. Whether to enable token swaps on the source chain.

- `fetchOptions?`: _(Optional)_ An object containing `baseUrl` to override the default API endpoint for this request.

import HowToCallData from "../\_how-to-calldata.md"

<HowToCallData />

import GasLimit from "../\_how-to-gas-limit.md"

<GasLimit />

<hr />

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

import GasTip from "../\_gas-tip.md"

<GasTip />

<Tabs groupId="call-type" queryString>
  <TabItem value="token" label="Token Transfer with Contract Call">

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
      "chainId": 845

32
    },
    "approvals": [
      {
        "data": "0x095ea7b30000000000000000000000003b0f996c474c91de56617da13a52b22bb659d18e0000000000000000000000000000000000000000000000000000000005f5e100",
        "to": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        "from": "0x3E101Ec02e7a48d16dade204c96bff842e7e2519",
        "value": "0x0",
        "gasPrice": "0xf433d",
        "gasLimit": "0xe484",
        "chainId": 84532
      }
    ]
  }
]
```

  </TabItem>

  <TabItem value="native" label="Native Token Transfer with Contract Call">

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
      "from": "0x3E101Ec02e7a48D16DADE204C96bFF842E7E2519",
      "value": "0x38d7ea4c68000",
      "gasPrice": "0xf433d",
      "gasLimit": "0x35f48",
      "chainId": 84532
    },
    "approvals": null
  }
]
```

</TabItem>
</Tabs>
