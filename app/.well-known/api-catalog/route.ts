import {
  apiCatalogHeadResponse,
  apiCatalogResponse,
  discoveryOptionsResponse,
} from "@/lib/public-catalog-routes";

// RFC 9727 API catalog: the public REST API (OpenAPI, docs, status) and the
// MCP server (server card, docs). HEAD answers with the api-catalog Link.
export function GET() {
  return apiCatalogResponse();
}

export function HEAD() {
  return apiCatalogHeadResponse();
}

export function OPTIONS() {
  return discoveryOptionsResponse();
}
