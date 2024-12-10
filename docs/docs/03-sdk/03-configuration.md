---
id: sdk-configuration
title: Configuration
sidebar_position: 3
---

# Configuration

The Sprinter SDK provides flexible options to configure the base URL for API interactions and allows you to override these settings on a per-method basis. This guide will show you how to configure the SDK effectively.

## Configuring the `Sprinter` Instance

When initializing the `Sprinter` class, you can pass a `baseUrl` configuration option. This sets the default API endpoint for all interactions.

### `baseUrl`

The `baseUrl` is the API server endpoint. You can either set it manually or use the predefined `Environment` enum to simplify configuration.

```typescript
import { Sprinter, Environment } from "@chainsafe/sprinter-sdk";

// Using a custom base URL
const sprinter = new Sprinter({
	baseUrl: "https://api.sprinter.buildwithsygma.com"
});

// Or using a predefined environment URL
const sprinterWithEnv = new Sprinter({
	baseUrl: Environment.MAINNET // Enum that provides predefined URLs
});
```

## Set Base URL Using `setBaseUrl`

You can change the `baseUrl` dynamically in your application using the `setBaseUrl` function provided by the SDK. This is useful when you need to modify the API endpoint during runtime.

```typescript
import { setBaseUrl } from "@chainsafe/sprinter-sdk";

// Dynamically set the base URL during runtime
setBaseUrl("https://custom.api.url");
```

## Set Base URL Using Environment Variables

To configure the base URL for all SDK interactions, you can set the `SPRINTER_URL` environment variable in your environment configuration. This is particularly useful for different deployment environments such as development, staging, or production.

```typescript
// In your environment file (e.g., .env)
SPRINTER_URL=https://api.sprinter.buildwithsygma.com
```

In your code, the SDK will use this environment variable automatically:

```typescript
import { setBaseUrl } from "@chainsafe/sprinter-sdk";

// Automatically set the base URL from the environment variable
setBaseUrl(process.env.SPRINTER_URL);
```

## Available URLs

Here are the URLs you can use for the `baseUrl`:

- **Mainnet**: `https://api.sprinter.buildwithsygma.com/`
- **Testnet**: `https://api.test.sprinter.buildwithsygma.com/`

You can either use these directly in the `baseUrl` option or reference them in your environment variables.

## Overriding `baseUrl` Per Request

Every method in the SDK accepts an optional `fetchOptions` parameter, which contains only the `baseUrl`. This allows you to override the `baseUrl` for individual requests, even if the `Sprinter` instance was initialized with a different URL.

### Example: Overriding `baseUrl` for a Single Request

```typescript
sprinter.getAvailableTokens({ baseUrl: "https://custom.api.url" }).then((tokens) => {
	console.log(tokens);
});
```

In this example, the `baseUrl` in `fetchOptions` is used only for this specific API request, without changing the base URL for the entire `Sprinter` instance.
