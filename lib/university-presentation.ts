const PROGRAMME_SUFFIX_SEPARATOR = /\s+[—–]\s+/u;

export function getUniversityDisplayName(name: string) {
  const [institutionName] = name.split(PROGRAMME_SUFFIX_SEPARATOR, 1);
  return institutionName.trim() || name.trim();
}

export function getUniversityHeroSummary(summary: string, maxCharacters = 320) {
  const normalized = summary.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxCharacters) return normalized;

  const sentences = normalized.match(/[^.!?]+[.!?]+/g) ?? [];
  let excerpt = "";

  for (const sentence of sentences) {
    const candidate = `${excerpt} ${sentence.trim()}`.trim();
    if (candidate.length > maxCharacters) break;
    excerpt = candidate;
    if (excerpt.length >= 140) return excerpt;
  }

  const clipped = normalized.slice(0, maxCharacters + 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : maxCharacters).trim()}…`;
}
