# Sprinter Credit — Credit Draw Demo

Live demonstration of the full credit draw lifecycle using the Sprinter Credit V2 API on Base.

## What it does

Walks through a complete credit draw flow in ~60 seconds:

1. **Lock** — Deposit USDC as collateral
2. **Check Credit** — View credit line and health factor
3. **Draw** — Simulate a card swipe (borrow against collateral)
4. **Repay** — Pay back the drawn amount
5. **Unlock** — Withdraw collateral

## Prerequisites

- **Node.js 18+**
- A wallet with **USDC on Base** (minimum: the demo amount, default $1.00)
- A small amount of **ETH on Base** for gas (~$0.01)

## Setup

```bash
cd demo
npm install
```

Copy the environment file and fill in your wallet's private key:

```bash
cp .env.example .env
```

Edit `.env`:
```
PRIVATE_KEY=0x_YOUR_PRIVATE_KEY_HERE
RPC_URL=https://mainnet.base.org
DEMO_AMOUNT=1.00
```

> **Important:** Never commit your `.env` file. It is already in `.gitignore`.

## Run

### Web UI (recommended for demos)

```bash
npm run ui
```

Opens a browser-friendly dashboard at `http://localhost:3002` with a "Run Demo" button and live progress.

### Dry run (no on-chain transactions)

```bash
npm run ui:dry-run
```

Calls the API but skips actual transactions — useful for testing the UI.

### CLI mode

```bash
npm run demo
```

Runs the same flow in the terminal with colored output.

## How the demo works

### Step-by-step flow

| Step | Action | API Endpoint | What happens on-chain |
|------|--------|-------------|----------------------|
| 0 | **Health Check** | `GET /health` + `GET /credit/protocol` | Nothing — reads API status and protocol config (LTV, strategies) |
| 1 | **Lock Collateral** | `GET /credit/accounts/{addr}/lock?amount=...&asset=...` | Approves USDC spend, then deposits USDC into the Sprinter credit hub |
| 2 | **Check Credit** | `GET /credit/accounts/{addr}/info` | Nothing — reads your credit capacity, health factor, and debt |
| 3 | **Draw (Card Swipe)** | `GET /credit/accounts/{addr}/draw?amount=...&receiver=...` | Borrows against your collateral, simulating a card transaction |
| 4 | **Repay** | `GET /credit/accounts/{addr}/repay?amount=...` | Approves USDC spend, then repays all outstanding debt |
| 5 | **Unlock** | `GET /credit/accounts/{addr}/unlock?amount=...&asset=...` | Withdraws your USDC collateral back to your wallet |

Each API call returns `{ calls: [...] }` — an array of contract call objects (`to`, `data`, `value`, `chain`). The demo signs and submits these transactions using your wallet.

### USDC approval

Before locking or repaying, the demo checks if the Sprinter credit hub contract has a USDC spending allowance. If not, it sends an `approve` transaction first. This is a one-time operation per spender address — subsequent runs skip it.

### Draw amount calculation

The draw amount is not a fixed value. After locking collateral, the demo queries your actual remaining credit capacity from `/info` and draws **50% of the available capacity**. This ensures the draw succeeds even if there's residual debt from a previous run.

### Interest and dust debt

Interest starts accruing the moment you draw. When repaying, the demo:

1. Queries your **total outstanding debt** (not just the draw amount)
2. Adds a small buffer to cover interest that accrues between the query and the repay transaction
3. After repaying, checks for any remaining "dust" debt (fractions of a cent)
4. If dust remains, sends a second repay to clear it completely

This matters because the protocol will **block unlock** if any debt remains, even a fraction of a cent.

### Recovery

If a demo run fails mid-way (e.g., network error after drawing but before repaying), your funds get stuck in the protocol. Use the **"Recover Funds"** button in the web UI (or call `GET /api/recover`) to:

1. Detect and repay any outstanding debt
2. Unlock all collateral back to your wallet

You should always run recovery before re-running the demo if a previous run didn't complete.

## Architecture

```
demo/
  server.ts            Express server (SSE streaming, /api/status, /api/run, /api/recover)
  credit-draw-demo.ts CLI version of the same flow
  public/index.html    Single-page web UI (vanilla JS, no build step)
  .env.example         Template for environment variables
  .env                 Your local config (gitignored)
```

- **Web UI** (`server.ts` + `public/index.html`): Express serves a dashboard that streams real-time progress via Server-Sent Events (SSE). Each step fires `step`, `log`, and `complete`/`error` events.
- **CLI** (`credit-draw-demo.ts`): Same flow with terminal-formatted output. Good for quick testing.
- Both share the same Sprinter API calls and transaction logic.

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| "ERC20: transfer amount exceeds balance" on Lock | Wallet doesn't have enough USDC (may be locked from a failed run) | Click "Recover Funds" to unlock stuck collateral first |
| "insufficient collateral to draw credit" on Draw | Residual debt from a prior run reduces available credit | Click "Recover Funds", then re-run |
| "nonce too low" or "nonce has already been used" | Stale nonce from a recently confirmed transaction | Wait a few seconds and retry — ethers auto-manages nonces |
| Unlock fails with custom error `0x62e82dca` | Dust debt remains after repay, blocking full unlock | Already handled automatically — the demo repays dust before unlocking |
| "PRIVATE_KEY not set" | `.env` file missing or empty | Copy `.env.example` to `.env` and add your private key |

## Security

- Your private key is stored only in `.env`, which is gitignored
- Never share your private key or commit it to version control
- Use a dedicated demo wallet with minimal funds
