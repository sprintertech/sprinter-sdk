import express from "express";
import { ethers } from "ethers";
import "dotenv/config";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { MockCardIssuer } from "./card-issuer.js";
import type { CardIssuer, Logger } from "./card-issuer.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Config ──────────────────────────────────────────────────────────────────

const SPRINTER_API = "https://api.sprinter.tech";
const USDC_ADDRESS = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
const USDC_DECIMALS = 6;
const BASE_CHAIN_ID = 8453;

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL || "https://mainnet.base.org";
const DEMO_AMOUNT = parseFloat(process.env.DEMO_AMOUNT || "1.00");
const DRY_RUN = process.env.DRY_RUN === "true";
const PORT = parseInt(process.env.PORT || "3003");

if (!PRIVATE_KEY) {
  console.error("\n  PRIVATE_KEY not set. Copy .env.example to .env and fill it in.\n");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const account = wallet.address;

// ── Card Issuer ─────────────────────────────────────────────────────────────
// Swap MockCardIssuer for a real CardIssuer implementation
// to connect to a live card issuing API.
const cardIssuer: CardIssuer = new MockCardIssuer();

const usdcUnits = (amount: number) =>
  BigInt(Math.round(amount * 10 ** USDC_DECIMALS)).toString();

interface ContractCall {
  to: string;
  data: string;
  value: string;
  chain: string;
}

// ── SSE Event Stream ────────────────────────────────────────────────────────

type SSEWriter = (event: string, data: any) => void;

function createSSEWriter(res: express.Response): SSEWriter {
  return (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };
}

// Logger adapter — converts card-issuer log calls to SSE events
function sseLogger(send: SSEWriter): Logger {
  return (msg: string, type?: string) => {
    send("log", { message: msg, type: type || undefined });
  };
}

// ── Sprinter Helpers ────────────────────────────────────────────────────────

async function sprinterGet(path: string, send: SSEWriter): Promise<any> {
  const url = `${SPRINTER_API}${path}`;
  send("log", { message: `Sprinter: GET ${path}` });
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    if (DRY_RUN) {
      send("log", { message: `Sprinter: API returned ${res.status} (expected in dry run)`, type: "warn" });
      // Return a shape that satisfies both calldata endpoints and info endpoints
      return {
        calls: [{ to: "0x0", data: "0x0", value: "0", chain: "eip155:8453" }],
        status: "ok",
        chains: {},
        data: {
          usdc: {
            healthFactor: "999999999",
            totalCreditCapacity: "0",
            remainingCreditCapacity: "0",
            totalCollateralValue: "0",
            debt: "0",
          },
        },
      };
    }
    throw new Error(`Sprinter API ${res.status}: ${body}`);
  }
  return res.json();
}

async function executeCalls(calls: ContractCall[], send: SSEWriter): Promise<string> {
  if (DRY_RUN) {
    send("log", { message: `DRY RUN — would execute ${calls.length} transaction(s)`, type: "info" });
    return "0x_dry_run";
  }

  const filteredCalls = calls.filter((call) => {
    if (call.to.toLowerCase() === USDC_ADDRESS.toLowerCase() && call.data.startsWith("0x095ea7b3")) {
      send("log", { message: "Skipping API approve call (handled separately)" });
      return false;
    }
    return true;
  });

  let lastTxHash = "";
  for (let i = 0; i < filteredCalls.length; i++) {
    const call = filteredCalls[i];
    send("log", { message: `Sending tx ${i + 1}/${filteredCalls.length} to ${call.to}` });

    const nonce = await wallet.getNonce("pending");
    const feeData = await provider.getFeeData();
    const gasEstimate = await wallet.estimateGas({
      to: call.to,
      data: call.data,
      value: call.value || "0",
    });

    const tx = await wallet.sendTransaction({
      to: call.to,
      data: call.data,
      value: call.value || "0",
      gasLimit: (gasEstimate * 120n) / 100n,
      nonce,
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    });

    send("log", { message: `Waiting for confirmation... ${tx.hash}` });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error(`Transaction reverted: ${tx.hash}`);
    }
    send("log", { message: `Confirmed in block ${receipt.blockNumber}` });
    lastTxHash = tx.hash;
  }
  return lastTxHash;
}

