import {
  Address,
  ChainID, ContractCallSolutionOptions,
  type SolutionResponse,
  Sprinter,
  TokenSymbol
} from "@chainsafe/sprinter-sdk";
import {useCallback} from "react";
import { useAsyncRequest} from "./useAsyncRequest.ts";

export function useCallSolution(sprinter: Sprinter) {
  const { state: callSolution, makeRequest } = useAsyncRequest<SolutionResponse>();

  const getCallSolution = useCallback((account: Address,
                                   destinationChain: ChainID,
                                   token: TokenSymbol,
                                   amount: number,
                                   contractCall: ContractCallSolutionOptions,
                                   threshold?: number,
                                   whitelistedSourceChains?: ChainID[],
  ) => {
    if (callSolution.loading) return;

    makeRequest(sprinter.getCallSolution({
      account, destinationChain, token, amount, threshold, whitelistedSourceChains, contractCall
    }));
  }, [sprinter, makeRequest, callSolution]);

  return { callSolution, getCallSolution };
}
