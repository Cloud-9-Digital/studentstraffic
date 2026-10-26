import { createMcpHandler } from "mcp-handler";
import { connection } from "next/server";

import { isMcpServerEnabled } from "@/lib/agent-discovery";
import { MCP_SERVER_NAME, PUBLIC_CATALOG_VERSION } from "@/lib/public-catalog-api";
import { MCP_SERVER_INSTRUCTIONS } from "@/lib/public-catalog-discovery";
import { registerPublicCatalogTools } from "@/lib/public-catalog-mcp";
import {
  checkMcpRateLimit,
  getMcpRequestContext,
  logMcpUsage,
  publicCatalog,
  runWithMcpRequestContext,
} from "@/lib/public-catalog-server";

// Public, read-only MCP server (Streamable HTTP, stateless, no auth). Tools
// live in lib/public-catalog-api.ts; discovery documents are
// /.well-known/mcp/server-card.json and /.well-known/api-catalog. Controls:
// MCP_SERVER_ENABLED kill switch, per-IP rate limits (30/min, 500/day), one
// usage log line per tool call. Terms: /ai-access. Runs on the Node.js
// runtime (the default; Cache Components rejects an explicit `runtime`).
export const maxDuration = 30;

const MAX_BODY_BYTES = 64 * 1024;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, Mcp-Protocol-Version, Retry-After",
  "Access-Control-Max-Age": "86400",
};

const mcpHandler = createMcpHandler(
  (server) => registerPublicCatalogTools(server, publicCatalog, logMcpUsage),
  {
    serverInfo: { name: MCP_SERVER_NAME, version: PUBLIC_CATALOG_VERSION },
    instructions: MCP_SERVER_INSTRUCTIONS,
    capabilities: { tools: { listChanged: false } },
    // Stateless and read-only: no server-pushed subscription streams.
    maxSubscriptions: 0,
  },
);

function withCors(response: Response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) headers.set(key, value);
  headers.set("Cache-Control", "no-store");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function jsonRpcId(request: Request) {
  if (request.method !== "POST") return null;
  try {
    const body = (await request.clone().json()) as { id?: unknown };
    return typeof body?.id === "string" || typeof body?.id === "number" ? body.id : null;
  } catch {
    return null;
  }
}

function jsonRpcError(
  status: number,
  code: number,
  message: string,
  id: string | number | null,
  headers: Record<string, string> = {},
) {
  return withCors(Response.json({ jsonrpc: "2.0", error: { code, message }, id }, { status, headers }));
}

async function handle(request: Request) {
  await connection();

  if (!isMcpServerEnabled()) {
    return jsonRpcError(503, -32001, "The Students Traffic MCP server is temporarily unavailable.", null, {
      "Retry-After": "3600",
    });
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return jsonRpcError(413, -32600, "Request body too large.", null);
  }

  const context = getMcpRequestContext(request);
  return runWithMcpRequestContext(context, async () => {
    const limited = await checkMcpRateLimit(context);
    if (limited) {
      logMcpUsage({ event: "mcp_rate_limited", window: limited.window, method: request.method });
      return jsonRpcError(
        429,
        -32029,
        `Rate limit exceeded (${limited.limit} requests per ${limited.window} per IP). Retry after ${limited.retryAfter} seconds.`,
        await jsonRpcId(request),
        { "Retry-After": String(limited.retryAfter) },
      );
    }
    return withCors(await mcpHandler(request));
  });
}

export { handle as GET, handle as POST, handle as DELETE };

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
