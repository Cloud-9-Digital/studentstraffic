import {
  getProgramsForUniversity,
  getUniversityBySlug,
} from "@/lib/data/catalog";
import { mobileError, mobilePublicJson } from "@/lib/mobile/http";
import { mapUniversityDetail } from "@/lib/mobile/mappers";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const [university, programs] = await Promise.all([
    getUniversityBySlug(slug),
    getProgramsForUniversity(slug),
  ]);
  if (!university) return mobileError("not_found", "University not found.", 404);

  return mobilePublicJson({
    university: mapUniversityDetail(
      university,
      programs[0]?.country.name,
      programs.map((program) => program.offering),
    ),
  });
}
