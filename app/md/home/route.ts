import { markdownResponse } from "@/lib/agent-markdown";
import { buildLlmsTxt } from "@/lib/llms-txt";

// Markdown view of the home page, served at /index.md and for
// `Accept: text/markdown` requests to / (rewrites in lib/agent-discovery.ts).
// The home page is a hub, so its markdown view is the llms.txt site guide.
export async function GET() {
  return markdownResponse(await buildLlmsTxt(), "/");
}
