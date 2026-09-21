/**
 * Stable catalogue facet values. These values are used in persisted programme
 * data and finder URLs; labels are only for presentation.
 */
export const intakeMonthCodes = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

export type IntakeMonthCode = (typeof intakeMonthCodes)[number];

export const teachingLanguageCodes = [
  "albanian",
  "arabic",
  "bulgarian",
  "catalan",
  "chinese",
  "croatian",
  "czech",
  "dutch",
  "english",
  "french",
  "georgian",
  "german",
  "greek",
  "hindi",
  "hungarian",
  "italian",
  "japanese",
  "korean",
  "kyrgyz",
  "lithuanian",
  "maltese",
  "norwegian",
  "polish",
  "portuguese",
  "romanian",
  "russian",
  "sanskrit",
  "serbian",
  "slovak",
  "slovenian",
  "spanish",
  "swedish",
  "telugu",
  "turkish",
  "urdu",
  "uzbek",
  "vietnamese",
] as const;

export type TeachingLanguageCode = (typeof teachingLanguageCodes)[number];

const intakeMonthLabels: Record<IntakeMonthCode, string> = {
  january: "January",
  february: "February",
  march: "March",
  april: "April",
  may: "May",
  june: "June",
  july: "July",
  august: "August",
  september: "September",
  october: "October",
  november: "November",
  december: "December",
};

const teachingLanguageLabels: Record<TeachingLanguageCode, string> = {
  albanian: "Albanian",
  arabic: "Arabic",
  bulgarian: "Bulgarian",
  catalan: "Catalan",
  chinese: "Chinese",
  croatian: "Croatian",
  czech: "Czech",
  dutch: "Dutch",
  english: "English",
  french: "French",
  georgian: "Georgian",
  german: "German",
  greek: "Greek",
  hindi: "Hindi",
  hungarian: "Hungarian",
  italian: "Italian",
  japanese: "Japanese",
  korean: "Korean",
  kyrgyz: "Kyrgyz",
  lithuanian: "Lithuanian",
  maltese: "Maltese",
  norwegian: "Norwegian",
  polish: "Polish",
  portuguese: "Portuguese",
  romanian: "Romanian",
  russian: "Russian",
  sanskrit: "Sanskrit",
  serbian: "Serbian",
  slovak: "Slovak",
  slovenian: "Slovenian",
  spanish: "Spanish",
  swedish: "Swedish",
  telugu: "Telugu",
  turkish: "Turkish",
  urdu: "Urdu",
  uzbek: "Uzbek",
  vietnamese: "Vietnamese",
};

const intakeAliases = new Map<string, IntakeMonthCode>(
  intakeMonthCodes.flatMap((code) => [
    [code, code],
    [code.slice(0, 3), code],
  ]),
);
intakeAliases.set("sept", "september");

const teachingLanguageAliases = new Map<string, TeachingLanguageCode>(
  teachingLanguageCodes.map((code) => [code, code]),
);

function normalizedKey(value: string) {
  return value.trim().toLowerCase().replace(/\.$/, "");
}

export function isIntakeMonthCode(value: string): value is IntakeMonthCode {
  return intakeMonthCodes.includes(value as IntakeMonthCode);
}

export function normalizeIntakeMonthCode(value?: string) {
  return value ? intakeAliases.get(normalizedKey(value)) : undefined;
}

export function getIntakeMonthLabel(value: IntakeMonthCode) {
  return intakeMonthLabels[value];
}

export function sortIntakeMonthCodes(values: Iterable<IntakeMonthCode>) {
  const present = new Set(values);
  return intakeMonthCodes.filter((code) => present.has(code));
}

export function isTeachingLanguageCode(
  value: string,
): value is TeachingLanguageCode {
  return teachingLanguageCodes.includes(value as TeachingLanguageCode);
}

export function normalizeTeachingLanguageCode(value?: string) {
  return value ? teachingLanguageAliases.get(normalizedKey(value)) : undefined;
}

export function getTeachingLanguageLabel(value: TeachingLanguageCode) {
  return teachingLanguageLabels[value];
}

export function sortTeachingLanguageCodes(values: Iterable<TeachingLanguageCode>) {
  const present = new Set(values);
  return teachingLanguageCodes.filter((code) => present.has(code));
}
