import { Environment } from "../enums";
import type { RelayRequest } from "../relay";
import { getRequests } from "../relay";
import { RELAY_STATUSES_MAPPING } from "../relay/constants";
import { getTransfers } from "../sygma/api";
import type { Status, SygmaTransfer } from "../sygma/types";
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
  // * mapping statuses from relay to "sprinter" statuses
  // * inTxs and outTxs contain information about the
  // * transfer. e.g chain ID and amount of tokens
  const status = RELAY_STATUSES_MAPPING.get(entry.status);
  // ! throw error if data is not available
  if (!status || entry.data.inTxs.length <= 0 || entry.data.outTxs.length <= 0)
    throw new Error("Missing transaction information");
  return {
    originTx: entry.data.inTxs[0].hash,
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
