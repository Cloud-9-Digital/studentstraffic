import type {
  Country,
  Course,
  ProgramOffering,
  University,
} from "@/lib/data/types";

type CatalogIndexInput = {
  countries: Country[];
  courses: Course[];
  universities: University[];
  programOfferings: ProgramOffering[];
};

export type CatalogIndexes = {
  countryBySlug: Map<string, Country>;
  courseBySlug: Map<string, Course>;
  universityBySlug: Map<string, University>;
  universitiesByCountrySlug: Map<string, University[]>;
  programsByCourseSlug: Map<string, ProgramOffering[]>;
  programsByUniversitySlug: Map<string, ProgramOffering[]>;
};

function pushToMapArray<Value>(
  map: Map<string, Value[]>,
  key: string,
  value: Value,
) {
  const existing = map.get(key);

  if (existing) {
    existing.push(value);
    return;
  }

  map.set(key, [value]);
}

export function buildCatalogIndexes({
  countries,
  courses,
  universities,
  programOfferings,
}: CatalogIndexInput): CatalogIndexes {
  const countryBySlug = new Map(
    countries.map((country) => [country.slug, country]),
  );
  const courseBySlug = new Map(courses.map((course) => [course.slug, course]));
  const universityBySlug = new Map(
    universities.map((university) => [university.slug, university]),
  );
  const universitiesByCountrySlug = new Map<string, University[]>();
  const programsByCourseSlug = new Map<string, ProgramOffering[]>();
  const programsByUniversitySlug = new Map<string, ProgramOffering[]>();

  for (const university of universities) {
    pushToMapArray(
      universitiesByCountrySlug,
      university.countrySlug,
      university,
    );
  }

  for (const offering of programOfferings) {
    pushToMapArray(programsByCourseSlug, offering.courseSlug, offering);
    pushToMapArray(
      programsByUniversitySlug,
      offering.universitySlug,
      offering,
    );
  }

  return {
    countryBySlug,
    courseBySlug,
    universityBySlug,
    universitiesByCountrySlug,
    programsByCourseSlug,
    programsByUniversitySlug,
  };
}
