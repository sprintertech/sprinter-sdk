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
