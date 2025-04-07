---
id: sprinter-stash
title: Sprinter Stash
sidebar_position: 2
---

# Sprinter Stash

Sprinter Stash is a cross-chain credit liquidity protocol that uses a just-in-time liquidity management system to efficiently allocate funds across multiple blockchains.

## How Sprinter Stash Works

- **Liquidity Providers** deposit USDC on Base into the protocol’s liquidity hub and receive `spUSDC-LP` tokens in return.
- **Liquidity Management** is dynamic—funds are allocated across supported chains based on solver demand.
- **Solvers** borrow liquidity instantly, without collateral, enabling seamless cross-chain execution.
- After fills are completed, the Stash receives funds on the source chain, repays the credit, and distributes profits to LPs and solvers.

## Stash Rewards

- **LPs earn dynamic rewards**:
  - Base APY from supply on lending protocols (e.g., Aave)
  - SPRNT staking rewards with multiplier boosts for longer locks
  - Earlybird incentives

Sprinter Stash is powered by **Sprinter Solve**.

## Features & Utility

### For Solvers

- Reduce capital requirements by borrowing liquidity on demand.
- Eliminate need to manage inventory across chains.
- Improve execution efficiency with shared liquidity access.

### For LPs

- Earn passive yield and solver-generated fees.
- Participate in liquidity mining campaigns for SPRNT rewards.
- Benefit from protocol-managed inventory strategies.

## Utilizing Sprinter Stash

### As a Liquidity Provider

1. Visit [app.sprinter.tech](https://app.sprinter.tech)
2. Connect your wallet (e.g., MetaMask)
3. Deposit USDC and stake LP tokens
4. Monitor rewards, pool stats, or withdraw liquidity

### As a Solver

1. Request API access via [Google Form](#)
2. Review API Docs
3. Query borrow rates
4. Borrow funds and execute swaps
5. Repay liquidity post-transaction

## Stash API Endpoints

```ts
// Example Endpoints (see Swagger for full list)

GET / v1 / liquidity / protocol / { protocol } / deposit / { txHash } / request;
GET / v1 / liquidity / protocol / { protocol } / type / { type } / quote;
```

➡️ _To integrate Swagger: use `@theme/ApiDoc` component or embed link to OpenAPI spec._

## Supported Networks

- Arbitrum
- Optimism
- Base
- Ethereum Mainnet (coming soon)

## Supported Assets

- Stablecoins: USDC, DAI, USDT
- Blue-Chip: WETH, WBTC

Want to request support for a new chain or asset? [Submit a request](#).
