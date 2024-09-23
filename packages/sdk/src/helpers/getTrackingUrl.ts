import { createPublicClient, http, parseEventLogs } from "viem";

import type { Address, Chain, Tool } from "../types";

import { acrossV3Abi } from "./acrossV3.abi";

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
    case "Sygma-Testnet": {
      const url = new URL(
        `api/transfers/txHash/${transactionHash}`,
        "https://api.test.buildwithsygma.com/",
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
