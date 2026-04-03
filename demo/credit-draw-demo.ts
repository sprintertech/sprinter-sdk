import { ethers } from "ethers";
import "dotenv/config";

// ── Config ──────────────────────────────────────────────────────────────────

const SPRINTER_API = "https://api.sprinter.tech";
const USDC_ADDRESS = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
const USDC_DECIMALS = 6;
const DRY_RUN = process.env.DRY_RUN === "true";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL || "https://mainnet.base.org";
const DEMO_AMOUNT = parseFloat(process.env.DEMO_AMOUNT || "1.00");

if (!PRIVATE_KEY) {
  console.error("\n❌ PRIVATE_KEY not set.\n");
  console.error("Setup:");
  console.error("  1. cp .env.example .env");
  console.error("  2. Edit .env and set PRIVATE_KEY to a wallet with USDC + ETH on Base");
  console.error("  3. npm run demo\n");
  process.exit(1);
}

// ── Setup ───────────────────────────────────────────────────────────────────

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

// ── Helpers ─────────────────────────────────────────────────────────────────

function log(icon: string, msg: string) {
  console.log(`  ${icon} ${msg}`);
}

function header(step: number, total: number, title: string) {
  console.log(`\n${"─".repeat(60)}`);
  console.log(`Step ${step}/${total}: ${title}`);
  console.log("─".repeat(60));
}

async function sprinterGet(path: string): Promise<any> {
  const url = `${SPRINTER_API}${path}`;
  log("→", `GET ${path}`);
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    if (DRY_RUN) {
      log("⚠️", `API returned ${res.status} (expected in dry run — no real collateral on-chain)`);
      return { calls: [{ to: "0x0", data: "0x0", value: "0", chain: "eip155:8453" }] };
    }
    throw new Error(`Sprinter API ${res.status}: ${body}`);
  }
  return res.json();
}

