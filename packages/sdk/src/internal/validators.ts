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
  sourceChains: optional(array(number())),
});

const BridgeCoreWithRecipientSchema = assign(
  BridgeCoreSchema,
  object({
    recipient: optional(hexString()),
  }),
);

const ContractCallCoreSchema = object({
  callData: hexString(),
  contractAddress: hexString(),
  gasLimit: numberLike,
});

const NativeContractCallSchema = ContractCallCoreSchema;

const TokenContractCallSchema = assign(
  ContractCallCoreSchema,
  object({
    outputTokenAddress: optional(hexString()),
    approvalAddress: optional(hexString()),
  }),
);

const ContractCallSchema = object({
  contractCall: union([NativeContractCallSchema, TokenContractCallSchema]),
});

export const SingleHopSchema = BridgeCoreWithRecipientSchema;

export const MultiHopSchema = BridgeCoreSchema;

export const SingleHopWithContractSchema = assign(
  BridgeCoreWithRecipientSchema,
  ContractCallSchema,
);

export const MultiHopWithContractSchema = assign(
  BridgeCoreSchema,
  ContractCallSchema,
);
