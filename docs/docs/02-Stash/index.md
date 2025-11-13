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


# Ready to Stash?

- As a Liquidity Provider: check out [Track Event 1](/Stash-points)
- For DeFi: check out the [Stash API Integration Guide](use-stash)
