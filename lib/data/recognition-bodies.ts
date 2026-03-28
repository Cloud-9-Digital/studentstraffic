/**
 * Canonical list of accepted recognition bodies for medical universities.
 * Only these keys may appear in university recognitionBadges.
 * Labels are the display strings shown in the UI.
 */
export const RECOGNITION_BODIES = {
  NMC: "NMC",
  WHO: "WHO",
  WFME: "WFME",
  FAIMER: "FAIMER",
} as const;

export type RecognitionBodyKey = keyof typeof RECOGNITION_BODIES;

export const RECOGNITION_BODY_KEYS = Object.keys(RECOGNITION_BODIES) as RecognitionBodyKey[];

/** Returns true only for exact canonical key matches — no qualifiers like (claimed), (verify) etc. */
export function isValidRecognitionBadge(badge: string): boolean {
  return RECOGNITION_BODY_KEYS.some((key) => badge.trim().toUpperCase() === key);
}
