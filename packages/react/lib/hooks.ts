import {useCallback, useContext} from "react";
import {Context} from "./context.tsx";
import {Address} from "@chainsafe/sprinter-sdk";
import {BalancesEntry} from "./internal/useBalances.ts";

/** Everything from context */
export function useSprinter() {
  const context = useContext(Context);

  if (!context) throw new Error('Sprinter Context is not defined');

  return context;
}

/** Balances */
const balancesEmptyState = {
  data: null,
  loading: false,
  error: null,
};

export function useSprinterBalances(account: Address) {
  const { balances: _balances, getUserBalances: _getUserBalances } = useSprinter();

  const balances: BalancesEntry = _balances[account] || balancesEmptyState;
  const getUserBalances = useCallback(() => _getUserBalances(account), [account]);

  return { balances, getUserBalances };
}

/** Tokens */
export function useSprinterTokens() {
  const { tokens, getAvailableTokens } = useSprinter();
  return { tokens, getAvailableTokens };
}

/** Chains */
export function useSprinterChains() {
  const { chains, getAvailableChains } = useSprinter();
  return { chains, getAvailableChains };
}

/** Solutions */
export function useSprinterSolution() {
  const { solution, getSolution } = useSprinter();
  return { solution, getSolution };
}

/** Call Solution */
export function useSprinterCallSolution() {
  const { callSolution, getCallSolution } = useSprinter();
  return { callSolution, getCallSolution };
}
