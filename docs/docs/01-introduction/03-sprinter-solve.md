---
id: solve
title: Sprinter Solve
sidebar_position: 3
---

# Sprinter Solve

Sprinter Solve enables efficient execution of intent-based swaps through an RFQ-based Swap API. It’s powered by the Sprinter Solver, built on top of Project Blanc.

## Key Benefits

- **Best Price:** Finds optimal routes and prices with MEV protection and low slippage.
- **Fast Integration:** Dedicated API that can be integrated in hours.
- **Cross-chain Liquidity:** Leverages Sprinter Stash for real-time liquidity allocation.
- **Zero Collateral:** Solvers execute transactions without upfront capital.
- **Support:** 24/7 support with flexible SLAs.

---

## Features & Utility

### For dApps & Wallets

- Seamless swap and bridge execution
- Better UX with reliable pricing

### For Intent-Based Protocols

- Competitive solver participation
- Access solver liquidity via unified API

### For Solvers

- Compete for fills and maximize returns
- Access credit without holding capital
- Simplify operations with automation

---

## Getting Started

### Accessing the Solve API

- **Mainnet:** `https://swaps.sprinter.tech/mainnet`
- **Base:** `https://swaps.sprinter.tech/base`

### Authentication

All requests must include:

```http
X-API-Key: <your_key>
```

### Basic Usage Flow

1. Request API key via [Google Form](#)
2. Call `/v2/route` to get quote + execution data
3. Send transaction using `swap_call_data`

---

## Limitations

- Supported networks: Ethereum, Base
- Rate limit: ~25 req/s per client (contact us to raise)
- No on-chain simulation (must simulate client-side)

---

## Solver API Endpoints

```ts
// Reference: https://github.com/sprintertech/ass/blob/dev/swap/docs/openapi.yml

GET / v2 / route;
```
