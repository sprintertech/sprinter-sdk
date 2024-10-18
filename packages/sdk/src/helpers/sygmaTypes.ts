export interface SygmaTransfer {
  id: string;
  depositNonce: number;
  resource: Resource;
  fromDomain: Domain;
  fromDomainId: number;
  toDomain: Domain;
  toDomainId: number;
  sender: string;
  destination: string;
  amount: string;
  timestamp?: string;
  status: TransferStatus;
  deposit?: Deposit;
  execution?: Execution;
  fee: Fee;
  resourceID: string;
  usdValue: number;
  accountId: string;
}

export enum TransferStatus {
  pending = "pending",
  executed = "executed",
  failed = "failed",
}

export interface Resource {
  id: string;
  type: string;
}

export interface Domain {
  id: string;
  name: string;
  lastIndexedBlock: string;
}

export interface Deposit {
  id: string;
  transferId: string;
  type: string;
  txHash: string;
  blockNumber: string;
  depositData: string;
  handlerResponse: string;
  timestamp: string;
}

export interface Execution {
  id: string;
  transferId: string;
  type: string;
  txHash: string;
  blockNumber: string;
  executionEvent: string;
  timestamp: string;
}

export interface Fee {
  amount: string;
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  transferId: string;
  decimals: number;
}
