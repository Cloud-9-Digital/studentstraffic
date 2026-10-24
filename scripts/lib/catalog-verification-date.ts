import type { CatalogPayload } from "./catalog-payload-schema";

type Evidence = Pick<CatalogPayload["evidence"][number], "universitySlug" | "status" | "checkedAt">;
type Source = Pick<CatalogPayload["universities"][number]["researchSources"][number], "checkedAt">;

export function universityVerificationDate(slug: string, evidence: Evidence[], sources: Source[]) {
  const verifiedDates = evidence
    .filter((claim) => claim.universitySlug === slug && claim.status !== "omit")
    .map((claim) => claim.checkedAt);
  const dates = verifiedDates.length ? verifiedDates : sources.map((source) => source.checkedAt);
  const latest = dates.sort().at(-1);
  if (!latest) throw new Error(`No verification date is available for ${slug}.`);
  return latest;
}
