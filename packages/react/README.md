# Sprinter React SDK

The Sprinter React SDK is a React wrapper for the [Sprinter SDK](https://github.com/ChainSafe/sprinter-sdk), enabling easy interaction with blockchain networks through React components and hooks. It provides context management and custom hooks for retrieving balances, tokens, supported chains, and solutions for asset transfers.

## Installation

To install the package, use npm or yarn:

```bash
npm install @chainsafe/sprinter-react @chainsafe/sprinter-sdk
# or
yarn add @chainsafe/sprinter-react @chainsafe/sprinter-sdk
```

## Usage

Wrap your application in the `SprinterContext` to gain access to blockchain-related data within your component tree.

### Example

```tsx
import React from 'react';
import { SprinterContext } from '@chainsafe/sprinter-react';

const App = () => (
  <SprinterContext>
    <YourComponent />
  </SprinterContext>
);

export default App;
```

Inside your components, you can use the provided hooks to interact with blockchain data:

```tsx
import React, { useEffect } from 'react';
import { useSprinterBalances, useSprinterTokens } from '@chainsafe/sprinter-react';

const YourComponent = () => {
  const ownerAddress = "0xYourAddressHere";
  const { balances, getUserBalances } = useSprinterBalances(ownerAddress);

  useEffect(() => {
    getUserBalances();
  }, [getUserBalances]);

  return (
    <div>
      <h1>Balances:</h1>
      <pre>{JSON.stringify(balances, null, 2)}</pre>
      <h1>Available Tokens:</h1>
      <pre>{JSON.stringify(tokens, null, 2)}</pre>
    </div>
  );
};

export default YourComponent;
```

### Available Hooks

The following hooks are provided by the SDK:

- **`useSprinter()`**: Access everything from the Sprinter context.
- **`useSprinterBalances(account: Address)`**: Retrieve user balances for a given account.
- **`useSprinterTokens()`**: Retrieve available tokens.
- **`useSprinterChains()`**: Retrieve available blockchain chains.
- **`useSprinterSolution()`**: Retrieve solutions for asset transfers.
- **`useSprinterCallSolution()`**: Call solutions for transferring assets.

### Custom Fetch Options

You can pass custom fetch options when initializing the context:

```tsx
<SprinterContext fetchOptions={{ baseUrl: "https://api.test.sprinter.buildwithsygma.com/" }}>
  <YourComponent />
</SprinterContext>
```

## Documentation
For more detailed docs you can check out [SDK docs page](https://docs.sprinter.tech/docs/react-sdk/).

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for new features or bug fixes.
