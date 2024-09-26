import { array, number, object, string, union } from "zod";

const BridgeCoreSchema = object({
  account: string(),
  destinationChain: number(),
  token: string(),
  amount: number(),
  threshold: number().optional(),
});

const ContractCallCoreSchema = object({
  callData: string(),
  contractAddress: string(),
  gasLimit: number(),
});

const NativeContractCallSchema = ContractCallCoreSchema.extend({
  recipient: string(),
});

const TokenContractCallSchema = ContractCallCoreSchema.extend({
  outputTokenAddress: string().optional(),
  approvalAddress: string().optional(),
});

export const SingleHopSchema = BridgeCoreSchema.extend({
  sourceChains: number(), // whitelistedSourceChains
});

export const MultiHopSchema = BridgeCoreSchema.extend({
  sourceChains: array(number()), // whitelistedSourceChains
});

export const SingleHopWithContractSchema = BridgeCoreSchema.extend({
  contractCall: union([NativeContractCallSchema, TokenContractCallSchema]),
  sourceChains: number(), // whitelistedSourceChains
});

export const MultiHopWithContractSchema = BridgeCoreSchema.extend({
  contractCall: union([NativeContractCallSchema, TokenContractCallSchema]),
  sourceChains: array(number()), // whitelistedSourceChains
});
