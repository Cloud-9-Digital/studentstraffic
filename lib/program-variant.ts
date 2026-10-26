/**
 * Sibling-aware programme labels.
 *
 * Some institutions publish the same course several times — one offering per
 * shift, teaching medium, aided/self-financed stream or campus (e.g.
 * /presidency-aece1, -aect1 and -aect2 are all B.A. Economics). Titled from the
 * course alone, those pages shared one title and H1. This module derives the
 * smallest qualifier that tells an offering apart from its siblings, using only
 * fields that exist on the offering: its title, `medium`, and the shift, stream
 * and campus named in its published overview and audience restrictions.
 *
 * Pure (no `next` or database imports) so it can be unit-tested.
 */

export type ProgramVariantSource = {
  slug: string;
  title: string;
  medium?: string | null;
  overview?: string | null;
  restrictions?: readonly string[] | null;
};

export type ProgramDisplayLabel = {
  /** Course label for the title/H1: the offering title when siblings differ by it. */
  courseLabel: string;
  /** Qualifier such as "Tamil medium, Shift II"; absent when not needed. */
  variant?: string;
};

const MAX_OFFERING_TITLE_CHARS = 40;
const ROMAN: Record<string, string> = { "1": "I", "2": "II", "3": "III" };

function normalize(value: string | null | undefined) {
  return (value ?? "").trim().replace(/\s+/g, " ");
}

function textOf(source: ProgramVariantSource) {
  return [source.overview ?? "", ...(source.restrictions ?? [])].join(" ");
}

function mediumOf(source: ProgramVariantSource) {
  const medium = normalize(source.medium);
  if (!medium || /not confirmed|unknown|not stated|varies/i.test(medium)) return undefined;
  return `${medium} medium`;
}

function shiftOf(source: ProgramVariantSource) {
  const match = textOf(source).match(/\bshift\s*[-–]?\s*(iii|ii|i|[123])(?![a-z])/i);
  if (!match) return undefined;
  const value = match[1].toUpperCase();
  return `Shift ${ROMAN[value] ?? value}`;
}

function fundingOf(source: ProgramVariantSource) {
  const text = textOf(source);
  if (/\bself[- ]?financ(?:ed|ing)\b/i.test(text)) return "Self-financed";
  if (/(?<![a-z-])aided\b/i.test(text) && !/\bunaided\b/i.test(text)) return "Aided";
  return undefined;
}

function lastPlaceSegment(value: string) {
  const segments = value
    .replace(/\([^)]*\)/g, "")
    .split(/[,;]/)
    .map((segment) => segment.trim().replace(/\.$/, ""))
    // "U.T. Puducherry" names the territory, not the campus town.
    .filter((segment) => segment && !/shift/i.test(segment) && !/^U\.\s?T\./.test(segment));
  const last = segments.at(-1);
  // Only a short place name is a useful qualifier; anything else is prose.
  return last && last.length <= 30 && !/\d/.test(last) ? last : undefined;
}

const GENERIC_CAMPUS_WORDS = /^(the|this|a|its|main|teaching|hospital|university|college|city)$/i;

function campusOf(source: ProgramVariantSource) {
  const text = textOf(source);
  for (const restriction of source.restrictions ?? []) {
    const labelled = restriction.match(/\bcampus:\s*(.+)$/i);
    if (labelled) return lastPlaceSegment(labelled[1]);
  }

  const named = text.match(/\b([A-Z][\w’'.-]+)\s+(?:(?:main|satellite|off)\s+)?campus\b/);
  if (named && !GENERIC_CAMPUS_WORDS.test(named[1])) return `${named[1]} campus`;

  const place = text.match(/\b(?:programme|program|degree|course) at ([^.]+)\./i);
  return place ? lastPlaceSegment(place[1]) : undefined;
}

const DIMENSIONS = [mediumOf, shiftOf, fundingOf, campusOf] as const;

/**
 * `siblings` are all published offerings of the same course at the same
 * university, including `target` itself.
 */
export function getProgramDisplayLabel(
  target: ProgramVariantSource,
  siblings: readonly ProgramVariantSource[],
  courseShortName: string,
): ProgramDisplayLabel {
  const others = siblings.filter((sibling) => sibling.slug !== target.slug);
  if (others.length === 0) return { courseLabel: courseShortName };

  const group = [target, ...others];
  const titles = new Set(group.map((item) => normalize(item.title).toLowerCase()));
  const targetTitle = normalize(target.title);
  // The offering title is used when it is what tells siblings apart, or when
  // it is short enough to read better than the generic course label.
  const useOfferingTitle =
    targetTitle.length > 0 &&
    (titles.size > 1 || targetTitle.length <= MAX_OFFERING_TITLE_CHARS);
  const courseLabel = useOfferingTitle ? targetTitle : courseShortName;

  // Only siblings that would still share the page title need a qualifier.
  const sameTitle =
    useOfferingTitle && titles.size > 1
      ? group.filter(
          (item) => normalize(item.title).toLowerCase() === targetTitle.toLowerCase(),
        )
      : group;
  if (sameTitle.length < 2) return { courseLabel };

  const values = sameTitle.map((item) => DIMENSIONS.map((dimension) => dimension(item)));
  const varying = DIMENSIONS.map((_, index) => index).filter(
    (index) => new Set(values.map((row) => row[index] ?? "")).size > 1,
  );
  if (varying.length === 0) return { courseLabel };

  const targetValues = values[0];
  const key = (row: (string | undefined)[], dims: number[]) =>
    dims.map((index) => row[index] ?? "").join("|");

  for (let size = 1; size <= varying.length; size += 1) {
    const dims = varying.slice(0, size);
    const targetKey = key(targetValues, dims);
    const clashes = values.filter((row) => key(row, dims) === targetKey).length;
    if (clashes === 1) {
      const variant = dims
        .map((index) => targetValues[index])
        .filter(Boolean)
        .join(", ");
      return variant ? { courseLabel, variant } : { courseLabel };
    }
  }

  const variant = varying
    .map((index) => targetValues[index])
    .filter(Boolean)
    .join(", ");
  return variant ? { courseLabel, variant } : { courseLabel };
}

export function formatProgramDisplayName(label: ProgramDisplayLabel) {
  return label.variant ? `${label.courseLabel} (${label.variant})` : label.courseLabel;
}
