import type { Infer } from "superstruct";
import { assert } from "superstruct";

import {
  getContractCallSolution,
  getContractSolution,
  getFungibleTokens,
  getSolution,
  getSupportedChains,
} from "./api";
import { formatBalances, getUserBalances } from "./internal/userBalances";
import {
  MultiHopSchema,
  MultiHopWithContractSchema,
  SingleHopSchema,
  SingleHopWithContractSchema,
} from "./internal/validators";
import type {
  Address,
  AggregateBalances,
  Chain,
  ContractSolutionOptions,
  FetchOptions,
  FungibleToken,
  SolutionOptions,
  SolutionResponse,
} from "./types";

export class Sprinter {
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
        getUserBalances(
          account,
          tokenList,
          this.makeFetchOptions(options || {}),
        ),
    );
    return formatBalances([balances, nativeTokens]);
  }

  public async bridgeAggregateBalance(
    settings: Infer<typeof MultiHopSchema>,
    options?: FetchOptions,
  ): Promise<SolutionResponse> {
    assert(settings, MultiHopSchema);

    const { sourceChains, amount, ...data } = settings;
    return await getSolution(
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
    return await getContractSolution(
      {
        ...data,
        amount: BigInt(amount),
        whitelistedSourceChains: sourceChains,
      } as ContractSolutionOptions,
      options,
    );
  }

  public async bridge(
    settings: Infer<typeof SingleHopSchema>,
    options?: FetchOptions,
  ): Promise<SolutionResponse> {
    assert(settings, SingleHopSchema);

    const { sourceChains, amount, ...data } = settings;
    return await getContractCallSolution(
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
    return await getContractCallSolution(
      {
        ...data,
        amount: BigInt(amount),
        whitelistedSourceChains: sourceChains ? [sourceChains] : [],
      } as SolutionOptions,
      options,
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
