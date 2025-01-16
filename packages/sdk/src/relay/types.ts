/**
 * * All types extracted from official relay
 * * documentation which can be found here
 * * https://docs.relay.link/references/api/get-requests#parameter-user
 */

enum FailureReason {
  UNKNOWN = "UNKNOWN",
  AMOUNT_TOO_LOW_TO_REFUND = "AMOUNT_TOO_LOW_TO_REFUND",
  DEPOSIT_ADDRESS_MISMATCH = "DEPOSIT_ADDRESS_MISMATCH",
  DEPOSIT_CHAIN_MISMATCH = "DEPOSIT_CHAIN_MISMATCH",
  NA = "N/A",
}

enum RequestStatus {
  Refund = "refund",
  Delayed = "delayed",
  Waiting = "waiting",
  Failure = "failure",
  Pending = "pending",
  Success = "success",
}

interface Currency {
  name: string;
  symbol: string;
  address: string;
  chainId: number;
  decimals: number;
  metadata: {
    isNative: boolean;
    logoURI: string;
    verified: boolean;
  };
}

interface Fees {
  fixed: string;
  gas: string;
  price: string;
}

interface TransactionData {
  block: number;
  chainId: number;
  data: any;
  fee: string;
  hash: string;
  stateChanges: any;
  timestamp: number;
  type: string;
}

export interface RelayRequest {
  createdAt: string;
  data: {
    id: string;
    recipient: string;
    status: RequestStatus;
    updatedAt: string;
    user: string;
    appFees: Array<{
      amount: string;
      recipient: string;
    }>;
    currency: string;
    currencyObject: Currency;
    failReason: FailureReason;
    feeCurrency: string;
    feeCurrencyObject: Currency;
    fees: Fees;
    feesUsd: Fees;
    inTxs: Array<TransactionData>;
    outTxs: Array<TransactionData>;
    price: string;
    refundCurrencyData: {
      amount: string;
      amountFormatted: string;
      amountUsd: string;
      currency: Currency;
      minimumAmount: string;
    };
    timeEstimate: number;
    usesExternalLiquidity: boolean;
  };
}

export interface RelayRequestsResponse {
  continuation: string;
  requests: Array<RelayRequest>;
}
