/**
 * Operator Dashboard — Local UI Server
 *
 * Serves a single-page dashboard where the human operator can:
 *   1. Connect MetaMask
 *   2. Lock collateral
 *   3. Set up a Credit Operator and whitelist receivers for the agent
 *   4. View their credit position and operator status
 *
 * The server proxies Sprinter API calls to avoid CORS issues.
 */

import express from "express";
import "dotenv/config";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SPRINTER_API = process.env.SPRINTER_API || "https://api.sprinter.tech";
const PORT = parseInt(process.env.PORT || "3001");

const app = express();
app.use(express.static(join(__dirname, "..", "public")));

// Proxy: credit position
app.get("/api/credit-info/:account", async (req, res) => {
  try {
    const r = await fetch(`${SPRINTER_API}/credit/accounts/${req.params.account}/info`);
    const data = await r.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy: protocol config
app.get("/api/protocol", async (_req, res) => {
  try {
    const r = await fetch(`${SPRINTER_API}/credit/protocol`);
    const data = await r.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy: lock collateral
app.get("/api/lock/:account", async (req, res) => {
  try {
    const { amount, asset, earn } = req.query;
    let url = `${SPRINTER_API}/credit/accounts/${req.params.account}/lock?amount=${amount}&asset=${asset}`;
    if (earn) url += `&earn=${earn}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy: operator status
app.get("/api/operator/:account", async (req, res) => {
  try {
    const r = await fetch(`${SPRINTER_API}/credit/accounts/${req.params.account}/operator`);
    const data = await r.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy: enable operator + whitelist receiver
app.get("/api/enable-operator/:account", async (req, res) => {
  try {
    const { receiver } = req.query;
    const r = await fetch(
      `${SPRINTER_API}/credit/accounts/${req.params.account}/operator/auto-topup/enable?receiver=${receiver}`
    );
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy: health check
app.get("/api/health", async (_req, res) => {
  try {
    const r = await fetch(`${SPRINTER_API}/health`);
    const data = await r.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log();
  console.log("========================================================");
  console.log("  Sprinter Credit — Operator Dashboard");
  console.log("========================================================");
  console.log();
  console.log(`  Open http://localhost:${PORT} in your browser`);
  console.log(`  Connect MetaMask to set up collateral & delegation`);
  console.log();
});
