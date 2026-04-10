# Sprinter Credit MCP Server + Operator Dashboard

MCP server that exposes the [Sprinter Credit API](https://docs.sprinter.tech) as tools for AI agents, plus a local web dashboard where the human operator sets up collateral and delegates credit access to the agent.

## Architecture

```
Human Operator (Dashboard UI)          Agent (CLI or MCP)
         |                                     |
    Lock collateral                    Check credit capacity
    Set up Credit Operator              Draw USDC (via Operator)
    Whitelist receivers                 Use funds (swap, bridge, etc.)
         |                              Repay debt
         v                                     |
    [Sprinter Credit Engine] <-----------------+
```

The human posts collateral and delegates credit access. The agent draws and repays within the delegated bounds. The agent can never touch the human's collateral.

## Quick Start

### 1. Install

```bash
npm install
```

### 2. Human: Set Up Collateral & Delegation

Run the Operator Dashboard:

```bash
npm run ui
```

Open http://localhost:3001 in your browser. Connect MetaMask (on Base network) and:

1. **Lock collateral** — enter a USDC amount and lock it
2. **Set up operator** — enter the agent's wallet address (or a receiver address) to set up the Credit Operator and whitelist it

Your credit position and operator status are displayed in the dashboard.

### 3. Agent: Draw & Repay

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

```
PRIVATE_KEY=0xAGENT_PRIVATE_KEY       # Agent's wallet key (authorized caller)
HUMAN_ACCOUNT=0xHUMAN_WALLET           # Human's wallet address (from dashboard)
RECEIVER_ADDRESS=0xWHITELISTED_ADDR    # Must be whitelisted by the human
```

Run the agent:

```bash
npm run demo
```

Output:

```
=== Agent: Delegated Credit Draw ===

Agent:          0xAgent...
Human account:  0xHuman...
Receiver:       0xReceiver...
Borrow amount:  0.5 USDC

[1] Checking credit capacity on human's account...
[2] Drawing 0.5 USDC to 0xReceiver...
[3] Agent uses borrowed funds...
[4] Repaying 0.5 USDC...
[5] Verifying position...

=== Agent: Complete ===
```

## MCP Server

The MCP server exposes 7 tools for any MCP-compatible agent (Claude, Cursor, LI.FI, ChatGPT):

| Tool | Description |
|------|-------------|
| `sprinter-health-check` | Check if the Sprinter Credit API is operational |
| `sprinter-protocol-config` | Get supported chains, collateral assets, LTV ratios, and earn strategies |
| `sprinter-credit-info` | Get an account's credit position — capacity, debt, health factor |
| `sprinter-lock-collateral` | Build unsigned calldata to lock collateral |
| `sprinter-draw-credit` | Build unsigned calldata to draw (borrow) from a credit line |
| `sprinter-repay-debt` | Build unsigned calldata to repay outstanding debt |
| `sprinter-unlock-collateral` | Build unsigned calldata to unlock collateral |

### Add to your MCP client

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

With LI.FI (agent gets both bridging and borrowing):

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

## Project Structure

```
sprinter-mcp/
├── src/
│   ├── server.ts          # MCP server — 7 Sprinter Credit tools
│   ├── ui-server.ts       # Express server for the Operator Dashboard
│   └── demo-agent.ts      # Agent script — delegated credit draw & repay
├── public/
│   └── index.html         # Operator Dashboard UI (single HTML file)
├── .env.example            # Environment variables template
├── package.json
└── tsconfig.json
```

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `ui` | `npm run ui` | Start the Operator Dashboard (http://localhost:3001) |
| `demo` | `npm run demo` | Run the agent demo (delegated draw & repay) |
| `dev` | `npm run dev` | Run MCP server in development mode |
| `build` | `npm run build` | Compile TypeScript to `dist/` |
| `start` | `npm run start` | Run compiled MCP server |

## Links

- [Agent Credit Borrow Quickstart](https://docs.sprinter.tech/quickstart/agent-skills/credit-borrow)
- [Credit Accounts (EOA vs Smart Account)](https://docs.sprinter.tech/sprinter-credit/credit-accounts)
- [Credit Operators](https://docs.sprinter.tech/sprinter-credit/policy-engine#credit-operators)
- [Sprinter Credit API Reference](https://docs.sprinter.tech/api-reference/sprinter/credit/get-credit-protocol-configuration)
- [Model Context Protocol](https://modelcontextprotocol.io/)
