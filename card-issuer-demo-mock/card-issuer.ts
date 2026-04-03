/**
 * Generic Card Issuer interface + mock implementation.
 *
 * To integrate a real card issuer,
 * implement the CardIssuer interface and swap it in server.ts.
 */

export type Logger = (msg: string, type?: string) => void;

// ── Interface ────────────────────────────────────────────────────────────────

export interface CardUser {
  id: string;
  applicationStatus: string;
}

export interface CardContract {
  id: string;
  chainId: number;
  depositAddress: string;
}

export interface Card {
  id: string;
  type: string;
  status: string;
  last4: string;
  network: string;
}

export interface CardIssuer {
  /** Whether this issuer is connected to a live API */
  readonly isLive: boolean;

  /** Submit a KYC application for a wallet address */
  createUser(walletAddress: string, log: Logger): Promise<CardUser>;

  /** Retrieve the on-chain deposit contract for a user on a given chain */
  retrieveContract(userId: string, chainId: number, log: Logger): Promise<CardContract>;

  /** Issue a virtual card for an approved user */
  issueCard(userId: string, log: Logger): Promise<Card>;
}

// ── Mock Implementation ──────────────────────────────────────────────────────

let mockCounter = 1000;
function mockId(prefix: string) {
  return `${prefix}_mock_${++mockCounter}`;
}

export class MockCardIssuer implements CardIssuer {
  readonly isLive = false;

  async createUser(walletAddress: string, log: Logger): Promise<CardUser> {
    log(`CardIssuer: Creating user (KYC) for wallet ${walletAddress.slice(0, 10)}...`);
    log("CardIssuer: [MOCK] Auto-approved user", "warn");
    return {
      id: mockId("usr"),
      applicationStatus: "approved",
    };
  }

  async retrieveContract(userId: string, chainId: number, log: Logger): Promise<CardContract> {
    log(`CardIssuer: Retrieving contract for user on chain ${chainId}...`);
    const depositAddress = "0x" + "a1b2c3d4e5".repeat(4).slice(0, 40);
    log(`CardIssuer: [MOCK] Contract found — deposit to ${depositAddress.slice(0, 14)}...`, "warn");
    return {
      id: mockId("ctr"),
      chainId,
      depositAddress,
    };
  }

  async issueCard(userId: string, log: Logger): Promise<Card> {
    log("CardIssuer: Issuing virtual card...");
    const card: Card = {
      id: mockId("card"),
      type: "virtual",
      status: "active",
      last4: "4242",
      network: "visa",
    };
    log(`CardIssuer: [MOCK] Card issued — **** ${card.last4} (${card.network})`, "warn");
    return card;
  }
}
