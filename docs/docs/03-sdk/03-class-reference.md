---
sidebar_position: 3
---

# Sprinter Class Reference

This section details the methods available to the `Sprinter` class in the Sprinter SDK. Use this reference to understand how to utilize the `Sprinter` class in your decentralized applications (dApps).

## Methods

### `constructor(provider: EIP1193Provider)`

Initializes the SDK with the given Ethereum provider.

#### Parameters

- `provider`: An Ethereum provider instance conforming to the EIP-1193 standard (e.g., `window.ethereum`).

#### Example

```typescript
const sprinter = new Sprinter(window.ethereum);
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

### `getUserBalances(tokens?: FungibleToken[]): Promise<{ [symbol: TokenSymbol]: { balances: FungibleTokenBalance[]; total: string } }>`

Fetches the user's balances for specified tokens across multiple blockchains. If no tokens are specified, it fetches balances for all available tokens.

#### Parameters

- `tokens`: An optional array of fungible token objects.

#### Returns

- `Promise<{ [symbol: TokenSymbol]: { balances: FungibleTokenBalance[]; total: string } }>`: A promise that resolves to an object mapping token symbols to balance information.

#### Example

```typescript
sprinter.getUserBalances().then(balances => {
  console.log('User balances:', balances);
});
```

### `getSolution(settings: Omit<SolutionOptions, "account">, targetAccount?: Address): Promise<SolutionResponse>`

Retrieves the optimal solution for managing cross-chain transactions based on the provided settings.

#### Parameters

- `settings`: An object containing the parameters for the solution request, excluding the account.
    - `token`: The token symbol (e.g., "USDC").
    - `destinationChain`: The ID of the destination blockchain.
    - `amount`: The amount to be transferred.
    - `threshold?`: An optional threshold parameter.
    - `whitelistedSourceChains?`: An optional array of whitelisted source chain IDs.
- `targetAccount`: An optional account address. If not provided, the current account will be used.

#### Returns

- `Promise<SolutionResponse>`: A promise that resolves to a solution response object.

#### Example

```typescript
sprinter.getSolution({
  token: "USDC",
  destinationChain: 42161,  // Destination chain ID
  amount: 1000000000        // Amount in the smallest unit (e.g., wei)
}).then(solution => {
  console.log('Transaction solution:', solution);
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
