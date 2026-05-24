import { and, eq } from "drizzle-orm";

import { getCountries, getProgramOfferings, getUniversityBySlug } from "@/lib/data/catalog";
import { getDb } from "@/lib/db/server";
import { userShortlists } from "@/lib/db/schema";
import { getMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson } from "@/lib/mobile/http";
import { mapUniversityDetail } from "@/lib/mobile/mappers";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const university = await getUniversityBySlug(slug);
  if (!university) return mobileError("not_found", "University not found.", 404);

  const [countries, offerings, session] = await Promise.all([
    getCountries(),
    getProgramOfferings(),
    getMobileSession(request),
  ]);

  let isShortlisted = false;
  const db = getDb();
  if (db && session?.user.id) {
    const [row] = await db
      .select({ id: userShortlists.id })
      .from(userShortlists)
      .where(
        and(
          eq(userShortlists.userId, session.user.id),
          eq(userShortlists.universitySlug, university.slug)
        )
      )
      .limit(1);
    isShortlisted = Boolean(row);
  }

  const country = countries.find((item) => item.slug === university.countrySlug);
  const universityOfferings = offerings.filter((item) => item.universitySlug === university.slug);

  return mobileJson({
    university: mapUniversityDetail(university, country?.name, universityOfferings, isShortlisted),
  });
}
