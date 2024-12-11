# Sprinter SDK

The **Sprinter SDK** is a JavaScript/TypeScript library that simplifies cross-chain operations such as fetching balances and providing solutions for asset transfers across multiple blockchains.

## Features

- **Cross-Chain Balance Retrieval**: Fetch user balances across multiple supported blockchains.
- **Bridging Solutions**: Generate solutions for single-hop and multi-hop token transfers across chains.
- **Contract Call Solutions**: Generate solutions to perform contract calls along with cross-chain transfers.
- **Typed Methods**: Full TypeScript support, ensuring type safety.

## Installation

To install the Sprinter SDK in your project, you can use either `npm` or `yarn`.

### npm

```bash
npm install @chainsafe/sprinter-sdk
```

### yarn

```bash
yarn add @chainsafe/sprinter-sdk
```

## Basic Usage

Once installed, you can initialize and use the SDK to interact with blockchain data.

### Using the `Sprinter` Class

The `Sprinter` class provides an interface to interact with balances and chains.

```typescript
import { Sprinter } from '@chainsafe/sprinter-sdk';

const sprinter = new Sprinter({
  baseUrl: 'https://api.sprinter.buildwithsygma.com',
});

const ownerAddress = "0xYourAddressHere";
sprinter.getUserBalances(ownerAddress).then(console.log);
```

### Example: Fetch Available Tokens

```typescript
sprinter.getAvailableTokens().then(tokens => {
  console.log(tokens);
});
```

### Example: Fetch Supported Chains

```typescript
sprinter.getAvailableChains().then(chains => {
  console.log(chains);
});
```

### Environment Configuration

You can configure the SDK using environment variables to set the base URL for API requests:

```typescript
import { setBaseUrl } from '@chainsafe/sprinter-sdk';

setBaseUrl("https://api.sprinter.buildwithsygma.com");
```

## Docs
For more detailed docs you can check out [SDK docs page](https://docs.sprinter.tech/docs/sdk/).

## API Documentation

For more detailed documentation on how to use the SDK, please visit the [API documentation](https://docs.sprinter.buildwithsygma.com/docs/sdk/overview).
