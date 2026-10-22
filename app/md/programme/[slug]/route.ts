import { connection } from "next/server";

import {
  markdownNotFound,
  markdownResponse,
  renderProgramMarkdown,
} from "@/lib/agent-markdown";
import { getProgramBySlug } from "@/lib/data/catalog";
import {
  getCountryRegulatoryAdvisory,
  getUniversityRegulatoryAdvisory,
} from "@/lib/data/regulatory-advisories";
import { getUniversityProgramHref } from "@/lib/routes";
import { parseProgramSlug } from "@/lib/university-sections";

// Served at /{programme-slug}.md (rewrite in next.config.ts). Section slugs
// such as {slug}-fees resolve to the whole programme record. Guide pages on
// the root route have no markdown view and return 404 here.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await connection();
  const { slug: rawSlug } = await params;
  const { programSlug } = parseProgramSlug(rawSlug);

  const program = await getProgramBySlug(programSlug);
  if (!program) return markdownNotFound();

  return markdownResponse(
    renderProgramMarkdown({
      program,
      countryAdvisory: getCountryRegulatoryAdvisory(program.country.slug),
      universityAdvisory: getUniversityRegulatoryAdvisory(
        program.country.slug,
        program.university.slug,
      ),
    }),
    getUniversityProgramHref(program.offering.slug),
  );
}
