import Link from "next/link";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";

const fmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric", month: "long", year: "numeric",
  hour: "numeric", minute: "2-digit", timeZoneName: "short",
});

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-800 break-words">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#0b312b]/60">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

async function LeadDetail({ id }: { id: string }) {
  await connection();

  const db = getDb();
  if (!db) notFound();

  const [lead] = await db.select().from(leads).where(eq(leads.id, Number(id))).limit(1);
  if (!lead) notFound();

  const syncTone = (status: string | null) =>
    status === "synced" ? "text-emerald-700" :
    status === "failed" ? "text-red-600" :
    status === "pending" ? "text-amber-600" : "text-slate-500";

  return (
    <div className="space-y-4">
      <div>
        <Link href="/admin/leads" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0b312b]">
          <ArrowLeft className="size-4" /> Leads
        </Link>
        <h1 className="mt-3 font-display text-2xl font-semibold text-[#0b312b] md:text-3xl">{lead.fullName}</h1>
        <p className="mt-1 text-sm text-slate-400">{lead.createdAt ? fmt.format(lead.createdAt) : "—"} · Lead #{lead.id}</p>
      </div>

      <Section title="Contact">
        <Field label="Full name" value={lead.fullName} />
        <Field label="Phone" value={lead.phone} />
        <Field label="Email" value={lead.email} />
        <Field label="State" value={lead.userState} />
      </Section>

      <Section title="Interest">
        <Field label="Course" value={lead.courseSlug} />
        <Field label="Country" value={lead.countrySlug} />
        <Field label="University" value={lead.universitySlug} />
      </Section>

      <Section title="Source">
        <Field label="CTA variant" value={lead.ctaVariant} />
        <Field label="Source path" value={lead.sourcePath} />
        <Field label="Source URL" value={lead.sourceUrl} />
        <Field label="Visitor ID" value={lead.visitorId} />
        <Field label="Page title" value={lead.pageTitle} />
        <Field label="Document referrer" value={lead.documentReferrer} />
        <Field label="Referrer" value={lead.referrer} />
      </Section>

      <Section title="UTM parameters">
        <Field label="utm_source" value={lead.utmSource} />
        <Field label="utm_medium" value={lead.utmMedium} />
        <Field label="utm_campaign" value={lead.utmCampaign} />
        <Field label="utm_term" value={lead.utmTerm} />
        <Field label="utm_content" value={lead.utmContent} />
        <Field label="gclid" value={lead.gclid} />
        <Field label="fbclid" value={lead.fbclid} />
        <Field label="gbraid" value={lead.gbraid} />
        <Field label="wbraid" value={lead.wbraid} />
        <Field label="ttclid" value={lead.ttclid} />
      </Section>

      <Section title="First touch">
        <Field label="Initial landing path" value={lead.initialLandingPath} />
        <Field label="Initial landing URL" value={lead.initialLandingUrl} />
        <Field label="Initial referrer" value={lead.initialReferrer} />
        <Field label="Initial UTM landing URL" value={lead.initialUtmLandingUrl} />
      </Section>

      <Section title="CRM sync">
        <Field label="Status" value={<span className={syncTone(lead.crmSyncStatus)}>{lead.crmSyncStatus}</span>} />
        <Field label="Synced at" value={lead.crmSyncedAt ? fmt.format(lead.crmSyncedAt) : undefined} />
        <Field label="External ID" value={lead.crmExternalId} />
        <Field label="Error" value={lead.crmSyncError} />
      </Section>

      <Section title="Pabbly sync">
        <Field label="Status" value={<span className={syncTone(lead.pabblySyncStatus)}>{lead.pabblySyncStatus}</span>} />
        <Field label="Synced at" value={lead.pabblySyncedAt ? fmt.format(lead.pabblySyncedAt) : undefined} />
        <Field label="Error" value={lead.pabblySyncError} />
      </Section>

      <Section title="Technical">
        <Field label="IP address" value={lead.ipAddress} />
        <Field label="Accept language" value={lead.acceptLanguage} />
        <Field label="User agent" value={lead.userAgent} />
      </Section>

      {lead.notes && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#0b312b]/60">Notes</h2>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{lead.notes}</p>
        </div>
      )}

      {Object.keys(lead.clientContext ?? {}).length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#0b312b]/60">Client context</h2>
          <pre className="overflow-x-auto rounded-xl bg-slate-50 p-4 text-xs text-slate-600">{JSON.stringify(lead.clientContext, null, 2)}</pre>
        </div>
      )}

      {Object.keys(lead.sourceQuery ?? {}).length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#0b312b]/60">Source query</h2>
          <pre className="overflow-x-auto rounded-xl bg-slate-50 p-4 text-xs text-slate-600">{JSON.stringify(lead.sourceQuery, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-400">Loading…</div>}>
      <LeadDetailInner params={params} />
    </Suspense>
  );
}

async function LeadDetailInner({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LeadDetail id={id} />;
}
