import { createHash } from "node:crypto";

import { isMcpServerEnabled } from "@/lib/agent-discovery";
import {
  API_CATALOG_CONTENT_TYPE,
  buildApiCatalog,
  buildServerCard,
  getApiCatalogLinkHeader,
  SERVER_CARD_CONTENT_TYPE,
} from "@/lib/public-catalog-discovery";

/**
 * Response builders for the MCP discovery documents. None reads the request,
 * so Next prerenders each route at build time and the CDN serves them; the
 * MCP_SERVER_ENABLED kill switch is therefore applied per deployment, the same
 * as for /mcp on Vercel. With the switch off they answer 404, so nothing
 * advertises a server that is not running.
 */

const DISCOVERY_CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, If-None-Match",
  "Access-Control-Expose-Headers": "ETag, Link",
};

function staticJson(body: unknown, contentType: string, extra: Record<string, string> = {}) {
  const text = JSON.stringify(body, null, 2);
  return new Response(text, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      ETag: `"${createHash("sha256").update(text).digest("hex").slice(0, 32)}"`,
      ...DISCOVERY_CORS,
      ...extra,
    },
  });
}

function disabled() {
  return Response.json(
    { error: "The Students Traffic MCP server is not available." },
    { status: 404, headers: { ...DISCOVERY_CORS, "Cache-Control": "public, max-age=300" } },
  );
}

export function serverCardResponse(enabled = isMcpServerEnabled()) {
  return enabled ? staticJson(buildServerCard(), SERVER_CARD_CONTENT_TYPE) : disabled();
}

export function apiCatalogResponse(enabled = isMcpServerEnabled()) {
  return enabled
    ? staticJson(buildApiCatalog(), API_CATALOG_CONTENT_TYPE, { Link: getApiCatalogLinkHeader() })
    : disabled();
}

export function apiCatalogHeadResponse(enabled = isMcpServerEnabled()) {
  const response = apiCatalogResponse(enabled);
  return new Response(null, { status: response.status, headers: response.headers });
}

export function discoveryOptionsResponse() {
  return new Response(null, { status: 204, headers: DISCOVERY_CORS });
}
