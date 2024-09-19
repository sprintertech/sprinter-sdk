import {useCallback, useReducer} from "react";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export function useAsyncRequest<T>() {
    const [state, dispatch] = useReducer(fetchReducer, initialState);

  const makeRequest = useCallback((request: Promise<T>) => {
    dispatch({ type: RequestAction.INIT });

    request.then(result => {
      dispatch({ type: RequestAction.SUCCESS, payload: result });
    }).catch((error: Error) => {
      dispatch({ type: RequestAction.FAILURE, error: error.message });
    });
  }, [dispatch]);

  return { state, makeRequest };
}

enum RequestAction {
  INIT = 'REQUEST_INIT',
  SUCCESS = 'REQUEST_SUCCESS',
  FAILURE = "REQUEST_FAILURE",
}

interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

type RequestActions<T> =
  | { type: RequestAction.INIT }
  | { type: RequestAction.SUCCESS; payload: T }
  | { type: RequestAction.FAILURE; error: string };

const fetchReducer = <T>(state: RequestState<T>, action: RequestActions<T>): RequestState<T> => {
  switch (action.type) {
    case RequestAction.INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case RequestAction.SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case RequestAction.FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      throw new Error('Unknown action type');
  }
};
