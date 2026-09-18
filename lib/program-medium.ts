import { getTeachingLanguageLabel, isTeachingLanguageCode, sortTeachingLanguageCodes, teachingLanguageCodes, type TeachingLanguageCode } from "./catalogue-facets";

/** Compact labels only. Research/admissions caveats belong in mediumDetails. */
export function normalizeProgramMedium(raw: string | null | undefined, codes: readonly string[] = []) {
  const source = raw?.trim() ?? "";
  let languages = sortTeachingLanguageCodes(codes.filter(isTeachingLanguageCode));
  if (!languages.length) {
    // A translated website, application instructions or an entry test does not establish teaching language.
    const uncertain = /^(?:confirm|not stated|programme|program |department|research-unit|international-class|the international|high-quality|mixed|japanese ability|english (?:application|admissions|instructions|subject components)|albanian is the primary language of the official university website)/i.test(source);
    if (!uncertain) {
      const head = source.split(/;|\.(?:\s|$)|\(/)[0].replace(/^(?:primarily|mainly|normally|partly|bilingual\s*-)\s*/i, "");
      // Only consume an explicit language list at the beginning, never mentions buried in evidence notes.
      let rest = head.toLowerCase().replace(/^50%\s*/, "");
      const found: TeachingLanguageCode[] = [];
      while (rest) {
        const code = teachingLanguageCodes.find(c => rest.startsWith(c) && !/[a-z]/.test(rest[c.length] ?? ""));
        if (!code) break;
        found.push(code); rest = rest.slice(code.length);
        const separator = rest.match(/^\s*(?:and\/or|and|or|then|\/|&|,|\+)\s*(?:partly\s+|50%\s+)?/);
        if (!separator) break;
        rest = rest.slice(separator[0].length);
      }
      languages = sortTeachingLanguageCodes(found);
      if (/^English \(years 1-3\), transitioning to Russian/i.test(source)) languages = ["english", "russian"];
    }
  }
  const medium = languages.length ? languages.map(getTeachingLanguageLabel).join(" / ") : "Not confirmed";
  return { medium, instructionLanguages: languages, mediumDetails: source && source !== medium ? source : null };
}
