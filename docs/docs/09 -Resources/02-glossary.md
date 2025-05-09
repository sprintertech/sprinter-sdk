---
id: glossary
title: Sprinter Glossary
sidebar_position: 12
---

### Account Abstraction (AA)

A design that moves away from traditional externally owned accounts (EOAs) and allows more flexible wallet interactions.

### Bridges

Protocols that facilitate asset and data transfer between different blockchain networks. Bridges can be trust-minimized (e.g., ZK-proofs, MPC) or centralized.

### Crosschain Finality

Ensuring that transactions on one blockchain are finalized and verifiable on another without rollback risks.

### Crosschain Governance

Systems that enable decentralized governance across multiple chains without requiring users to vote on each network separately.

### Crosschain Messaging

A communication layer that enables smart contracts and applications on different blockchains to exchange messages and trigger actions.

### Decentralized Order Flow

A distributed mechanism where the process is open, permissionless, and avoids reliance on a central entity (such as a centralized exchange)

### Execution Environments

Different blockchain execution layers (e.g., EVM, WASM) that need to be abstracted for smooth multi-chain interactions.

### Executable Intents

Intents that include conditions and constraints to ensure execution only happens when all state change criteria are met.

### Fair Ordering Protocols

Systems that prevent MEV extraction and ensure user transactions are processed fairly in intent-based architectures.

### Fill

A fill represents the full lifecycle: Detecting a user intent ➔ Borrowing liquidity ➔ Executing the transaction ➔ Repaying liquidity ➔ Realizing solver and protocol profits.

### Gas Abstraction

A mechanism where users don’t need to hold native tokens to pay for gas fees, allowing transactions to be executed with alternative assets.

### Intent Aggregation

The process of bundling multiple user intents to optimize execution costs and efficiency.

### Intent Standardization

The process of creating common formats for intent expression so that multiple solvers can compete on execution.

### Intent Systems

A model where users specify desired outcomes, and solvers or order flow networks execute transactions accordingly.

### Intent-Based Arbitrage

Arbitrage that is facilitated through intents, allowing solvers or execution agents to optimize price discrepancies across multiple venues or chains without needing the user to manually define trade paths.

### Interop

The ability of multiple blockchain networks to communicate and share information in a seamless, trust-minimized, and permissionless way. This enables assets, smart contracts, and transactions to interact across chains without requiring users to manage complex bridging processes.

### Liquidity Mining

Incentivizing users to provide liquidity to decentralized protocols, crucial for ensuring deep liquidity in interoperable ecosystems.

### MEV (Maximal Extractable Value)

The value miners, validators, or solvers can extract by reordering transactions, with growing importance in MEV-resistant routing across chains.

### Order Flow Auctions

A mechanism where solvers compete to execute user intents by offering the most efficient execution path.

### Recursive SNARKs

A cryptographic method for verifying multiple proofs efficiently, often used for crosschain validation.

### Solver Competition

A model where multiple solvers bid to execute a user’s intent based on optimal execution parameters.

### Solver Networks

Decentralized networks of solvers that execute user intents efficiently while minimizing costs and MEV risks.

### Solvers

Automated agents that find and execute the most efficient way to fulfill a user’s intent, optimizing for cost, speed, and security.

### Sprinter Solve Route

Gets the finalized execution package returned by `/v2/route` which contains all necessary data to execute a transaction. It builds on a quote by including calldata, selected liquidity paths, slippage tolerances, and chain-specific details. Routes are consumed directly by solvers or smart contracts to simulate and execute cross-chain swaps or intent fills.

### Stash Borrow Quote

A borrow quote is the preliminary **estimated fee** a solver would incur to borrow credit from Sprinter Stash. It is returned off-chain via the Stash API and helps solvers determine if pursuing a fill is profitable. Borrow quote includes expected gas, risk premiums, protocol fees, and capital access costs — but it is not a binding or reserved price.

### Stash Borrow Cost

A borrow cost is the final, **authorized borrowing offer** issued by Sprinter Stash when a solver decides to proceed with a fill. It reserves credit under specific conditions, allowing solvers to confidently execute the crosschain transaction.

### State Proofs

Cryptographic proofs that verify the state of one blockchain on another without needing a centralized validator.

### Swaps

Asset exchanges that can occur within a single chain or across multiple chains using interoperability protocols.

### Threshold Signature Scheme (TSS)

A security mechanism where multiple signatures are required to execute a transaction across chains.

### Threshold Signatures (TSS)

A cryptographic scheme used in cross transactions to prevent single points of failure.

### Trust-Minimized Interoperability

A security model that ensures crosschain transactions can be verified without relying on a single centralized authority.

### Unified Liquidity Pools

Crosschain pools that allow users to access liquidity seamlessly without needing to bridge assets manually.

### Universal Smart Accounts

Wallet accounts that function across multiple blockchains and support advanced execution logic.
