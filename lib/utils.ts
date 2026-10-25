import { parseReportedFeeQuote } from "@/lib/reported-fee-quote";
import type { FeeAudience, ProgramOffering } from "@/lib/data/types";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyUsd(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyAmount(
  value: number,
  currencyCode: string,
) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${formatNumber(value)} ${currencyCode}`;
  }
}

export function hasPublishedUsdAmount(
  value: number | null | undefined
): value is number {
  return typeof value === "number" && value > 0;
}

export function hasOfficialFeeAmount(
  value: number | null | undefined,
  currencyCode?: string | null,
  feeStatus?: ProgramOffering["feeStatus"],
): value is number {
  if (typeof value !== "number" || !Number.isFinite(value)) return false;
  // Zero is a fee only with explicit confirmation and a native currency.
  // Legacy normalized USD zero remains an unknown-amount sentinel.
  return (value > 0 && Boolean(currencyCode)) || (
    value === 0 && feeStatus === "confirmed" && /^[A-Z]{3}$/.test(currencyCode ?? "")
  );
}

// Mirrors formatProgramAnnualFee's source-of-truth logic without the
// fallback string, so callers (e.g. meta description generation) can check
// whether a real, renderable fee exists before leading with it.
export function hasRenderableProgramFee(
  offering: Pick<
    ProgramOffering,
    | "annualTuitionUsd"
    | "officialAnnualTuitionAmount"
    | "officialFeeCurrency"
    | "feeStatus"
    | "indicativeAnnualTuitionMinUsd"
    | "indicativeAnnualTuitionMaxUsd"
  >
) {
  if (offering.feeStatus === "on_request") return false;

  if (
    offering.feeStatus === "indicative" &&
    hasPublishedUsdAmount(offering.indicativeAnnualTuitionMinUsd) &&
    hasPublishedUsdAmount(offering.indicativeAnnualTuitionMaxUsd)
  ) {
    return true;
  }

  if (hasPublishedUsdAmount(offering.annualTuitionUsd)) return true;

  return hasOfficialFeeAmount(
    offering.officialAnnualTuitionAmount,
    offering.officialFeeCurrency,
    offering.feeStatus,
  );
}

export function hasRenderableProgramAnnualFee(
  offering: Pick<
    ProgramOffering,
    | "annualTuitionUsd"
    | "officialAnnualTuitionAmount"
    | "officialFeeCurrency"
    | "feeStatus"
  >,
) {
  if (offering.feeStatus && offering.feeStatus !== "confirmed") {
    return false;
  }
  return (
    hasPublishedUsdAmount(offering.annualTuitionUsd) ||
    hasOfficialFeeAmount(
      offering.officialAnnualTuitionAmount,
      offering.officialFeeCurrency,
      offering.feeStatus,
    )
  );
}

export function isConfirmedProgramFee(
  offering: Pick<
    ProgramOffering,
    | "annualTuitionUsd"
    | "officialAnnualTuitionAmount"
    | "officialFeeCurrency"
    | "feeStatus"
  >,
) {
  return hasRenderableProgramAnnualFee(offering);
}

/** A reported quote is a display fallback, never an annual tuition or budget value. */
export function getDisplayedReportedFeeQuote(
  offering: Pick<ProgramOffering, "annualTuitionUsd" | "officialAnnualTuitionAmount" | "officialFeeCurrency" | "feeStatus" | "indicativeAnnualTuitionMinUsd" | "indicativeAnnualTuitionMaxUsd" | "reportedFeeQuote">,
) {
  return hasRenderableProgramFee(offering) ? undefined : parseReportedFeeQuote(offering.reportedFeeQuote);
}

export function hasRenderableProgramDisplayFee(
  offering: Parameters<typeof getDisplayedReportedFeeQuote>[0],
) {
  return hasRenderableProgramFee(offering) || Boolean(getDisplayedReportedFeeQuote(offering));
}

export function getProgramAnnualFeeLabel(
  offering: Pick<
    ProgramOffering,
    | "annualTuitionUsd"
    | "officialAnnualTuitionAmount"
    | "officialFeeCurrency"
    | "feeStatus"
    | "reportedFeeQuote"
  >,
) {
  if (getDisplayedReportedFeeQuote(offering)) return "Fees";
  if (offering.feeStatus === "indicative") return "Indicative tuition per year";
  if (offering.feeStatus === "on_request") return "Fee plan";
  return hasOfficialFeeAmount(
    offering.officialAnnualTuitionAmount,
    offering.officialFeeCurrency,
    offering.feeStatus,
  ) && !hasPublishedUsdAmount(offering.annualTuitionUsd)
    ? "Tuition per year"
    : hasPublishedUsdAmount(offering.annualTuitionUsd)
      ? "Tuition per year"
      : "Fee status";
}

export function formatProgramAnnualFee(
  offering: Pick<
    ProgramOffering,
    | "annualTuitionUsd"
    | "officialAnnualTuitionAmount"
    | "officialFeeCurrency"
    | "feeStatus"
    | "reportedFeeQuote"
    | "indicativeAnnualTuitionMinUsd"
    | "indicativeAnnualTuitionMaxUsd"
  >,
  fallback = "Fee plan on request",
) {
  if (
    offering.feeStatus === "indicative" &&
    hasPublishedUsdAmount(offering.indicativeAnnualTuitionMinUsd) &&
    hasPublishedUsdAmount(offering.indicativeAnnualTuitionMaxUsd)
  ) {
    return `${formatCurrencyUsd(offering.indicativeAnnualTuitionMinUsd)}–${formatCurrencyUsd(offering.indicativeAnnualTuitionMaxUsd)}`;
  }

  if (offering.feeStatus === "on_request") return fallback;

  if (
    offering.feeStatus === "confirmed" &&
    offering.officialAnnualTuitionAmount === 0 &&
    hasOfficialFeeAmount(0, offering.officialFeeCurrency, offering.feeStatus) &&
    offering.officialFeeCurrency
  ) {
    return formatCurrencyAmount(0, offering.officialFeeCurrency);
  }

  if (hasPublishedUsdAmount(offering.annualTuitionUsd)) {
    return formatCurrencyUsd(offering.annualTuitionUsd);
  }

  if (
    hasOfficialFeeAmount(
      offering.officialAnnualTuitionAmount,
      offering.officialFeeCurrency,
      offering.feeStatus,
    ) &&
    offering.officialFeeCurrency
  ) {
    return formatCurrencyAmount(
      offering.officialAnnualTuitionAmount,
      offering.officialFeeCurrency,
    );
  }

  return fallback;
}

/** Display-only formatter: amount/range without exposing a quote's billing basis or provenance. */
export function formatProgramFee(
  offering: Parameters<typeof getDisplayedReportedFeeQuote>[0],
  fallback = "Fee plan on request",
) {
  const quote = getDisplayedReportedFeeQuote(offering);
  if (!quote) return formatProgramAnnualFee(offering, fallback);
  const minimum = formatCurrencyAmount(quote.minAmount, quote.currency);
  return quote.maxAmount !== undefined && quote.maxAmount !== quote.minAmount
    ? `${minimum}–${formatCurrencyAmount(quote.maxAmount, quote.currency)}`
    : minimum;
}

function feeAudienceLabel(audience: FeeAudience, countrySlug: string) {
  if (audience === "all") return "All students";
  if (audience === "international") return countrySlug === "india" ? "NRI & international" : "International students";
  return countrySlug === "india" ? "Indian students" : "Domestic students";
}

/**
 * Every published annual fee for a programme, each labelled with who it applies to when known,
 * e.g. [{ label: "Indian students", amount: "₹1,95,000" }, { label: "NRI & international", amount: "$4,000" }].
 * Unclassified fees keep the generic label, so older records render as before.
 */
export function getProgramFeeLines(
  offering: Pick<
    ProgramOffering,
    | "annualTuitionUsd"
    | "officialAnnualTuitionAmount"
    | "officialFeeCurrency"
    | "feeStatus"
    | "reportedFeeQuote"
    | "indicativeAnnualTuitionMinUsd"
    | "indicativeAnnualTuitionMaxUsd"
    | "feeAudience"
    | "additionalFees"
  >,
  countrySlug: string,
  fallback = "Fee plan on request",
): { label: string; amount: string }[] {
  if (getDisplayedReportedFeeQuote(offering)) return [{ label: "Fees", amount: formatProgramFee(offering, fallback) }];
  const primary = {
    label: offering.feeAudience && offering.feeStatus !== "on_request"
      ? feeAudienceLabel(offering.feeAudience, countrySlug)
      : getProgramAnnualFeeLabel(offering),
    amount: formatProgramAnnualFee(offering, fallback),
  };
  const extra = (offering.additionalFees ?? []).map((fee) => ({
    label: feeAudienceLabel(fee.audience, countrySlug),
    amount: formatCurrencyAmount(fee.annualAmount, fee.currency),
  }));
  const lines = [
    { ...primary, audience: offering.feeStatus === "on_request" ? undefined : offering.feeAudience },
    ...extra.map((line, index) => ({ ...line, audience: offering.additionalFees?.[index]?.audience })),
  ];
  // Same order on every card: Indian/domestic fee first, then one-fee-for-all, then NRI & international.
  const rank = (audience?: FeeAudience) => (audience === "domestic" ? 0 : audience === "all" ? 1 : audience === "international" ? 2 : 3);
  return lines
    .map((line, index) => ({ line, index }))
    .sort((a, b) => rank(a.line.audience) - rank(b.line.audience) || a.index - b.index)
    .map(({ line }) => ({ label: line.label, amount: line.amount }));
}

export function hasRenderableProgramLivingFee(
  offering: Pick<ProgramOffering, "livingUsd">
) {
  return hasPublishedUsdAmount(offering.livingUsd);
}

export function formatProgramLivingFee(
  offering: Pick<ProgramOffering, "livingUsd">,
  fallback = "Check with university",
) {
  return hasPublishedUsdAmount(offering.livingUsd)
    ? formatCurrencyUsd(offering.livingUsd)
    : fallback;
}

export function getSortableUsdValue(value: number | null | undefined) {
  return hasPublishedUsdAmount(value) ? value : Number.POSITIVE_INFINITY;
}

export function formatUsdAmountOrTbd(
  value: number | null | undefined,
  fallback = "Check official fee"
) {
  return hasPublishedUsdAmount(value) ? formatCurrencyUsd(value) : fallback;
}

export function formatProgramDuration(durationYears: number) {
  if (Number.isInteger(durationYears)) {
    return `${durationYears} ${durationYears === 1 ? "year" : "years"}`;
  }

  const totalMonths = Math.round(durationYears * 12);
  return `${totalMonths} months`;
}

const LOCAL_LANGUAGE_BY_COUNTRY: Record<string, string> = {
  vietnam: "Vietnamese",
  russia: "Russian",
  georgia: "Georgian",
  kyrgyzstan: "Kyrgyz",
  uzbekistan: "Uzbek",
};

const MAX_PROGRAM_MEDIUM_LABEL_LENGTH = 40;
const SENTENCE_LIKE_MEDIUM = /[.;:()\r\n]|--/;

const PLACEHOLDER_PROGRAM_MEDIUMS = new Set([
  "",
  "not confirmed",
  "tbc",
  "tbd",
  "to be confirmed",
  "unknown",
  "n/a",
  "na",
]);

/**
 * True when a stored `medium` is a placeholder rather than a verified language
 * label. Placeholders must never be shown, and must never be replaced with a
 * guessed language.
 */
export function isPlaceholderProgramMedium(
  medium: string | null | undefined,
): boolean {
  return PLACEHOLDER_PROGRAM_MEDIUMS.has((medium ?? "").trim().toLowerCase());
}

/**
 * `medium` is a short language label ("English / Russian"); delivery nuance
 * lives in `mediumNote`. Some legacy rows still hold a source sentence, so
 * those are reduced to their first concise phrase for display.
 *
 * Returns `null` for placeholder values ("Not confirmed", "TBC", empty) so
 * callers omit the medium entirely instead of displaying or guessing one.
 */
export function formatProgramMedium(
  medium: string | null | undefined,
  countrySlug?: string | null,
): string | null {
  if (isPlaceholderProgramMedium(medium)) {
    return null;
  }

  const value = (medium ?? "").trim();
  // Checked before the generic pattern below, which would otherwise swallow it.
  if (value === "English + Local Support") {
    const localLanguage = countrySlug
      ? LOCAL_LANGUAGE_BY_COUNTRY[countrySlug]
      : null;

    return localLanguage ? `English, ${localLanguage}` : "English + Local Support";
  }

  const englishSupportMatch = value.match(/^English \+ (.+) Support$/);
  if (englishSupportMatch?.[1]) {
    return `English, ${englishSupportMatch[1]}`;
  }

  if (
    value.length <= MAX_PROGRAM_MEDIUM_LABEL_LENGTH &&
    !SENTENCE_LIKE_MEDIUM.test(value)
  ) {
    return value;
  }

  const shortened =
    value.split(/\s*(?:\(|--|,|;|:|\.|\r|\n)\s*/)[0]?.trim() || value;
  return isPlaceholderProgramMedium(shortened) ? null : shortened;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function toTitleCase(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function clamp(input: number, min: number, max: number) {
  return Math.min(Math.max(input, min), max);
}

export function createSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}
