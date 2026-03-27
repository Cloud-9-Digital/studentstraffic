import type {
  Country,
  Course,
  LandingPage,
  ProgramOffering,
  SearchDocument,
  University,
} from "@/lib/data/types";
import {
  getCountryHref,
  getCourseHref,
  getLandingPageHref,
  getUniversityHref,
} from "@/lib/routes";

type SearchCatalogInput = {
  countries: Country[];
  courses: Course[];
  universities: University[];
  programOfferings: ProgramOffering[];
  landingPages: LandingPage[];
};

function normalizeText(parts: Array<string | undefined | null | string[]>) {
  return parts
    .flatMap((part) => (Array.isArray(part) ? part : [part]))
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSearchDocuments({
  countries,
  courses,
  universities,
  programOfferings,
  landingPages,
}: SearchCatalogInput): SearchDocument[] {
  const countryBySlug = new Map(countries.map((country) => [country.slug, country]));
  const courseBySlug = new Map(courses.map((course) => [course.slug, course]));
  const offeringsByUniversitySlug = new Map<string, ProgramOffering[]>();

  for (const offering of programOfferings) {
    const current = offeringsByUniversitySlug.get(offering.universitySlug) ?? [];
    current.push(offering);
    offeringsByUniversitySlug.set(offering.universitySlug, current);
  }

  const countryDocuments: SearchDocument[] = countries.map((country) => {
    const countryUniversities = universities.filter(
      (university) => university.countrySlug === country.slug
    );

    return {
      documentType: "country",
      sourceSlug: country.slug,
      path: getCountryHref(country.slug),
      title: `Study in ${country.name}`,
      subtitle: country.region,
      summary: country.summary,
      searchText: normalizeText([
        country.name,
        country.region,
        country.summary,
        country.whyStudentsChooseIt,
        country.climate,
        country.currencyCode,
        countryUniversities.map((university) => university.name),
      ]),
      highlights: [country.region, country.climate, country.currencyCode],
      countrySlug: country.slug,
      featured: false,
      intakeMonths: [],
    };
  });

  const courseDocuments: SearchDocument[] = courses.map((course) => {
    const coursePrograms = programOfferings.filter(
      (offering) => offering.courseSlug === course.slug
    );

    return {
      documentType: "course",
      sourceSlug: course.slug,
      path: getCourseHref(course.slug),
      title: `${course.shortName} Abroad`,
      subtitle: course.name,
      summary: course.summary,
      searchText: normalizeText([
        course.name,
        course.shortName,
        course.summary,
        coursePrograms.map((program) => program.title),
      ]),
      highlights: [`${course.durationYears} years`, course.shortName],
      courseSlug: course.slug,
      featured: false,
      intakeMonths: [...new Set(coursePrograms.flatMap((program) => program.intakeMonths))],
    };
  });

  const universityDocuments: SearchDocument[] = universities.map((university) => {
    const country = countryBySlug.get(university.countrySlug);
    const universityPrograms =
      offeringsByUniversitySlug.get(university.slug)?.sort(
        (a, b) => a.annualTuitionUsd - b.annualTuitionUsd
      ) ?? [];
    const courseSlugs = [...new Set(universityPrograms.map((program) => program.courseSlug))];
    const courseNames = courseSlugs
      .map((slug) => courseBySlug.get(slug)?.shortName)
      .filter(Boolean) as string[];
    const cheapestProgram = universityPrograms[0];

    return {
      documentType: "university",
      sourceSlug: university.slug,
      path: getUniversityHref(university.slug),
      title: university.name,
      subtitle: country ? `${university.city}, ${country.name}` : university.city,
      summary: university.summary,
      searchText: normalizeText([
        university.name,
        university.city,
        country?.name,
        university.summary,
        university.campusLifestyle,
        university.cityProfile,
        university.clinicalExposure,
        university.hostelOverview,
        university.indianFoodSupport,
        university.safetyOverview,
        university.studentSupport,
        university.whyChoose,
        university.thingsToConsider,
        university.bestFitFor,
        university.teachingHospitals,
        university.recognitionBadges,
        university.faq.map((item) => `${item.question} ${item.answer}`),
        courseNames,
      ]),
      highlights: [
        ...university.recognitionBadges.slice(0, 2),
        ...courseNames.slice(0, 2),
      ],
      countrySlug: university.countrySlug,
      universitySlug: university.slug,
      city: university.city,
      featured: university.featured,
      annualTuitionUsd: cheapestProgram?.annualTuitionUsd,
      medium: cheapestProgram?.medium,
      intakeMonths: [
        ...new Set(universityPrograms.flatMap((program) => program.intakeMonths)),
      ],
    };
  });

  const programDocuments: SearchDocument[] = programOfferings.map((offering) => {
    const university = universities.find(
      (candidate) => candidate.slug === offering.universitySlug
    );
    const course = courseBySlug.get(offering.courseSlug);
    const country = university ? countryBySlug.get(university.countrySlug) : undefined;

    return {
      documentType: "program",
      sourceSlug: offering.slug,
      path: university ? getUniversityHref(university.slug) : "/universities",
      title: course && university ? `${course.shortName} at ${university.name}` : offering.title,
      subtitle:
        university && country ? `${university.city}, ${country.name}` : offering.title,
      summary: university?.summary ?? offering.title,
      searchText: normalizeText([
        offering.title,
        course?.name,
        course?.shortName,
        university?.name,
        university?.summary,
        university?.clinicalExposure,
        university?.hostelOverview,
        university?.indianFoodSupport,
        offering.medium,
        offering.licenseExamSupport,
        offering.teachingPhases.map(
          (phase) => `${phase.phase} ${phase.language} ${phase.details}`
        ),
      ]),
      highlights: [
        offering.medium,
        "Verify licensing fit",
      ],
      countrySlug: university?.countrySlug,
      courseSlug: offering.courseSlug,
      universitySlug: offering.universitySlug,
      city: university?.city,
      featured: offering.featured,
      annualTuitionUsd: offering.annualTuitionUsd,
      medium: offering.medium,
      intakeMonths: offering.intakeMonths,
    };
  });

  const landingPageDocuments: SearchDocument[] = landingPages.map((page) => {
    const country = countryBySlug.get(page.countrySlug);
    const course = courseBySlug.get(page.courseSlug);

    return {
      documentType: "landing_page",
      sourceSlug: page.slug,
      path: getLandingPageHref(page.courseSlug, page.countrySlug),
      title: page.title,
      subtitle:
        course && country ? `${course.shortName} in ${country.name}` : page.kicker,
      summary: page.summary,
      searchText: normalizeText([
        page.title,
        page.kicker,
        page.summary,
        page.heroHighlights,
        page.reasonsToChoose,
        page.editorialNotes,
        page.faq.map((item) => `${item.question} ${item.answer}`),
      ]),
      highlights: page.heroHighlights.slice(0, 3),
      countrySlug: page.countrySlug,
      courseSlug: page.courseSlug,
      featured: true,
      intakeMonths: [],
    };
  });

  return [
    ...countryDocuments,
    ...courseDocuments,
    ...universityDocuments,
    ...programDocuments,
    ...landingPageDocuments,
  ];
}
