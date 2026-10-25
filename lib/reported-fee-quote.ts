/** Native-currency quote. Basis and provenance are retained internally, never inferred as annual tuition. */
export type ReportedFeeQuote = {
  currency: string;
  minAmount: number;
  maxAmount?: number;
  status: "confirmed" | "indicative";
  period: "semester" | "academic_year" | "first_year" | "full_course" | "other";
  componentBasis: string;
  audience?: "domestic" | "international" | "all";
  category?: string;
  academicYear: string;
  sourceUrl: string;
  sourceLabel: string;
  verifiedAt: string;
};

/** Fail closed for legacy/malformed JSON; this lightweight guard is also used by payload validation. */
export function parseReportedFeeQuote(value: unknown): ReportedFeeQuote | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const q = value as Record<string, unknown>;
  const text = (key: string, min: number, max: number) => typeof q[key] === "string" && (q[key] as string).trim().length >= min && (q[key] as string).length <= max;
  if (typeof q.currency !== "string" || !/^[A-Z]{3}$/.test(q.currency)) return undefined;
  if (typeof q.minAmount !== "number" || !Number.isSafeInteger(q.minAmount) || q.minAmount <= 0) return undefined;
  if (q.maxAmount !== undefined && (typeof q.maxAmount !== "number" || !Number.isSafeInteger(q.maxAmount) || q.maxAmount < q.minAmount)) return undefined;
  if (q.status !== "confirmed" && q.status !== "indicative") return undefined;
  if (!["semester", "academic_year", "first_year", "full_course", "other"].includes(q.period as string)) return undefined;
  if (!text("componentBasis", 10, 800) || !text("academicYear", 4, 40) || !text("sourceLabel", 3, 180)) return undefined;
  if (q.category !== undefined && !text("category", 2, 200)) return undefined;
  if (q.audience !== undefined && !["domestic", "international", "all"].includes(q.audience as string)) return undefined;
  if (typeof q.sourceUrl !== "string" || q.sourceUrl.length > 2000) return undefined;
  try { if (!["https:", "http:"].includes(new URL(q.sourceUrl).protocol)) return undefined; } catch { return undefined; }
  if (typeof q.verifiedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(q.verifiedAt) || Number.isNaN(Date.parse(q.verifiedAt)) || new Date(q.verifiedAt).toISOString().slice(0, 10) !== q.verifiedAt) return undefined;
  return {
    currency: q.currency, minAmount: q.minAmount, status: q.status, period: q.period as ReportedFeeQuote["period"],
    componentBasis: q.componentBasis as string, academicYear: q.academicYear as string,
    sourceUrl: q.sourceUrl, sourceLabel: q.sourceLabel as string, verifiedAt: q.verifiedAt,
    ...(q.maxAmount !== undefined ? { maxAmount: q.maxAmount as number } : {}),
    ...(q.category !== undefined ? { category: q.category as string } : {}),
    ...(q.audience !== undefined ? { audience: q.audience as ReportedFeeQuote["audience"] } : {}),
  };
}
