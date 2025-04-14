---
id: Stash
title: Sprinter Stash
sidebar_position: 3
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

## How Sprinter Enables Zero-Collateral Loans

Sprinter Stash enables solvers to borrow liquidity with near zero collateral, and achieves this through a series of mechanisms below:

#### 1. Approved Solvers

On launch only approved solvers can access Stash credit. These solvers:

- Undergo screening and onboarding by the Sprinter team
- Must use authenticated API keys tied to their accounts
- Are rate-limited and monitored to ensure responsible usage

Sprinter also tracks solver performance and creditworthiness over time. Solvers who consistently repay on time may be granted higher limits, while misbehavior results in penalties or revoked access with both informed through regular reviews of:

- Fill accuracy and repayment behavior
- Volume solved and protocols interacted with
- On-chain and off-chain repayment events

#### 2. Transaction-Level Guarantees

Each fill is validated against the user’s original intent using:

- Verified source deposits (e.g. via Across)
- MPC-signed authorization signatures
- Controlled function execution (via calldata)

Sprinter acts as an intermediary: the solver never touches user funds directly. The system ensures that repayment is guaranteed by the user's transaction on the source chain before the solver receives liquidity.

#### 3. Protocol Guardrails & Limits

Sprinter enforces:

- Per-solver daily limits (to minimize exposure)
- Per-transaction liquidity caps
- Circuit breakers triggered by irregular repayment behavior
- Slashing (or bond requirements) for higher-risk integrations

#### 4. Future Safety Module Activation

Sprinter will in future, activate the Sprinter Stash Safety Module (STSM) which incentivizes solvers to stake SPRNT tokens as a safeguard against potential liquidity shortfalls (eg reorgs or defaults) or protocol insolvencies, essentially providing a security backstop to the protocol.

#### 5. Bonding Pools

Sprinter will also allow Solver Operators to create Bonding Pools, that escrow funds to vouch for their solvers, enabling more favourable borrowing conditions. Sprinter Bonding Pools will be controlled by governance and similarly allow slashing by governance for any malicious activity or violations.
