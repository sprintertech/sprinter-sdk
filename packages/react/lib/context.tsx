import {createContext, ReactNode, useState} from "react";
import {type FetchOptions, Sprinter} from "@chainsafe/sprinter-sdk";
import {useTokens} from "./internal/useTokens.ts";
import {useChains} from "./internal/useChains.ts";
import {useSolution} from "./internal/useSolution.ts";

type SprinterContext = ReturnType<typeof useTokens> & ReturnType<typeof useChains> & ReturnType<typeof useSolution>;

const Context = createContext<SprinterContext | null>(null);

interface SprinterContextProps {
  children?: ReactNode | undefined;
  fetchOptions?: Omit<FetchOptions, "signal">;
}

export function SprinterContext({ children, fetchOptions }: SprinterContextProps) {
  const [sprinter] = useState(new Sprinter(fetchOptions));

  /** Balances */


  /** Tokens */
  const { tokens, getAvailableTokens } = useTokens(sprinter);

  /** Chains */
  const { chains, getAvailableChains } = useChains(sprinter);

  /** Solutions */
  const { solution, getSolution } = useSolution(sprinter);

  return <Context.Provider value={{
    tokens, getAvailableTokens,
    chains, getAvailableChains,
    solution, getSolution,
  }}>{children}</Context.Provider>;
}
