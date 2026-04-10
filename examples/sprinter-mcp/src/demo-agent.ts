/**
 * Demo: Agent with Delegated Credit
 *
 * This script simulates an AI agent that draws from a human-delegated
 * credit line. The human operator has already:
 *   1. Locked collateral (via the Operator Dashboard UI)
 *   2. Set up a Credit Operator authorizing this agent
 *   3. Whitelisted receiver addresses
 *
 * The agent only draws and repays — it never touches collateral.
 *
 * Flow:
 *   1. Check credit capacity on the human's account
 *   2. Draw USDC to a whitelisted receiver (via Operator)
 *   3. Use the funds (agent's own logic — swap, bridge, settle, etc.)
 *   4. Repay debt
 *
 * Setup:
 *   1. Run `npm run ui` and set up collateral + operator in the dashboard
 *   2. Copy the human's wallet address to HUMAN_ACCOUNT in .env
 *   3. Set PRIVATE_KEY to the agent's wallet key (authorized caller on the Operator)
 *   4. Set RECEIVER_ADDRESS to a whitelisted receiver
 *   5. Run `npm run demo`
 */

import { ethers } from "ethers";
import "dotenv/config";

const SPRINTER_API = process.env.SPRINTER_API || "https://api.sprinter.tech";
const RPC_URL = process.env.RPC_URL || "https://mainnet.base.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const HUMAN_ACCOUNT = process.env.HUMAN_ACCOUNT;
const RECEIVER_ADDRESS = process.env.RECEIVER_ADDRESS;
const USDC_ADDRESS = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
const USDC_DECIMALS = 6;

if (!PRIVATE_KEY) {
  console.error("Set PRIVATE_KEY in .env (agent's wallet key)");
  process.exit(1);
}
if (!HUMAN_ACCOUNT) {
  console.error("Set HUMAN_ACCOUNT in .env (human operator's wallet address)");
  process.exit(1);
}
if (!RECEIVER_ADDRESS) {
  console.error("Set RECEIVER_ADDRESS in .env (whitelisted receiver for drawn USDC)");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const agentAddress = wallet.address;

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
  let lastHash = "";
  for (const call of calls) {
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
  const allowance = await usdc.allowance(agentAddress, spender);
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

async function agentOperate(borrowAmount: number) {
  console.log("\n=== Agent: Delegated Credit Draw ===\n");
  console.log(`Agent:          ${agentAddress}`);
  console.log(`Human account:  ${HUMAN_ACCOUNT}`);
  console.log(`Receiver:       ${RECEIVER_ADDRESS}`);
  console.log(`Borrow amount:  ${borrowAmount} USDC`);

  // 1. Check credit capacity on the human's account
  console.log("\n[1] Checking credit capacity on human's account...");
  const info = await sprinterGet(`/credit/accounts/${HUMAN_ACCOUNT}/info`);
  const usdc = info.data.USDC || info.data.usdc;
  const remaining = parseFloat(usdc.remainingCreditCapacity);
  console.log(`  Credit capacity: ${usdc.totalCreditCapacity} USDC`);
  console.log(`  Available:       ${remaining.toFixed(2)} USDC`);
  console.log(`  Current debt:    ${usdc.debt || usdc.principal || "0"} USDC`);

  if (remaining < borrowAmount) {
    console.error(`\n  Insufficient credit. Available: ${remaining.toFixed(2)}, needed: ${borrowAmount}`);
    console.error("  Ask the human operator to lock more collateral via the dashboard.");
    process.exit(1);
  }

  // 2. Draw USDC via the Operator (agent is the authorized caller)
  console.log(`\n[2] Drawing ${borrowAmount} USDC to ${RECEIVER_ADDRESS}...`);
  const drawData = await sprinterGet(
    `/credit/accounts/${HUMAN_ACCOUNT}/draw?amount=${usdcUnits(borrowAmount)}&receiver=${RECEIVER_ADDRESS}`
  );
  await executeCalls(drawData.calls);
  console.log("  USDC drawn successfully.");

  // 3. Agent uses the funds
  console.log("\n[3] Agent uses borrowed funds...");
  console.log("  ... (your agent logic here — swap, bridge, settle, etc.) ...");

  // 4. Repay
  console.log(`\n[4] Repaying ${borrowAmount} USDC...`);
  const repayInfo = await sprinterGet(`/credit/accounts/${HUMAN_ACCOUNT}/info`);
  const repayUsdc = repayInfo.data.USDC || repayInfo.data.usdc;
  const debt = parseFloat(repayUsdc.debt || repayUsdc.principal || "0");
  const repayUnits = BigInt(Math.ceil((debt + 0.01) * 10 ** USDC_DECIMALS)).toString();
  const repayData = await sprinterGet(
    `/credit/accounts/${HUMAN_ACCOUNT}/repay?amount=${repayUnits}`
  );
  const repaySpender = findSpender(repayData.calls);
  if (repaySpender) await ensureApproval(repaySpender, repayUnits);
  await executeCalls(repayData.calls);
  console.log("  Debt repaid.");

  // 5. Verify
  console.log("\n[5] Verifying position...");
  const finalInfo = await sprinterGet(`/credit/accounts/${HUMAN_ACCOUNT}/info`);
  const finalUsdc = finalInfo.data.USDC || finalInfo.data.usdc;
  console.log(`  Remaining capacity: ${finalUsdc.remainingCreditCapacity} USDC`);
  console.log(`  Outstanding debt:   ${finalUsdc.debt || finalUsdc.principal || "0"} USDC`);

  console.log("\n=== Agent: Complete ===\n");
}

// ── Run ─────────────────────────────────────────────────────────────────────

const BORROW_AMOUNT = parseFloat(process.env.BORROW_AMOUNT || "0.5");

agentOperate(BORROW_AMOUNT).catch((err) => {
  console.error(`\nFailed: ${err.message}`);
  process.exit(1);
});
