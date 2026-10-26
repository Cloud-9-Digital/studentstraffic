import { buildLlmsTxt } from "@/lib/llms-txt";
import { logPublicRouteRequest } from "@/lib/route-observability";

// Content is built in lib/llms-txt.ts, shared with the home page markdown view.
export async function GET(request: Request) {
  logPublicRouteRequest({
    route: "llms.txt",
    request,
    sampleRate: 1,
  });

  return new Response(await buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
