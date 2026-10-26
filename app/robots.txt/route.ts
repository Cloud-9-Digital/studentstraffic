import { buildRobotsTxt } from "@/lib/robots-txt";

// Replaces app/robots.ts: the metadata route cannot emit Content-Signal lines.
// No request data is read, so the response is prerendered at build time.
export function GET() {
  return new Response(buildRobotsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
