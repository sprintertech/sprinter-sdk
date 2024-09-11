# Sprinter SDK

Sprinter SDK is a powerful library for interacting with blockchain networks, allowing you to retrieve information about fungible tokens, supported chains, and user balances, as well as finding solutions for asset transfers.

## Installation

Install the library using npm or yarn:

```bash
npm install @chainsafe/sprinter-sdk
# or
yarn add @chainsafe/sprinter-sdk
```

## Usage

You have two approaches: using the `Sprinter` class or calling API endpoints directly through the SDK.

### Using the Sprinter Class

The `Sprinter` class provides a convenient interface for interacting with the blockchain using an EIP1193 provider (e.g., MetaMask).

#### Example

```typescript
import { Sprinter } from '@chainsafe/sprinter-sdk';

const sprinter = new Sprinter();

const ownerAddress = "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519";
sprinter.getUserBalances(ownerAddress).then(console.log);
```

### Calling API Endpoints Directly

Alternatively, you can call the API endpoints directly using the provided SDK functions.

#### Example

```typescript
import { api } from '@chainsafe/sprinter-sdk';

const ownerAddress = "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519";
const tokenSymbol = "USDC";

api.getUserFungibleTokens(ownerAddress, tokenSymbol).then(console.log);
```

### Environment Variables

The SDK uses environment variables to configure the base URL `SPRINTER_URL`. You can set this variable in your environment configuration or directly in your code.

#### Setting Environment Variables in Code

```typescript
import { setBaseUrl } from '@chainsafe/sprinter-sdk';

setBaseUrl("http://localhost:8080");
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.
