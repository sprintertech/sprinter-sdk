import { type SolutionResponse, Sprinter } from "@chainsafe/sprinter-sdk";
import { useCallback } from "react";
import { useAsyncRequest } from "./useAsyncRequest";
import type { Infer } from "superstruct";
import {
  MultiHopSchema,
  MultiHopWithContractSchema,
  SingleHopSchema,
  SingleHopWithContractSchema,
  SweepSchema,
} from "@chainsafe/sprinter-sdk/dist/internal/validators";

export function useTransfers(sprinter: Sprinter) {
  const { state: solution, makeRequest } = useAsyncRequest<SolutionResponse>();

  const getPoolAssetOnDestination = useCallback(
    (settings: Infer<typeof MultiHopSchema>) => {
      makeRequest(sprinter.poolAssetOnDestination(settings));
    },
    [sprinter, makeRequest],
  );

  const getPoolAssetOnDestinationWithHook = useCallback(
    (settings: Infer<typeof MultiHopWithContractSchema>) => {
      makeRequest(sprinter.poolAssetOnDestinationWithHook(settings));
    },
    [sprinter, makeRequest],
  );

  const getTransfer = useCallback(
    (settings: Infer<typeof SingleHopSchema>) => {
      makeRequest(sprinter.transfer(settings));
    },
    [sprinter, makeRequest],
  );

  const getTransferWithHook = useCallback(
    (settings: Infer<typeof SingleHopWithContractSchema>) => {
      makeRequest(sprinter.transferWithHook(settings));
    },
    [sprinter, makeRequest],
  );

  const getSweep = useCallback(
    (settings: Infer<typeof SweepSchema>) => {
      makeRequest(sprinter.sweep(settings));
    },
    [sprinter, makeRequest],
  );

  return {
    solution,
    getTransfer,
    getTransferWithHook,
    getPoolAssetOnDestination,
    getPoolAssetOnDestinationWithHook,
    getSweep,
  };
}