async function getUsdcBalance(): Promise<string> {
  const usdc = new ethers.Contract(
    USDC_ADDRESS,
    ["function balanceOf(address) view returns (uint256)"],
    provider
  );
  return ethers.formatUnits(await usdc.balanceOf(account), USDC_DECIMALS);
}

async function getEthBalance(): Promise<string> {
  return ethers.formatEther(await provider.getBalance(account));
}

async function ensureUsdcApproval(spender: string, amount: string, send: SSEWriter): Promise<void> {
  if (DRY_RUN) {
    send("log", { message: `DRY RUN — would approve USDC for ${spender}`, type: "info" });
    return;
  }

  const usdc = new ethers.Contract(
    USDC_ADDRESS,
    [
      "function allowance(address owner, address spender) view returns (uint256)",
      "function approve(address spender, uint256 amount) returns (bool)",
    ],
    wallet
  );

  const currentAllowance = await usdc.allowance(account, spender);
  if (currentAllowance >= BigInt(amount)) {
    send("log", { message: "USDC allowance sufficient" });
    return;
  }

  send("log", { message: `Approving USDC spend for ${spender}...` });
  const tx = await usdc.approve(spender, ethers.MaxUint256);
  send("log", { message: `Waiting for approval... ${tx.hash}` });
  const receipt = await tx.wait();
  if (!receipt || receipt.status !== 1) throw new Error(`USDC approval reverted`);
  send("log", { message: `USDC approved in block ${receipt.blockNumber}` });
}

// ── Express App ─────────────────────────────────────────────────────────────

const app = express();
app.use(express.static(join(__dirname, "public")));

