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
      title: "Official admissions page",
      body: `The mapped official admissions page was reachable on ${audit.checkedAt}. Use it to confirm the active intake, application route, and any current university-side screening before you apply.`,
    };
  }

  if (audit.classification === "broken") {
    return {
      title: "Official admissions page needs re-check",
      body: `The mapped admissions URL returned ${audit.status ?? "an error"} on ${audit.checkedAt}. Verify the university's current international admissions page directly from the main official site before relying on older links or agent copies.`,
    };
  }

  if (audit.classification === "suspicious") {
    return {
      title: "Mapped page looks unsafe or unrelated",
      body: `The mapped admissions URL resolved on ${audit.checkedAt}, but the page content did not look like a legitimate university admissions page. Do not rely on that link until the official university route is re-verified.`,
    };
  }

  if (audit.classification === "missing") {
    return {
      title: "Official admissions page not mapped",
      body: "This page does not yet have a mapped university admissions URL in the catalog. Use the official university website to find the current foreign-applicant route before you apply.",
    };
  }

  return {
    title: "Official admissions page could not be checked",
    body: `The mapped admissions URL could not be verified automatically on ${audit.checkedAt}. Treat this as a reminder to confirm the active admissions route on the university's own site before paying any fee.`,
  };
}
