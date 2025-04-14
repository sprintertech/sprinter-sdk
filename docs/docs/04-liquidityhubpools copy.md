---
id: liquidity-hub-pools
title: Liquidity Hub & Pools
sidebar_position: 4
---

# Liquidity Hub & Liquidity Pools

Central to both Sprinter Stash and Solve is the **Liquidity Hub**—the smart contract that manages and distributes liquidity.

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
  `0xB58Bb9643884abbbad64FA7eBcD9978002c09f4b`

### Functionality

- **Cross-Chain Execution:** Pools enable real-time execution of swaps and bridges.
- **Collateral-Free Borrowing:** Solvers access liquidity backed by hub-signed approvals.
- **Rebalancing:** Liquidity is auto-optimized across chains.
- **Risk Management:** Protocol maintains loan-to-value ratios to ensure solvency.
