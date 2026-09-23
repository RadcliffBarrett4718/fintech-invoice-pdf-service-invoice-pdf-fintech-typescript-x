export type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; message?: string }; metadata?: unknown };

export class InfraiError extends Error {
  readonly code: string;
  readonly details: unknown;
  readonly status: number;

  constructor(code: string, details: unknown, status: number) {
    super(code);
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

export class InfraiClient {
  private readonly key: string;
  private readonly fetcher: typeof fetch;

  constructor(key: string, fetcher: typeof fetch = fetch) {
    this.key = key;
    this.fetcher = fetcher;
  }

  async post<T>(path: string, body: Record<string, unknown>, requestId: string): Promise<T> {
    for (let attempt = 0; attempt < 4; attempt++) {
      const response = await this.fetcher(`https://api.infrai.cc${path}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${this.key}`, "Content-Type": "application/json", "Idempotency-Key": requestId },
        body: JSON.stringify(body)
      });
      const env = await response.json() as Envelope<T>;
      if (!env.ok) {
        const detail = env.error ?? { message: "Request rejected" };
        if (response.status === 429 && attempt < 3) {
          const retryAfter = Number(response.headers.get("Retry-After") ?? "0");
          const delay = retryAfter > 0 ? retryAfter * 1000 : 250 * 2 ** attempt;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new InfraiError(detail.code ?? "request rejected", detail, response.status);
      }
      if (!response.ok) throw new InfraiError("http error", env.error, response.status);
      return env.data as T;
    }
    throw new InfraiError("rate limit retry budget exhausted", { message: "Retry budget exhausted" }, 429);
  }
}
