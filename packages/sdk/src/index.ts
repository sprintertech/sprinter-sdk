import { EIP1193Provider } from "eip1193-types";

import {
  getFungibleTokens,
  getSolution,
  getContractSolution,
  getSupportedChains,
  getUserFungibleTokens,
  getUserNativeTokens,
  setBaseUrl,
  BASE_URL,
  getContractCallSolution,
} from "./api";
import type {
  Address,
  Chain,
  ContractSolutionOptions,
  FetchOptions,
  FungibleToken,
  SolutionOptions,
  SolutionResponse,
  TokenBalance,
  TokenSymbol,
} from "./types";

export type * from "./types";
export * as api from "./api";
export * from "./enums";

class Sprinter {
  #provider: EIP1193Provider;

  // local "cache"
  #tokens?: FungibleToken[];
  #chains?: Chain[];

  #fetchOptions: Omit<FetchOptions, "signal">;

  constructor(
    provider: EIP1193Provider,
    fetchOptions: Omit<FetchOptions, "signal"> = {},
  ) {
    this.#provider = provider;
    this.#fetchOptions = fetchOptions;
  }

  public async getAvailableTokens(
    options: FetchOptions = {},
  ): Promise<FungibleToken[]> {
    if (!this.#tokens)
      this.#tokens = await getFungibleTokens(this.makeFetchOptions(options));
    return this.#tokens;
  }

  public async getAvailableChains(
    options: FetchOptions = {},
  ): Promise<Chain[]> {
    if (!this.#chains)
      this.#chains = await getSupportedChains(this.makeFetchOptions(options));
    return this.#chains;
  }

  public async getUserBalances(
    tokens?: FungibleToken[],
    options: FetchOptions = {},
  ): Promise<{
    [sybol: TokenSymbol]: { balances: TokenBalance[]; total: string };
  }> {
    const account = await this.getAccount();

    const tokenList = tokens || (await this.getAvailableTokens(options));

    const [balances, nativeTokens] = await Promise.all([
      Promise.all(
        tokenList.map((token) =>
          getUserFungibleTokens(account, token.symbol, options).then(
            (balances) => ({
              symbol: token.symbol,
              balances,
            }),
          ),
        ),
      ),
      getUserNativeTokens(account, options),
    ]);

    return balances.reduce(
      (previousValue, { symbol, balances }) => {
        previousValue[symbol] = {
          total: balances
            .reduce((prev, cur) => prev + BigInt(cur.balance), 0n)
            .toString(),
          balances,
        };
        return previousValue;
      },
      {
        ["ETH"]: {
          total: nativeTokens
            .reduce((prev, cur) => prev + BigInt(cur.balance), 0n)
            .toString(),
          balances: nativeTokens,
        },
      } as {
        [symbol: TokenSymbol]: {
          balances: TokenBalance[];
          total: string;
        };
      },
    );
  }

  public async getSolution(
    settings: Omit<ContractSolutionOptions, "account">,
    targetAccount?: Address,
    options?: FetchOptions,
  ): Promise<SolutionResponse>;
  public async getSolution(
    settings: Omit<SolutionOptions, "account">,
    targetAccount?: Address,
    options?: FetchOptions,
  ): Promise<SolutionResponse>;
  public async getSolution(
    settings: unknown,
    targetAccount?: Address,
    options?: FetchOptions,
  ): Promise<SolutionResponse> {
    const account = targetAccount || (await this.getAccount());

    if (typeof settings !== "object" || settings === null)
      throw new Error("Missing settings object");

    if ("contractCall" in settings)
      return await getContractSolution(
        <ContractSolutionOptions>{
          ...settings,
          account,
        },
        this.makeFetchOptions(options || {}),
      );
    return await getSolution(
      <SolutionOptions>{ ...settings, account },
      this.makeFetchOptions(options || {}),
    );
  }

  public async getCallSolution(
    settings: Omit<ContractSolutionOptions, "account">,
    targetAccount?: Address,
    options?: FetchOptions,
  ): Promise<SolutionResponse> {
    const account = targetAccount || (await this.getAccount());

    if (typeof settings !== "object" || settings === null)
      throw new Error("Missing settings object");

    return await getContractCallSolution(
      <ContractSolutionOptions>{
        ...settings,
        account,
      },
      this.makeFetchOptions(options || {}),
    );
  }

  private async getAccount(): Promise<Address> {
    const [account] = (await this.#provider.request({
      method: "eth_requestAccounts",
      params: [],
    })) as Address[];
    if (!account)
      throw new Error("No available account! Check your provider or something");

    return account;
  }

  private makeFetchOptions(options: FetchOptions): FetchOptions {
    return { ...this.#fetchOptions, ...options };
  }
}

export { Sprinter, setBaseUrl, BASE_URL, EIP1193Provider };
