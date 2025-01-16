import { Environment } from "../enums";
import { getRequests, RelayRequest } from "../relay";
import { getTransfers } from "../sygma/api";
import { Status, SygmaTransfer } from "../sygma/types";
import type { Address } from "../types";

interface History {
  originTx: string;
  originChainId: number;
  destinationTx?: string;
  destinationChainId: number;
  amount: string;
  tokenSymbol: string;
  status: Status;
}

function handleSygmaResponseEntry(entry: SygmaTransfer): History {
  return {
    originTx: entry.deposit?.txHash || "0x0",
    originChainId: Number(entry.fromDomain.id),
    destinationTx: entry.execution?.txHash,
    destinationChainId: Number(entry.toDomain.name),
    amount: entry.amount,
    tokenSymbol: entry.fee.tokenSymbol,
    status: entry.status,
  };
}

function handleRelayResponseEntry(entry: RelayRequest): History {
  // * sprinter SDK offers only 3 statuses
  // * through "Status" enum
  // ? should this be done?
  let status = ["delayed", "waiting", "pending"].includes(entry.status)
    ? Status.pending
    : entry.status === "success"
      ? Status.executed
      : Status.failed;

  return {
    originTx: entry.id,
    originChainId: entry.data.inTxs[0].chainId,
    destinationChainId: entry.data.outTxs[0].chainId,
    amount: entry.data.metadata.currencyIn.amountFormatted,
    tokenSymbol: entry.data.currencyObject.symbol,
    status,
  };
}

/**
 * Returns bridging history
 * for an address
 * @param {Address} address
 * @param {Environment} environment
 * @returns {Promise<History[]>}
 */
export async function getBridgeHistory(
  address: Address,
  environment: Environment = Environment.MAINNET,
): Promise<History[]> {
  // TODO: add logic for all supported bridges
  const transactions = await getTransfers(address, environment).then(
    (sygmaTransfers) =>
      sygmaTransfers.map((transfer) => handleSygmaResponseEntry(transfer)),
  );

  transactions.push(
    ...(await getRequests(address, environment).then((response) =>
      response.requests.map((request) => handleRelayResponseEntry(request)),
    )),
  );

  return transactions;
}
