---
sidebar_position: 3
---

# Sprinter Class Reference

This section details the methods available to the `Sprinter` class in the Sprinter SDK. Use this reference to understand how to utilize the `Sprinter` class in your decentralized applications (dApps).

:::tip
`FetchOptions` is an object that contains settings for configuring how the fetch requests are made by the SDK. You can include options like headers, credentials, or a base URL for the requests.
`AggregateBalances` represents the user's token balances across multiple blockchains. It maps a token symbol to the balance information, which includes the total balance and an array of token balances for each chain.
:::

## Methods

### `constructor(fetchOptions: Omit<FetchOptions, "signal">)`

Initializes the SDK with the given fetch options. These options are used to configure how requests are made to the Sprinter API.

#### Parameters

- `fetchOptions: Omit<FetchOptions, "signal">`: An object that allows specifying additional fetch options, excluding the signal property.
- `fetchOptions` allows you to configure options like headers, credentials, and more for the requests made by the SDK. This configuration is essential when integrating with secured or custom endpoints.

#### Example

```typescript
const sprinter = new Sprinter();
```

### `getAvailableTokens(): Promise<FungibleToken[]>`

Fetches the available fungible tokens across supported blockchain networks.

#### Returns

- `Promise<FungibleToken[]>`: A promise that resolves to an array of fungible token objects.

#### Example

```typescript
sprinter.getAvailableTokens().then(tokens => {
  console.log('Available tokens:', tokens);
});
```

### `getAvailableChains(): Promise<Chain[]>`

Fetches the supported blockchain networks.

#### Returns

- `Promise<Chain[]>`: A promise that resolves to an array of chain objects.

#### Example

```typescript
sprinter.getAvailableChains().then(chains => {
  console.log('Supported chains:', chains);
});
```

### `getUserBalances(account: Address, tokens?: FungibleToken[], options?: FetchOptions): Promise<AggregateBalances>`

Fetches the user's balances for specified tokens across multiple blockchains. If no tokens are specified, it fetches balances for all available tokens.

:::note

Method will always return native tokens under `ETH` key

:::

#### Parameters

- `account`: Targeted account address.
- `tokens`: An optional array of fungible token objects.
- `options?: FetchOptions`: An optional parameter for configuring the request. It can include headers, credentials, or any other custom fetch settings.

#### Returns

- `Promise<AggregateBalances>`: A promise that resolves to an object mapping token symbols to balance information. The balance information contains the total balance and an array of token balances on different chains.

#### Example

```typescript
const ownerAddress = "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519";
sprinter.getUserBalances(ownerAddress).then(balances => {
  console.log('User balances:', balances);
});
```

### `getSolution(settings: SolutionOptions | ContractSolutionOptions, options?: FetchOptions): Promise<SolutionResponse>`

There are two variations of this method. One is used for general cross-chain transactions, and another handles contract call solutions:
- `SolutionOptions`: For standard cross-chain transfers.
- `ContractSolutionOptions`: For contract call solutions.
You can specify options to control how the request is made, including custom headers, credentials, or other fetch settings.

#### Parameters

- `settings`: An object containing the parameters for the solution request, excluding the account.
  - `account`: Targeted account address.
  - `token`: The token symbol (e.g., "USDC").
  - `destinationChain`: The ID of the destination blockchain.
  - `amount`: The amount to be transferred.
  - `threshold?`: An optional threshold parameter.
  - `whitelistedSourceChains?`: An optional array of whitelisted source chain IDs.

#### Returns

- `Promise<SolutionResponse>`: A promise that resolves to a solution response object.

#### Example

```typescript
const solutionSettings = {
  account: ownerAddress,
  token: "USDC",
  destinationChain: 42161,  // Destination chain ID
  amount: 1000000000        // Amount in the smallest unit (e.g., wei)
};

sprinter.getSolution(solutionSettings).then(solution => {
  console.log('Transaction solution:', solution);
});

// For contract call solution
const contractSolutionSettings = {
  contractCall: true,
  // Other contract call-specific options...
};

sprinter.getSolution(contractSolutionSettings).then(contractSolution => {
  console.log('Contract call solution:', contractSolution);
});
```

