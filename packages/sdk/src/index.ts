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
  // in memory "cache"
  #tokens?: FungibleToken[];
  #chains?: Chain[];

  #fetchOptions: Omit<FetchOptions, "signal">;

  constructor(fetchOptions: Omit<FetchOptions, "signal"> = {}) {
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
    account: Address,
    tokens?: FungibleToken[],
    options: FetchOptions = {},
  ): Promise<{
    [sybol: TokenSymbol]: { balances: TokenBalance[]; total: string };
  }> {
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
    settings: ContractSolutionOptions,
    options?: FetchOptions,
  ): Promise<SolutionResponse>;
  public async getSolution(
    settings: SolutionOptions,
    options?: FetchOptions,
  ): Promise<SolutionResponse>;
  public async getSolution(
    settings: unknown,
    options?: FetchOptions,
  ): Promise<SolutionResponse> {
    if (typeof settings !== "object" || settings === null)
      throw new Error("Missing settings object");

    if ("contractCall" in settings)
      return await getContractSolution(
        <ContractSolutionOptions>settings,
        this.makeFetchOptions(options || {}),
      );
    return await getSolution(
      <SolutionOptions>settings,
      this.makeFetchOptions(options || {}),
    );
  }

  public async getCallSolution(
    settings: ContractSolutionOptions,
    options?: FetchOptions,
  ): Promise<SolutionResponse> {
    if (typeof settings !== "object" || settings === null)
      throw new Error("Missing settings object");

    return await getContractCallSolution(
      settings,
      this.makeFetchOptions(options || {}),
    );
  }

  private makeFetchOptions(options: FetchOptions): FetchOptions {
    return { ...this.#fetchOptions, ...options };
  }
}

export { Sprinter, setBaseUrl, BASE_URL };
