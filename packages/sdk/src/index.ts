import {
  getFungibleTokens,
  getSolution,
  getSupportedChains,
  getUserFungibleTokens,
  BASE_URL,
} from "./api";
import {
  Address,
  Chain,
  FungibleToken,
  FungibleTokenBalance,
  Solution,
  SolutionOptions,
  TokenSymbol,
} from "./types";

export type * from "./types";
export * as api from "./api";

// Note: code below is hacking, not a final api or approach
// TODO: find correct type so all disables can be safely removed
type EIP1193Provider = any;

class GopherManager {
  #provider: EIP1193Provider;

  // local "cache"
  #tokens: FungibleToken[] | undefined;
  #chains: Chain[] | undefined;

  constructor(provider: EIP1193Provider) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
    settings: Omit<SolutionOptions, "account">,
    targetAccount?: Address
  ): Promise<Solution[]> {
    const account = targetAccount || (await this.getAccount());

    return await getSolution({ ...settings, account });
  }

  private async getAccount(): Promise<Address> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const [account] = (await this.#provider.request({
      method: "eth_requestAccounts",
      params: [],
    })) as unknown as Address[];
    if (!account)
      throw new Error("No available account! Check your provider or something");

    return account;
  }
}

export {
  getSupportedChains,
  getFungibleTokens,
  getSolution,
  GopherManager,
  BASE_URL,
};
