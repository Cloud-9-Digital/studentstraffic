import type { SearchDocumentType } from "@/lib/data/types";

/** Best matches shown as one mixed list above the typed sections. */
export const TOP_RESULTS_COUNT = 4;

export type SearchResultLayout<Section, Result> = {
  topResults: Result[];
  sections: Array<{ section: Section; results: Result[] }>;
};

/**
 * Lays out /search results: the best `TOP_RESULTS_COUNT` results across all
 * types first, then the remaining results grouped into typed sections in their
 * configured order. Every result appears exactly once. `results` must be in
 * rank order (as returned by searchCatalog).
 *
 * Chosen over ordering whole sections by their single best result, which let
 * weak results of the leading type sit above stronger results of other types
 * (for "manipal univ", four India colleges before Manipal Academy of Higher
 * Education).
 */
export function buildSearchResultLayout<
  Section extends { type: SearchDocumentType },
  Result extends { documentType: SearchDocumentType },
>(
  sections: readonly Section[],
  results: readonly Result[],
): SearchResultLayout<Section, Result> {
  const remaining = results.slice(TOP_RESULTS_COUNT);

  return {
    topResults: results.slice(0, TOP_RESULTS_COUNT),
    sections: sections
      .map((section) => ({
        section,
        results: remaining.filter((result) => result.documentType === section.type),
      }))
      .filter((group) => group.results.length > 0),
  };
}
