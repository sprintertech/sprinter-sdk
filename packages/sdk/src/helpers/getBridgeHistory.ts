import { Environment } from "../enums";
import { getTransfers } from "../sygma/api";
import type { Status, SygmaTransfer } from "../sygma/types";
import type { Address } from "../types";

interface History {
  originTx: string;
  originName: string;
  destinationTx?: string;
  destinationName: string;
  amount: string;
  tokenSymbol: string;
  status: Status;
}

function handleSygmaResponseEntry(entry: SygmaTransfer): History {
  return {
    originTx: entry.deposit?.txHash || "0x0",
    originName: entry.fromDomain.name,
    destinationTx: entry.execution?.txHash,
    destinationName: entry.toDomain.name,
    amount: entry.amount,
    tokenSymbol: entry.fee.tokenSymbol,
    status: entry.status,
  };
}

/**
 * Returns bridging history
 * for an address
 * @param {Address} address
 * @param {Environment} environment
 * @returns {Promise<History[]>}
 */
export async function experimental_getBridgeHistory(
  address: Address,
  environment: Environment = Environment.MAINNET,
): Promise<History[]> {
  // TODO: add logic for all supported bridges
  const transactions = await getTransfers(address, environment).then(
    (sygmaTransfers) =>
      sygmaTransfers.map((transfer) => handleSygmaResponseEntry(transfer)),
  );

  return transactions;
}
