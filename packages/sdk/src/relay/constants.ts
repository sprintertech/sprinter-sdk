import { Environment } from "../enums";
import { Status } from "../sygma";
import { RelayRequestStatus } from "./types";

export const RELAY_API_ENDPOINTS: Record<Environment, string> = {
  [Environment.MAINNET]: "https://api.relay.link",
  [Environment.TESTNET]: "https://api.testnets.relay.link",
};

export const RELAY_STATUSES_MAPPING = new Map<RelayRequestStatus, Status>([
  [RelayRequestStatus.Refund, Status.failed],
  [RelayRequestStatus.Delayed, Status.pending],
  [RelayRequestStatus.Waiting, Status.pending],
  [RelayRequestStatus.Failure, Status.failed],
  [RelayRequestStatus.Pending, Status.pending],
  [RelayRequestStatus.Success, Status.executed],
]);
