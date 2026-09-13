import type { SearchDocumentType } from "@/lib/data/types";

/**
 * Orders the /search result sections so the section holding the best-ranked
 * result is shown first; the visitor then sees the top result before any
 * other card. `results` must be in rank order (as returned by searchCatalog),
 * so a section's first position is its best score. Sections are otherwise kept
 * in their configured order, which is also where empty sections end up.
 */
export function orderSectionsByTopResult<Section extends { type: SearchDocumentType }>(
  sections: readonly Section[],
  results: readonly { documentType: SearchDocumentType }[],
): Section[] {
  const bestPositionByType = new Map<SearchDocumentType, number>();

  results.forEach((result, position) => {
    if (!bestPositionByType.has(result.documentType)) {
      bestPositionByType.set(result.documentType, position);
    }
  });

  return sections
    .map((section, order) => ({
      section,
      order,
      bestPosition: bestPositionByType.get(section.type) ?? Number.MAX_SAFE_INTEGER,
    }))
    .sort((left, right) => left.bestPosition - right.bestPosition || left.order - right.order)
    .map(({ section }) => section);
}
