export interface Chain {}
export interface FungibleToken {}

export interface Solution {}

export interface SolutionOptions {
  account: string;
  destinationChain: Chain;
  token: FungibleToken;
  amount: bigint;
  threshold?: bigint;
  whitelistedSourceChains: Chain[];
}
