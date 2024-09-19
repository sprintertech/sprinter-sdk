import {useCallback, useReducer} from "react";
import {Address, AggregateBalances, Sprinter} from "@chainsafe/sprinter-sdk";

enum BalanceAction {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
}

interface BalanceActions {
  type: BalanceAction;
  payload: number;
}

interface BalancesState {
  [account: Address]: AggregateBalances;
}

function balancesReducer(balances: BalancesState, action: BalanceActions) {
  switch (action.type) {
    case 'added': {
      return [...balances, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export function useBalances(sprinter: Sprinter) {
  const [balances, dispatch] = useReducer(
    balancesReducer,
    {} as BalancesState,
  );

  const getUserBalances = useCallback((account: Address) => {
    sprinter.getUserBalances(account);
  }, [sprinter]);

  return {balances, getUserBalances};
}
