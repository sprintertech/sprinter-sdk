---
id: stash-credit-v2
title: Stash Credit (V2)
sidebar_position: 2
---

# Stash Credit (V2)

Stash is programmable credit layer for individuals and agents. We don't just issue credit — we make credit *configurable*.

The first version of Stash (V1) provided zero-collateral credit for crosschain solvers and processed over $200m USD in volume within the first months. With our upcoming V2 we take credit beyond solvers and bring the benefits of *programmable credit* to neo finance and the agentic age.

On a high-level, Stash (V2) consists of the following components:

1. **Credit Hub**
   The core credit issuance and management system. Handles credit line creation, drawdowns, repayments, and liquidations across supported networks.
2. **Policy Engine**
   Credit policies enable Stash to 1) provide favorable credit conditions and 2) enable users and applications to constrain usage of credit.
3. **Liquidity Layer**
   The Stash Liquidity Layer provides the liquidity required for the credit engine. The Stash Liquidity Hub & App allow Liquidity Providers to earn yield by providing capital.

Stash enables applications to get purpose-fit credit lines for their users:

- Card Programmes fund card spend just-in-time, so users don't have to hold assets idle
- Neobanks provide a DeFi-powered liquid savings account, so users can spend their assets while having them earn yield in DeFi
- Agents access a human-delegated undercollateralized credit line to trade extended leverage on Hyperliquid

In the following sections you can get a glimpse on our upcoming V2 that will be launching very soon and explore our [V1](/Stash).

## Position Health, LTV and Liquidations

For collateralized credit, Stash continuously monitors the health of every position to ensure the protocol remains solvent and users stay protected.

### Loan-to-Value (LTV)

LTV defines how much credit you can draw relative to the value of your collateral. Each supported collateral asset has its own LTV ratio, reflecting its risk profile.

```
Max Credit = Collateral Value × LTV
```

For example, if you deposit $1,000 of USDC collateral with an LTV of 80%, your maximum credit line is $800.

### Maintenance LTV

Maintenance LTV is the maximum LTV your position is allowed to reach while you have an outstanding balance. It is set higher than the initial LTV to give your position a safety buffer before liquidation becomes possible.

```
Current LTV = Outstanding Debt / Collateral Value
```

As long as your Current LTV stays below the Maintenance LTV, your position is safe. If the value of your collateral drops or your debt grows (due to accruing interest) and pushes your Current LTV above the Maintenance LTV, your position becomes eligible for liquidation.

### Position Health Factor

The Health Factor combines both values into a single number that tells you how close your position is to liquidation:

```
Health Factor = (Collateral Value × Maintenance LTV) / Outstanding Debt
```

| Health Factor | Status |
|---|---|
| > 1.3 | Healthy |
| 1.0 – 1.3 | At risk — consider adding collateral or repaying |
| < 1.0 | Eligible for liquidation |

A Health Factor above 1.0 means your position is safe. Below 1.0, the protocol can liquidate part of your collateral to restore a healthy position.

### Liquidations

When a position becomes eligible for liquidation, Stash liquidates only as much collateral as needed to bring the Health Factor back above 1.0 — partial liquidations wherever possible. Liquidators who perform the liquidation receive a 5% bonus on the collateral they claim.
