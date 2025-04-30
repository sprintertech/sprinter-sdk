---
id: glossary
title: Sprinter Glossary
sidebar_position: 10
--- 
  
### 1. Solvers
Automated agents that find and execute the most efficient way to fulfill a user’s intent, optimizing for cost, speed, and security.

### 2. Intent Systems
A model where users specify desired outcomes, and solvers or order flow networks execute transactions accordingly.

### 3. MEV (Maximal Extractable Value)
The value miners, validators, or solvers can extract by reordering transactions, with growing importance in MEV-resistant routing across chains.

### 4. Liquidity Mining
Incentivizing users to provide liquidity to decentralized protocols, crucial for ensuring deep liquidity in interoperable ecosystems.

### 5. Swaps
Asset exchanges that can occur within a single chain or across multiple chains using interoperability protocols.

### 6. Interop
The ability of multiple blockchain networks to communicate and share information in a seamless, trust-minimized, and permissionless way.

### 7. Atomic Swaps
A mechanism that allows users to exchange assets across different blockchains in a trustless manner without intermediaries.

### 8. Bridges
Protocols that facilitate asset and data transfer between different blockchain networks. Bridges can be trust-minimized (e.g., ZK-proofs, MPC) or centralized.

### 9. Cross-Chain Messaging (CCM)
A communication layer that enables smart contracts and applications on different blockchains to exchange messages and trigger actions.

### 10. Trust-Minimized Interoperability
A security model that ensures cross-chain transactions can be verified without relying on a single centralized authority.

### 11. State Proofs
Cryptographic proofs that verify the state of one blockchain on another without needing a centralized validator.

### 12. Order Flow Auctions (OFAs)
A mechanism where solvers compete to execute user intents by offering the most efficient execution path.

### 13. Commit-Reveal Schemes
A cryptographic technique where users commit to an intent before revealing execution details to prevent frontrunning.

### 14. Solver Competition
A model where multiple solvers bid to execute a user’s intent based on optimal execution parameters.

### 15. Fair Ordering Protocols
Systems that prevent MEV extraction and ensure user transactions are processed fairly in intent-based architectures.

### 16. Flow Isolation
A technique used to prevent solver collusion and ensure that intents remain private until execution.

### 17. Meta-Transactions
Transactions that are relayed and executed on behalf of a user, abstracting away gas fees and network complexity.

### 18. Gas Abstraction
A mechanism where users don’t need to hold native tokens to pay for gas fees, allowing transactions to be executed with alternative assets.

### 19. Account Abstraction (AA)
A design that moves away from traditional externally owned accounts (EOAs) and allows more flexible wallet interactions.

### 20. Unified Liquidity Pools
Cross-chain pools that allow users to access liquidity seamlessly without needing to bridge assets manually.

### 21. Execution Environments
Different blockchain execution layers (e.g., EVM, WASM) that need to be abstracted for smooth multi-chain interactions.

### 22. Threshold Signatures (TSS)
A cryptographic scheme used in cross-chain transactions to prevent single points of failure.

### 23. Rollup Composability
The ability of rollups to interact with each other and with Layer 1 chains in a seamless way.

### 24. Hybrid Custodial & Non-Custodial Bridges
Models that combine elements of centralized and decentralized bridge security to improve trust minimization.

### 25. Cross-Chain Governance
Systems that enable decentralized governance across multiple chains without requiring users to vote on each network separately.

### 26. Cross-Domain MEV
The study of how maximal extractable value (MEV) can be exploited or mitigated across different blockchain networks.

### 27. Cross-Chain Finality
Ensuring that transactions on one blockchain are finalized and verifiable on another without rollback risks.

### 28. Recursive SNARKs
A cryptographic method for verifying multiple proofs efficiently, often used for cross-chain validation.

### 29. Bridgeless Interoperability
A model where assets do not need to be explicitly bridged but are instead referenced and executed natively across chains.

### 30. Atomic Composability
The ability to execute transactions in a single atomic operation, ensuring all steps succeed or fail together.

### 31. Shared Security Models
Mechanisms where smaller chains inherit security from a larger, more established network.

### 32. Intent Standardization
The process of creating common formats for intent expression so that multiple solvers can compete on execution.

### 33. Solver Networks
Decentralized networks of solvers that execute user intents efficiently while minimizing costs and MEV risks.

### 34. Executable Intents
Intents that include conditions and constraints to ensure execution only happens when all state change criteria are met.

### 35. Decentralized Order Flow
A distributed mechanism where the process is open, permissionless, and avoids reliance on a central entity.

### 36. Cross-Domain Intent Execution
The ability for an intent system to execute across different execution environments (EVM, WASM, etc.).

### 37. Bounded MEV Intents
Intents that are designed to minimize MEV exploitation by setting strict execution conditions.

### 38. Intent Aggregation
The process of bundling multiple user intents to optimize execution costs and efficiency.

### 39. Universal Smart Accounts
Wallet accounts that function across multiple blockchains and support advanced execution logic.

### 40. Multichain Asset Abstraction
The ability to use a single asset representation across multiple blockchains without explicit bridging.

### 41. Trustless Relayers
Intermediaries that facilitate cross-chain transactions without requiring users to trust them with their assets.

### 42. Intent-Based Arbitrage
Arbitrage that is facilitated through intents, optimizing price discrepancies across venues without needing specific trade paths.

### 43. Interoperable Liquidity Aggregation
The process of dynamically managing liquidity across chains to optimize swap execution and efficiency.

### 44. Threshold Multi-Signature (TMS)
A security mechanism where multiple signatures are required to execute a transaction across chains.

### 45. Consensus-Agnostic Interoperability
Systems that facilitate communication between chains regardless of their underlying consensus mechanism (PoS, PoW, etc.).

### 46. Borrow Cost  
A **borrow cost** is the preliminary **estimated fee** a solver would incur to borrow liquidity from Sprinter Stash. It is returned off-chain via the Stash API and helps solvers determine if pursuing a fill is profitable.  Borrow cost includes expected gas, risk premiums, protocol fees, and capital access costs — but it is **not a binding or reserved price**.

### 47. Borrow Quote  

A **borrow quote** is the final, **authorized borrowing offer** issued by Sprinter Stash when a solver decides to proceed with a fill. It reserves liquidity under specific conditions, allowing solvers to confidently execute the cross-chain transaction.



### 48. Sprinter Solve Quote
A quote is a solver’s proposed price and execution plan for fulfilling a user's intent. It includes information such as input/output amounts, fees, and gas costs. In Sprinter, a quote is typically returned from the Solve API (/v2/route) and reflects the cost, path, and feasibility of executing a swap or cross-chain action at a given moment. Users (or integrators) evaluate quotes to determine if they're acceptable before triggering execution.

### 49. Sprinter Solve Fill
A fill is the successful execution of a user intent by a solver. Once a quote is accepted, the solver "fills" the intent by borrowing liquidity (via Sprinter Stash), performing the necessary transactions (swap, bridge, etc.), and finalizing the settlement on the destination chain. In Sprinter, fills represent the moment where capital moves and the solver earns fees — it's the actual fulfillment of what was quoted.

### 50. Fill

A fill represents the full lifecycle: Detecting a user intent ➔ Borrowing liquidity ➔ Executing the transaction ➔ Repaying liquidity ➔ Realizing solver and protocol profits.