### `getCallSolution(settings: ContractSolutionOptions, options?: FetchOptions): Promise<SolutionResponse>`

Retrieves a solution for executing a contract call across chains.

#### Parameters

- `settings: ContractSolutionOptions`: The options required for creating a cross-chain contract call solution.
- `options: FetchOptions`: Optional fetch options to configure how the request is made.

#### Returns

- `Promise<SolutionResponse>`: A promise that resolves to a solution response object containing details about the contract call execution.

#### Example

```ts
const contractCallSettings = {
  account: ownerAddress,
  contractCall: true,
  token: "USDC",
  destinationChain: 42161,  // Destination chain ID
  amount: 1000000000        // Amount in the smallest unit (e.g., wei)
};

sprinter.getCallSolution(contractCallSettings).then(callSolution => {
  console.log('Contract call solution:', callSolution);
});
```

## Data Types

### `Address`

Represents an Ethereum address as a string.

### `TokenSymbol`

Represents a token symbol as a string.

### `ChainID`

Represents a chain ID as a number.

### `FungibleToken`

Represents a fungible token available in the system.

#### Properties

- `addresses: Record<ChainID, Address>`: The addresses of the token on different chains.
- `decimals: number`: The number of decimals the token uses.
- `logoURI: string`: The URI for the token's logo.
- `name: string`: The name of the token.
- `symbol: TokenSymbol`: The symbol of the token.

### `Chain`

Represents a supported blockchain network.

#### Properties

- `chainID: ChainID`: The chain ID.
- `chainType: ChainType`: The type of the chain.
- `name: string`: The name of the chain.
- `logoURI: string`: The URI for the chain's logo.
- `rpcurls: string[]`: The RPC URLs for the chain.

### `FungibleTokenBalance`

Represents a balance of a fungible token.

#### Properties

- `balance: string`: The balance amount in the smallest unit (e.g., wei).
- `chainId: ChainID`: The ID of the chain.
- `tokenDecimals: number`: The number of decimals for the token.

### `SolutionOptions`

Parameters for retrieving a transaction solution.

#### Properties

- `account: Address`: The account address.
- `destinationChain: ChainID`: The ID of the destination blockchain.
- `token: TokenSymbol`: The token symbol (e.g., "USDC").
- `amount: number`: The amount to be transferred.
- `threshold?`: An optional threshold parameter.
- `whitelistedSourceChains?`: An optional array of whitelisted source chain IDs.

### `SolutionResponse`

Represents a solution for a cross-chain transaction. It can either be an array of solutions or an error.

#### Properties

- `error?: string`: An optional error message if the solution failed.
- `solutions?: Solution[]`: An array of solution objects if the solution succeeded.

### `Solution`

Represents a single solution for a cross-chain transaction.

#### Properties

- `destinationChain: ChainID`: The ID of the destination chain.
- `destinationTokenAddress: Address`: The address of the destination token.
- `duration: number`: The estimated duration for the transaction in seconds.
- `fee: Amount`: The fee for the transaction.
- `gasCost: Amount`: The gas cost for the transaction.
- `senderAddress: Address`: The sender's address.
- `sourceChain: ChainID`: The ID of the source chain.
- `sourceTokenAddress: Address`: The address of the source token.
- `amount: string`: The amount to be transferred.
- `tool`: An object containing information about the tool used for the transaction.
    - `logoURI: string`: The URI for the tool's logo.
    - `name: string`: The name of the tool.
- `transaction: Transaction`: The transaction object to be used for executing the transaction.

### `Transaction`

Represents a transaction object.

#### Properties

- `chainId: ChainID`: The ID of the chain.
- `data: string`: The data for the transaction.
- `from: Address`: The sender's address.
- `gasLimit: string`: The gas limit for the transaction.
- `gasPrice: string`: The gas price for the transaction.
- `to: Address`: The recipient's address.
- `value: string`: The value of the transaction in the smallest unit (e.g., wei).

### `Amount`

Represents an amount in both native and USD values.

#### Properties

- `amount: string`: The amount in the smallest unit (e.g., wei).
- `amountUSD: number`: The equivalent amount in USD.
