import { useCallback, useContext } from "react";
import { Context } from "./context.tsx";
import { Address } from "@chainsafe/sprinter-sdk";
import { BalancesEntry } from "./internal/useBalances.ts";

/**
 * A hook to access the full Sprinter context, including balances, tokens, chains, and transfer solutions.
 *
 * @returns {SprinterContext} The current context value with Sprinter functionalities.
 *
 * @throws {Error} If the context is not available.
 *
 * @example
 * ```ts
 * import { useSprinter } from '@chainsafe/sprinter-react';
 *
 * const { balances, tokens, chains, solution } = useSprinter();
 * ```
 */
export function useSprinter() {
  const context = useContext(Context);

  if (!context) throw new Error("Sprinter Context is not defined");

  return context;
}

/** Balances */
const balancesEmptyState = {
  data: null,
  loading: false,
  error: null,
};
/**
 * A hook to retrieve the user's token balances and a function to fetch them.
 *
 * @param {Address} account - The user's wallet address.
 *
 * @returns {{
 *   balances: AsyncRequestState<BalancesEntry>,
 *   getUserBalances: () => void
 * }}
 * - `balances`: The state of the user's token balances for the specified account, including:
 *   - `data`: The token balances, or `null` if not yet fetched.
 *   - `loading`: A boolean indicating if the request is in progress.
 *   - `error`: An error message, or `null` if there is no error.
 * - `getUserBalances`: A function to fetch the user's balances for the specified account.
 *
 * @example
 * ```ts
 * import React, { useEffect } from 'react';
 * import { useSprinterBalances } from '@chainsafe/sprinter-react';
 *
 * function BalancesComponent() {
 *   const { balances, getUserBalances } = useSprinterBalances("0xYourAddress");
 *
 *   useEffect(() => {
 *     getUserBalances();
 *   }, [getUserBalances]);
 *
 *   if (balances.loading) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   if (balances.error) {
 *     return <div>Error: {balances.error}</div>;
 *   }
 *
 *   return (
 *     <ul>
 *       {Object.entries(balances.data || {}).map(([symbol, balanceEntry]) => (
 *         <li key={symbol}>{symbol}: {balanceEntry.total}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useSprinterBalances(account: Address) {
  const { balances: _balances, getUserBalances: _getUserBalances } =
    useSprinter();

  const balances: BalancesEntry = _balances[account] || balancesEmptyState;
  const getUserBalances = useCallback(
    () => _getUserBalances(account),
    [_getUserBalances, account]
  );

  return { balances, getUserBalances };
}

/**
 * A hook to retrieve available tokens and a function to fetch them.
 *
 * @returns {{
 *   tokens: AsyncRequestState<FungibleToken[]>,
 *   getAvailableTokens: () => void
 * }}
 * - `tokens`: The state of available tokens, including:
 *   - `data`: The list of available tokens, or `null` if not yet fetched.
 *   - `loading`: A boolean indicating if the request is in progress.
 *   - `error`: An error message, or `null` if there is no error.
 * - `getAvailableTokens`: A function to fetch the available tokens.
 *
 * @example
 * ```ts
 * import React, { useEffect } from 'react';
 * import { useSprinterTokens } from '@chainsafe/sprinter-react';
 *
 * function TokensComponent() {
 *   const { tokens, getAvailableTokens } = useSprinterTokens();
 *
 *   useEffect(() => {
 *     getAvailableTokens();
 *   }, [getAvailableTokens]);
 *
 *   if (tokens.loading) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   if (tokens.error) {
 *     return <div>Error: {tokens.error}</div>;
 *   }
 *
 *   return (
 *     <ul>
 *       {tokens.data?.map(token => (
 *         <li key={token.symbol}>{token.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useSprinterTokens() {
  const { tokens, getAvailableTokens } = useSprinter();
  return { tokens, getAvailableTokens };
}

/**
 * A hook to retrieve available chains and a function to fetch them.
 *
 * @returns {{
 *   chains: AsyncRequestState<Chain[]>,
 *   getAvailableChains: () => void
 * }}
 * - `chains`: The state of available chains, including:
 *   - `data`: The list of available chains, or `null` if not yet fetched.
 *   - `loading`: A boolean indicating if the request is in progress.
 *   - `error`: An error message, or `null` if there is no error.
 * - `getAvailableChains`: A function to fetch the available chains.
 *
 * @example
 * ```ts
 * import React, { useEffect } from 'react';
 * import { useSprinterChains } from '@chainsafe/sprinter-react';
 *
 * function ChainsComponent() {
 *   const { chains, getAvailableChains } = useSprinterChains();
 *
 *   useEffect(() => {
 *     getAvailableChains();
 *   }, [getAvailableChains]);
 *
 *   if (chains.loading) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   if (chains.error) {
 *     return <div>Error: {chains.error}</div>;
 *   }
 *
 *   return (
 *     <ul>
 *       {chains.data?.map(chain => (
 *         <li key={chain.chainID}>{chain.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useSprinterChains() {
  const { chains, getAvailableChains } = useSprinter();
  return { chains, getAvailableChains };
}

/**
 * A hook to retrieve transfer and pooling solutions and functions to interact with the Sprinter SDK.
 *
 * @returns {{
 *   solution: AsyncRequestState<SolutionResponse>,
 *   getTransfer: (request: {
 *     account: string,
 *     destinationChain: number,
 *     token: string,
 *     amount: string
 *   }) => void,
 *   getTransferWithHook: (request: {
 *     account: string,
 *     destinationChain: number,
 *     token: string,
 *     amount: string,
 *     contractCall: object
 *   }) => void,
 *   getPoolAssetOnDestination: (request: {
 *     account: string,
 *     destinationChain: number,
 *     token: string,
 *     amount: string,
 *     sourceChains?: number[]
 *   }) => void,
 *   getPoolAssetOnDestinationWithHook: (request: {
 *     account: string,
 *     destinationChain: number,
 *     token: string,
 *     amount: string,
 *     contractCall: object,
 *     sourceChains?: number[]
 *   }) => void
 * }}
 * - `solution`: The state of the solution, including:
 *   - `data`: The solution, or `null` if not yet fetched.
 *   - `loading`: A boolean indicating if the request is in progress.
 *   - `error`: An error message, or `null` if there is no error.
 * - `getTransfer`: A function to get a single-hop transfer solution based on the provided request.
 * - `getTransferWithHook`: A function to get a transfer solution that includes an additional contract call on the destination chain.
 * - `getPoolAssetOnDestination`: A function to get a solution for pooling assets from multiple chains and transferring them to the destination chain.
 * - `getPoolAssetOnDestinationWithHook`: A function to get a solution for pooling assets and performing a contract call on the destination chain.
 *
 * @example
 * ```ts
 * import React, { useEffect } from 'react';
 * import { useSprinterTransfers } from '@chainsafe/sprinter-react';
 *
 * function TransfersComponent() {
 *   const { solution, getPoolAssetOnDestination } = useSprinterTransfers();
 *
 *   useEffect(() => {
 *     getPoolAssetOnDestination({
 *       account: "0x3e101ec02e7a48d16dade204c96bff842e7e2519",
 *       destinationChain: 11155111,
 *       token: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
 *       amount: "100000000",
 *       sourceChains: [84532, 137],
 *     });
 *   }, [getPoolAssetOnDestination]);
 *
 *   if (solution.loading) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   if (solution.error) {
 *     return <div>Error: {solution.error}</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <pre>{JSON.stringify(solution.data, null, 2)}</pre>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSprinterTransfers() {
  const {
    solution,
    getTransfer,
    getTransferWithHook,
    getPoolAssetOnDestination,
    getPoolAssetOnDestinationWithHook,
  } = useSprinter();
  return {
    solution,
    getTransfer,
    getTransferWithHook,
    getPoolAssetOnDestination,
    getPoolAssetOnDestinationWithHook,
  };
}
