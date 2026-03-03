---
id: liquidity-hub-pools
title: Sprinter Stash Contracts
sidebar_position: 113
---

# Sprinter Stash

Central to Sprinter Stash are the [**Sprinter Liquidity Hub**](liquidity-hub-pools#liquidity-hub), [**Liquidity Mining**](liquidity-hub-pools#liquidity-mining-contract) and [**Stash Pools**](liquidity-hub-pools#liquidity-pools) smart contracts which manages and distributes liquidity.

Liquidity authorization is managed and controlled by Sprinter's [**Multi-Party Computation (MPC)**](liquidity-hub-pools#liquidity-authorization-via-mpc) network.

## Liquidity Hub

**Contract Address (Base):**
`0xa593A9bBBc65be342FF610a01e96da2EB8539FF2`

### Functionality:

- **Allocation:** Hub allocates liquidity across supported chains based on solver demand.
- **Yield:** Idle liquidity is deployed into lending protocols like Aave.
- **Withdrawals:** LPs redeem their LP tokens for USDC when available.

## Liquidity Mining Contract

**Contract Address (Base):**
`0x479D158959B59328E89f0fbF7DfeBb198c313C21`

### Functionality:

- **Incentive Layer** Bootstraps solver access to credit while ensuring LPs are fairly rewarded. Reward parameters can be updated through governance, and all emissions are transparently distributed on-chain.
- **Depositing Liquidity:** LPs deposit USDC → receive `spUSDC-LP` tokens.
- **Stashing** When LPs receive their `spUSDC-LP` tokens, they can stake them in this contract to participate in ongoing emissions programs.
  **Multiplier incentives** — Longer lockups (e.g., 3, 6, or 9 months) offer higher point multipliers to encourage deeper liquidity commitments.

## Liquidity Pools

Deployed across multiple chains, these on-chain vaults serve solver requests.

### Key Pools

- **Aave USDC Pool** (Base, OP, Arbitrum):  
  `0x7C255279c098fdF6c3116D2BecD9978002c09f4b`

- **Standard USDC Pool** (Base, OP, Arbitrum):  
  `0xB58Bb9643884abbbad64FA7eBc874c5481E5c032`

### Functionality

- **Crosschain Execution:** Pools enable real-time execution of swaps and bridges.
- **Collateral-Free Borrowing:** Solvers access liquidity backed by hub-signed approvals.
- **Rebalancing:** Liquidity is auto-optimized across chains.
- **Risk Management:** Protocol maintains loan-to-value ratios to ensure solvency.

## Liquidity Authorization via MPC

Sprinter Stash relies on a secure **Multi-Party Computation (MPC)** network to authorize the release of credit and liquidity during cross-chain operations.

### What the MPC Does

- **Validates and Signs liquidity quotes**: When a solver calls the Stash API and is approved for a fill, the MPC validates the intent, user deposit and then co-signs the authorization.
- **Authorizes cross-chain releases**: The MPC authorizes any transfers required for inventory management across Stash Liquidity Pools and the Liquidity Hub (e.g., on Base, Arbitrum).
- **Enforces protocol limits**: MPC logic verifies borrowing caps, rate limits, and repayment preconditions before authorizing transactions.

### Why MPC Matters

- **Trust-Minimized Security**: No single signer can approve a transfer — it requires a quorum (e.g. 3-of-5 or 4-of-7 threshold).
- **Decentralized Control**: The MPC signer set is governed on-chain and can evolve over time as governance decentralizes.
- **Programmable Logic**: Validators inside the MPC check for vault solvency, repayment windows, and risk heuristics before signing.

### Governance & Oversight

The [**Super Admin Multisig**](/governance#2-super-admin-multisig) manages:

- Rotation or upgrade of MPC key shares
- Approval and removal of validator nodes
- Emergency pauses or overrides to protect protocol funds

The [**Operations Multisig**](/governance#1-operations-admin-multisig) may interact with MPC flows for day-to-day liquidity tuning, such as temporarily adjusting caps or triggering manual resets if required.

> Note: MPC signing happens off-chain but is fully verifiable and auditable via Sprinter’s on-chain replay logs and relay receipts.
