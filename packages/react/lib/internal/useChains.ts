import {type Chain, Sprinter} from "@chainsafe/sprinter-sdk";
import {useCallback} from "react";
import {useAsyncRequest} from "./useAsyncRequest.ts";

export function useChains(sprinter: Sprinter) {
  const { state: chains, makeRequest } = useAsyncRequest<Chain[]>();

  const getAvailableChains = useCallback(() => {
    makeRequest(sprinter.getAvailableChains());
  }, [sprinter, makeRequest]);

  return { chains, getAvailableChains };
}
