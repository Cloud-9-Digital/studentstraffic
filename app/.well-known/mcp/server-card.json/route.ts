import { discoveryOptionsResponse, serverCardResponse } from "@/lib/public-catalog-routes";

// MCP Server Card for the public catalogue MCP server at /mcp, built from the
// same tool definitions the server registers (lib/public-catalog-api.ts).
export function GET() {
  return serverCardResponse();
}

export function OPTIONS() {
  return discoveryOptionsResponse();
}
