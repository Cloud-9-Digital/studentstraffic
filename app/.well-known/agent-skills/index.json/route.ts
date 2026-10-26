import { buildAgentSkillsIndex } from "@/lib/agent-skills";

// Agent Skills discovery index (RFC v0.2.0). Built from lib/agent-skills.ts,
// the same module that serves each SKILL.md, so digests match the bytes.
export function GET() {
  return Response.json(buildAgentSkillsIndex(), {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
