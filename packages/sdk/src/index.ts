import { EIP1193Provider } from "eip1193-types";
import {
  getFungibleTokens,
  getSolution,
  getContractSolution,
  getSupportedChains,
  getUserFungibleTokens,
  setBaseUrl,
  BASE_URL,
} from "./api";
import {
  Address,
  Chain,
  ContractSolutionOptions,
  FungibleToken,
  FungibleTokenBalance,
  SolutionOptions,
  SolutionResponse,
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

  constructor(provider: EIP1193Provider) {
    this.#provider = provider;
  }

  public async getAvailableTokens(): Promise<FungibleToken[]> {
    if (!this.#tokens) this.#tokens = await getFungibleTokens();
    return this.#tokens;
  }

  public async getAvailableChains(): Promise<Chain[]> {
    if (!this.#chains) this.#chains = await getSupportedChains();
    return this.#chains;
  }

  public async getUserBalances(tokens?: FungibleToken[]): Promise<{
    [sybol: TokenSymbol]: { balances: FungibleTokenBalance[]; total: string };
  }> {
    const account = await this.getAccount();

    const tokenList = tokens || (await this.getAvailableTokens());

    const balances = await Promise.all(
      tokenList.map((token) =>
        getUserFungibleTokens(account, token.symbol).then((balances) => ({
          symbol: token.symbol,
          balances,
        }))
      )
    );

    return balances.reduce((previousValue, { symbol, balances }) => {
      previousValue[symbol] = {
        total: balances
          .reduce((prev, cur) => prev + BigInt(cur.balance), 0n)
          .toString(),
        balances,
      };
      return previousValue;
    }, {} as { [symbol: TokenSymbol]: { balances: FungibleTokenBalance[]; total: string } });
  }

  public async getSolution(
    settings: Omit<ContractSolutionOptions, "account">,
    targetAccount?: Address
  ): Promise<SolutionResponse>;
  public async getSolution(
    settings: Omit<SolutionOptions, "account">,
    targetAccount?: Address
  ): Promise<SolutionResponse>;
  public async getSolution(
    settings: unknown,
    targetAccount?: Address
  ): Promise<SolutionResponse> {
    const account = targetAccount || (await this.getAccount());

    if (typeof settings !== "object" || settings === null)
      throw new Error("Missing settings object");

    if ("contractCall" in settings)
      return await getContractSolution(<ContractSolutionOptions>{
        ...settings,
        account,
      });
    return await getSolution(<SolutionOptions>{ ...settings, account });
  }

  private isContractSolutionOptions(
    settings: unknown
  ): settings is Omit<ContractSolutionOptions, "account"> {
    return (
      settings != undefined &&
      typeof settings === "object" &&
      "contractCall" in settings &&
      typeof settings.contractCall === "object"
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
}

export { Sprinter, setBaseUrl, BASE_URL, EIP1193Provider };
