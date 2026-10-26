import type { McpServer } from "@modelcontextprotocol/server";

import { siteConfig } from "@/lib/constants";
import { absoluteUrl } from "@/lib/metadata";
import {
  PUBLIC_CATALOG_TOOLS,
  type PublicCatalog,
} from "@/lib/public-catalog-api";
import { READ_ONLY_TOOL_ANNOTATIONS } from "@/lib/public-catalog-discovery";

const temporaryErrorText = () =>
  `The ${siteConfig.name} catalogue is temporarily unavailable. Please try again shortly, or open ${absoluteUrl("/")} directly.`;

type UsageLogger = (event: Record<string, string | number | boolean | null>) => void;

function itemCount(data: unknown) {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  for (const key of ["results", "programmes"]) {
    if (Array.isArray(record[key])) return (record[key] as unknown[]).length;
  }
  return 1;
}

/**
 * Registers the read-only catalogue tools on an MCP server. Each tool returns
 * the human-readable text (with the canonical page URL and the counselling
 * link) plus the same data as structured content, and logs one usage line:
 * tool, outcome, latency and result size, never the arguments.
 */
export function registerPublicCatalogTools(
  server: McpServer,
  catalog: PublicCatalog,
  logUsage: UsageLogger = () => {},
) {
  for (const tool of PUBLIC_CATALOG_TOOLS) {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: { title: tool.title, ...READ_ONLY_TOOL_ANNOTATIONS },
      },
      async (args: unknown) => {
        const started = Date.now();
        let result: Awaited<ReturnType<PublicCatalog[typeof tool.name]>>;
        try {
          result = await catalog[tool.name](args);
        } catch (error) {
          // Never pass a data-layer error (SQL text, parameters) to the caller.
          logUsage({
            event: "mcp_tool_error",
            tool: tool.name,
            latencyMs: Date.now() - started,
            error: error instanceof Error ? error.name : "unknown",
          });
          return {
            content: [{ type: "text" as const, text: temporaryErrorText() }],
            isError: true,
          };
        }
        logUsage({
          event: "mcp_tool_call",
          tool: tool.name,
          ok: result.ok,
          status: result.ok ? 200 : result.status,
          latencyMs: Date.now() - started,
          resultChars: result.text.length,
          resultItems: result.ok ? itemCount(result.data) : 0,
          argChars: JSON.stringify(args ?? {}).length,
        });
        return result.ok
          ? {
              content: [{ type: "text" as const, text: result.text }],
              structuredContent: result.data as Record<string, unknown>,
            }
          : { content: [{ type: "text" as const, text: result.text }], isError: true };
      },
    );
  }
}
