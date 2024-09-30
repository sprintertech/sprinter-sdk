import { getUserFungibleTokens, getUserNativeTokens } from "../api";
import type {
  Address,
  AggregateBalances,
  FetchOptions,
  FungibleToken,
  FungibleTokenBalance,
  NativeTokenBalance,
  TokenSymbol,
} from "../types";

type FetchBalancesResponse = [
  { symbol: TokenSymbol; balances: FungibleTokenBalance[] }[],
  NativeTokenBalance[],
];

export function getUserBalances(
  account: Address,
  tokens: FungibleToken[],
  options: FetchOptions,
): Promise<FetchBalancesResponse> {
  return Promise.all([
    Promise.all(
      tokens.map((token) =>
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
}

export function formatBalances([
  balances,
  nativeTokens,
]: FetchBalancesResponse): AggregateBalances {
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
    } as AggregateBalances,
  );
}
