import { neonConfig } from "@neondatabase/serverless";

const DB_QUERY_TIMEOUT_MS = 15_000;
const DEFAULT_SLOW_DB_QUERY_MS = 1_000;
const BUILD_SLOW_DB_QUERY_MS = 5_000;
const DB_FETCH_RETRY_DELAYS_MS = [250, 750];

function getSlowQueryThresholdMs() {
  return process.env.NEXT_PHASE === "phase-production-build"
    ? BUILD_SLOW_DB_QUERY_MS
    : DEFAULT_SLOW_DB_QUERY_MS;
}

function getNowMs() {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }

  return Number(process.hrtime.bigint()) / 1_000_000;
}

function summarizeQueryPayload(body: unknown) {
  if (typeof body !== "string") {
    return null;
  }

  try {
    const parsed = JSON.parse(body) as
      | { query?: string; queries?: Array<{ query?: string }> }
      | null;

    if (!parsed) {
      return null;
    }

    if (Array.isArray(parsed.queries)) {
      return {
        kind: "batch",
        queryCount: parsed.queries.length,
        sampleQuery: parsed.queries[0]?.query?.replace(/\s+/g, " ").trim().slice(0, 180) ?? null,
      };
    }

    return {
      kind: "single",
      queryCount: 1,
      sampleQuery: parsed.query?.replace(/\s+/g, " ").trim().slice(0, 180) ?? null,
    };
  } catch {
    return null;
  }
}

function isExpectedPrerenderCancellation(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.message.includes(
    "During prerendering, fetch() rejects when the prerender is complete.",
  );
}

function isRetryableDatabaseTransportError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("fetch failed") ||
    message.includes("error connecting to database") ||
    message.includes("ecconnreset") ||
    message.includes("etimedout")
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeoutSignal(existingSignal: AbortSignal | null | undefined) {
  const timeoutSignal = AbortSignal.timeout(DB_QUERY_TIMEOUT_MS);
  return existingSignal ? AbortSignal.any([existingSignal, timeoutSignal]) : timeoutSignal;
}

export function configureDatabaseTransport() {
  const globalState = globalThis as typeof globalThis & {
    __dbTransportConfigured?: boolean;
  };

  if (globalState.__dbTransportConfigured) {
    return;
  }

  const baseFetch = globalThis.fetch.bind(globalThis);

  neonConfig.fetchFunction = async (input: RequestInfo | URL, init?: RequestInit) => {
    const startedAt = getNowMs();
    const querySummary = summarizeQueryPayload(init?.body);
    const slowQueryThresholdMs = getSlowQueryThresholdMs();

    for (let attempt = 0; attempt <= DB_FETCH_RETRY_DELAYS_MS.length; attempt += 1) {
      try {
        const response = await baseFetch(input, {
          ...init,
          signal: withTimeoutSignal((init?.signal as AbortSignal | undefined) ?? undefined),
        });

        const durationMs = Math.round(getNowMs() - startedAt);

        if (durationMs >= slowQueryThresholdMs) {
          console.warn(
            "[db-slow]",
            JSON.stringify({
              durationMs,
              status: response.status,
              attempts: attempt + 1,
              ...querySummary,
            }),
          );
        }

        return response;
      } catch (error) {
        if (isExpectedPrerenderCancellation(error)) {
          throw error;
        }

        const shouldRetry =
          attempt < DB_FETCH_RETRY_DELAYS_MS.length &&
          isRetryableDatabaseTransportError(error);

        if (shouldRetry) {
          await wait(DB_FETCH_RETRY_DELAYS_MS[attempt]);
          continue;
        }

        const durationMs = Math.round(getNowMs() - startedAt);
        console.error(
          "[db-error]",
          JSON.stringify({
            durationMs,
            timeoutMs: DB_QUERY_TIMEOUT_MS,
            attempts: attempt + 1,
            error: error instanceof Error ? error.message : String(error),
            ...querySummary,
          }),
        );
        throw error;
      }
    }

    throw new Error("Unreachable database transport retry state.");
  };

  globalState.__dbTransportConfigured = true;
}
