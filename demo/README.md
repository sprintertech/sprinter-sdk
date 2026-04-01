# Sprinter Credit — Card Program Demo

Live demonstration of the full card program lifecycle using the Sprinter Credit V2 API on Base.

## What it does

Walks through a complete credit card flow in ~60 seconds:

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

## Security

- Your private key is stored only in `.env`, which is gitignored
- Never share your private key or commit it to version control
- Use a dedicated demo wallet with minimal funds
