# Gopher SDK

TODO: insert copy from marketing!

## Installation

Install the library using npm or yarn:

```bash
npm install gopher-sdk
# or
yarn add gopher-sdk
```


## Usage

You have 2 approaches, using Gopher class or call endpoint by yourself

To use class just import Gopher and use EIP1193Provider

```typescript
import { Gopher } from '@chainsafe/gopher-sdk';

const gopher = new Gopher(window.ethereum);
gopher.getUserBalances().then(console.log);
```

Or calling API directly over SDK.

```typescript
import { api } from '@chainsafe/gopher-sdk';

const ownerAddress = "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519";
const tokenSybol = "USDC";
api.getUserFungibleTokens(ownerAddress, tokenSybol).then(console.log);
```

### Environment Variables

The SDK uses environment variables to configure the base URL `GOPHER_URL`.
or you can do from code like this

```typescript
import { setBaseUrl } from '@chainsafe/gopher-sdk';

setBaseUrl("http://localhost:8080");
```
