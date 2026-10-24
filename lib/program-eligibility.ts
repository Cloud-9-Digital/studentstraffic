export function getProgrammeEligibilityItems(
  admissionsItems: readonly string[] | undefined,
  audience: {
    eligibleAudiences?: readonly string[];
    restrictions?: readonly string[];
  } | undefined,
) {
  return [...new Set([
    ...(admissionsItems ?? []),
    ...(audience?.eligibleAudiences ?? []).map((item) => `Open to: ${item}`),
    ...(audience?.restrictions ?? []),
  ])];
}
