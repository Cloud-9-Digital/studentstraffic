import flagCodes from "./generated/flag-codes.json";

const localFlagCodes = new Set(flagCodes);

export function getLocalFlagUrl(countryCode: string): string {
  const code = countryCode.trim().toLowerCase();
  return `/images/flags/${localFlagCodes.has(code) ? code : "xx"}.svg`;
}
