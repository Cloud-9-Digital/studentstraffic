import { NextResponse, type NextRequest } from "next/server";

import {
  getBudgetComparisonGuides,
  getComparisonGuides,
  getCountryComparisonGuides,
} from "@/lib/discovery-pages";

const PAGE_SIZE = 24;

function getOffset(request: NextRequest) {
  const value = Number(request.nextUrl.searchParams.get("offset") ?? 0);
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  const offset = getOffset(request);
  let guides;

  if (type === "university") {
    guides = [...(await getComparisonGuides())].sort((left, right) =>
      `${left.left.university.name} ${left.right.university.name}`.localeCompare(
        `${right.left.university.name} ${right.right.university.name}`,
      ),
    );
  } else if (type === "country") {
    guides = [...(await getCountryComparisonGuides())].sort((left, right) =>
      `${left.leftCountry.name} ${left.rightCountry.name}`.localeCompare(
        `${right.leftCountry.name} ${right.rightCountry.name}`,
      ),
    );
  } else if (type === "budget") {
    guides = [...(await getBudgetComparisonGuides())].sort((left, right) => {
      if (left.course.slug !== right.course.slug) {
        return left.course.slug.localeCompare(right.course.slug);
      }
      if (left.budgetUsd !== right.budgetUsd) {
        return left.budgetUsd - right.budgetUsd;
      }
      return `${left.leftCountry.name} ${left.rightCountry.name}`.localeCompare(
        `${right.leftCountry.name} ${right.rightCountry.name}`,
      );
    });
  } else {
    return NextResponse.json({ error: "Invalid comparison type." }, { status: 400 });
  }

  return NextResponse.json(
    {
      guides: guides.slice(offset, offset + PAGE_SIZE),
      total: guides.length,
      nextOffset: Math.min(offset + PAGE_SIZE, guides.length),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
