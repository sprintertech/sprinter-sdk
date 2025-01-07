---
id: sdk-installation
title: Installation
sidebar_position: 2
---

# Installation

The Sprinter SDK allows developers to interact with cross-chain solutions such as balance aggregation and asset transfers across multiple blockchain networks. This guide will walk you through the installation process.

## Prerequisites

Before installing the SDK, ensure you have the following installed:

- **Node.js**: Version 20 (recommended) or higher
- **npm** or **yarn**: A package manager for JavaScript

## Installation

To install the SDK in your project, use either `npm` or `yarn`:

```bash npm2yarn
npm install @chainsafe/sprinter-sdk
```

## Basic Setup

Once the SDK is installed, you can initialize it to interact with blockchain networks and fetch data like user balances and supported tokens.

:::note
The `baseUrl` should be changed depending on whether you want to interract with test networks or main networks.
:::

### Example: Initialize `Sprinter`

```typescript
import { Sprinter, Environment } from "@chainsafe/sprinter-sdk";

const sprinter = new Sprinter({ baseUrl: Environment.TESTNET });

const ownerAddress = "0xYourAddressHere";
sprinter.getUserBalances(ownerAddress).then(console.log);
```

## API Usage

You can also call specific API endpoints directly using the SDK. Here’s an example:

```typescript
import { api } from "@chainsafe/sprinter-sdk";

const ownerAddress = "0xYourAddressHere";
const tokenSymbol = "USDC";

api.getErc20Balances(ownerAddress, tokenSymbol).then(console.log);
```

## Base url Configuration

The base url will define the url used for API requests. If you want to make calls to test networks (e.g Sepolia, BaseSepolia...) you should use the test endpoint available from the exported `Environment` Enum: `Environment.TESTNET`. For main networks you can use `Environment.MAINNET`.

### Example: Set Base URL

```typescript
import { setBaseUrl } from "@chainsafe/sprinter-sdk";

setBaseUrl("https://api.sprinter.buildwithsygma.com");
```

This allows the SDK to communicate with the appropriate API server for cross-chain solutions.

For more advanced configuration and usage examples, refer to the next section on configuring the SDK.
