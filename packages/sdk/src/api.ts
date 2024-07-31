import type {
  Address,
  Chain,
  ChainID,
  ContractSolutionOptions,
  FailedSolution,
  FungibleToken,
  FungibleTokenBalance,
  Solution,
  SolutionOptions,
  SolutionResponse,
  TokenSymbol,
} from "./types";
import { getEnv } from "./utils";

export let BASE_URL = getEnv(
  "SPRINTER_URL",
  "https://api.sprinter.buildwithsygma.com/",
);
export function setBaseUrl(url: string): void {
  BASE_URL = url;
}

export async function getSupportedChains(): Promise<Chain[]> {
  const url = new URL("/networks", BASE_URL);
  const response = await fetch(url).then(
    (response) => response.json() as unknown as { data: Chain[] },
  );

  return response.data;
}

export async function getChainTokens(
  chainID: ChainID,
): Promise<FungibleToken[]> {
  const url = new URL(`/networks/${chainID}/assets/fungible`, BASE_URL);
  const response = await fetch(url).then(
    (response) => response.json() as unknown as { data: FungibleToken[] },
  );

  return response.data;
}

export async function getFungibleTokens(): Promise<FungibleToken[]> {
  const url = new URL("/assets/fungible", BASE_URL);
  const response = await fetch(url).then(
    (response) => response.json() as unknown as { data: FungibleToken[] },
  );

  return response.data;
}

export async function getFungibleToken(
  token: TokenSymbol,
): Promise<FungibleToken> {
  const url = new URL(`/assets/fungible/${token}`, BASE_URL);
  return await fetch(url).then(
    (response) => response.json() as unknown as FungibleToken,
  );
}

export async function getUserFungibleTokens(
  address: Address,
  token: TokenSymbol,
): Promise<FungibleTokenBalance[]> {
  const url = new URL(
    `/accounts/${address}/assets/fungible/${token}`,
    BASE_URL,
  );
  const response = await fetch(url).then(
    (response) =>
      response.json() as unknown as { data: FungibleTokenBalance[] },
  );

  return response.data;
}

export async function getSolution({
  account,
  destinationChain,
  token,
  amount,
  threshold,
  whitelistedSourceChains,
}: SolutionOptions): Promise<SolutionResponse> {
  const url = new URL("/solutions/aggregation", BASE_URL);

  url.searchParams.set("account", account);
  url.searchParams.set("destination", String(destinationChain));
  url.searchParams.set("token", token);
  url.searchParams.set("amount", String(amount));
  //
  if (threshold) url.searchParams.set("threshold", String(threshold));
  if (whitelistedSourceChains?.length)
    url.searchParams.set(
      "whitelistedSourceChains",
      whitelistedSourceChains.join(","),
    );

  const response = await fetch(url).then(
    (response) =>
      response.json() as unknown as { data: Solution[] } | FailedSolution,
  );

  if ("error" in response) return response;
  return response.data;
}

export async function getContractSolution({
  account,
  destinationChain,
  token,
  amount,
  contractCall,
  threshold,
  whitelistedSourceChains,
}: ContractSolutionOptions): Promise<SolutionResponse> {
  const url = new URL("/solutions/aggregation", BASE_URL);

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      account,
      token,
      amount: String(amount),
      destination: destinationChain,
      destinationContractCall: contractCall,
      type: "fungible",
      threshold,
      whitelistedSourceChains,
    }),
  }).then(
    (response) =>
      response.json() as unknown as { data: Solution[] } | FailedSolution,
  );

  if ("error" in response) return response;
  return response.data;
}