// GET /api/status
app.get("/api/status", async (_req, res) => {
  try {
    const [usdcBalance, ethBalance, health] = await Promise.all([
      getUsdcBalance(),
      getEthBalance(),
      fetch(`${SPRINTER_API}/health`).then((r) => r.json()),
    ]);

    res.json({
      account,
      rpc: RPC_URL,
      demoAmount: DEMO_AMOUNT,
      dryRun: DRY_RUN,
      cardIssuerLive: cardIssuer.isLive,
      usdcBalance,
      ethBalance,
      apiStatus: health.status,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/run — full Sprinter + Card Issuer demo via SSE
app.get("/api/run", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const send = createSSEWriter(res);
  const log = sseLogger(send);
  const drawAmount = DEMO_AMOUNT * 0.5;

  try {
    // ── Step 0: Health Check ──────────────────────────────────────────────
    send("step", { step: 0, status: "running", title: "API Health Check" });
    const health = await sprinterGet("/health", send);
    const protocol = await sprinterGet("/credit/protocol", send);

    const chainConfig = protocol.chains?.["eip155:8453"];
    const usdcLtv = chainConfig?.collateral?.[`erc20:${USDC_ADDRESS}`]?.ltv;

    send("step", {
      step: 0, status: "done", title: "API Health Check",
      details: {
        sprinterStatus: health.status,
        cardIssuer: cardIssuer.isLive ? "LIVE" : "MOCK",
        chain: "Base (8453)",
        usdcLtv: usdcLtv ? `${parseInt(usdcLtv) / 100}%` : "N/A",
      },
    });

    // ── Step 1: KYC — Create User ─────────────────────────────────────────
    send("step", { step: 1, status: "running", title: "Card Issuer: Create User (KYC)" });
    const user = await cardIssuer.createUser(account, log);
    send("step", {
      step: 1, status: "done", title: "Card Issuer: Create User (KYC)",
      details: {
        userId: user.id,
        applicationStatus: user.applicationStatus,
        mode: cardIssuer.isLive ? "LIVE" : "MOCK",
      },
    });

    // ── Step 2: Issue Virtual Card ────────────────────────────────────────
    send("step", { step: 2, status: "running", title: "Card Issuer: Issue Virtual Card" });
    const contract = await cardIssuer.retrieveContract(user.id, BASE_CHAIN_ID, log);
    const card = await cardIssuer.issueCard(user.id, log);
    send("step", {
      step: 2, status: "done", title: "Card Issuer: Issue Virtual Card",
      details: {
        cardId: card.id,
        last4: card.last4 || "????",
        network: card.network || "visa",
        type: card.type,
        depositAddress: contract.depositAddress?.slice(0, 18) + "...",
      },
    });

    // ── Step 3: Sprinter — Lock Collateral ────────────────────────────────
    send("step", { step: 3, status: "running", title: `Sprinter: Lock ${DEMO_AMOUNT} USDC` });
    const lockData = await sprinterGet(
      `/credit/accounts/${account}/lock?amount=${usdcUnits(DEMO_AMOUNT)}&asset=${USDC_ADDRESS}`,
      send
    );
    const lockContract = lockData.calls.find(
      (c: ContractCall) => c.to.toLowerCase() !== USDC_ADDRESS.toLowerCase()
    );
    if (lockContract) await ensureUsdcApproval(lockContract.to, usdcUnits(DEMO_AMOUNT), send);
    const lockTx = await executeCalls(lockData.calls, send);
    send("step", {
      step: 3, status: "done", title: `Sprinter: Lock ${DEMO_AMOUNT} USDC`,
      txHash: lockTx,
    });

    // ── Step 4: Sprinter — Check Credit Line ──────────────────────────────
    send("step", { step: 4, status: "running", title: "Sprinter: Check Credit Line" });
    const infoData = await sprinterGet(`/credit/accounts/${account}/info`, send);
    const usdc = infoData.data.usdc;
    let hf = usdc.healthFactor;
    if (parseFloat(hf) > 1000000) hf = "∞";
    else hf = parseFloat(hf).toFixed(2);

    send("step", {
      step: 4, status: "done", title: "Sprinter: Check Credit Line",
      details: {
        creditCapacity: `${parseFloat(usdc.totalCreditCapacity).toFixed(2)} USDC`,
        remainingCapacity: `${parseFloat(usdc.remainingCreditCapacity).toFixed(2)} USDC`,
        collateralValue: `${parseFloat(usdc.totalCollateralValue).toFixed(2)} USDC`,
        healthFactor: hf,
      },
    });

    // ── Step 5: Draw Credit → Fund Card ───────────────────────────────────
    send("step", {
      step: 5, status: "running",
      title: `Draw $${drawAmount.toFixed(2)} → Fund Card`,
    });

    // Sprinter draw sends USDC directly to the card issuer's deposit address.
    // The issuer detects the on-chain deposit automatically.
    const drawReceiver = contract.depositAddress;
    send("log", { message: `Drawing to deposit address: ${drawReceiver}` });
    const drawData = await sprinterGet(
      `/credit/accounts/${account}/draw?amount=${usdcUnits(drawAmount)}&receiver=${drawReceiver}`,
      send
    );
    const drawTx = await executeCalls(drawData.calls, send);
    send("log", { message: `Sprinter: Drew ${drawAmount} USDC → card issuer (tx: ${drawTx})` });

    send("step", {
      step: 5, status: "done",
      title: `Draw $${drawAmount.toFixed(2)} → Fund Card`,
      txHash: drawTx,
      details: {
        sprinterDraw: `${drawAmount.toFixed(2)} USDC`,
        depositAddress: drawReceiver.slice(0, 18) + "...",
        funding: "On-chain deposit (auto-detected)",
      },
    });

    // ── Step 6: Sprinter — Repay & Unlock ─────────────────────────────────
    send("step", { step: 6, status: "running", title: "Sprinter: Repay & Unlock" });

    // Repay debt
    const preRepayInfo = await sprinterGet(`/credit/accounts/${account}/info`, send);
    const totalDebt = parseFloat(preRepayInfo.data.usdc.debt);
    const repayUnits = BigInt(Math.ceil((totalDebt + 0.01) * 10 ** USDC_DECIMALS)).toString();

    send("log", { message: `Sprinter: Repaying ${totalDebt.toFixed(4)} USDC debt...` });
    const repayData = await sprinterGet(
      `/credit/accounts/${account}/repay?amount=${repayUnits}`,
      send
    );
    const repayContract = repayData.calls.find(
      (c: ContractCall) => c.to.toLowerCase() !== USDC_ADDRESS.toLowerCase()
    );
    if (repayContract) await ensureUsdcApproval(repayContract.to, repayUnits, send);
    const repayTx = await executeCalls(repayData.calls, send);

    // Clear dust debt if any
    const postRepayInfo = await sprinterGet(`/credit/accounts/${account}/info`, send);
    const remainingDebt = parseFloat(postRepayInfo.data.usdc.debt);
    if (remainingDebt > 0.0001) {
      send("log", { message: `Clearing dust debt: ${remainingDebt.toFixed(6)} USDC` });
      const dustUnits = BigInt(Math.ceil(remainingDebt * 10 ** USDC_DECIMALS) + 10).toString();
      const dustData = await sprinterGet(`/credit/accounts/${account}/repay?amount=${dustUnits}`, send);
      const dustContract = dustData.calls.find(
        (c: ContractCall) => c.to.toLowerCase() !== USDC_ADDRESS.toLowerCase()
      );
      if (dustContract) await ensureUsdcApproval(dustContract.to, dustUnits, send);
      await executeCalls(dustData.calls, send);
    }

    // Unlock collateral
    send("log", { message: `Sprinter: Unlocking ${DEMO_AMOUNT} USDC collateral...` });
    const unlockData = await sprinterGet(
      `/credit/accounts/${account}/unlock?amount=${usdcUnits(DEMO_AMOUNT)}&asset=${USDC_ADDRESS}`,
      send
    );
    const unlockTx = await executeCalls(unlockData.calls, send);

    const finalUsdc = await getUsdcBalance();
    const finalEth = await getEthBalance();

    send("step", {
      step: 6, status: "done", title: "Sprinter: Repay & Unlock",
      txHash: unlockTx,
      details: {
        repaid: `${totalDebt.toFixed(4)} USDC`,
        unlocked: `${DEMO_AMOUNT} USDC`,
        finalUsdcBalance: `${finalUsdc} USDC`,
        finalEthBalance: `${finalEth} ETH`,
      },
    });

    // ── Complete ──────────────────────────────────────────────────────────
    send("complete", {
      cardIssuerMode: cardIssuer.isLive ? "LIVE" : "MOCK",
      transactions: { lock: lockTx, draw: drawTx, repay: repayTx, unlock: unlockTx },
      card: { id: card.id, last4: card.last4, userId: user.id },
    });
  } catch (err: any) {
    send("error", { message: err.message });
  }

  res.end();
});

app.listen(PORT, () => {
  console.log();
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║    Sprinter Credit + Card Issuer — Validation Demo          ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log();
  console.log(`  Wallet:       ${account}`);
  console.log(`  Amount:       ${DEMO_AMOUNT} USDC`);
  console.log(`  Card Issuer:  ${cardIssuer.isLive ? "LIVE" : "MOCK (swap MockCardIssuer for a real implementation)"}`);
  if (DRY_RUN) console.log("  Mode:         DRY RUN — no on-chain transactions");
  console.log();
  console.log(`  Open http://localhost:${PORT}`);
  console.log();
});
