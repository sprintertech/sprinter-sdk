---
id: Stash
title: Sprinter Stash
sidebar_position: 3
---

:::tip
Ready to Stash? Check out [Track Event 1](/Stash-points) on how to provide capital, earn yield and win Stash Points.
:::

# Sprinter Stash

Sprinter Stash is a credit-based liquidity protocol that connects stablecoin LPs with crosschain actors like solvers and strategists and bridges the gap between passive capital and high-frequency, crosschain demand.

## Why Sprinter Stash?

### For Liquidity Providers

Sprinter Stash is for liquidity providers looking for an attractive yield opportunity based on a new DeFi primitive:

- **High Yield & Low Risk:** Sprinter Stash utilizes multiple yield sources to maximize capital efficiency and returns: LPs earn from service fees paid by solvers to access credit as well as proven passive yield sources (such as lending protocols) ensuring low risk. Staking earns additional rewards through SPRNT token emissions.
- **Secure & Credible:** MPC-secured multi-party threshold signing, risk mitigation mechanisms, and [smart contract audits by [Veridise](https://github.com/sprintertech/sprinter-stash-contracts/blob/main/audits/VAR_Sygma_labs_Sprinter_liquidity_250212-final.pdf) and [Spearbit/Cantina](https://cantina.xyz/portfolio/fe3c634c-d06d-47c2-a70a-f19d2f820f58) make Sprinter Stash a secure platform. Built in partnership with [ChainSafe](https://chainsafe.io), a team with 7+ years of industry expertise across core protocol development, standardization/ EIPs and security audits /council work.

### For crosschain DeFi

Sprinter Stash enables capital-efficient crosschain execution by removing the need for pre-funded liquidity pools or collateralized loans. Liquidity is automatically managed across chains via a variety of rebalancing and netting protocols. At launch, **Stash** initially supports solvers filling orders in:

- Across
- LiFi Intents
- Mayan Finance
- Rhinestone

## How Stash Works

1. **Liquidity Providers deposit USDC on Base from any chain into the protocol’s liquidity hub** - Receiving spUSDC-LP tokens in return. Liquidity is then managed across the pools on supported chains.
2. **Solvers access liquidity instantly, without collateral** – Solvers are executing their fills through Stash. After a fill is completed via credit, Stash receives the deposited funds on the source chain repaying the credit and keeping profits for LPs and solvers. Stash works as a closed credit system where the MPC validates all intents to be filled and ensure credit will be repayed.
3. **LPs earn dynamic rewards** – Yield is optimized through a combination of base yield from supply in lending protocols, such as Aave, and yield from solver borrow fees. LPs are also eligible to earn staking rewards in the form of SPRNT emissions, with higher multipliers for longer locks in addition to bonus incentives for earlybirds.
4. Once **fills are completed**, Stash receives funds on the source chain, repays the credit, and distributes profits to LPs and solvers.

By bringing together **liquidity providers and solvers** Sprinter Stash creates a more efficient and scalable solver environment for the entire DeFi ecosystem. Stash launches with supported:

- **Destination Networks** - Base, Arbitrum, Optimism
- **Tokens** - DAI, ETH/WETH, USDC, USDT, WBTC
- **Protocols** - Any EVM crosschain bridge/ swap protocol such as 1inch Fusion+, Across, Debridge Liquidity Network, Everclear, Mayan.Finance with many more upcoming
- **Rebalancing/ Inventory Management** - CCTP, native Bridges, Everclear

## How Stash Enables Zero-Collateral Loans

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

#### 4. Solver Risk / Repayment

Stash pools initiate the execution, not the solver. The solver does not pull funds itself, but merely instruct the pool and as such never custody capital. There are no scenarios where a solver can “not execute” or misdirect funds.

#### 5. Liquidity Proivder Risk

Stash is a closed credit system with controlled flows, so solvers cannot lose LP funds. The remaining risks are the same as any DeFi protocol: Security risks in Stash itself and in the protocols we use (e.g. Aave). We only integrate with partners who meet strict security standards and have strong audit histories as ourselves.

## Stash Fees

Sprinter Stash handles crosschain liquidity fills. Revenue is generated from the spread between between the amount the user deposited on source and the amount provided on the destination.

### Revenue Components

- **Fill Revenue:** Amount user deposits on source - amount send to user on destination
- **Borrow Costs:** Cost of liquidity borrowing and crosschain repayment.
- **Solver Costs:** Gas fees and execution costs fronted by solvers.

### Profit Calculation

```
Fill Profit = Fill Revenue - Borrow Costs - Solver Costs
```

### Monthly Distribution

1. Withdraw raw profits from liquidity pools.
2. Deduct solver gas costs.
3. Distribute monthly fill profits to:

| Actor    | Description                           | Fill Profit % |
| -------- | ------------------------------------- | ------------- |
| Solvers  | For executing fills                   | 50%           |
| LPs      | For providing liquidity               | 50%           |
| Treasury | Protocol growth & sustainability fund | TBD           |

➡️ _Initial fee split is reviewed monthly by governance._

# Ready to Stash?

- As a Liquidity Provider: check out [Track Event 1](/Stash-points)
- For DeFi: check out the [Stash API Integration Guide](use-stash)
