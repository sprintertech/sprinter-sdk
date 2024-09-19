import {
  Address,
  ChainID,
  type SolutionResponse,
  Sprinter,
  TokenSymbol
} from "@chainsafe/sprinter-sdk";
import {useCallback} from "react";
import {useAsyncRequest} from "./useAsyncRequest.ts";

export function useSolution(sprinter: Sprinter) {
  const { state: solution, makeRequest } = useAsyncRequest<SolutionResponse>();

  const getSolution = useCallback((account: Address,
  destinationChain: ChainID,
  token: TokenSymbol,
  amount: number,
  threshold?: number,
  whitelistedSourceChains?: ChainID[],
  ) => {
    makeRequest(sprinter.getSolution({
      account, destinationChain, token, amount, threshold, whitelistedSourceChains,
    }));
  }, [sprinter, makeRequest]);

  return { solution, getSolution };
}
