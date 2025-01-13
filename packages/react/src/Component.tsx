import { useEffect } from "react";
import { useSprinterTokens, useSprinterTransfers } from "../lib/hooks.ts";

export function Component() {
  const { getAvailableTokens } = useSprinterTokens();
  const { getSweep, solution } = useSprinterTransfers();

  useEffect(() => {
    getAvailableTokens();
  }, [getAvailableTokens]);

  useEffect(() => {
    getSweep({
      account: "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519",
      destinationChain: 11155111,
      token: "USDC",
    });
  }, [getSweep]);

  return <pre>{JSON.stringify(solution, null, 2)}</pre>;
}