async function executeCalls(calls: ContractCall[]): Promise<string> {
  if (DRY_RUN) {
    log("⏭️", `DRY RUN — would execute ${calls.length} transaction(s)`);
    for (const call of calls) {
      log("  ", `to: ${call.to}`);
      log("  ", `data: ${call.data.slice(0, 20)}...`);
    }
    return "0x_dry_run";
  }

  // Filter out any USDC approve calls from the API response — we handle approval ourselves
  const filteredCalls = calls.filter((call) => {
    if (call.to.toLowerCase() === USDC_ADDRESS.toLowerCase() && call.data.startsWith("0x095ea7b3")) {
      log("⏭️", `Skipping API approve call (handled separately)`);
      return false;
    }
    return true;
  });

  let lastTxHash = "";
  for (let i = 0; i < filteredCalls.length; i++) {
    const call = filteredCalls[i];
    log("⛓️", `Sending tx ${i + 1}/${filteredCalls.length} to ${call.to}`);

    try {
      // Estimate gas first to catch reverts early with a clear error
      const gasEstimate = await wallet.estimateGas({
        to: call.to,
        data: call.data,
        value: call.value || "0",
      });
      log("⛽", `Gas estimate: ${gasEstimate.toString()}`);

      const tx = await wallet.sendTransaction({
        to: call.to,
        data: call.data,
        value: call.value || "0",
        gasLimit: (gasEstimate * 120n) / 100n, // 20% buffer
      });

      log("⏳", `Waiting for confirmation... tx: ${tx.hash}`);
      const receipt = await tx.wait();

      if (!receipt || receipt.status !== 1) {
        throw new Error(`Transaction reverted: ${tx.hash}`);
      }

      log("✅", `Confirmed in block ${receipt.blockNumber} (gas used: ${receipt.gasUsed.toString()})`);
      lastTxHash = tx.hash;
    } catch (err: any) {
      // Parse common errors into human-readable messages
      const msg = err.message || String(err);
      if (msg.includes("insufficient funds")) {
        throw new Error(
          `Insufficient ETH for gas. Send ETH to ${account} on Base.\n` +
            `  Tip: You need ~0.001 ETH per transaction, ~0.005 ETH for the full demo.`
        );
      }
      if (msg.includes("execution reverted")) {
        throw new Error(
          `Transaction reverted on-chain. This usually means:\n` +
            `  - Insufficient USDC allowance or balance\n` +
            `  - Credit line state doesn't support this operation yet\n` +
            `  Raw error: ${msg.slice(0, 200)}`
        );
      }
      throw err;
    }
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

async function ensureUsdcApproval(spender: string, amount: string): Promise<void> {
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
    log("✅", `USDC allowance sufficient (${currentAllowance} >= ${needed})`);
    return;
  }

  log("🔓", `Approving USDC spend for ${spender}...`);
  const tx = await usdc.approve(spender, ethers.MaxUint256);
  log("⏳", `Waiting for approval confirmation... tx: ${tx.hash}`);
  const receipt = await tx.wait();
  if (!receipt || receipt.status !== 1) {
    throw new Error(`USDC approval reverted: ${tx.hash}`);
  }
  log("✅", `USDC approved in block ${receipt.blockNumber}`);
}

// ── Demo Steps ──────────────────────────────────────────────────────────────

async function checkHealth() {
  const data = await sprinterGet("/health");
  if (data.status !== "ok") throw new Error("Sprinter API not healthy");
  log("✅", `API status: ${data.status}`);
}

async function showProtocolConfig() {
  const data = await sprinterGet("/credit/protocol");
  const chains = Object.keys(data.chains || {});
  log("✅", `Supported chains: ${chains.join(", ")}`);

  for (const [chainId, config] of Object.entries(data.chains) as any) {
    const strategies = Object.keys(config.strategies || {});
    const collateralCount = Object.keys(config.collateral || {}).length;
    log(
      "📋",
      `${chainId}: ${collateralCount} collateral assets, strategies: ${strategies.join(", ") || "none"}`
    );

    // Show USDC collateral details
    const usdcKey = `erc20:${USDC_ADDRESS}`;
    const usdcCollateral = config.collateral?.[usdcKey];
    if (usdcCollateral) {
      log("📋", `USDC LTV: ${(parseInt(usdcCollateral.ltv) / 100).toFixed(0)}% (${usdcCollateral.ltv} bps)`);
    }
  }
}

async function lockCollateral(amount: number): Promise<string> {
  const amountWei = usdcUnits(amount);
  const data = await sprinterGet(
    `/credit/accounts/${account}/lock?amount=${amountWei}&asset=${USDC_ADDRESS}`
  );

  log("📦", `Got ${data.calls.length} transaction(s) to execute`);
  // Ensure USDC is approved for the lock contract before executing
  const lockContract = data.calls.find((c: ContractCall) => c.to.toLowerCase() !== USDC_ADDRESS.toLowerCase());
  if (lockContract) {
    await ensureUsdcApproval(lockContract.to, amountWei);
  }
  const txHash = await executeCalls(data.calls);
  log("✅", `Collateral locked: ${amount} USDC`);
  return txHash;
}

async function checkCreditInfo(): Promise<{
  capacity: number;
  remaining: number;
  debt: number;
  healthFactor: string;
  collateral: number;
}> {
  const data = await sprinterGet(`/credit/accounts/${account}/info`);
  const usdc = data.data.usdc;

  const capacity = parseFloat(usdc.totalCreditCapacity);
  const remaining = parseFloat(usdc.remainingCreditCapacity);
  const debt = parseFloat(usdc.debt);
  const collateral = parseFloat(usdc.totalCollateralValue);

  // Cap health factor display for readability
  let hf = usdc.healthFactor;
  if (parseFloat(hf) > 1000000) hf = "∞ (no debt)";
  else hf = parseFloat(hf).toFixed(2);

  log("💳", `Credit capacity:    ${capacity.toFixed(2)} USDC`);
  log("💳", `Remaining capacity: ${remaining.toFixed(2)} USDC`);
  log("💰", `Collateral value:   ${collateral.toFixed(2)} USDC`);
  log("📊", `Outstanding debt:   ${debt.toFixed(2)} USDC`);
  log("❤️", ` Health factor:      ${hf}`);

  return { capacity, remaining, debt, healthFactor: hf, collateral };
}

async function simulateCardSwipe(amount: number): Promise<string> {
  const amountWei = usdcUnits(amount);

  // In a real integration, receiver would be the card issuer's settlement address.
  // For this demo, we draw to our own wallet to keep USDC for the repay step.
  const receiver = account;

  const data = await sprinterGet(
    `/credit/accounts/${account}/draw?amount=${amountWei}&receiver=${receiver}`
  );

  log("📦", `Got ${data.calls.length} transaction(s) to execute`);
  const txHash = await executeCalls(data.calls);
  log("✅", `Drew ${amount} USDC → ${receiver}`);
  return txHash;
}

async function repayDebt(amount: number): Promise<string> {
  const amountWei = usdcUnits(amount);
  const data = await sprinterGet(
    `/credit/accounts/${account}/repay?amount=${amountWei}`
  );

  log("📦", `Got ${data.calls.length} transaction(s) to execute`);
  // Ensure USDC is approved for the repay contract before executing
  const repayContract = data.calls.find((c: ContractCall) => c.to.toLowerCase() !== USDC_ADDRESS.toLowerCase());
  if (repayContract) {
    await ensureUsdcApproval(repayContract.to, amountWei);
  }
  const txHash = await executeCalls(data.calls);
  log("✅", `Repaid ${amount} USDC`);
  return txHash;
}

async function unlockCollateral(amount: number): Promise<string> {
  const amountWei = usdcUnits(amount);
  const data = await sprinterGet(
    `/credit/accounts/${account}/unlock?amount=${amountWei}&asset=${USDC_ADDRESS}`
  );

  log("📦", `Got ${data.calls.length} transaction(s) to execute`);
  const txHash = await executeCalls(data.calls);
  log("✅", `Unlocked ${amount} USDC collateral`);
  return txHash;
}

// ── Preflight Checks ────────────────────────────────────────────────────────

async function preflightChecks(): Promise<{ usdcBalance: string; ethBalance: string }> {
  // Check RPC connectivity
  try {
    const network = await provider.getNetwork();
    if (network.chainId !== 8453n) {
      throw new Error(
        `Wrong network! Expected Base (chainId 8453) but got chainId ${network.chainId}.\n` +
          `  Check your RPC_URL in .env — it should point to Base mainnet.`
      );
    }
    log("✅", `Connected to Base (chainId: ${network.chainId})`);
  } catch (err: any) {
    if (err.message.includes("Wrong network")) throw err;
    throw new Error(`Cannot connect to RPC at ${RPC_URL}. Check your RPC_URL in .env.`);
  }

  // Check balances
  const ethBalance = await getEthBalance();
  const usdcBalance = await getUsdcBalance();

  log("💰", `USDC balance: ${usdcBalance} USDC`);
  log("⛽", `ETH balance:  ${ethBalance} ETH (for gas)`);

  if (!DRY_RUN) {
    if (parseFloat(usdcBalance) < DEMO_AMOUNT) {
      throw new Error(
        `Insufficient USDC. Need ${DEMO_AMOUNT} USDC but wallet has ${usdcBalance} USDC.\n` +
          `  Send at least ${DEMO_AMOUNT} USDC to ${account} on Base.`
      );
    }

    if (parseFloat(ethBalance) < 0.001) {
      throw new Error(
        `Insufficient ETH for gas. Wallet has ${ethBalance} ETH.\n` +
          `  Send at least 0.005 ETH to ${account} on Base.\n` +
          `  (The demo executes ~6 transactions, each costing ~0.0005-0.001 ETH)`
      );
    }
  }

  return { usdcBalance, ethBalance };
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║       Sprinter Credit — Credit Draw Demo                 ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log();

  if (DRY_RUN) {
    console.log("🏃 DRY RUN MODE — API calls are real, but no on-chain transactions\n");
  }

  log("🔑", `Wallet: ${account}`);
  log("🌐", `RPC:    ${RPC_URL}`);
  log("💵", `Demo:   Lock ${DEMO_AMOUNT} USDC → draw ${(DEMO_AMOUNT * 0.5).toFixed(2)} → repay → unlock`);
  console.log();

  // ── Preflight ───────────────────────────────────────────────────────────
  log("🔍", "Running preflight checks...");
  await preflightChecks();
  log("✅", "Preflight passed\n");

  const drawAmount = DEMO_AMOUNT * 0.5; // Draw 50% of locked collateral (within 90% LTV)
  const startTime = Date.now();

  // ── Step 0: Health check ──────────────────────────────────────────────
  header(0, 6, "API Health Check & Protocol Config");
  await checkHealth();
  await showProtocolConfig();

  // ── Step 1: Lock collateral ───────────────────────────────────────────
  header(1, 6, `Lock ${DEMO_AMOUNT} USDC as collateral`);
  log("ℹ️", "This sends 2 transactions: USDC approve + deposit to escrow");
  const lockTx = await lockCollateral(DEMO_AMOUNT);
  log("🔗", `https://basescan.org/tx/${lockTx}`);

  // ── Step 2: Check credit line ─────────────────────────────────────────
  header(2, 6, "Check credit line");
  log("ℹ️", `With ${DEMO_AMOUNT} USDC locked at 90% LTV → expect ~${(DEMO_AMOUNT * 0.9).toFixed(2)} USDC capacity`);
  const preDrawInfo = await checkCreditInfo();

  if (preDrawInfo.remaining < drawAmount && !DRY_RUN) {
    throw new Error(
      `Not enough credit capacity for the draw. Available: ${preDrawInfo.remaining.toFixed(2)} USDC, need: ${drawAmount.toFixed(2)} USDC`
    );
  }

  // ── Step 3: Simulate card swipe ───────────────────────────────────────
  header(3, 6, `Simulate card swipe — draw $${drawAmount.toFixed(2)}`);
  log("🛒", "Merchant: Demo Coffee Shop");
  log("💳", `Amount:  $${drawAmount.toFixed(2)} USD`);
  log("ℹ️", "In production, this happens in your card authorization webhook (<2s)");
  const drawTx = await simulateCardSwipe(drawAmount);
  log("🔗", `https://basescan.org/tx/${drawTx}`);

  console.log("\n  Credit position after draw:");
  await checkCreditInfo();

  // ── Step 4: Repay debt ────────────────────────────────────────────────
  header(4, 6, `Repay $${drawAmount.toFixed(2)} debt`);
  log("ℹ️", "This sends 2 transactions: USDC approve + repay to credit hub");
  const repayTx = await repayDebt(drawAmount);
  log("🔗", `https://basescan.org/tx/${repayTx}`);

  console.log("\n  Credit position after repay:");
  const postRepay = await checkCreditInfo();

  // Clear any remaining dust debt (interest accrues immediately after draw)
  if (postRepay.debt > 0.001) {
    log("ℹ️", `Remaining dust debt: ${postRepay.debt.toFixed(6)} USDC — repaying...`);
    const dustAmount = postRepay.debt + 0.000001; // tiny buffer
    await repayDebt(dustAmount);
    log("✅", "Dust debt cleared");
    await checkCreditInfo();
  }

  // ── Step 5: Unlock collateral ─────────────────────────────────────────
  header(5, 6, `Unlock ${DEMO_AMOUNT} USDC collateral`);
  const unlockTx = await unlockCollateral(DEMO_AMOUNT);
  log("🔗", `https://basescan.org/tx/${unlockTx}`);

  // ── Step 6: Final state ───────────────────────────────────────────────
  header(6, 6, "Final state");
  const finalUsdcBalance = await getUsdcBalance();
  const finalEthBalance = await getEthBalance();
  log("💰", `USDC balance: ${finalUsdcBalance}`);
  log("⛽", `ETH balance:  ${finalEthBalance} (gas spent: ${(parseFloat(await getEthBalance()) - parseFloat(finalEthBalance)).toFixed(6)} ETH)`);
  await checkCreditInfo();

  // ── Summary ───────────────────────────────────────────────────────────
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log();
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log(`║  ✅ Credit draw demo completed in ${elapsed}s`);
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log();
  console.log("On-chain transactions (verify on Basescan):");
  console.log(`  1. Lock:   https://basescan.org/tx/${lockTx}`);
  console.log(`  2. Draw:   https://basescan.org/tx/${drawTx}`);
  console.log(`  3. Repay:  https://basescan.org/tx/${repayTx}`);
  console.log(`  4. Unlock: https://basescan.org/tx/${unlockTx}`);
  console.log();
  console.log("What this proved:");
  console.log("  ✅ Collateral locking via Sprinter Credit API");
  console.log("  ✅ Credit line creation with configurable LTV");
  console.log("  ✅ Just-in-time credit draw (card authorization)");
  console.log("  ✅ Debt repayment");
  console.log("  ✅ Collateral recovery");
  console.log();
}

main().catch((err) => {
  console.error(`\n❌ Demo failed: ${err.message}`);
  if (!DRY_RUN) {
    console.error("\nTroubleshooting:");
    console.error("  1. Is your wallet funded? Need USDC + ETH on Base");
    console.error("  2. Is the RPC working? Try: curl -s https://mainnet.base.org -d '{\"jsonrpc\":\"2.0\",\"method\":\"eth_blockNumber\",\"params\":[],\"id\":1}'");
    console.error("  3. Try dry run first: npm run demo:dry-run");
  }
  process.exit(1);
});
