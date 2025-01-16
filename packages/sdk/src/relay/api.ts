import { Environment } from "../enums";
import { RELAY_API_ENDPOINTS } from "./constants";
import { RelayRequestsResponse } from "./types";

/**
 * Returns list of transfers from
 * Relay protocol
 *
 * https://docs.relay.link/references/api/get-requests?playground=open
 * @param {Environment} environment
 */
export async function getRequests(address: string, environment: Environment) {
  const requestsPath = `/requests/v2`;
  const url = new URL(RELAY_API_ENDPOINTS[environment], requestsPath);
  url.searchParams.set("user", address);

  const response: RelayRequestsResponse = await fetch(url.toString()).then(
    (response): Promise<RelayRequestsResponse> => response.json(),
  );

  return response;
}
