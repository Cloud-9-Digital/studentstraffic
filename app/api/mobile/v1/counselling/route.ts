import { headers } from "next/headers";

import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { mobileError, mobileJson, mobileValidationError, readJson } from "@/lib/mobile/http";
import { mobileCounsellingSchema } from "@/lib/mobile/schemas";

export async function POST(request: Request) {
  const parsed = mobileCounsellingSchema.safeParse(await readJson(request));
  if (!parsed.success) return mobileValidationError(parsed.error);

  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);

  const headerStore = await headers();
  const [lead] = await db
    .insert(leads)
    .values({
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      userState: parsed.data.userState,
      neetScore: parsed.data.neetScore ?? null,
      courseSlug: parsed.data.courseSlug || null,
      countrySlug: parsed.data.countrySlug || null,
      universitySlug: parsed.data.universitySlug || null,
      sourcePath: "mobile-app",
      sourceUrl: "studentstraffic://mobile",
      sourceQuery: {},
      pageTitle: "Mobile counselling request",
      ctaVariant: "mobile_counselling",
      notes: parsed.data.notes || null,
      userAgent: headerStore.get("user-agent"),
      acceptLanguage: headerStore.get("accept-language"),
      clientContext: { channel: "mobile_app" },
      crmSyncStatus: env.hasCrmLeadSyncConfig ? "pending" : "skipped",
      pabblySyncStatus: env.hasPabblyLeadWebhook ? "pending" : "skipped",
      createdAt: new Date(),
    })
    .returning({ id: leads.id });

  return mobileJson({ success: true, leadId: lead.id }, { status: 201 });
}
