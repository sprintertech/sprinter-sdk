export const acrossV3Abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "inputToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "outputToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "outputAmount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "destinationChainId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint32",
        name: "depositId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "quoteTimestamp",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "fillDeadline",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "exclusivityDeadline",
        type: "uint32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "exclusiveRelayer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
    ],
    name: "V3FundsDeposited",
    type: "event",
  },
] as const;
