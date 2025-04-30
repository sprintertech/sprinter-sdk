---
id: solve-api-quick-start
title: Solve API Quick Start
sidebar_position: 110
---

# 🚀 Sprinter Solve API Quick Start Guide

A practical walkthrough of how developers can use the **Sprinter Solve API** to optimize swap execution via intent fulfillment.

---

## 📘 Step 1: Detect a User Intent or Trade Request

Listen for user swap requests or intent triggers in your dApp, aggregator, or protocol integration.

---

## 📘 Step 2: Fetch a Quote from Solve API

Use the `/v2/route` endpoint to fetch an optimized swap route and quote for execution.

```ts title="Fetch Swap Quote"
const chainId = 1; // 1 = Ethereum, 8453 = Base, etc.
const srcToken = "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // USDC
const dstToken = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH
const amount = "1000000"; // USDC with 6 decimals = 1 USDC

const res = await fetch(`https://swaps.sprinter.tech/base/v2/route`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "<your_api_key>",
  },
  body: JSON.stringify({
    fromToken: srcToken,
    toToken: dstToken,
    amount: amount,
    slippage: 0.005, // 0.5% slippage tolerance
    user: "<user_address>",
  }),
});

const quoteData = await res.json();
console.log("Solve API Quote:", quoteData);
