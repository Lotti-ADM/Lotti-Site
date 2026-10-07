import "server-only";

import { createLottiApiClient, readLottiApiConfig, type LottiApiClient } from "./core";

export { LottiApiError } from "./core";

let cachedClient: LottiApiClient | null = null;

/** Cliente da API da Lotti para o checkout. Lança se LOTTI_API_URL/CHECKOUT_API_TOKEN faltarem. */
export function getLottiApi(): LottiApiClient {
  if (cachedClient) return cachedClient;
  const config = readLottiApiConfig(process.env);
  if (!config) throw new Error("CHECKOUT_LOTTI_API_NOT_CONFIGURED");
  cachedClient = createLottiApiClient(config);
  return cachedClient;
}

export function isLottiApiConfigured(): boolean {
  return readLottiApiConfig(process.env) !== null;
}
