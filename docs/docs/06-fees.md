---
id: sprnt-fees
title: Fees
sidebar_position: 6
---

# Protocol Fees

## Sprinter Stash

Sprinter Stash handles cross-chain liquidity fills. Revenue is generated from the spread between source and destination values.

### Revenue Components

- **Fill Revenue:** User deposit on source - amount bridged to destination.
- **Borrow Costs:** Cost of liquidity borrowing and cross-chain repayment.
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

## Solving API Revenue Share

When a fixed user fee is applied through Sprinter API, revenue is shared with partners based on usage volume.

### Fee Discount Tiers

| Monthly Volume (USD) | Sprinter Fee (X%) | Discount |
| -------------------- | ----------------- | -------- |
| $0 - $1M             | X \* 0.20         | 0%       |
| $1M - $10M           | X \* 0.15         | 25%      |
| $10M - $50M          | X \* 0.10         | 50%      |
| $50M - $100M         | X \* 0.075        | 62.5%    |
| Over $100M           | X \* 0.05         | 75%      |

### Example

```
User Fee = 0.875%
Monthly Volume = $150M
Sprinter Fee = 0.875% * 0.05 = 0.04375% (4.375 bps)
```
