import { Environment } from "../enums";
import type { Address } from "../types";

import type { SygmaTransfer } from "./sygmaTypes";

interface History {
  originTx: string;
  originName: string;
  destinationTx?: string;
  destinationName: string;
  amount: string;
  tokenSymbol: string;
}

export async function experimental_getBridgeHistory(
  address: Address,
  environment: Environment = Environment.MAINNET,
): Promise<History[]> {
  const transactions: History[] = [];

  switch (environment) {
    case Environment.MAINNET: {
      /** Sygma */
      const url = new URL(
        `/api/sender/${address}/transfers`,
        "https://api.buildwithsygma.com/",
      );
      url.searchParams.set("limit", "100");

      const response: SygmaTransfer[] = await fetch(url.toString()).then(
        (response): Promise<SygmaTransfer[]> => response.json(),
      );

      for (const entry of response) {
        transactions.push(handleSygmaResponseEntry(entry));
      }

      break;
    }
    case Environment.TESTNET: {
      /** Sygma */
      const url = new URL(
        `/api/sender/${address}/transfers`,
        "https://api.test.buildwithsygma.com/",
      );
      url.searchParams.set("limit", "100");

      const response: SygmaTransfer[] = await fetch(url.toString()).then(
        (response): Promise<SygmaTransfer[]> => response.json(),
      );

      for (const entry of response) {
        transactions.push(handleSygmaResponseEntry(entry));
      }

      break;
    }
  }

  return transactions;
}

function handleSygmaResponseEntry(entry: SygmaTransfer): History {
  return {
    originTx: entry.deposit?.txHash || "0x0",
    originName: entry.fromDomain.name,
    destinationTx: entry.execution?.txHash,
    destinationName: entry.toDomain.name,
    amount: entry.amount,
    tokenSymbol: entry.fee.tokenSymbol,
  };
}
