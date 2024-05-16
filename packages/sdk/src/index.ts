import { Chain, FungibleToken, Solution, SolutionOptions } from "./types";

export async function getSupportedChains(): Promise<Chain[]> {
  return Promise.resolve([]);
}

export async function getKnownFungibleTokens(): Promise<FungibleToken[]> {
  return Promise.resolve([]);
}

export async function getSolution({
  account,
  destinationChain,
  token,
  amount,
  threshold,
  whitelistedSourceChains,
}: SolutionOptions): Promise<Solution[]> {
  console.log(
    account,
    destinationChain,
    token,
    amount,
    threshold,
    whitelistedSourceChains
  );
  return Promise.resolve([]);
}
