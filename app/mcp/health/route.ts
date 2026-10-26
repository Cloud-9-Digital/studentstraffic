import { connection } from "next/server";

import { isMcpServerEnabled } from "@/lib/agent-discovery";

// Status link for the API catalog's MCP entry: no data, no database. Rendered
// per request so it reflects the deployment serving traffic and the
// MCP_SERVER_ENABLED kill switch.
export async function GET() {
  await connection();
  const enabled = isMcpServerEnabled();
  return Response.json(enabled ? { status: "ok" } : { status: "disabled" }, {
    status: enabled ? 200 : 503,
    headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" },
  });
}
