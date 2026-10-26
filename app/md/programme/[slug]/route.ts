import { connection } from "next/server";

import {
  markdownNotFound,
  markdownResponse,
  renderGuideMarkdown,
  renderLandingPageMarkdown,
  renderProgramMarkdown,
} from "@/lib/agent-markdown";
import {
  getCountryBySlug,
  getLandingPageBySlug,
  getProgramBySlug,
} from "@/lib/data/catalog";
import {
  getCountryRegulatoryAdvisory,
  getUniversityRegulatoryAdvisory,
} from "@/lib/data/regulatory-advisories";
import { getStudyAbroadGuideBySlug } from "@/lib/data/study-abroad-guides-db";
import { getUniversityProgramHref } from "@/lib/routes";
import { parseProgramSlug } from "@/lib/university-sections";

// Markdown view of every page on the root /[slug] route, served at /{slug}.md
// and for `Accept: text/markdown` requests to /{slug} (rewrites in
// lib/agent-discovery.ts). Resolves slugs in the same order as
// app/[slug]/page.tsx: landing page, study-abroad guide, then programme.
// Programme section slugs such as {slug}-fees resolve to the whole record.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await connection();
  const { slug: rawSlug } = await params;

  const landingPage = await getLandingPageBySlug(rawSlug);
  if (landingPage) {
    const country = await getCountryBySlug(landingPage.countrySlug);
    const canonicalPath = `/${landingPage.slug}`;
    return markdownResponse(
      renderLandingPageMarkdown({ page: landingPage, canonicalPath, country }),
      canonicalPath,
    );
  }

  const guide = await getStudyAbroadGuideBySlug(rawSlug);
  if (guide) {
    return markdownResponse(renderGuideMarkdown({ guide: guide.page }), guide.page.path);
  }

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
