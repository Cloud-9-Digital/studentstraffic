import { desc } from "drizzle-orm";
import { headers } from "next/headers";

import { getAdminSession, isAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";
import { recordAdminAuditLog } from "@/lib/security/admin-audit";

function toCsvCell(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value).replaceAll('"', '""');
  return `"${stringValue}"`;
}

export async function GET() {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (session.user.adminRole !== "owner") {
    return new Response("Forbidden", { status: 403 });
  }

  const db = getDb();

  if (!db) {
    return new Response("Database unavailable", { status: 503 });
  }

  const rows = await db
    .select({
      id: leads.id,
      fullName: leads.fullName,
      phone: leads.phone,
      email: leads.email,
      userState: leads.userState,
      courseSlug: leads.courseSlug,
      countrySlug: leads.countrySlug,
      universitySlug: leads.universitySlug,
      sourcePath: leads.sourcePath,
      sourceUrl: leads.sourceUrl,
      pageTitle: leads.pageTitle,
      ctaVariant: leads.ctaVariant,
      utmSource: leads.utmSource,
      utmMedium: leads.utmMedium,
      utmCampaign: leads.utmCampaign,
      crmSyncStatus: leads.crmSyncStatus,
      pabblySyncStatus: leads.pabblySyncStatus,
      createdAt: leads.createdAt,
    })
    .from(leads)
    .orderBy(desc(leads.createdAt));

  const headerStore = await headers();
  await recordAdminAuditLog({
    actorAdminId: session.user.adminUserId,
    actorEmail: session.user.email,
    action: "lead.export_csv",
    targetType: "lead",
    targetDisplay: "studentstraffic leads export",
    metadata: {
      rowCount: rows.length,
    },
    headerSource: headerStore,
  });

  const csvHeaders = [
    "id",
    "createdAt",
    "fullName",
    "phone",
    "email",
    "userState",
    "courseSlug",
    "countrySlug",
    "universitySlug",
    "sourcePath",
    "sourceUrl",
    "pageTitle",
    "ctaVariant",
    "utmSource",
    "utmMedium",
    "utmCampaign",
    "crmSyncStatus",
    "pabblySyncStatus",
  ];

  const csvLines = [
    csvHeaders.join(","),
    ...rows.map((row) =>
      [
        row.id,
        row.createdAt?.toISOString() ?? "",
        row.fullName,
        row.phone,
        row.email,
        row.userState,
        row.courseSlug,
        row.countrySlug,
        row.universitySlug,
        row.sourcePath,
        row.sourceUrl,
        row.pageTitle,
        row.ctaVariant,
        row.utmSource,
        row.utmMedium,
        row.utmCampaign,
        row.crmSyncStatus,
        row.pabblySyncStatus,
      ]
        .map(toCsvCell)
        .join(",")
    ),
  ];

  return new Response(csvLines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="studentstraffic-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
