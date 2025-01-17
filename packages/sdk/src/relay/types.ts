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

export enum RelayRequestStatus {
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
  fee: string;
  // * relay documentation marks these as any
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  data: any;
  // * relay documentation marks these as any
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  stateChanges: any;
  hash: string;
  block: number;
  type: string;
  chainId: number;
  timestamp: number;
}

export interface RelayRequest {
  id: string;
  status: RelayRequestStatus;
  user: string;
  recipient: string;
  createdAt: string;
  updatedAt: string;

  data: {
    failReason: FailureReason;
    fees: Fees;
    feesUsd: Fees;
    inTxs: Array<TransactionData>;
    currency: string;
    currencyObject: Currency;
    feeCurrency: string;
    feeCurrencyObject: Currency;
    appFees: Array<{
      amount: string;
      recipient: string;
    }>;
    metadata: {
      sender: string;
      recipient: string;
      currencyIn: {
        currency: Currency;
        amount: string;
        amountFormatted: string;
        amountUsd: string;
        minimumAmount: string;
      };
      currencyOut: {
        currency: Currency;
        amount: string;
        amountFormatted: string;
        amountUsd: string;
        minimumAmount: string;
      };
      rate: string;
    };
    price: string;
    usesExternalLiquidity: boolean;
    timeEstimate: number;
    outTxs: Array<TransactionData>;

    refundCurrencyData: {
      amount: string;
      amountFormatted: string;
      amountUsd: string;
      currency: Currency;
      minimumAmount: string;
    };
  };
}

export interface RelayRequestsResponse {
  continuation: string;
  requests: Array<RelayRequest>;
}
