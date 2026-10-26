import { connection } from "next/server";

import {
  markdownNotFound,
  markdownResponse,
  renderCountryMarkdown,
} from "@/lib/agent-markdown";
import {
  getCountryBySlug,
  getCountryProgramDirectoryRows,
} from "@/lib/data/catalog";
import { getCountryRegulatoryAdvisory } from "@/lib/data/regulatory-advisories";
import { getCountryHref } from "@/lib/routes";

// Served at /countries/{slug}.md and for `Accept: text/markdown` requests to
// /countries/{slug} (rewrites in lib/agent-discovery.ts). Reads go through the
// same cached catalogue readers as the HTML country page.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await connection();
  const { slug } = await params;

  const country = await getCountryBySlug(slug);
  if (!country) return markdownNotFound();

  const programRows = await getCountryProgramDirectoryRows(country.slug);

  return markdownResponse(
    renderCountryMarkdown({
      country,
      programRows,
      countryAdvisory: getCountryRegulatoryAdvisory(country.slug),
    }),
    getCountryHref(country.slug),
  );
}
