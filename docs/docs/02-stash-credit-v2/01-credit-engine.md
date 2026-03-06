---
id: credit-engine
title: Credit Engine
sidebar_position: 1
---

# Credit Engine

## Introduction

The Stash Credit Engine handles credit line creation, drawdowns, repayments, and liquidations. Key features include:

**Flexible terms** — Overcollateralized or undercollateralized, fixed-rate or variable, short-term or rolling. The credit parameters adapt to the use case, not the other way around.

**Cross-chain portfolio, one credit line** — Collateral assets across all major chains valued as a unified portfolio. $50K staked ETH on Ethereum + $30K in Morpho Earn on Base + $20K WBTC on Arbitrum → $70K credit line, usable anywhere without bridging.

**Productive collateral** — Integrations with leading DeFi strategists Gauntlet and YO provide market-leading yield on your collateral assets such as USDC, ETH & BTC.

## Credit Configurations

Stash uses credit configurations to structure different forms of credit. Creating a new credit configuration is currently a permissioned process — if you need purpose-fit credit for your app, we'd love to hear from you!

| | Card Spend | Crosschain Intents |
|---|---|---|
| Access | Permissionless | Permissioned |
| Type | Overcollateralized | Zero Collateral |
| Usage Constraints | No | Fills in supported Intent protocols |
| Credit Chains | Base | Base, Arbitrum, Ethereum, Optimism, Unichain |
| Credit Asset | USDC | USDC, WETH, WBTC |
| Collateral Chains | Base, Ethereum | N/A |
| Collateral Assets | All supported | N/A |
| Term | Fixed 30+7 | Up to 4 hours |
| Fees | One-Time + Late Payment | Dynamic |

## Credit Issuance

Stash currently uses USDC as the main asset for credit issuance.

## Supported Assets & Positions

Stash provides one unified credit line — and in the case of collateralized credit, users can deposit assets and DeFi positions across all supported chains. The following assets and positions are supported as collateral:

| Asset or Position | Type | Supported Chains | Token | LTV | Maintenance LTV |
|---|---|---|---|---|---|
| USDC | Asset | Base | | | |
| Gauntlet USDC Prime | Vault | Base | | | |
| YoUSD | | | | | |
| SuperUSD | | | | | |

:::tip
Stash constantly adds more assets and DeFi positions to the list of supported collateral. Drop us a message if you'd like to see a specific asset supported.
:::

## Position Health, LTVs and Liquidations

Stash constantly monitors the health of all credit positions according to the defined credit configuration. In the case of collateralized credit, the collateral value is tracked continuously for changes.

**Loan-to-Value (LTV)**

LTV defines how much credit a user can draw relative to the value of their collateral. Each supported collateral asset has its own LTV ratio, reflecting its risk profile.

`Max Credit = Collateral Value × LTV`

For example, if a user deposits $1,000 of USDC collateral with an LTV of 80%, their maximum credit line is $800.

**Maintenance LTV**

Maintenance LTV is the maximum LTV a position is allowed to reach while there is an outstanding balance. It is set higher than the initial LTV to provide a safety buffer before liquidation becomes possible.

`Current LTV = Outstanding Debt / Collateral Value`

As long as the Current LTV stays below the Maintenance LTV, the position is safe. If collateral value drops or debt grows (due to accruing interest) and pushes the Current LTV above the Maintenance LTV, the position becomes eligible for liquidation.

**Position Health Factor**

The Health Factor combines both values into a single number that indicates how close a position is to liquidation:

`Health Factor = (Collateral Value × Maintenance LTV) / Outstanding Debt`

| Health Factor | Status |
|---|---|
| > 1.3 | Healthy |
| 1.0 – 1.3 | At risk — consider adding collateral or repaying |
| < 1.0 | Eligible for liquidation |

A Health Factor above 1.0 means the position is safe. Below 1.0, the protocol can liquidate part of the collateral to restore a healthy position.

**Liquidations**

When a position becomes eligible for liquidation, Stash liquidates only as much collateral as needed to bring the Health Factor back above 1.0 — partial liquidations wherever possible. Liquidators who perform the liquidation receive a 5% bonus on the collateral they claim.
