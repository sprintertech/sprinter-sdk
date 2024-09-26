import type { Infer } from "superstruct";
import { assert } from "superstruct";

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
  AggregateBalances,
  Chain,
  ContractSolutionOptions,
  FetchOptions,
  FungibleToken,
  SingleHopContractSolutionOptions,
  SolutionOptions,
  SolutionResponse,
  TokenBalance,
  TokenSymbol,
} from "./types";
import {
  MultiHopSchema,
  MultiHopWithContractSchema,
  SingleHopSchema,
  SingleHopWithContractSchema,
} from "./validators";

export type * from "./types";
export * as api from "./api";
export * from "./enums";

class Sprinter {
  // in memory "cache"
  #tokens?: FungibleToken[];
  #chains?: Chain[];
  #requests: Record<string, Promise<unknown>> = {};

  #fetchOptions: Omit<FetchOptions, "signal">;

  constructor(fetchOptions: Omit<FetchOptions, "signal"> = {}) {
    this.#fetchOptions = fetchOptions;
  }

  public async getAvailableTokens(
    options: FetchOptions = {},
  ): Promise<FungibleToken[]> {
    if (!this.#tokens)
      this.#tokens = await this.deferredRequest("tokens", () =>
        getFungibleTokens(this.makeFetchOptions(options)),
      );
    return this.#tokens;
  }

  public async getAvailableChains(
    options: FetchOptions = {},
  ): Promise<Chain[]> {
    if (!this.#chains)
      this.#chains = await this.deferredRequest("chains", () =>
        getSupportedChains(this.makeFetchOptions(options)),
      );
    return this.#chains;
  }

  public async getUserBalances(
    account: Address,
    tokens?: FungibleToken[],
    options: FetchOptions = {},
  ): Promise<AggregateBalances> {
    const tokenList = tokens || (await this.getAvailableTokens(options));

    const [balances, nativeTokens] = await this.deferredRequest(
      `balances-${account}`,
      () =>
        Promise.all([
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
        ]),
    );
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

  public async bridgeAggregateBalance(
    settings: Infer<typeof MultiHopSchema>,
    options?: FetchOptions,
  ): Promise<SolutionResponse> {
    assert(settings, MultiHopSchema);

    const { sourceChains, amount, ...data } = settings;
    return this.getSolution(
      {
        ...data,
        amount: BigInt(amount),
        whitelistedSourceChains: sourceChains,
      } as SolutionOptions,
      options,
    );
  }

  public async bridgeAggregateBalanceAndCall(
    settings: Infer<typeof MultiHopWithContractSchema>,
    options?: FetchOptions,
  ): Promise<SolutionResponse> {
    assert(settings, MultiHopWithContractSchema);

    const { sourceChains, amount, ...data } = settings;
    return this.getSolution(
      {
        ...data,
        amount: BigInt(amount),
        whitelistedSourceChains: sourceChains,
      } as SolutionOptions,
      options,
    );
  }

  public async bridge(
    settings: Infer<typeof SingleHopSchema>,
    options?: FetchOptions,
  ): Promise<SolutionResponse> {
    assert(settings, SingleHopSchema);

    const { sourceChains, amount, ...data } = settings;
    return this.getSingleSolution(
      {
        ...data,
        amount: BigInt(amount),
        whitelistedSourceChains: sourceChains ? [sourceChains] : [],
      } as SolutionOptions,
      options,
    );
  }

  public async bridgeAndCall(
    settings: Infer<typeof SingleHopSchema>,
    options?: FetchOptions,
  ): Promise<SolutionResponse> {
    assert(settings, SingleHopWithContractSchema);

    const { sourceChains, amount, ...data } = settings;
    return this.getSingleSolution(
      {
        ...data,
        amount: BigInt(amount),
        whitelistedSourceChains: sourceChains ? [sourceChains] : [],
      } as SolutionOptions,
      options,
    );
  }

  private async getSolution(
    settings: ContractSolutionOptions,
    options?: FetchOptions,
  ): Promise<SolutionResponse>;
  private async getSolution(
    settings: SolutionOptions,
    options?: FetchOptions,
  ): Promise<SolutionResponse>;
  private async getSolution(
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

  private async getSingleSolution(
    settings: SingleHopContractSolutionOptions,
    options?: FetchOptions,
  ): Promise<SolutionResponse> {
    if (typeof settings !== "object" || settings === null)
      throw new Error("Missing settings object");

    return await getContractCallSolution(
      settings,
      this.makeFetchOptions(options || {}),
    );
  }

  private deferredRequest<T>(
    name: string,
    request: () => Promise<T>,
  ): Promise<T> {
    if (!(name in this.#requests)) {
      this.#requests[name] = request();
      void this.#requests[name].finally(() => {
        void setTimeout(() => {
          delete this.#requests[name];
        }, 1000);
      });
    }

    return this.#requests[name] as Promise<T>;
  }

  private makeFetchOptions(options: FetchOptions): FetchOptions {
    return { ...this.#fetchOptions, ...options };
  }
}

export { Sprinter, setBaseUrl, BASE_URL };
