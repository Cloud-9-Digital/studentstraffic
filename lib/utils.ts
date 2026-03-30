import type { ProgramOffering } from "@/lib/data/types";

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
): value is number {
  return typeof value === "number" && value > 0 && Boolean(currencyCode);
}

export function hasRenderableProgramAnnualFee(
  offering: Pick<
    ProgramOffering,
    "annualTuitionUsd" | "officialAnnualTuitionAmount" | "officialFeeCurrency"
  >,
) {
  return (
    hasPublishedUsdAmount(offering.annualTuitionUsd) ||
    hasOfficialFeeAmount(
      offering.officialAnnualTuitionAmount,
      offering.officialFeeCurrency,
    )
  );
}

export function getProgramAnnualFeeLabel(
  offering: Pick<
    ProgramOffering,
    "annualTuitionUsd" | "officialAnnualTuitionAmount" | "officialFeeCurrency"
  >,
) {
  return hasOfficialFeeAmount(
    offering.officialAnnualTuitionAmount,
    offering.officialFeeCurrency,
  ) && !hasPublishedUsdAmount(offering.annualTuitionUsd)
    ? "Official annual fee"
    : hasPublishedUsdAmount(offering.annualTuitionUsd)
      ? "Annual tuition"
      : "Fee status";
}

export function formatProgramAnnualFee(
  offering: Pick<
    ProgramOffering,
    "annualTuitionUsd" | "officialAnnualTuitionAmount" | "officialFeeCurrency"
  >,
  fallback = "Check official fee",
) {
  if (hasPublishedUsdAmount(offering.annualTuitionUsd)) {
    return formatCurrencyUsd(offering.annualTuitionUsd);
  }

  if (
    hasOfficialFeeAmount(
      offering.officialAnnualTuitionAmount,
      offering.officialFeeCurrency,
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
