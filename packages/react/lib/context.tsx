import { createContext, ReactNode, useEffect, useState } from "react";
import { Sprinter } from "@chainsafe/sprinter-sdk";
import { useTokens } from "./internal/useTokens.ts";
import { useChains } from "./internal/useChains.ts";
import { useBalances } from "./internal/useBalances.ts";
import { useTransfers } from "./internal/useTransfers.ts";

type SprinterContext = ReturnType<typeof useBalances> &
  ReturnType<typeof useTokens> &
  ReturnType<typeof useChains> &
  ReturnType<typeof useTransfers>;

export const Context = createContext<SprinterContext | null>(null);

interface SprinterContextProps {
  children?: ReactNode;
  baseUrl?: string;
}

/**
 * SprinterContext is a context provider component that initializes a Sprinter instance
 * and provides various functionalities for interacting with tokens, chains, balances,
 * and bridging solutions through React Context.
 *
 * It fetches and provides tokens, chains, user balances, and bridging solutions to any
 * component that consumes this context.
 *
 * @param {SprinterContextProps} props - The props for the component:
 * - `children` (ReactNode): The child components that will have access to the context.
 * - `baseUrl` (string, optional): The base URL to be used for all fetch requests in the Sprinter SDK.
 *
 * @returns {JSX.Element} A context provider that supplies tokens, chains, balances, and bridging solutions to its children.
 *
 * @example
 * ```ts
 * import { SprinterContext, Environment } from '@chainsafe/sprinter-react';
 *
 * function App() {
 *   return (
 *     <SprinterContext baseUrl={Environment.TESTNET}>
 *       <YourComponent />
 *     </SprinterContext>
 *   );
 * }
 * ```
 */
export function SprinterContext({ children, baseUrl }: SprinterContextProps) {
  const [sprinter] = useState(new Sprinter({ baseUrl }));

  /** Balances */
  const { balances, getUserBalances } = useBalances(sprinter);

  /** Tokens */
  const { tokens, getAvailableTokens } = useTokens(sprinter);

  /** Chains */
  const { chains, getAvailableChains } = useChains(sprinter);

  /** Solutions */
  const {
    solution,
    getTransfer,
    getTransferWithHook,
    getPoolAssetOnDestination,
    getPoolAssetOnDestinationWithHook,
  } = useTransfers(sprinter);

  /** Initialization */
  useEffect(() => {
    getAvailableTokens();
    getAvailableChains();
  }, [sprinter]);

  return (
    <Context.Provider
      value={{
        balances,
        getUserBalances,
        tokens,
        getAvailableTokens,
        chains,
        getAvailableChains,
        solution,
        getTransfer,
        getTransferWithHook,
        getPoolAssetOnDestination,
        getPoolAssetOnDestinationWithHook,
      }}
    >
      {children}
    </Context.Provider>
  );
}
