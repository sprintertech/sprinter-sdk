---
id: solvestart
title: How to use Solve
sidebar_position: 1
---

## Getting Started

1. Request an API key via the [Sprinter Solve Request Form](https://forms.gle/TCAUwcYqguQbWi3bA)
2. Review the Solve APIs ([get route](solve-get-route), [get quote](solve-get-quote), [get route V2](solve-get-route-v2))
3. Call `/v2/route` to get quote + execution data
4. Send transaction using `swap_call_data`

### Accessing the Solve API

- **Mainnet:** `https://swaps.sprinter.tech/mainnet`
- **Base:** `https://swaps.sprinter.te`c`h/base`

### Authentication

All requests must include:

```http
X-API-Key: <your_key>
```

## Solve Fees

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
