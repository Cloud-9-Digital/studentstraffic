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

export function hasPublishedUsdAmount(
  value: number | null | undefined
): value is number {
  return typeof value === "number" && value > 0;
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
