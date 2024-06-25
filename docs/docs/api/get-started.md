---
sidebar_position: 1
---

# Get Started

# SDK Usage

This section explains how to use the Gopher SDK to interact with blockchain networks, including setup, initialization, and usage examples for various functionalities.

## Installation

Install the Gopher SDK using npm or yarn:

```bash
npm install gopher-sdk
# or
yarn add gopher-sdk
```

## Example

To start using the Gopher SDK, you need to initialize it with an EIP1193 provider (e.g., MetaMask).

```typescript
import { Gopher } from 'gopher-sdk';

const gopher = new Gopher(window.ethereum);
```

or call APi calls by yourself

```typescript
import { api } from 'gopher-sdk';

const ownerAddress = "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519";
const tokenSymbol = "USDC";

api.getUserFungibleTokens(ownerAddress, tokenSymbol).then(console.log);
```
