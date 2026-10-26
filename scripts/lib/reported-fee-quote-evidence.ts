import type { ReportedFeeQuote } from "../../lib/reported-fee-quote";

type QuoteEvidence = { publicField: string; sourceUrl: string; sourceGrade: string; status: string };

export function assertReportedFeeQuoteEvidence(quote: ReportedFeeQuote, evidence: readonly QuoteEvidence[], context: string) {
  const supported = evidence.some((item) =>
    item.publicField === "reportedFeeQuote" && item.sourceUrl === quote.sourceUrl &&
    (quote.status === "confirmed"
      ? item.sourceGrade === "A" && item.status === "verified"
      : item.status === "indicative"),
  );
  if (!supported) throw new Error(`${context} needs matching ${quote.status === "confirmed" ? "Grade A verified" : "indicative"} reportedFeeQuote evidence.`);
}
