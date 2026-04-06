# Sprinter Credit + Card Issuer Demo

End-to-end demo that runs the full Sprinter Credit + card issuer lifecycle on Base: KYC, card issuance, collateral locking, credit draw to the card issuer's deposit address, repay, and unlock — all in a single click from a web UI.

Ships with a **mock card issuer** that auto-approves KYC and generates test cards. Swap it for a real `CardIssuer` implementation to validate against a live card issuing API.

## What It Does

1. **Health Check** — verifies Sprinter API is reachable, loads protocol config
2. **Create User (KYC)** — submits wallet address to card issuer for onboarding
3. **Issue Virtual Card** — retrieves deposit contract and issues a virtual card
4. **Lock Collateral** — locks USDC on Base via Sprinter to activate a credit line
5. **Check Credit Line** — reads credit capacity, collateral value, health factor
6. **Draw Credit → Fund Card** — draws USDC from the credit line directly to the card issuer's deposit address
7. **Repay & Unlock** — repays outstanding debt and unlocks collateral

## Quick Start

### 1. Install

```bash
npm install
```

### 2. Configure

```bash
cp .env.example .env
```

Edit `.env`:

```
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
RPC_URL=https://mainnet.base.org        # optional, defaults to Base mainnet
DEMO_AMOUNT=1.00                         # USDC amount for the demo
DRY_RUN=true                             # set to false for real on-chain txs
PORT=3003
```

The wallet needs USDC and a small amount of ETH (for gas) on Base.

### 3. Run

```bash
npm run dev
```

Open `http://localhost:3003` and click **Run Full Demo**.

### Dry Run Mode

Dry run mode (`DRY_RUN=true`) makes real Sprinter API calls but skips on-chain transactions. Use this to test the integration flow without spending gas or moving funds.

```bash
npm run dev:dry-run
```

## Swapping the Card Issuer

The demo uses a `CardIssuer` interface defined in `card-issuer.ts`:

```typescript
interface CardIssuer {
  readonly isLive: boolean;
  createUser(walletAddress: string, log: Logger): Promise<CardUser>;
  retrieveContract(userId: string, chainId: number, log: Logger): Promise<CardContract>;
  issueCard(userId: string, log: Logger): Promise<Card>;
}
```

To connect a real card issuer (Rain, Stripe Issuing, Marqeta, etc.):

1. Implement the `CardIssuer` interface in a new file (e.g. `rain-issuer.ts`)
2. Import and swap it in `server.ts`:

```typescript
// Before
const cardIssuer: CardIssuer = new MockCardIssuer();

// After
import { RainCardIssuer } from "./rain-issuer.js";
const cardIssuer: CardIssuer = new RainCardIssuer(process.env.RAIN_API_KEY);
```

The Sprinter Credit side stays the same — only the card issuer implementation changes.

## Project Structure

```
card-issuer-demo-mock/
├── server.ts           # Express server — orchestrates Sprinter + card issuer
├── card-issuer.ts      # CardIssuer interface + MockCardIssuer implementation
├── public/
│   └── index.html      # Web UI with SSE-powered step-by-step dashboard
├── .env.example        # Environment variables template
└── package.json
```

## How It Works

The server exposes two endpoints:

| Endpoint | Description |
|----------|-------------|
| `GET /api/status` | Returns wallet address, balances, API status, card issuer mode |
| `GET /api/run` | Runs the full demo lifecycle, streaming progress via Server-Sent Events |

The web UI connects to `/api/run` via SSE and renders each step in real time — showing transaction hashes, credit line details, and card information as they come in.

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Run the demo server |
| `dev:dry-run` | `npm run dev:dry-run` | Run in dry-run mode (no on-chain txs) |

## Links

- [Card Program Integration](https://docs.sprinter.tech/quickstart/card-program)
- [Credit Draw Quickstart](https://docs.sprinter.tech/quickstart/credit-draw)
- [Sprinter Credit API Reference](https://docs.sprinter.tech/api-reference/sprinter/credit/get-credit-protocol-configuration)
- [Sprinter Documentation](https://docs.sprinter.tech)
