import { Environment } from "../enums";
import { Status } from "../sygma";

export const RELAY_API_ENDPOINTS: Record<Environment, string> = {
  [Environment.MAINNET]: "https://api.relay.link",
  [Environment.TESTNET]: "https://api.testnets.relay.link",
};

export const RELAY_STATUSES_MAPPING = new Map<string, Status>([
  ["refund", Status.failed],
  ["delayed", Status.pending],
  ["waiting", Status.pending],
  ["failure", Status.failed],
  ["pending", Status.pending],
  ["success", Status.executed],
]);
