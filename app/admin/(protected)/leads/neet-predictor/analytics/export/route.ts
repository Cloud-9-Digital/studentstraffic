import { and, desc, eq, gte, lt } from "drizzle-orm";
import { headers } from "next/headers";

import { getAdminSession, isAdminSession } from "@/lib/auth";
import { leads } from "@/lib/db/schema";
import { getDb } from "@/lib/db/server";
import { recordAdminAuditLog } from "@/lib/security/admin-audit";

const INDIA_TIME_ZONE = "Asia/Kolkata";
const NEET_PREDICTOR_SOURCE_PATH = "/neet-college-predictor";
const ANALYTICS_START_DATE = "2026-07-17";
const DAY_IN_MS = 86_400_000;

function getIndiaDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: INDIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function isValidDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
}

function clampDate(value: string | null, fallback: string, today: string) {
  const date = isValidDate(value) ? value! : fallback;
  if (date < ANALYTICS_START_DATE) return ANALYTICS_START_DATE;
  if (date > today) return today;
  return date;
}

function getIndiaDayBounds(value: string) {
  const start = new Date(`${value}T00:00:00+05:30`);
  return { start, end: new Date(start.getTime() + DAY_IN_MS) };
}

function formatIndiaTimestamp(value: Date | null) {
  if (!value || Number.isNaN(value.getTime())) return "";

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: INDIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(value);
}

function getCategoryGroup(category: string | null) {
  const normalized = category?.trim().toUpperCase() ?? "";
  if (normalized === "GENERAL") return "General";
  if (normalized.startsWith("OBC")) return "OBC";
  if (normalized === "SC") return "SC";
  if (normalized === "ST") return "ST";
  return "Other";
}

function getQualification(score: number | null, category: string | null) {
  const hasCategory = Boolean(category?.trim());
  const cutoff = category?.trim().toUpperCase() === "GENERAL" ? 213 : 177;

  if (score === null || !hasCategory) {
    return { cutoff, status: "Incomplete" };
  }

  return { cutoff, status: score >= cutoff ? "Qualified" : "Not qualified" };
}

function toCsvCell(value: unknown) {
  if (value === null || value === undefined) return '""';
  return `"${String(value).replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (session.user.adminRole !== "owner") {
    return new Response("Forbidden", { status: 403 });
  }

  const db = getDb();
  if (!db) return new Response("Database unavailable", { status: 503 });

  const url = new URL(request.url);
  const today = getIndiaDate();
  const clampedFrom = clampDate(url.searchParams.get("from"), ANALYTICS_START_DATE, today);
  const clampedTo = clampDate(url.searchParams.get("to"), today, today);
  const selectedFrom = clampedFrom <= clampedTo ? clampedFrom : clampedTo;
  const selectedTo = clampedFrom <= clampedTo ? clampedTo : clampedFrom;
  const { start } = getIndiaDayBounds(selectedFrom);
  const { end } = getIndiaDayBounds(selectedTo);

  const rows = await db
    .select({
      id: leads.id,
      createdAt: leads.createdAt,
      fullName: leads.fullName,
      phone: leads.phone,
      email: leads.email,
      city: leads.city,
      userState: leads.userState,
      neetScore: leads.neetScore,
      neetCategory: leads.neetCategory,
      sourceUrl: leads.sourceUrl,
      initialLandingUrl: leads.initialLandingUrl,
      initialReferrer: leads.initialReferrer,
      utmSource: leads.utmSource,
      utmMedium: leads.utmMedium,
      utmCampaign: leads.utmCampaign,
      utmTerm: leads.utmTerm,
      utmContent: leads.utmContent,
      gclid: leads.gclid,
      fbclid: leads.fbclid,
      gbraid: leads.gbraid,
      wbraid: leads.wbraid,
      crmSyncStatus: leads.crmSyncStatus,
      pabblySyncStatus: leads.pabblySyncStatus,
      leadSquaredSyncStatus: leads.leadSquaredSyncStatus,
    })
    .from(leads)
    .where(
      and(
        eq(leads.sourcePath, NEET_PREDICTOR_SOURCE_PATH),
        gte(leads.createdAt, start),
        lt(leads.createdAt, end),
      ),
    )
    .orderBy(desc(leads.createdAt));

  const csvHeaders = [
    "id",
    "createdAtIst",
    "createdAtUtc",
    "fullName",
    "phone",
    "email",
    "city",
    "state",
    "region",
    "neetScore",
    "neetCategory",
    "categoryGroup",
    "qualificationCutoff",
    "qualificationStatus",
    "utmSource",
    "utmMedium",
    "utmCampaign",
    "utmTerm",
    "utmContent",
    "gclid",
    "fbclid",
    "gbraid",
    "wbraid",
    "sourceUrl",
    "initialLandingUrl",
    "initialReferrer",
    "crmSyncStatus",
    "pabblySyncStatus",
    "leadSquaredSyncStatus",
  ];

  const csvLines = [
    csvHeaders.join(","),
    ...rows.map((row) => {
      const qualification = getQualification(row.neetScore, row.neetCategory);
      const region = row.userState?.trim().toLowerCase() === "tamil nadu"
        ? "Tamil Nadu"
        : "Other states";

      return [
        row.id,
        formatIndiaTimestamp(row.createdAt),
        row.createdAt?.toISOString() ?? "",
        row.fullName,
        row.phone,
        row.email,
        row.city,
        row.userState,
        region,
        row.neetScore,
        row.neetCategory,
        getCategoryGroup(row.neetCategory),
        qualification.cutoff,
        qualification.status,
        row.utmSource,
        row.utmMedium,
        row.utmCampaign,
        row.utmTerm,
        row.utmContent,
        row.gclid,
        row.fbclid,
        row.gbraid,
        row.wbraid,
        row.sourceUrl,
        row.initialLandingUrl,
        row.initialReferrer,
        row.crmSyncStatus,
        row.pabblySyncStatus,
        row.leadSquaredSyncStatus,
      ]
        .map(toCsvCell)
        .join(",");
    }),
  ];

  const headerStore = await headers();
  await recordAdminAuditLog({
    actorAdminId: session.user.adminUserId,
    actorEmail: session.user.email,
    action: "lead.export_csv",
    targetType: "lead",
    targetDisplay: "NEET predictor leads export",
    metadata: {
      rowCount: rows.length,
      sourcePath: NEET_PREDICTOR_SOURCE_PATH,
      from: selectedFrom,
      to: selectedTo,
    },
    headerSource: headerStore,
  });

  return new Response(`\uFEFF${csvLines.join("\n")}`, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="neet-predictor-leads-${selectedFrom}-to-${selectedTo}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
