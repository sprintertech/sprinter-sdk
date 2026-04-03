# Sprinter Credit MCP Server

MCP server that exposes the [Sprinter Credit API](https://docs.sprinter.tech) as tools for AI agents. Any MCP-compatible client — Claude Desktop, Cursor, ChatGPT, LI.FI agents, or custom agents — can discover and call these tools to borrow against on-chain collateral.

Also includes a standalone demo agent script that runs the full borrow lifecycle (lock → draw → use → repay → unlock) via direct API calls.

## Tools

| Tool | Description |
|------|-------------|
| `sprinter-health-check` | Check if the Sprinter Credit API is operational |
| `sprinter-protocol-config` | Get supported chains, collateral assets, LTV ratios, and earn strategies |
| `sprinter-credit-info` | Get an account's credit position — capacity, debt, health factor |
| `sprinter-lock-collateral` | Build unsigned calldata to lock collateral |
| `sprinter-draw-credit` | Build unsigned calldata to draw (borrow) from a credit line |
| `sprinter-repay-debt` | Build unsigned calldata to repay outstanding debt |
| `sprinter-unlock-collateral` | Build unsigned calldata to unlock collateral |

All transaction-building tools return `{ calls: ContractCall[] }` — unsigned calldata. The agent's wallet signs and broadcasts. No custody, no API keys for on-chain operations.

## Quick Start

### 1. Install

```bash
npm install
```

### 2. Run the MCP Server

```bash
npm run dev
```

The server communicates over stdio (the standard MCP transport). It doesn't open a port — your MCP client connects to it by spawning the process.

### 3. Add to Your MCP Client

**Claude Desktop / Cursor:**

Add to your MCP client config (e.g. `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "sprinter-credit": {
      "command": "npx",
      "args": ["tsx", "src/server.ts"],
      "cwd": "/path/to/examples/sprinter-mcp"
    }
  }
}
```

**With LI.FI (agent gets both bridging and borrowing):**

```json
{
  "mcpServers": {
    "lifi": {
      "type": "http",
      "url": "https://mcp.li.quest/mcp"
    },
    "sprinter-credit": {
      "command": "npx",
      "args": ["tsx", "src/server.ts"],
      "cwd": "/path/to/examples/sprinter-mcp"
    }
  }
}
```

## Demo Agent

The demo agent (`src/demo-agent.ts`) runs the full borrow lifecycle on Base using direct HTTP calls — no MCP required. It demonstrates what an autonomous agent does when it needs liquidity.

### Setup

```bash
cp .env.example .env
```

Edit `.env`:

```
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
RPC_URL=https://mainnet.base.org        # optional, defaults to Base mainnet
SPRINTER_API=https://api.sprinter.tech   # optional
```

The wallet needs USDC on Base (the demo locks 1 USDC as collateral and borrows 0.50 USDC).

### Run

```bash
npm run demo
```

Output:

```
=== Agent: Borrow from Sprinter ===

Account:    0x...
Collateral: 1 USDC
Borrow:     0.5 USDC

[1] Checking credit position...
[2] Locking 1 USDC as collateral...
[3] Drawing 0.5 USDC...
[4] Agent uses borrowed funds (swap, bridge, settle, etc.)
[5] Repaying 0.5 USDC...
[6] Unlocking 1 USDC collateral...

=== Agent: Borrow complete ===
```

## Project Structure

```
sprinter-mcp/
├── src/
│   ├── server.ts        # MCP server — exposes 7 Sprinter Credit tools
│   └── demo-agent.ts    # Standalone agent script (direct API, no MCP)
├── .env.example         # Environment variables template
├── package.json
└── tsconfig.json
```

## How It Works

1. **Agent needs liquidity** — it holds collateral (e.g. USDC on Base) but needs to borrow
2. **Lock collateral** → `sprinter-lock-collateral` returns unsigned calldata
3. **Draw credit** → `sprinter-draw-credit` sends borrowed USDC to any receiver address
4. **Agent does its work** — swap via LI.FI, bridge to another chain, settle a payment, etc.
5. **Repay** → `sprinter-repay-debt` clears the debt and restores credit capacity
6. **Unlock collateral** → `sprinter-unlock-collateral` returns collateral to the agent

Every step returns unsigned `ContractCall[]` calldata. The agent's wallet signs and broadcasts — Sprinter never has custody.

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Run MCP server in development mode (tsx) |
| `demo` | `npm run demo` | Run the standalone demo agent |
| `build` | `npm run build` | Compile TypeScript to `dist/` |
| `start` | `npm run start` | Run compiled MCP server from `dist/` |

## Links

- [Agent Credit Borrow Quickstart](https://docs.sprinter.tech/quickstart/agent-skills/credit-borrow)
- [Sprinter Credit API Reference](https://docs.sprinter.tech/api-reference/sprinter/credit/get-credit-protocol-configuration)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Sprinter Documentation](https://docs.sprinter.tech)
