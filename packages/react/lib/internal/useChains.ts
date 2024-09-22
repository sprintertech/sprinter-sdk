import {type Chain, Sprinter} from "@chainsafe/sprinter-sdk";
import {useCallback} from "react";
import {useAsyncRequest} from "./useAsyncRequest.ts";

export function useChains(sprinter: Sprinter) {
  const { state: chains, makeRequest } = useAsyncRequest<Chain[]>();

  const getAvailableChains = useCallback(() => {
    if (chains.loading) return;

    makeRequest(sprinter.getAvailableChains());
  }, [sprinter, makeRequest, chains]);

  return { chains, getAvailableChains };
}
