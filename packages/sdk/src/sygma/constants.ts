import { Environment } from "../enums";

export const SYGMA_API_ENDPOINT: Record<Environment, string> = {
  [Environment.MAINNET]: "https://api.buildwithsygma.com/",
  [Environment.TESTNET]: "https://api.test.buildwithsygma.com/",
};
