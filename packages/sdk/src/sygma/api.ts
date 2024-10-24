import { Environment } from "../enums";

import type { SygmaTransfer } from "./types";

const SYGMA_API_ENDPOINT: Record<Environment, string> = {
  [Environment.MAINNET]: "https://api.buildwithsygma.com/",
  [Environment.TESTNET]: "https://api.test.buildwithsygma.com/",
};

/**
 * Returns list of sygma transfers for an address
 * @param {`0x${string}`} address EVM address
 * @param {Environment} environment TESTNET or MAINNET
 * @returns {Promise<Array<SygmaTransfer>>}
 */
export async function getTransfers(
  address: string,
  environment: Environment,
): Promise<Array<SygmaTransfer>> {
  const transfersPath = `/api/sender/${address}/transfers`;
  const url = new URL(transfersPath, SYGMA_API_ENDPOINT[environment]);
  url.searchParams.set("limit", "100");

  const response: SygmaTransfer[] = await fetch(url.toString()).then(
    (response): Promise<SygmaTransfer[]> => response.json(),
  );

  return response;
}
