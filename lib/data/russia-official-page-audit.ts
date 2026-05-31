import auditData from "@/lib/data/russia-official-page-audit.json";

export type RussiaOfficialPageAuditClassification =
  | "ok"
  | "broken"
  | "suspicious"
  | "error"
  | "missing";

export type RussiaOfficialPageAudit = {
  slug: string;
  name: string;
  checkedAt: string;
  officialWebsite: string | null;
  officialProgramUrl: string | null;
  classification: RussiaOfficialPageAuditClassification;
  status: number | null;
  finalUrl: string | null;
  title: string;
  snippet: string;
};

const auditBySlug = new Map<string, RussiaOfficialPageAudit>(
  (auditData as RussiaOfficialPageAudit[]).map((item) => [item.slug, item]),
);

export function getRussiaOfficialPageAudit(slug: string) {
  return auditBySlug.get(slug) ?? null;
}

export function getRussiaOfficialPageAuditSummary(audit: RussiaOfficialPageAudit) {
  if (audit.classification === "ok") {
    return {
      title: "Official admissions route",
      body: "Use the university's official website to confirm the active intake, application route, and any current screening requirements before you apply.",
    };
  }

  return {
    title: "Official admissions route",
    body: "Confirm the current international admissions route directly on the university's official website before applying. Intake timelines and application steps can change each cycle.",
  };
}
