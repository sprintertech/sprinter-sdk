import type { ChainType } from "./enums";

export type Address = `0x${string}`;

export type TokenSymbol = string;

export type ChainID = number;

export interface FungibleToken {
  addresses: Record<ChainID, Address>;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: TokenSymbol;
}

export interface Chain {
  chainID: ChainID;
  chainType: ChainType;
  name: string;
  logoURI: string;
  rpcURLs: string[];
}

export interface TokenBalance {
  balance: string /* big number as string*/;
  chainId: ChainID;
  tokenDecimals: number;
}

export type AggregateBalances = {
  [symbol: TokenSymbol]: { balances: TokenBalance[]; total: string };
};

export type FungibleTokenBalance = TokenBalance;

export type NativeTokenBalance = TokenBalance;

export type NumberLike = number | string | bigint;

export interface SolutionOptions {
  account: Address;
  destinationChain: ChainID;
  token: TokenSymbol;
  amount: NumberLike;
  threshold?: number;
  whitelistedSourceChains?: ChainID[];
}

export interface ContractCallSolutionOptions {
  callData: string;
  contractAddress: Address;
  gasLimit: number;
  ///
  outputTokenAddress?: Address;
  approvalAddress?: Address;
}

export interface SingleHopContractSolutionOptions extends SolutionOptions {
  recipient?: Address;
  contractCall?: ContractCallSolutionOptions;
  enableSwaps?: boolean;
}

export interface ContractSolutionOptions extends SolutionOptions {
  contractCall: ContractCallSolutionOptions;
}

export interface SweepSolutionOptions {
  account: Address;
  destinationChain: ChainID;
  token: TokenSymbol;
  sourceChains?: ChainID[];
  recipient?: Address;
}

interface Amount {
  amount: string;
  amountUSD: number;
}

export type SolutionResponse = Solution[] | FailedSolution;

export interface FailedSolution {
  error: string;
}

export interface Tool {
  logoURI: string;
  name: string;
}

export interface Solution {
  destinationChain: ChainID;
  destinationTokenAddress: Address;
  duration: number /* estimation duration by seconds */;
  fee: Amount;
  gasCost: Amount;
  senderAddress: Address;
  sourceChain: ChainID;
  sourceTokenAddress: Address;
  amount: string;
  tool: Tool;
  transaction: Transaction;
  approvals?: Transaction[];
}

export interface Transaction {
  chainId: ChainID;
  data: string;
  from: Address;
  gasLimit: string;
  gasPrice: string;
  to: Address;
  value: string;
}

export interface FetchOptions {
  signal?: AbortSignal;
  baseUrl?: string;
}
