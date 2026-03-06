---
id: policy-engine
title: Policy Engine
sidebar_position: 2
---

# Policy Engine

The Policy Engine is what makes Stash credit *configurable*. Rather than one-size-fits-all credit, every credit line is governed by a policy that defines exactly who can use it, what they can do with it, and under what conditions.

The tighter the constraints, the less collateral is needed — because the protocol's downside risk is bounded. This is how Stash can offer favourable or even undercollateralised credit terms: not because the risk disappears, but because it is constrained.

## Components

**Credit Operators**

Credit operators enable Stash users to grant access to their Stash credit line to other users or agents. Furthermore it allows to define fine-grained policy on the credit access provided such as:

- *Actions* — which Stash actions such as draw, repay and withdraw collateral are allowed
- *Amount caps* — per-transaction and per-period limits
- *Co-sign requirements* — actions above a value threshold require an additional approval

**Guardrailed Credit Accounts**

Stash supports the creation of guardrailed credit accounts that grant Stash permissions on the issued funds.

Each integration has its own Credit Account implementation suited to its use case:

- **Miso (card top-up)** — a contract that can only call the card top-up function; it cannot send funds arbitrarily
- **HyperEVM (agent trading)** — the `HLExecutor` contract, which holds the leveraged capital, registers the Hyperliquid API keys, and is the target for the liquidator's withdrawal call. It is the on-chain anchor that bridges Stash's credit system with Hyperliquid's off-chain trading account

**Credit Configuration**

The financial terms set at onboarding: LTV ratios, supported collateral assets, credit asset, interest rate, and term length. The credit configuration and the credit policy work together — a tighter policy can unlock a more favourable configuration.

## Use Cases Compared

| | Miso — Card Auto Top-Up | HL Agent / Bot |
|---|---|---|
| **Credit operator** | Delegated app wallet (no user sig per action) | User-issued API key (trading only) |
| **Usage constraint** | Card top-up contract only | HL API key scoped to trading — no withdrawals or account changes |
