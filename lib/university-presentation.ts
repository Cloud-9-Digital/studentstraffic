const PROGRAMME_SUFFIX_SEPARATOR = /\s+(?:\u2014|\u2013|-)\s+/u;
const PROGRAMME_SUFFIX_MARKER =
  /\b(?:bachelor|master|honours|bsc|b\.sc|bscn|msc|m\.sc|mbbs|md|mba|nursing|engineering|computer science|general practice nurse)\b/i;

export function getUniversityDisplayName(name: string) {
  const normalized = name.trim();
  const separator = normalized.match(PROGRAMME_SUFFIX_SEPARATOR);
  if (!separator?.index) return normalized;

  const suffix = normalized.slice(separator.index + separator[0].length);
  if (!PROGRAMME_SUFFIX_MARKER.test(suffix)) return normalized;

  return normalized.slice(0, separator.index).trim() || normalized;
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
