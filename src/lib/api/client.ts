export class ApiError extends Error {
  constructor(
    public status: number,
    public code?: string,
    public correlationId?: string,
  ) {
    super("API request failed");
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  path: `/api/v1/${string}`,
  method: "GET" | "POST" | "DELETE",
  data?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(path, {
    method,
    headers:
      data === undefined ? undefined : { "Content-Type": "application/json" },
    body: data === undefined ? undefined : JSON.stringify(data),
    credentials: "same-origin",
    cache: "no-store",
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(20_000)])
      : AbortSignal.timeout(20_000),
  }).catch((error: unknown) => {
    if (signal?.aborted) throw error;
    const correlationId = crypto.randomUUID();
    console.warn(
      JSON.stringify({
        event: "api.transport_failed",
        method,
        operation: path
          .split("?")[0]
          .replace(/\/sessions\/[^/]+$/, "/sessions/:id"),
        correlationId,
      }),
    );
    throw new ApiError(0, "transport_failed", correlationId);
  });
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const detail =
      result && typeof result === "object" && "detail" in result
        ? result.detail
        : null;
    const envelope =
      detail && typeof detail === "object"
        ? (detail as Record<string, unknown>)
        : {};
    throw new ApiError(
      response.status,
      typeof envelope.code === "string" ? envelope.code : undefined,
      typeof envelope.correlation_id === "string"
        ? envelope.correlation_id
        : undefined,
    );
  }
  if (result === null) throw new ApiError(502, "invalid_response");
  return result as T;
}

export function apiPost<T>(path: `/api/v1/${string}`, data: unknown) {
  return apiRequest<T>(path, "POST", data);
}
