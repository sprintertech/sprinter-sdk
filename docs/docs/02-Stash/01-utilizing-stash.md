---
id: use-stash
title: How to use Stash
sidebar_position: 1
---

:::tip
There are two main ways to utilize Sprinter Stash. Either as a Liquidity Provider or as a Solver.
:::

## As a Liquidity Provider

1. Visit [app.sprinter.tech](https://app.sprinter.tech)
2. Connect your wallet (e.g., MetaMask)
3. Deposit USDC and stake LP tokens
4. Monitor rewards, pool stats, unstake or withdraw liquidity

## As a Solver

1. Request Stash API access via [Sprinter Stash Request Form](https://forms.gle/kgpcQK722Ley2gke7)
2. Review the Stash APIs ([borrow cost](borrow-cost-api), [borrow quote](borrow-quote-api)) or visit the [Stash Swagger](https://api.test.sprinter.buildwithsygma.com/swagger/index.html#/Liquidity/get_liquidity_protocol__protocol__deposit__txHash__request)
3. Query borrow rates
4. Borrow funds and execute swaps
5. Repay liquidity post-transaction

### Supported Networks

- Arbitrum
- Optimism
- Base
- Ethereum Mainnet (coming soon)

### Supported Assets

- Stablecoins: USDC, DAI, USDT
- Blue-Chip: WETH, WBTC

Want to request support for a new chain or asset? [Submit a request](https://forms.gle/an5vZrmyDkyYR8Ni7).



## Fees

Sprinter Stash handles crosschain liquidity fills. Revenue is generated from the spread between source and destination values.

### Revenue Components

- **Fill Revenue:** User deposit on source - amount bridged to destination.
- **Borrow Costs:** Cost of liquidity borrowing and crosschain repayment.
- **Solver Costs:** Gas fees and execution costs fronted by solvers.

### Profit Calculation

```
Fill Profit = Fill Revenue - Borrow Costs - Solver Costs
```

### Monthly Distribution

1. Withdraw raw profits from liquidity pools.
2. Deduct solver gas costs.
3. Distribute monthly fill profits to:

| Actor    | Description                           | Fill Profit % |
| -------- | ------------------------------------- | ------------- |
| Solvers  | For executing fills                   | 50%           |
| LPs      | For providing liquidity               | 50%           |
| Treasury | Protocol growth & sustainability fund | TBD           |

➡️ _Initial fee split is reviewed monthly by governance._