import {
  type SolutionResponse,
  Sprinter,
} from "@chainsafe/sprinter-sdk";
import {useCallback} from "react";
import {useAsyncRequest} from "./useAsyncRequest";
import type {Infer} from "superstruct";
import {
  MultiHopSchema,
  MultiHopWithContractSchema,
  SingleHopSchema, SingleHopWithContractSchema
} from "@chainsafe/sprinter-sdk/dist/internal/validators";

export function useBridge(sprinter: Sprinter) {
  const { state: solution, makeRequest } = useAsyncRequest<SolutionResponse>();

  const getBridgeAggregateBalance = useCallback((settings: Infer<typeof MultiHopSchema>) => {
    makeRequest(sprinter.bridgeAggregateBalance(settings));
  }, [sprinter, makeRequest]);

  const getBridgeAggregateBalanceAndCall = useCallback((settings: Infer<typeof MultiHopWithContractSchema>) => {
    makeRequest(sprinter.bridgeAggregateBalanceAndCall(settings));
  }, [sprinter, makeRequest]);

  const getBridgeBalance = useCallback((settings: Infer<typeof SingleHopSchema>) => {
    makeRequest(sprinter.bridge(settings));
  }, [sprinter, makeRequest]);

  const getBridgeAndCall = useCallback((settings: Infer<typeof SingleHopWithContractSchema>) => {
    makeRequest(sprinter.bridgeAndCall(settings));
  }, [sprinter, makeRequest]);

  return { solution, getBridgeBalance, getBridgeAndCall, getBridgeAggregateBalance, getBridgeAggregateBalanceAndCall };
}
