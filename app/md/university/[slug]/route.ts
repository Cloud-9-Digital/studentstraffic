import { connection } from "next/server";

import {
  markdownNotFound,
  markdownResponse,
  renderUniversityMarkdown,
} from "@/lib/agent-markdown";
import {
  getCountryBySlug,
  getProgramsForUniversity,
  getUniversityBySlug,
} from "@/lib/data/catalog";
import { getUniversityHref } from "@/lib/routes";
import { parseUniversitySlug } from "@/lib/university-sections";

// Served at /university/{slug}.md and for `Accept: text/markdown` requests to
// /university/{slug} (rewrites in next.config.ts). Section slugs resolve to
// the whole university record. Reads go through the same "use cache" readers
// as the HTML page, so publishes invalidate both through the entity tags.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await connection();
  const { slug: rawSlug } = await params;
  const { universitySlug } = parseUniversitySlug(rawSlug);

  const university = await getUniversityBySlug(universitySlug);
  if (!university) return markdownNotFound();

  const [programs, country] = await Promise.all([
    getProgramsForUniversity(university.slug),
    getCountryBySlug(university.countrySlug),
  ]);
  if (!country) return markdownNotFound();

  return markdownResponse(
    renderUniversityMarkdown({ university, country, programs }),
    getUniversityHref(university.slug),
  );
}
