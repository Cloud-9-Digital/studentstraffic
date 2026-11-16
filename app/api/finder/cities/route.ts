import { NextResponse, type NextRequest } from "next/server";

import { getFinderCities, getWebFinderOptions } from "@/lib/data/catalog";

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country");
  if (!country || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(country)) {
    return NextResponse.json([], { status: 400 });
  }

  // Only catalogue countries can create entries in the shared city cache.
  const { countries } = await getWebFinderOptions();
  if (!countries.some(({ slug }) => slug === country)) {
    return NextResponse.json([], { status: 404 });
  }

  return NextResponse.json(await getFinderCities(country), {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
  });
}
