---
id: liquidity-hub-pools
title: Sprinter Stash Pools
sidebar_position: 113
---

# Sprinter Stash

Central to both Sprinter Stash is the **Sprinter Liquidity Hub and Stash Pools**—the smart contracts that manages and distributes liquidity.

## Liquidity Hub

**Contract Address (Base):**
`0xa593A9bBBc65be342FF610a01e96da2EB8539FF2`

### Responsibilities:

- **Depositing Liquidity:** LPs deposit USDC → receive `spUSDC-LP` tokens.
- **Allocation:** Hub allocates liquidity across supported chains based on solver demand.
- **Yield:** Idle liquidity is deployed into lending protocols like Aave.
- **Withdrawals:** LPs redeem their LP tokens for USDC when available.

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

- **Signs liquidity quotes**: When a solver calls the Stash API and is approved for a fill, the MPC co-signs the authorization.
- **Authorizes cross-chain releases**: The MPC signs messages that unlock liquidity from remote vaults (e.g., on Base, Arbitrum).
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
