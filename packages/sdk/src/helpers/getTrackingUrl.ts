import { createPublicClient, http, parseEventLogs } from "viem";

import type { Address, Chain, Tool } from "../types";

export async function experimental_getTrackingUrl(
  transactionHash: string,
  chain: Chain,
  tool: Tool,
): Promise<string> {
  switch (tool.name) {
    case "LiFi": {
      const url = new URL("v1/status", "https://li.quest/");
      url.searchParams.set("txHash", transactionHash);
      return url.toString();
    }
    case "Sygma": {
      const url = new URL(
        `api/transfers/txHash/${transactionHash}`,
        "https://api.buildwithsygma.com/",
      );
      return url.toString();
    }
    case "Across": {
      const rpcUrl =
        chain.rpcURLs[Math.floor(Math.random() * chain.rpcURLs.length)];

      const client = createPublicClient({
        transport: http(rpcUrl),
      });
      const transactionReceipt = await client.getTransactionReceipt({
        hash: transactionHash as Address,
      });
      const logs = parseEventLogs({
        abi: acrossV3Abi,
        eventName: "V3FundsDeposited",
        logs: transactionReceipt.logs,
      });
      if (logs.length === 0) {
        return "Transaction not found";
      }

      const url = new URL("api/deposit/status", "https://app.across.to/");
      url.searchParams.set("originChainId", String(chain.chainID));
      url.searchParams.set("depositId", String(logs[0].args.depositId));

      return url.toString();
    }
    default:
      return "Tool not recognized.";
  }
}

const acrossV3Abi = [
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
