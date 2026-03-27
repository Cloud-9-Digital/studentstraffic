import { NextRequest, NextResponse } from "next/server";

import { getCountries, getCourses, getUniversities, getAllLandingPages } from "@/lib/data/catalog";
import { getUniversityHref, getCountryHref, getCourseHref } from "@/lib/routes";

export type Suggestion = {
  type: "university" | "country" | "course" | "landing_page";
  label: string;
  subtitle: string;
  href: string;
};

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, " ");
}

function matches(query: string, text: string) {
  const q = normalize(query);
  const t = normalize(text);
  return t.includes(q);
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json<Suggestion[]>([]);
  }

  const [countries, courses, universities, landingPages] = await Promise.all([
    getCountries(),
    getCourses(),
    getUniversities(),
    getAllLandingPages(),
  ]);

  const countryMap = new Map(countries.map((c) => [c.slug, c.name]));
  const results: Suggestion[] = [];

  for (const u of universities) {
    if (matches(q, u.name) || matches(q, u.city)) {
      const countryName = countryMap.get(u.countrySlug) ?? "";
      results.push({
        type: "university",
        label: u.name,
        subtitle: `${u.city}${countryName ? `, ${countryName}` : ""}`,
        href: getUniversityHref(u.slug),
      });
    }
  }

  for (const c of countries) {
    if (matches(q, c.name) || matches(q, c.region)) {
      results.push({
        type: "country",
        label: `Study in ${c.name}`,
        subtitle: c.region,
        href: getCountryHref(c.slug),
      });
    }
  }

  for (const c of courses) {
    if (matches(q, c.name) || matches(q, c.shortName)) {
      results.push({
        type: "course",
        label: c.shortName,
        subtitle: c.name,
        href: getCourseHref(c.slug),
      });
    }
  }

  for (const lp of landingPages) {
    if (matches(q, lp.title) || matches(q, lp.slug)) {
      results.push({
        type: "landing_page",
        label: lp.title,
        subtitle: "Curated guide",
        href: `/${lp.slug}`,
      });
    }
  }

  return NextResponse.json<Suggestion[]>(results.slice(0, 8));
}
