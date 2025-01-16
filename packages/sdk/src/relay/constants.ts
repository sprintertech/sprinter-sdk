import { Environment } from "../enums";

export const RELAY_API_ENDPOINTS: Record<Environment, string> = {
  [Environment.MAINNET]: "https://api.relay.link",
  [Environment.TESTNET]: "https://api.testnets.relay.link",
};
