// Cliente HTTP da API da Lotti (Railway) para o checkout. Sem "server-only" aqui para
// os testes rodarem em Node puro; o único ponto de entrada da aplicação é
// src/lib/lotti-api/server.ts, que é server-only. Estas variáveis nunca vão para o
// navegador: nada de prefixo público do Next nelas.

/** Cabeçalho com o segredo compartilhado (CHECKOUT_API_TOKEN), conferido em tempo constante pela API. */
export const CHECKOUT_HEADER = "x-lotti-checkout";

const REQUEST_TIMEOUT_MS = 15_000;

export type LottiApiConfig = {
  /** Origem da API, sem barra final e sem /api (ex.: https://api.plataformalotti.com.br). */
  baseUrl: string;
  token: string;
};

/** Erro de uma chamada à API: status HTTP (0 = rede/timeout) e o `codigo` do corpo, quando houver. */
export class LottiApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string | null,
  ) {
    super(`LOTTI_API_${status}${code ? `:${code}` : ""}`);
  }
}

type Env = Record<string, string | undefined>;

/**
 * LOTTI_API_URL + CHECKOUT_API_TOKEN. Null quando faltar algum ou a URL for inválida: o
 * checkout fica indisponível de forma segura. HTTP só para localhost (desenvolvimento).
 */
export function readLottiApiConfig(env: Env): LottiApiConfig | null {
  const raw = env.LOTTI_API_URL?.trim();
  const token = env.CHECKOUT_API_TOKEN?.trim();
  if (!raw || !token) return null;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && local)) return null;

  const path = url.pathname.replace(/\/+$/, "").replace(/\/api$/, "");
  return { baseUrl: `${url.origin}${path}`, token };
}

type RequestOptions = {
  /** 404 vira null em vez de erro (leitura de pedido/conta que pode não existir). */
  allowNotFound?: boolean;
};

export type LottiApiClient = ReturnType<typeof createLottiApiClient>;

/** Chamadas às rotas /api/checkout/* da API, servidor a servidor. */
export function createLottiApiClient(config: LottiApiConfig, fetchImpl: typeof fetch = fetch) {
  async function request<T>(
    method: "GET" | "POST" | "PATCH",
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T | null> {
    const headers: Record<string, string> = {
      accept: "application/json",
      [CHECKOUT_HEADER]: config.token,
    };
    if (body !== undefined) headers["content-type"] = "application/json";

    let response: Response;
    try {
      response = await fetchImpl(`${config.baseUrl}/api/checkout${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: "no-store",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch {
      throw new LottiApiError(0, null);
    }

    if (options.allowNotFound && response.status === 404) return null;
    const data = (await response.json().catch(() => null)) as { codigo?: unknown } | null;
    if (!response.ok) {
      throw new LottiApiError(response.status, typeof data?.codigo === "string" ? data.codigo : null);
    }
    return data as T;
  }

  return {
    get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, undefined, options),
    post: <T>(path: string, body: unknown = {}, options?: RequestOptions) => request<T>("POST", path, body, options),
    patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, body),
  };
}
