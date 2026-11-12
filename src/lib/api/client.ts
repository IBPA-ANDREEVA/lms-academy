export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiPost<T>(
  path: `/api/v1/${string}`,
  data: unknown,
): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const result: unknown = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    const payload =
      result !== null && typeof result === "object"
        ? result as Record<string, unknown>
        : {};

    throw new ApiError(
      response.status,
      typeof payload.detail === "string"
        ? payload.detail
        : "Request failed",
    );
  }

  return result as T;
}
