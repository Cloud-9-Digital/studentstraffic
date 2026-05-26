import { getCountries, getProgramOfferings, getUniversityBySlug } from "@/lib/data/catalog";
import { mobileError, mobilePublicJson } from "@/lib/mobile/http";
import { mapUniversityDetail } from "@/lib/mobile/mappers";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const university = await getUniversityBySlug(slug);
  if (!university) return mobileError("not_found", "University not found.", 404);

  const [countries, offerings] = await Promise.all([
    getCountries(),
    getProgramOfferings(),
  ]);

  const country = countries.find((item) => item.slug === university.countrySlug);
  const universityOfferings = offerings.filter((item) => item.universitySlug === university.slug);

  return mobilePublicJson({
    university: mapUniversityDetail(university, country?.name, universityOfferings),
  });
}
