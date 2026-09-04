/** Reads `message` from a typical RTK Query / Laravel error payload. */
export function getApiErrorMessage(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("data" in error)) {
    return undefined;
  }

  const data = (error as { data?: unknown }).data;
  if (typeof data !== "object" || data === null) {
    return undefined;
  }

  const message = (data as { message?: unknown }).message;
  return typeof message === "string" && message ? message : undefined;
}

export function getApiErrorStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null || !("status" in error)) {
    return undefined;
  }

  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : undefined;
}
