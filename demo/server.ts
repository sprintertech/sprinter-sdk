import express from "express";
import { ethers } from "ethers";
import "dotenv/config";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Config ──────────────────────────────────────────────────────────────────

const SPRINTER_API = "https://api.sprinter.tech";
const USDC_ADDRESS = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
const USDC_DECIMALS = 6;

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL || "https://mainnet.base.org";
const DEMO_AMOUNT = parseFloat(process.env.DEMO_AMOUNT || "1.00");
const DRY_RUN = process.env.DRY_RUN === "true";
const PORT = parseInt(process.env.PORT || "3002");

if (!PRIVATE_KEY) {
  console.error("\n❌ PRIVATE_KEY not set. Copy .env.example to .env and fill it in.\n");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const account = wallet.address;

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

// ── API Helpers ─────────────────────────────────────────────────────────────

async function sprinterGet(path: string, send: SSEWriter): Promise<any> {
  const url = `${SPRINTER_API}${path}`;
  send("log", { message: `GET ${path}` });
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    if (DRY_RUN) {
      send("log", { message: `API returned ${res.status} (expected in dry run)`, type: "warn" });
      return { calls: [{ to: "0x0", data: "0x0", value: "0", chain: "eip155:8453" }] };
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

  // Filter out any USDC approve calls from the API response — we handle approval ourselves
  const filteredCalls = calls.filter((call) => {
    if (call.to.toLowerCase() === USDC_ADDRESS.toLowerCase() && call.data.startsWith("0x095ea7b3")) {
      send("log", { message: `Skipping API approve call (handled separately)` });
      return false;
    }
    return true;
  });

  let lastTxHash = "";
  for (let i = 0; i < filteredCalls.length; i++) {
    const call = filteredCalls[i];
    send("log", { message: `Sending tx ${i + 1}/${filteredCalls.length} to ${call.to}` });

    const nonce = await wallet.getNonce("pending");
    send("log", { message: `Using nonce ${nonce}` });

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
  const balance = await usdc.balanceOf(account);
  return ethers.formatUnits(balance, USDC_DECIMALS);
}

async function getEthBalance(): Promise<string> {
  const balance = await provider.getBalance(account);
  return ethers.formatEther(balance);
}

async function ensureUsdcApproval(spender: string, amount: string, send: SSEWriter): Promise<void> {
  const usdc = new ethers.Contract(
    USDC_ADDRESS,
    [
      "function allowance(address owner, address spender) view returns (uint256)",
      "function approve(address spender, uint256 amount) returns (bool)",
    ],
    wallet
  );

  const currentAllowance = await usdc.allowance(account, spender);
  const needed = BigInt(amount);

  if (currentAllowance >= needed) {
    send("log", { message: `USDC allowance sufficient (${currentAllowance} >= ${needed})` });
    return;
  }

  send("log", { message: `Approving USDC spend for ${spender}...` });
  const nonce = await wallet.getNonce("pending");
  const tx = await usdc.approve(spender, ethers.MaxUint256, { nonce });
  send("log", { message: `Waiting for approval confirmation... ${tx.hash}` });
  const receipt = await tx.wait();
  if (!receipt || receipt.status !== 1) {
    throw new Error(`USDC approval reverted: ${tx.hash}`);
  }
  send("log", { message: `USDC approved in block ${receipt.blockNumber}` });
}

// ── Express App ─────────────────────────────────────────────────────────────

const app = express();
app.use(express.static(join(__dirname, "public")));

// GET /api/status — wallet info and balances
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
      drawAmount: DEMO_AMOUNT * 0.5,
      dryRun: DRY_RUN,
      usdcBalance,
      ethBalance,
      apiStatus: health.status,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/recover — repay any outstanding debt and unlock stuck collateral
app.get("/api/recover", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const send = createSSEWriter(res);

  try {
    send("log", { message: "Checking credit position..." });
    const infoData = await sprinterGet(`/credit/accounts/${account}/info`, send);
    const usdc = infoData.data.usdc;
    const debt = parseFloat(usdc.debt);
    const collateral = parseFloat(usdc.totalCollateralValue);

    send("log", { message: `Debt: ${debt.toFixed(6)} USDC, Collateral: ${collateral.toFixed(6)} USDC` });

    if (debt < 0.000001 && collateral < 0.000001) {
      send("complete", { message: "Nothing to recover — no debt or collateral found." });
      res.end();
      return;
    }

    // Repay any outstanding debt first
    if (debt > 0.001) {
      send("step", { step: 0, status: "running", title: `Repay ${debt.toFixed(6)} USDC debt` });
      const repayUnits = BigInt(Math.ceil(debt * 10 ** USDC_DECIMALS) + 2).toString();
      const repayData = await sprinterGet(
        `/credit/accounts/${account}/repay?amount=${repayUnits}`,
        send
      );
      const repayContract = repayData.calls.find((c: ContractCall) => c.to.toLowerCase() !== USDC_ADDRESS.toLowerCase());
      if (repayContract) {
        await ensureUsdcApproval(repayContract.to, repayUnits, send);
      }
      const repayTx = await executeCalls(repayData.calls, send);
      send("step", { step: 0, status: "done", title: `Repaid debt`, txHash: repayTx });
    }

    // Check for remaining dust debt
    const postRepayInfo = await sprinterGet(`/credit/accounts/${account}/info`, send);
    const postDebt = parseFloat(postRepayInfo.data.usdc.debt);
    if (postDebt > 0.0001) {
      send("log", { message: `Dust debt remaining: ${postDebt.toFixed(6)} — repaying...` });
      const dustUnits = BigInt(Math.ceil(postDebt * 10 ** USDC_DECIMALS) + 2).toString();
      const dustData = await sprinterGet(`/credit/accounts/${account}/repay?amount=${dustUnits}`, send);
      const dustContract = dustData.calls.find((c: ContractCall) => c.to.toLowerCase() !== USDC_ADDRESS.toLowerCase());
      if (dustContract) {
        await ensureUsdcApproval(dustContract.to, dustUnits, send);
      }
      await executeCalls(dustData.calls, send);
    }

    // Unlock collateral
    const postInfo = await sprinterGet(`/credit/accounts/${account}/info`, send);
    const postCollateral = parseFloat(postInfo.data.usdc.totalCollateralValue);
    if (postCollateral > 0.001) {
      send("step", { step: 1, status: "running", title: `Unlock ${postCollateral.toFixed(2)} USDC collateral` });
      const unlockUnits = BigInt(Math.round(postCollateral * 10 ** USDC_DECIMALS)).toString();
      const unlockData = await sprinterGet(
        `/credit/accounts/${account}/unlock?amount=${unlockUnits}&asset=${USDC_ADDRESS}`,
        send
      );
      const unlockTx = await executeCalls(unlockData.calls, send);
      send("step", { step: 1, status: "done", title: `Unlocked collateral`, txHash: unlockTx });
    }

    send("complete", { message: "Recovery complete. Collateral unlocked." });
  } catch (err: any) {
    send("error", { message: err.message });
  }

  res.end();
});

// GET /api/run — execute the demo via Server-Sent Events
app.get("/api/run", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const send = createSSEWriter(res);
  const drawAmount = DEMO_AMOUNT * 0.5;

  try {
    // Step 0: Protocol config
    send("step", { step: 0, status: "running", title: "API Health Check" });
    const health = await sprinterGet("/health", send);
    const protocol = await sprinterGet("/credit/protocol", send);

    const chainConfig = protocol.chains?.["eip155:8453"];
    const usdcLtv = chainConfig?.collateral?.[`erc20:${USDC_ADDRESS}`]?.ltv;
    const strategies = Object.keys(chainConfig?.strategies || {});

    send("step", {
      step: 0,
      status: "done",
      title: "API Health Check",
      details: {
        apiStatus: health.status,
        chain: "Base (eip155:8453)",
        usdcLtv: usdcLtv ? `${parseInt(usdcLtv) / 100}%` : "N/A",
        strategies: strategies.join(", "),
      },
    });

    // Step 1: Lock collateral
    send("step", { step: 1, status: "running", title: `Lock ${DEMO_AMOUNT} USDC` });
    const lockData = await sprinterGet(
      `/credit/accounts/${account}/lock?amount=${usdcUnits(DEMO_AMOUNT)}&asset=${USDC_ADDRESS}`,
      send
    );
    // Ensure USDC is approved for the lock contract before executing
    const lockContract = lockData.calls.find((c: ContractCall) => c.to.toLowerCase() !== USDC_ADDRESS.toLowerCase());
    if (lockContract) {
      await ensureUsdcApproval(lockContract.to, usdcUnits(DEMO_AMOUNT), send);
    }
    const lockTx = await executeCalls(lockData.calls, send);
    send("step", {
      step: 1,
      status: "done",
      title: `Lock ${DEMO_AMOUNT} USDC`,
      txHash: lockTx,
      details: { transactions: lockData.calls.length },
    });

    // Step 2: Check credit
    send("step", { step: 2, status: "running", title: "Check Credit Line" });
    const infoData = await sprinterGet(`/credit/accounts/${account}/info`, send);
    const usdc = infoData.data.usdc;
    let hf = usdc.healthFactor;
    if (parseFloat(hf) > 1000000) hf = "∞";
    else hf = parseFloat(hf).toFixed(2);

    send("step", {
      step: 2,
      status: "done",
      title: "Check Credit Line",
      details: {
        creditCapacity: `${parseFloat(usdc.totalCreditCapacity).toFixed(2)} USDC`,
        remainingCapacity: `${parseFloat(usdc.remainingCreditCapacity).toFixed(2)} USDC`,
        collateralValue: `${parseFloat(usdc.totalCollateralValue).toFixed(2)} USDC`,
        healthFactor: hf,
        debt: `${parseFloat(usdc.debt).toFixed(2)} USDC`,
      },
    });

    // Step 3: Draw (card swipe)
    send("step", {
      step: 3,
      status: "running",
      title: `Card Swipe — Draw $${drawAmount.toFixed(2)}`,
    });
    const drawData = await sprinterGet(
      `/credit/accounts/${account}/draw?amount=${usdcUnits(drawAmount)}&receiver=${account}`,
      send
    );
    const drawTx = await executeCalls(drawData.calls, send);

    // Re-check credit after draw
    const postDrawInfo = await sprinterGet(`/credit/accounts/${account}/info`, send);
    const postDraw = postDrawInfo.data.usdc;
    let postHf = postDraw.healthFactor;
    if (parseFloat(postHf) > 1000000) postHf = "∞";
    else postHf = parseFloat(postHf).toFixed(2);

    send("step", {
      step: 3,
      status: "done",
      title: `Card Swipe — Draw $${drawAmount.toFixed(2)}`,
      txHash: drawTx,
      details: {
        drawn: `${drawAmount.toFixed(2)} USDC`,
        merchant: "Demo Coffee Shop",
        remainingCapacity: `${parseFloat(postDraw.remainingCreditCapacity).toFixed(2)} USDC`,
        debt: `${parseFloat(postDraw.debt).toFixed(2)} USDC`,
        healthFactor: postHf,
      },
    });

    // Step 4: Repay
    send("step", { step: 4, status: "running", title: `Repay $${drawAmount.toFixed(2)}` });
    const repayData = await sprinterGet(
      `/credit/accounts/${account}/repay?amount=${usdcUnits(drawAmount)}`,
      send
    );
    // Ensure USDC is approved for the repay contract before executing
    const repayContract = repayData.calls.find((c: ContractCall) => c.to.toLowerCase() !== USDC_ADDRESS.toLowerCase());
    if (repayContract) {
      await ensureUsdcApproval(repayContract.to, usdcUnits(drawAmount), send);
    }
    const repayTx = await executeCalls(repayData.calls, send);

    // Check for remaining dust debt (interest accrues immediately after draw)
    const postRepayInfo = await sprinterGet(`/credit/accounts/${account}/info`, send);
    const postRepay = postRepayInfo.data.usdc;
    const remainingDebt = parseFloat(postRepay.debt);

    if (remainingDebt > 0.001) {
      send("log", { message: `Remaining debt: ${remainingDebt.toFixed(6)} USDC — repaying dust...`, type: "info" });
      const dustUnits = BigInt(Math.ceil(remainingDebt * 10 ** USDC_DECIMALS) + 1).toString();
      const dustRepay = await sprinterGet(
        `/credit/accounts/${account}/repay?amount=${dustUnits}`,
        send
      );
      const dustContract = dustRepay.calls.find((c: ContractCall) => c.to.toLowerCase() !== USDC_ADDRESS.toLowerCase());
      if (dustContract) {
        await ensureUsdcApproval(dustContract.to, dustUnits, send);
      }
      await executeCalls(dustRepay.calls, send);
    }

    const finalDebtInfo = await sprinterGet(`/credit/accounts/${account}/info`, send);
    const finalDebt = finalDebtInfo.data.usdc;

    send("step", {
      step: 4,
      status: "done",
      title: `Repay $${drawAmount.toFixed(2)}`,
      txHash: repayTx,
      details: {
        repaid: `${drawAmount.toFixed(2)} USDC`,
        remainingDebt: `${parseFloat(finalDebt.debt).toFixed(6)} USDC`,
      },
    });

    // Step 5: Unlock
    send("step", { step: 5, status: "running", title: `Unlock ${DEMO_AMOUNT} USDC` });
    const unlockData = await sprinterGet(
      `/credit/accounts/${account}/unlock?amount=${usdcUnits(DEMO_AMOUNT)}&asset=${USDC_ADDRESS}`,
      send
    );
    const unlockTx = await executeCalls(unlockData.calls, send);

    const finalUsdc = await getUsdcBalance();
    const finalEth = await getEthBalance();

    send("step", {
      step: 5,
      status: "done",
      title: `Unlock ${DEMO_AMOUNT} USDC`,
      txHash: unlockTx,
      details: {
        finalUsdcBalance: `${finalUsdc} USDC`,
        finalEthBalance: `${finalEth} ETH`,
      },
    });

    // Done
    send("complete", {
      transactions: {
        lock: lockTx,
        draw: drawTx,
        repay: repayTx,
        unlock: unlockTx,
      },
    });
  } catch (err: any) {
    send("error", { message: err.message });
  }

  res.end();
});

app.listen(PORT, () => {
  console.log();
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║       Sprinter Credit — Card Program Demo               ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log();
  console.log(`  🌐 Open http://localhost:${PORT} in your browser`);
  console.log(`  🔑 Wallet: ${account}`);
  console.log(`  💵 Amount: ${DEMO_AMOUNT} USDC`);
  if (DRY_RUN) console.log("  🏃 DRY RUN MODE — no on-chain transactions");
  console.log();
});
