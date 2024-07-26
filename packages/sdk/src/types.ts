import { ChainType } from "./enums";

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
  rpcurls: string[];
}

export interface FungibleTokenBalance {
  balance: string /* big number as string*/;
  chainId: ChainID;
  tokenDecimals: number;
}

export interface SolutionOptions {
  account: Address;
  destinationChain: ChainID;
  token: TokenSymbol;
  amount: number;
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

export interface ContractSolutionOptions extends SolutionOptions {
  contractCall: ContractCallSolutionOptions;
}

interface Amount {
  amount: string;
  amountUSD: number;
}

export type SolutionResponse = Solution[] | FailedSolution;

export interface FailedSolution {
  error: string;
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
  tool: {
    logoURI: string;
    name: string;
  };
  transaction: Transaction;
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
