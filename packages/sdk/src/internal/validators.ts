import {
  array,
  assign,
  bigint,
  define,
  number,
  object,
  optional,
  refine,
  string,
  type Struct,
  union,
} from "superstruct";

const hexString = (): Struct<string, null> =>
  define("hexString", (value) => {
    if (typeof value !== "string") return false;
    const hexRegex = /^0x[0-9a-fA-F]+$/;
    return hexRegex.test(value);
  });

const numberLike = refine(
  union([number(), string(), hexString(), bigint()]),
  "numberLike",
  (value) => {
    if (typeof value === "string") return !isNaN(Number(value));
    return true; // If it's a number or bigint, it's already valid
  },
);

const BridgeCoreSchema = object({
  account: hexString(),
  destinationChain: number(),
  token: string(),
  amount: numberLike,
  threshold: optional(number()),
});

const ContractCallCoreSchema = object({
  callData: hexString(),
  contractAddress: hexString(),
  gasLimit: numberLike,
});

const NativeContractCallSchema = assign(
  ContractCallCoreSchema,
  object({
    recipient: hexString(),
  }),
);

const TokenContractCallSchema = assign(
  ContractCallCoreSchema,
  object({
    outputTokenAddress: optional(hexString()),
    approvalAddress: optional(hexString()),
  }),
);

export const SingleHopSchema = assign(
  BridgeCoreSchema,
  object({
    sourceChain: optional(number()), // whitelistedSourceChains
  }),
);

export const MultiHopSchema = assign(
  BridgeCoreSchema,
  object({
    sourceChains: optional(array(number())), // whitelistedSourceChains
  }),
);

export const SingleHopWithContractSchema = assign(
  BridgeCoreSchema,
  object({
    contractCall: union([NativeContractCallSchema, TokenContractCallSchema]),
    sourceChain: optional(number()), // whitelistedSourceChains
  }),
);

export const MultiHopWithContractSchema = assign(
  BridgeCoreSchema,
  object({
    contractCall: union([NativeContractCallSchema, TokenContractCallSchema]),
    sourceChains: optional(array(number())), // whitelistedSourceChains
  }),
);
