/**
 * Demo: Autonomous Agent Borrows from Sprinter
 *
 * This script simulates what an AI agent (like LI.FI's) does when it
 * needs liquidity — it borrows from Sprinter's credit engine using
 * collateral it already holds.
 *
 * Flow:
 *   1. Check credit position (do I have capacity?)
 *   2. If not — lock USDC as collateral
 *   3. Draw (borrow) against the credit line
 *   4. Use the funds (agent does its thing — swap, bridge, etc.)
 *   5. Repay when done
 *   6. Optionally unlock collateral
 *
 * This is the same flow the MCP tools expose, but called directly
 * via HTTP for demonstration purposes.
 */

import { ethers } from "ethers";
import "dotenv/config";

const SPRINTER_API = process.env.SPRINTER_API || "https://api.sprinter.tech";
const RPC_URL = process.env.RPC_URL || "https://mainnet.base.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const USDC_ADDRESS = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
const USDC_DECIMALS = 6;

if (!PRIVATE_KEY) {
  console.error("Set PRIVATE_KEY in .env");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const account = wallet.address;

const usdcUnits = (amount: number) =>
  BigInt(Math.round(amount * 10 ** USDC_DECIMALS)).toString();

// ── Helpers ─────────────────────────────────────────────────────────────────

interface ContractCall {
  to: string;
  data: string;
  value: string;
}

async function sprinterGet(path: string): Promise<any> {
  const res = await fetch(`${SPRINTER_API}${path}`);
  if (!res.ok) throw new Error(`Sprinter ${res.status}: ${await res.text()}`);
  return res.json();
}

async function executeCalls(calls: ContractCall[]): Promise<string> {
  // Filter out approve calls — we handle them separately
  const filtered = calls.filter(
    (c) =>
      !(
        c.to.toLowerCase() === USDC_ADDRESS.toLowerCase() &&
        c.data.startsWith("0x095ea7b3")
      )
  );

  let lastHash = "";
  for (const call of filtered) {
    const tx = await wallet.sendTransaction({
      to: call.to,
      data: call.data,
      value: call.value || "0",
    });
    console.log(`  tx: ${tx.hash}`);
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) throw new Error(`Reverted: ${tx.hash}`);
    lastHash = tx.hash;
  }
  return lastHash;
}

async function ensureApproval(spender: string, amount: string) {
  const usdc = new ethers.Contract(
    USDC_ADDRESS,
    [
      "function allowance(address,address) view returns (uint256)",
      "function approve(address,uint256) returns (bool)",
    ],
    wallet
  );
  const allowance = await usdc.allowance(account, spender);
  if (allowance >= BigInt(amount)) return;

  console.log(`  Approving USDC for ${spender}...`);
  const tx = await usdc.approve(spender, ethers.MaxUint256);
  await tx.wait();
}

function findSpender(calls: ContractCall[]): string | null {
  const nonUsdc = calls.find(
    (c) => c.to.toLowerCase() !== USDC_ADDRESS.toLowerCase()
  );
  return nonUsdc?.to ?? null;
}

// ── Agent Logic ─────────────────────────────────────────────────────────────

async function agentBorrow(borrowAmount: number, collateralAmount: number) {
  console.log("\n=== Agent: Borrow from Sprinter ===\n");
  console.log(`Account:    ${account}`);
  console.log(`Collateral: ${collateralAmount} USDC`);
  console.log(`Borrow:     ${borrowAmount} USDC`);

  // 1. Check current position
  console.log("\n[1] Checking credit position...");
  const info = await sprinterGet(`/credit/accounts/${account}/info`);
  const usdc = info.data.usdc;
  const remaining = parseFloat(usdc.remainingCreditCapacity);
  console.log(`  Credit capacity: ${usdc.totalCreditCapacity}`);
  console.log(`  Remaining:       ${remaining.toFixed(2)}`);
  console.log(`  Debt:            ${usdc.debt}`);

  // 2. Lock collateral if needed
  if (remaining < borrowAmount) {
    console.log(`\n[2] Locking ${collateralAmount} USDC as collateral...`);
    const lockData = await sprinterGet(
      `/credit/accounts/${account}/lock?amount=${usdcUnits(collateralAmount)}&asset=${USDC_ADDRESS}`
    );
    const spender = findSpender(lockData.calls);
    if (spender) await ensureApproval(spender, usdcUnits(collateralAmount));
    await executeCalls(lockData.calls);
    console.log("  Collateral locked.");
  } else {
    console.log("\n[2] Sufficient credit capacity — skipping collateral lock.");
  }

  // 3. Draw (borrow)
  console.log(`\n[3] Drawing ${borrowAmount} USDC...`);
  const drawData = await sprinterGet(
    `/credit/accounts/${account}/draw?amount=${usdcUnits(borrowAmount)}&receiver=${account}`
  );
  await executeCalls(drawData.calls);
  console.log("  Funds received.");

  // 4. Agent uses the funds
  console.log("\n[4] Agent uses borrowed funds (swap, bridge, settle, etc.)");
  console.log("  ... (your agent logic here) ...");

  // 5. Repay
  console.log(`\n[5] Repaying ${borrowAmount} USDC...`);
  const repayInfo = await sprinterGet(`/credit/accounts/${account}/info`);
  const debt = parseFloat(repayInfo.data.usdc.debt);
  const repayUnits = BigInt(Math.ceil((debt + 0.01) * 10 ** USDC_DECIMALS)).toString();
  const repayData = await sprinterGet(
    `/credit/accounts/${account}/repay?amount=${repayUnits}`
  );
  const repaySpender = findSpender(repayData.calls);
  if (repaySpender) await ensureApproval(repaySpender, repayUnits);
  await executeCalls(repayData.calls);
  console.log("  Debt repaid.");

  // 6. Unlock collateral
  console.log(`\n[6] Unlocking ${collateralAmount} USDC collateral...`);
  const unlockData = await sprinterGet(
    `/credit/accounts/${account}/unlock?amount=${usdcUnits(collateralAmount)}&asset=${USDC_ADDRESS}`
  );
  await executeCalls(unlockData.calls);
  console.log("  Collateral unlocked.");

  console.log("\n=== Agent: Borrow complete ===\n");
}

// ── Run ─────────────────────────────────────────────────────────────────────

const BORROW_AMOUNT = 0.5; // USDC
const COLLATERAL_AMOUNT = 1.0; // USDC

agentBorrow(BORROW_AMOUNT, COLLATERAL_AMOUNT).catch((err) => {
  console.error(`\nFailed: ${err.message}`);
  process.exit(1);
});
