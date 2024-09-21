import {useCallback, useReducer} from "react";
import {Address, AggregateBalances, Sprinter} from "@chainsafe/sprinter-sdk";

const initialState: BalancesState = {};

export function useBalances(sprinter: Sprinter) {
  const [balances, dispatch] = useReducer(balancesReducer, initialState);

  const getUserBalances = useCallback((account: Address) => {
    dispatch({ type: BalanceAction.INIT, address: account });

    sprinter.getUserBalances(account).then(result => {
      dispatch({ type: BalanceAction.SUCCESS, payload: result, address: account });
    }).catch((error: Error) => {
      dispatch({ type: BalanceAction.FAILURE, error: error.message, address: account });
    });
  }, [sprinter]);

  return {balances, getUserBalances};
}

enum BalanceAction {
  INIT = 'REQUEST_INIT',
  SUCCESS = 'REQUEST_SUCCESS',
  FAILURE = "REQUEST_FAILURE",
}

export interface BalancesEntry {
  data: AggregateBalances | null;
  loading: boolean;
  error: string | null;
}

type BalancesState = Record<Address, BalancesEntry>;

type BalanceActions =
  | { type: BalanceAction.INIT; address: Address }
  | { type: BalanceAction.SUCCESS; payload: AggregateBalances; address: Address }
  | { type: BalanceAction.FAILURE; error: string; address: Address };

function balancesReducer(state: BalancesState, action: BalanceActions): BalancesState {
  switch (action.type) {
    case BalanceAction.INIT:
      return {
        ...state,
        [action.address]: {
          ...state[action.address],
          loading: true,
          error: null,
        }
      }
    case BalanceAction.SUCCESS:
      return {
        ...state,
        [action.address]: {
          ...state[action.address],
          loading: false,
          data: action.payload,
        }
      }
    case BalanceAction.FAILURE:
      return {
        ...state,
        [action.address]: {
          ...state[action.address],
          loading: false,
          error: action.error,
        }
      }
    default:
      throw Error('Unknown action type');
  }
}
