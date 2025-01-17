import { type FungibleToken, Sprinter } from "@chainsafe/sprinter-sdk";
import { useCallback } from "react";
import { useAsyncRequest } from "./useAsyncRequest.ts";

export function useTokens(sprinter: Sprinter) {
  const { state: tokens, makeRequest } = useAsyncRequest<FungibleToken[]>();

  const getAvailableTokens = useCallback(() => {
    makeRequest(sprinter.getAvailableTokens());
  }, [sprinter, makeRequest]);

  return { tokens, getAvailableTokens };
}
