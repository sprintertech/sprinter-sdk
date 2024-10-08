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

  /**
   * Fetches and returns the list of fungible tokens supported by Sprinter.
   *
   * @param {FetchOptions} [options={}] - Optional configuration for the fetch request, which can include custom headers or query parameters.
   *
   * @returns {Promise<FungibleToken[]>} A promise that resolves to a list of fungible tokens.
   *
   * @example
   * ```ts
   * import { Sprinter } from '@chainsafe/sprinter-sdk';
   *
   * const sprinter = new Sprinter();
   *
   * sprinter.getAvailableTokens().then(tokens => {
   *   console.log(tokens);
   * });
   * ```
   */
  public async getAvailableTokens(
    options: FetchOptions = {},
  ): Promise<FungibleToken[]> {
    if (!this.#tokens)
      this.#tokens = await this.deferredRequest("tokens", () =>
        getFungibleTokens(this.makeFetchOptions(options)),
      );
    return this.#tokens;
  }

  /**
   * Fetches and returns the list of supported blockchain networks (chains) available in Sprinter.
   *
   * @param {FetchOptions} [options={}] - Optional configuration for the fetch request, which can include custom headers or query parameters.
   *
   * @returns {Promise<Chain[]>} A promise that resolves to a list of supported chains.
   *
   * @example
   * ```ts
   * import { Sprinter } from '@chainsafe/sprinter-sdk';
   *
   * const sprinter = new Sprinter();
   *
   * sprinter.getAvailableChains().then(chains => {
   *   console.log(chains);
   * });
   * ```
   */
  public async getAvailableChains(
    options: FetchOptions = {},
  ): Promise<Chain[]> {
    if (!this.#chains)
      this.#chains = await this.deferredRequest("chains", () =>
        getSupportedChains(this.makeFetchOptions(options)),
      );
    return this.#chains;
  }

  /**
   * Fetches and returns the aggregate balances of the specified user across the provided list of tokens.
   *
   * @param {Address} account - The user's wallet address for which balances are to be fetched.
   * @param {FungibleToken[]} [tokens] - An optional list of tokens to check balances for. If an empty array is provided, only native token balances (e.g., ETH) will be returned.
   * @param {FetchOptions} [options={}] - Optional configuration for the fetch request, which can include custom headers or query parameters.
   *
   * @returns {Promise<AggregateBalances>} A promise that resolves to the user's aggregate balances for the specified tokens and always includes native token balances (e.g., ETH).
   *
   * @note If no tokens are provided or if an empty array is passed, the function will only return the native token balances (e.g., ETH). However, native balances are always returned regardless of the tokens specified.
   *
   * @example
   * ```ts
   * import { Sprinter } from '@chainsafe/sprinter-sdk';
   *
   * const sprinter = new Sprinter();
   * const account = "0xYourAddressHere";
   *
   * sprinter.getUserBalances(account).then(balances => {
   *   console.log(balances);
   * });
   * ```
   *
   * Returned Example:
   * ```json
   * {
   *   "USDC": {
   *     "balances": [
   *       {
   *         "balance": "100000000", // Balance in smallest denomination
   *         "chainId": 1,
   *         "tokenDecimals": 6
   *       },
   *       {
   *         "balance": "5000000", // Balance in smallest denomination
   *         "chainId": 137,
   *         "tokenDecimals": 6
   *       }
   *     ],
   *     "total": "105000000" // Total balance across all chains
   *   },
   *   "ETH": {
   *     "balances": [
   *       {
   *         "balance": "2000000000000000000", // 2 ETH
   *         "chainId": 1,
   *         "tokenDecimals": 18
   *       }
   *     ],
   *     "total": "2000000000000000000" // Total balance across all chains
   *   }
   * }
   * ```
   */
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

  /**
   * Fetches and returns the optimal bridging solution based on the provided settings for bridging tokens between multiple chains.
   *
   * This method uses the provided settings to determine the best path for transferring tokens across multiple supported blockchains using a multi-hop strategy.
   *
   * @param {Infer<typeof MultiHopSchema>} settings - The settings object for defining the bridging parameters:
   * - `account`: The user's wallet address for the transaction.
   * - `destinationChain`: The ID of the destination blockchain.
   * - `token`: The token symbol (e.g., "ETH", "USDC") to be bridged.
   * - `amount`: The amount of tokens to bridge (as a string or number).
   * - `threshold` (optional): The minimum amount threshold required for bridging.
   * - `sourceChains` (optional): An array of whitelisted source chain IDs for the transfer.
   *
   * @param {FetchOptions} [options] - Optional configuration for the fetch request, such as custom headers or query parameters.
   *
   * @returns {Promise<SolutionResponse>} A promise that resolves to an array of possible bridging solutions (`Solution[]`), or a `FailedSolution` object in case of an error.
   *
   * @example
   * ```ts
   * import { Sprinter } from '@chainsafe/sprinter-sdk';
   *
   * const sprinter = new Sprinter();
   * const settings = {
   *   account: "0x3e101ec02e7a48d16dade204c96bff842e7e2519",
   *   destinationChain: 11155111,
   *   token: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
   *   amount: "100000000",
   *   sourceChains: [84532, 137],
   * };
   *
   * sprinter.bridgeAggregateBalance(settings).then(solution => {
   *   console.log(solution);
   * });
   * ```
   *
   * Returned Example:
   * ```json
   * [
   *   {
   *     "sourceChain": 84532,
   *     "destinationChain": 11155111,
   *     "sourceTokenAddress": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
   *     "destinationTokenAddress": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
   *     "senderAddress": "0x3e101ec02e7a48d16dade204c96bff842e7e2519",
   *     "tool": {
   *       "name": "Sygma-Testnet",
   *       "logoURI": "https://scan.buildwithsygma.com/assets/images/logo1.svg"
   *     },
   *     "gasCost": {
   *       "amount": "221055913000",
   *       "amountUSD": 0
   *     },
   *     "fee": {
   *       "amount": "1000000000000000",
   *       "amountUSD": 0
   *     },
   *     "amount": "100000000",
   *     "duration": 60000000000,
   *     "transaction": {
   *       "data": "0x73c45c98000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000540000000000000000000000000000000000000000000000000000000005f5e10000000000000000000000000000000000000000000000000000000000000000143e101ec02e7a48d16dade204c96bff842e7e251900000000000000000000000000000000000000000000000000000000000000000000000000000000000000023078000000000000000000000000000000000000000000000000000000000000",
   *       "to": "0x9D5C332Ebe0DaE36e07a4eD552Ad4d8c5067A61F",
   *       "from": "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519",
   *       "value": "0x38d7ea4c68000",
   *       "gasPrice": "0xf433d",
   *       "gasLimit": "0x35f48",
   *       "chainId": 84532
   *     },
   *     "approvals": [
   *       {
   *         "data": "0x095ea7b30000000000000000000000003b0f996c474c91de56617da13a52b22bb659d18e0000000000000000000000000000000000000000000000000000000005f5e100",
   *         "to": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
   *         "from": "0x3E101Ec02e7A48D16DADE204C96bFF842E7E2519",
   *         "value": "0x0",
   *         "gasPrice": "0xf433d",
   *         "gasLimit": "0xe484",
   *         "chainId": 84532
   *       }
   *     ]
   *   }
   * ]
   * ```
   *
   * @note If the bridging process encounters an error, the returned object will be of type `FailedSolution` containing an error message.
   */
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

  /**
   * Fetches and returns the optimal bridging solution and performs a contract call on the destination chain.
   *
   * This method is intended to determine the best path for transferring tokens across multiple supported blockchains
   * and then execute a contract call on the destination chain using either native or token contract interactions.
   *
   * @param {Infer<typeof MultiHopWithContractSchema>} settings - The settings object for defining the bridging and contract call parameters:
   * - `account`: The user's wallet address for the transaction.
   * - `destinationChain`: The ID of the destination blockchain.
   * - `token`: The token symbol (e.g., "ETH", "USDC") to be bridged.
   * - `amount`: The amount of tokens to bridge (as a string or number).
   * - `contractCall`: Defines the contract call that will be executed on the destination chain:
   *   - For native contract calls (`NativeContractCall`):
   *     - `callData`: The encoded data to be sent to the contract.
   *     - `contractAddress`: The address of the contract to call.
   *     - `gasLimit`: The gas limit for the contract call.
   *     - `recipient`: The address of the recipient of the call.
   *   - For token contract calls (`TokenContractCall`):
   *     - `callData`: The encoded data to be sent to the contract.
   *     - `contractAddress`: The address of the contract to call.
   *     - `gasLimit`: The gas limit for the contract call.
   *     - `outputTokenAddress` (optional): The address of the output token (if different from the input).
   *     - `approvalAddress` (optional): The address to approve for spending tokens.
   * - `sourceChains` (optional): An array of whitelisted source chain IDs for the transfer.
   * - `threshold` (optional): The minimum amount threshold required for bridging.
   *
   * @param {FetchOptions} [options] - Optional configuration for the fetch request, such as custom headers or query parameters.
   *
   * @returns {Promise<SolutionResponse>} A promise that resolves to the solution object containing the optimal bridging strategy and contract call, or a `FailedSolution` in case of an error.
   *
   * @example
   * ```ts
   * import { Sprinter } from '@chainsafe/sprinter-sdk';
   *
   * const sprinter = new Sprinter();
   *
   * const settings = {
   *   account: "0x3e101ec02e7a48d16dade204c96bff842e7e2519",
   *   destinationChain: 11155111,
   *   token: "USDC",
   *   amount: "100000000",
   *   contractCall: {
   *     callData: "0xabcdef", // encoded contract call data
   *     contractAddress: "0x1234567890abcdef",
   *     gasLimit: 21000,
   *     recipient: "0xRecipientAddress" // for native contract call
   *   },
   *   sourceChains: [84532, 137]
   * };
   *
   * sprinter.bridgeAggregateBalanceAndCall(settings).then(solution => {
   *   console.log(solution);
   * }).catch(error => {
   *   console.error(error);
   * });
   * ```
   */
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

  /**
   * Fetches and returns the optimal bridging solution for transferring tokens between two blockchains using a single-hop strategy.
   *
   * This method finds the best path for transferring tokens from a source chain to a destination chain, as specified by the provided settings.
   *
   * @param {Infer<typeof SingleHopSchema>} settings - The settings object for defining the bridging parameters:
   * - `account`: The user's wallet address for the transaction.
   * - `destinationChain`: The ID of the destination blockchain.
   * - `token`: The token symbol (e.g., "ETH", "USDC") to be bridged.
   * - `amount`: The amount of tokens to bridge (as a string or number).
   * - `threshold` (optional): The minimum amount threshold required for bridging.
   * - `sourceChains` (optional): An array of whitelisted source chain IDs for the transfer.
   *
   * @param {FetchOptions} [options] - Optional configuration for the fetch request, such as custom headers or query parameters.
   *
   * @returns {Promise<SolutionResponse>} A promise that resolves to the solution object containing the optimal bridging strategy, or a `FailedSolution` in case of an error.
   *
   * @example
   * ```ts
   * import { Sprinter } from '@chainsafe/sprinter-sdk';
   *
   * const sprinter = new Sprinter();
   *
   * const settings = {
   *   account: "0x3e101ec02e7a48d16dade204c96bff842e7e2519",
   *   destinationChain: 11155111,
   *   token: "USDC",
   *   amount: "100000000",
   * };
   *
   * sprinter.bridge(settings).then(solution => {
   *   console.log(solution);
   * }).catch(error => {
   *   console.error(error);
   * });
   * ```
   */
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
        whitelistedSourceChains: sourceChains,
      } as SolutionOptions,
      options,
    );
  }

  /**
   * Fetches and returns the optimal bridging solution and performs a contract call on the destination chain using a single-hop strategy.
   *
   * This method transfers tokens from a source chain to a destination chain and then executes a contract call on the destination chain.
   *
   * @param {Infer<typeof SingleHopWithContractSchema>} settings - The settings object for defining the bridging and contract call parameters:
   * - `account`: The user's wallet address for the transaction.
   * - `destinationChain`: The ID of the destination blockchain.
   * - `token`: The token symbol (e.g., "ETH", "USDC") to be bridged.
   * - `amount`: The amount of tokens to bridge (as a string or number).
   * - `contractCall`: Defines the contract call that will be executed on the destination chain:
   *   - For native contract calls (`NativeContractCall`):
   *     - `callData`: The encoded data to be sent to the contract.
   *     - `contractAddress`: The address of the contract to call.
   *     - `gasLimit`: The gas limit for the contract call.
   *     - `recipient`: The address of the recipient of the call.
   *   - For token contract calls (`TokenContractCall`):
   *     - `callData`: The encoded data to be sent to the contract.
   *     - `contractAddress`: The address of the contract to call.
   *     - `gasLimit`: The gas limit for the contract call.
   *     - `outputTokenAddress` (optional): The address of the output token (if different from the input).
   *     - `approvalAddress` (optional): The address to approve for spending tokens.
   * - `sourceChains` (optional): An array of whitelisted source chain IDs for the transfer.
   * - `threshold` (optional): The minimum amount threshold required for bridging.
   *
   * @param {FetchOptions} [options] - Optional configuration for the fetch request, such as custom headers or query parameters.
   *
   * @returns {Promise<SolutionResponse>} A promise that resolves to the solution object containing the optimal bridging strategy and contract call, or a `FailedSolution` in case of an error.
   *
   * @example
   * ```ts
   * import { Sprinter } from '@chainsafe/sprinter-sdk';
   *
   * const sprinter = new Sprinter();
   *
   * const settings = {
   *   account: "0x3e101ec02e7a48d16dade204c96bff842e7e2519",
   *   destinationChain: 11155111,
   *   token: "USDC",
   *   amount: "100000000",
   *   contractCall: {
   *     callData: "0xabcdef", // encoded contract call data
   *     contractAddress: "0x1234567890abcdef",
   *     gasLimit: 21000,
   *     recipient: "0xRecipientAddress" // for native contract call
   *   },
   * };
   *
   * sprinter.bridgeAndCall(settings).then(solution => {
   *   console.log(solution);
   * }).catch(error => {
   *   console.error(error);
   * });
   * ```
   *
   */
  public async bridgeAndCall(
    settings: Infer<typeof SingleHopWithContractSchema>,
    options?: FetchOptions,
  ): Promise<SolutionResponse> {
    assert(settings, SingleHopWithContractSchema);

    const { sourceChains, amount, ...data } = settings;
    return await getContractCallSolution(
      {
        ...data,
        amount: BigInt(amount),
        whitelistedSourceChains: sourceChains,
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
