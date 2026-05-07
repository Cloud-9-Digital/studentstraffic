import "server-only";

import { neonConfig } from "@neondatabase/serverless";

const DB_QUERY_TIMEOUT_MS = 15_000;
const SLOW_DB_QUERY_MS = 1_000;

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

    try {
      const response = await baseFetch(input, {
        ...init,
        signal: withTimeoutSignal((init?.signal as AbortSignal | undefined) ?? undefined),
      });

      const durationMs = Math.round(getNowMs() - startedAt);

      if (durationMs >= SLOW_DB_QUERY_MS) {
        console.warn(
          "[db-slow]",
          JSON.stringify({
            durationMs,
            status: response.status,
            ...querySummary,
          }),
        );
      }

      return response;
    } catch (error) {
      if (isExpectedPrerenderCancellation(error)) {
        throw error;
      }

      const durationMs = Math.round(getNowMs() - startedAt);
      console.error(
        "[db-error]",
        JSON.stringify({
          durationMs,
          timeoutMs: DB_QUERY_TIMEOUT_MS,
          error: error instanceof Error ? error.message : String(error),
          ...querySummary,
        }),
      );
      throw error;
    }
  };

  globalState.__dbTransportConfigured = true;
}
