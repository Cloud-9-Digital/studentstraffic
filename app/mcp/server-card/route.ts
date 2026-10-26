import { discoveryOptionsResponse, serverCardResponse } from "@/lib/public-catalog-routes";

// The server card's recommended location under the Streamable HTTP endpoint
// (<streamable-http-url>/server-card); same document as
// /.well-known/mcp/server-card.json.
export function GET() {
  return serverCardResponse();
}

export function OPTIONS() {
  return discoveryOptionsResponse();
}
