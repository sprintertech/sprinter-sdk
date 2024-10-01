import {useCallback, useContext} from "react";
import {Context} from "./context.tsx";
import {Address} from "@chainsafe/sprinter-sdk";
import {BalancesEntry} from "./internal/useBalances.ts";

/**
 * A hook to access the full Sprinter context, including balances, tokens, chains, and bridge solutions.
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

  if (!context) throw new Error('Sprinter Context is not defined');

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
  const { balances: _balances, getUserBalances: _getUserBalances } = useSprinter();

  const balances: BalancesEntry = _balances[account] || balancesEmptyState;
  const getUserBalances = useCallback(() => _getUserBalances(account), [account]);

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
 * A hook to retrieve bridge solutions and functions to interact with the Sprinter.
 *
 * @returns {{
 *   solution: AsyncRequestState<SolutionResponse>,
 *   getBridgeAggregateBalance: (request: {
 *     account: string,
 *     destinationChain: number,
 *     token: string,
 *     amount: string
 *   }) => void
 * }}
 * - `solution`: The state of the bridge solution, including:
 *   - `data`: The bridge solution, or `null` if not yet fetched.
 *   - `loading`: A boolean indicating if the request is in progress.
 *   - `error`: An error message, or `null` if there is no error.
 * - `getBridgeAggregateBalance`: A function to get the aggregate bridge balance based on the provided request.
 *
 * @example
 * ```ts
 * import React, { useEffect } from 'react';
 * import { useSprinterBridge } from '@chainsafe/sprinter-react';
 *
 * function BridgeComponent() {
 *   const { solution, getBridgeAggregateBalance } = useSprinterBridge();
 *
 *   useEffect(() => {
 *     getBridgeAggregateBalance({
 *       account: "0x3e101ec02e7a48d16dade204c96bff842e7e2519",
 *       destinationChain: 11155111,
 *       token: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
 *       amount: "100000000",
 *     });
 *   }, [getBridgeAggregateBalance]);
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
export function useSprinterBridge() {
  const { solution, getBridgeAndCall, getBridge, getBridgeAggregateBalance, getBridgeAggregateBalanceAndCall } = useSprinter();
  return { solution, getBridgeAndCall, getBridge, getBridgeAggregateBalance, getBridgeAggregateBalanceAndCall };
}
