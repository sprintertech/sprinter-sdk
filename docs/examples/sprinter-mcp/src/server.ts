/**
 * Sprinter Credit MCP Server
 *
 * Exposes Sprinter's credit engine as MCP tools so any MCP-compatible
 * AI agent (LI.FI, Claude, Cursor, etc.) can borrow against on-chain collateral.
 *
 * Tools:
 *   sprinter-health-check     — API health check
 *   sprinter-protocol-config  — Supported chains, collateral, LTVs
 *   sprinter-credit-info      — Get an account's credit position
 *   sprinter-lock-collateral  — Build calldata to lock collateral
 *   sprinter-draw-credit      — Build calldata to borrow (draw)
 *   sprinter-repay-debt       — Build calldata to repay debt
 *   sprinter-unlock-collateral — Build calldata to unlock collateral
 *
 * All transaction-building tools return unsigned calldata.
 * The agent (or its wallet) is responsible for signing and broadcasting.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const SPRINTER_API = process.env.SPRINTER_API || "https://api.sprinter.tech";

// ── Sprinter API helper ─────────────────────────────────────────────────────

async function sprinterGet(path: string): Promise<any> {
  const res = await fetch(`${SPRINTER_API}${path}`);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sprinter API ${res.status}: ${body}`);
  }
  return res.json();
}

// ── MCP Server ──────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "sprinter-credit",
  version: "1.0.0",
});

// Health check
server.tool(
  "sprinter-health-check",
  "Check if the Sprinter Credit API is operational",
  {},
  async () => {
    const data = await sprinterGet("/health");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Protocol config
server.tool(
  "sprinter-protocol-config",
  "Get Sprinter credit protocol configuration — supported chains, collateral assets, LTV ratios, and earn strategies",
  {},
  async () => {
    const data = await sprinterGet("/credit/protocol");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Credit info
server.tool(
  "sprinter-credit-info",
  "Get the credit position for an on-chain account — credit capacity, remaining capacity, collateral value, debt, and health factor",
  {
    account: z.string().describe("The account address (e.g. 0x...)"),
  },
  async ({ account }) => {
    const data = await sprinterGet(`/credit/accounts/${account}/info`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Lock collateral
server.tool(
  "sprinter-lock-collateral",
  "Build unsigned transaction calldata to lock an asset as collateral. Returns an array of ContractCall objects to sign and broadcast.",
  {
    account: z.string().describe("The account address locking collateral"),
    amount: z
      .string()
      .describe("Amount in the asset's smallest unit (e.g. 1000000 = 1 USDC)"),
    asset: z
      .string()
      .describe("Collateral token address (e.g. 0x833589fcd6edb6e08f4c7c32d4f71b54bda02913 for USDC on Base)"),
    earn: z
      .string()
      .optional()
      .describe("Optional earn strategy ID — locks collateral into a yield-bearing vault"),
  },
  async ({ account, amount, asset, earn }) => {
    let path = `/credit/accounts/${account}/lock?amount=${amount}&asset=${asset}`;
    if (earn) path += `&earn=${earn}`;
    const data = await sprinterGet(path);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Draw credit (borrow)
server.tool(
  "sprinter-draw-credit",
  "Build unsigned transaction calldata to draw (borrow) from a credit line. The drawn amount is sent to the receiver address. This is the core 'borrow' operation.",
  {
    account: z.string().describe("The borrower's account address"),
    amount: z
      .string()
      .describe("Amount to borrow in USDC smallest unit (e.g. 500000 = 0.50 USDC)"),
    receiver: z
      .string()
      .describe("Address that receives the borrowed funds"),
  },
  async ({ account, amount, receiver }) => {
    const data = await sprinterGet(
      `/credit/accounts/${account}/draw?amount=${amount}&receiver=${receiver}`
    );
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Repay debt
server.tool(
  "sprinter-repay-debt",
  "Build unsigned transaction calldata to repay outstanding credit debt. Repaying clears debt and restores credit capacity.",
  {
    account: z.string().describe("The borrower's account address"),
    amount: z
      .string()
      .describe("Amount to repay in USDC smallest unit"),
  },
  async ({ account, amount }) => {
    const data = await sprinterGet(
      `/credit/accounts/${account}/repay?amount=${amount}`
    );
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Unlock collateral
server.tool(
  "sprinter-unlock-collateral",
  "Build unsigned transaction calldata to unlock collateral. Only works if debt is zero or remaining collateral maintains the position's health.",
  {
    account: z.string().describe("The account address unlocking collateral"),
    amount: z
      .string()
      .describe("Amount to unlock in the asset's smallest unit"),
    asset: z.string().describe("Collateral token address"),
  },
  async ({ account, amount, asset }) => {
    const data = await sprinterGet(
      `/credit/accounts/${account}/unlock?amount=${amount}&asset=${asset}`
    );
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// ── Start ───────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Sprinter Credit MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
