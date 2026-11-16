import type { FinderCardProgram, FinderCardProgramsPage } from "@/lib/data/types";

export type FinderUniversityCard = Pick<FinderCardProgram, "country"> & {
  university: Omit<FinderCardProgram["university"], "featured">;
};

export type FinderWebResults = Pick<
  FinderCardProgramsPage,
  "totalPages" | "currentPage" | "hasPreviousPage" | "hasNextPage"
> & { programs: FinderUniversityCard[] };

export function toFinderWebResults(results: FinderCardProgramsPage): FinderWebResults {
  return {
    totalPages: results.totalPages,
    currentPage: results.currentPage,
    hasPreviousPage: results.hasPreviousPage,
    hasNextPage: results.hasNextPage,
    programs: results.programs.map(({ university, country }) => ({
      university: {
        slug: university.slug,
        name: university.name,
        city: university.city,
        type: university.type,
        logoUrl: university.logoUrl,
        coverImageUrl: university.coverImageUrl,
      },
      country,
    })),
  };
}
