---
id: react-sdk-installation
title: Installation
sidebar_position: 2
---

# Installation

To use the **Sprinter React SDK** in your project, follow these installation instructions.

## Step 1: Install the React SDK and Sprinter SDK

The React SDK requires the core Sprinter SDK (`@chainsafe/sprinter-sdk`) to function properly. You can install both packages using `yarn` or `npm`.

```bash npm2yarn
npm install @chainsafe/sprinter-react @chainsafe/sprinter-sdk
```

## Step 2: Ensure React Version

Make sure your project uses **React** version 18.3.1 or higher, as it’s the minimum version supported by the React SDK.

```bash npm2yarn
npm install react@latest react-dom@latest
```

## Step 3: Wrap Your App with `SprinterContext`

Once the installation is complete, wrap your app’s component tree with `SprinterContext` to provide access to Sprinter’s functionalities across your React components.

```tsx
import React from 'react';
import { SprinterContext } from '@chainsafe/sprinter-react';
import { Environment } from '@chainsafe/sprinter-sdk';

function App() {
  return (
    <SprinterContext baseUrl={Environment.TESTNET}>
      <YourComponent />
    </SprinterContext>
  );
}
```

By passing the `baseUrl`, you specify which environment (testnet or mainnet) to use for API calls.

### Available URLs:

- **Testnet**: `https://api.test.sprinter.buildwithsygma.com`
- **Mainnet**: `https://api.sprinter.buildwithsygma.com`

For more information on available hooks and methods, proceed to the [Using Hooks](03-using-hooks.md) section.
