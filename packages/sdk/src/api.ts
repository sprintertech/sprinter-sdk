import type {
  Address,
  Chain,
  ChainID,
  ContractSolutionOptions,
  FailedSolution,
  FetchOptions,
  FungibleToken,
  FungibleTokenBalance,
  NativeTokenBalance,
  SingleHopContractSolutionOptions,
  Solution,
  SolutionOptions,
  SolutionResponse,
  SweepSolutionOptions,
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

export async function getSupportedChains({
  baseUrl,
  signal,
}: FetchOptions = {}): Promise<Chain[]> {
  const url = new URL("/networks", baseUrl || BASE_URL);
  const response = await fetch(url, { signal }).then(
    (response) => response.json() as unknown as { data: Chain[] },
  );

  return response.data;
}

export async function getChainTokens(
  chainID: ChainID,
  { baseUrl, signal }: FetchOptions = {},
): Promise<FungibleToken[]> {
  const url = new URL(
    `/networks/${chainID}/assets/fungible`,
    baseUrl || BASE_URL,
  );
  const response = await fetch(url, { signal }).then(
    (response) => response.json() as unknown as { data: FungibleToken[] },
  );

  return response.data;
}

export async function getFungibleTokens({
  baseUrl,
  signal,
}: FetchOptions = {}): Promise<FungibleToken[]> {
  const url = new URL("/assets/fungible", baseUrl || BASE_URL);
  const response = await fetch(url, { signal }).then(
    (response) => response.json() as unknown as { data: FungibleToken[] },
  );

  return response.data;
}

export async function getFungibleToken(
  token: TokenSymbol,
  { baseUrl, signal }: FetchOptions = {},
): Promise<FungibleToken> {
  const url = new URL(`/assets/fungible/${token}`, baseUrl || BASE_URL);
  return await fetch(url, { signal }).then(
    (response) => response.json() as unknown as FungibleToken,
  );
}

export async function getErc20Balances(
  address: Address,
  token: TokenSymbol,
  { baseUrl, signal }: FetchOptions = {},
): Promise<FungibleTokenBalance[]> {
  const url = new URL(
    `/accounts/${address}/assets/fungible/${token}`,
    baseUrl || BASE_URL,
  );
  const response = await fetch(url, { signal }).then(
    (response) =>
      response.json() as unknown as { data: FungibleTokenBalance[] },
  );

  return response.data;
}

export async function getUserNativeTokens(
  address: Address,
  { baseUrl, signal }: FetchOptions = {},
): Promise<NativeTokenBalance[]> {
  const url = new URL(
    `/accounts/${address}/assets/native`,
    baseUrl || BASE_URL,
  );
  const response = await fetch(url, { signal }).then(
    (response) => response.json() as unknown as { data: NativeTokenBalance[] },
  );

  return response.data;
}

export async function getSolution(
  {
    account,
    destinationChain,
    token,
    amount,
    threshold,
    whitelistedSourceChains,
  }: SolutionOptions,
  { baseUrl, signal }: FetchOptions = {},
): Promise<SolutionResponse> {
  const url = new URL("/solutions/aggregation", baseUrl || BASE_URL);

  url.searchParams.set("account", account);
  url.searchParams.set("destination", String(destinationChain));
  url.searchParams.set("token", token);
  url.searchParams.set("amount", String(amount));
  //
  threshold && url.searchParams.set("threshold", String(threshold));
  whitelistedSourceChains?.length &&
    url.searchParams.set(
      "whitelistedSourceChains",
      whitelistedSourceChains.join(","),
    );

  const response = await fetch(url, { signal }).then(
    (response) =>
      response.json() as unknown as { data: Solution[] } | FailedSolution,
  );

  if ("error" in response) return response;
  return response.data;
}

export async function getContractSolution(
  {
    account,
    destinationChain,
    token,
    amount,
    contractCall,
    threshold,
    whitelistedSourceChains,
  }: ContractSolutionOptions,
  { baseUrl, signal }: FetchOptions = {},
): Promise<SolutionResponse> {
  const url = new URL("/solutions/aggregation", baseUrl || BASE_URL);

  const response = await fetch(url, {
    signal,
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

export async function getContractCallSolution(
  {
    account,
    destinationChain,
    token,
    amount,
    contractCall,
    recipient,
    threshold,
    whitelistedSourceChains,
    enableSwaps,
  }: SingleHopContractSolutionOptions,
  { baseUrl, signal }: FetchOptions = {},
): Promise<SolutionResponse> {
  const url = new URL("/solution/call", baseUrl || BASE_URL);

  const response = await fetch(url, {
    signal,
    method: "POST",
    body: JSON.stringify({
      account,
      token,
      amount: String(amount),
      destination: destinationChain,
      destinationContractCall: contractCall,
      type: "fungible",
      recipient,
      threshold,
      whitelistedSourceChains,
      enableSwaps,
    }),
  }).then(
    (response) =>
      response.json() as unknown as { data: Solution[] } | FailedSolution,
  );

  if ("error" in response) return response;
  return response.data;
}

export async function getSweepSolution(
  {
    account,
    destinationChain,
    recipient,
    token,
    whitelistedSourceChains,
  }: SweepSolutionOptions,
  { baseUrl, signal }: FetchOptions = {},
): Promise<SolutionResponse> {
  const url = new URL("/solutions/balance-sweep", baseUrl || BASE_URL);

  url.searchParams.set("account", account);
  url.searchParams.set("destination", String(destinationChain));
  url.searchParams.set("token", token);
  recipient && url.searchParams.set("recipient", recipient);
  whitelistedSourceChains?.length &&
    url.searchParams.set(
      "whitelistedSourceChains",
      whitelistedSourceChains.join(","),
    );

  const response = await fetch(url, { signal }).then(
    (response) =>
      response.json() as unknown as { data: Solution[] } | FailedSolution,
  );

  if ("error" in response) return response;
  return response.data;
}
