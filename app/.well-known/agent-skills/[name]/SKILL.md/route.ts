import { getAgentSkill, getAgentSkills } from "@/lib/agent-skills";

export function generateStaticParams() {
  return getAgentSkills().map((skill) => ({ name: skill.name }));
}

// Serves the exact bytes hashed into /.well-known/agent-skills/index.json.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const skill = getAgentSkill(name);
  if (!skill) {
    return new Response("Not found\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(skill.body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
