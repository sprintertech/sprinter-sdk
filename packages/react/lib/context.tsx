import {createContext, ReactNode, useEffect, useState} from "react";
import {type FetchOptions, Sprinter} from "@chainsafe/sprinter-sdk";
import {useTokens} from "./internal/useTokens.ts";
import {useChains} from "./internal/useChains.ts";
import {useBalances} from "./internal/useBalances.ts";
import {useBridge} from "./internal/useBridge.ts";

type SprinterContext = ReturnType<typeof useBalances> & ReturnType<typeof useTokens> & ReturnType<typeof useChains> & ReturnType<typeof useBridge>;

export const Context = createContext<SprinterContext | null>(null);

interface SprinterContextProps {
  children?: ReactNode | undefined;
  fetchOptions?: Omit<FetchOptions, "signal">;
}

export function SprinterContext({ children, fetchOptions }: SprinterContextProps) {
  const [sprinter] = useState(new Sprinter(fetchOptions));

  /** Balances */
  const { balances, getUserBalances } = useBalances(sprinter);

  /** Tokens */
  const { tokens, getAvailableTokens } = useTokens(sprinter);

  /** Chains */
  const { chains, getAvailableChains } = useChains(sprinter);

  /** Solutions */
  const { solution, getBridgeAndCall, getBridgeBalance, getBridgeAggregateBalance, getBridgeAggregateBalanceAndCall } = useBridge(sprinter);

  /** Initialization */
  useEffect(() => {
    getAvailableTokens();
    getAvailableChains();
  }, [sprinter]);

  return <Context.Provider value={{
    balances, getUserBalances,
    tokens, getAvailableTokens,
    chains, getAvailableChains,
    solution, getBridgeAndCall, getBridgeBalance, getBridgeAggregateBalance, getBridgeAggregateBalanceAndCall,
  }}>{children}</Context.Provider>;
}
