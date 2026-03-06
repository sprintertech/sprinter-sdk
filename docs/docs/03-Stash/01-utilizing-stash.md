---
id: use-stash
title: Stash API Integration Guide
sidebar_position: 1
---

:::tip
Request your Stash API key via [Sprinter Stash Request](https://forms.gle/kgpcQK722Ley2gke7) or contacting support@sprinter.tech
:::

## For crosschain DeFi

Sprinter Stash enables solvers to **borrow crosschain credit on-demand** to execute user intents without needing pre-funded inventory.

## Overview of the Stash Fill Lifecycle

<div style={{ display: "flex", justifyContent: "center" }}>

```mermaid
flowchart TD
  A[Solver Detects User Intent] --> B[2 - Solver Previews estimated borrowing /quote of credit]
  B --> C[Receive Borrow Quote Estimate]
  C --> D{Fill using Stash Credit?}
  D -- Yes --> E[3 - Solver Reserves credit and authorize the fill /cost]
  D -- No --> F[Abort Fill]
  E --> G[Solver Borrow Liquidity from Sprinter Stash]
  G --> H[Stash Executes Cross-Chain Swap/Bridge Execution /request]
  H --> I[Intent Protocol Repays Borrowed Credit + Costs]
  I --> J[Fill Complete]

click B "borrow-quote-api" "Borrow Cost"
style B fill:#FF9B43,stroke:#333,stroke-width:2px,color:#000,font-weight:bold

click E "borrow-cost-api" "Borrow Quote"
style E fill:#FF9B43,stroke:#333,stroke-width:2px,color:#000,font-weight:bold

```

</div>
