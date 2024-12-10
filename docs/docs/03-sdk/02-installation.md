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

### Example: Initialize `Sprinter`

```typescript
import { Sprinter, Environment } from "@chainsafe/sprinter-sdk";

const sprinter = new Sprinter({ baseUrl: Environment.MAINNET });

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

## Environment Configuration

You can configure the SDK using environment variables to set the base URL for API requests.

### Example: Set Base URL

```typescript
import { setBaseUrl } from "@chainsafe/sprinter-sdk";

setBaseUrl("https://api.sprinter.buildwithsygma.com");
```

This allows the SDK to communicate with the appropriate API server for cross-chain solutions.

For more advanced configuration and usage examples, refer to the next section on configuring the SDK.
