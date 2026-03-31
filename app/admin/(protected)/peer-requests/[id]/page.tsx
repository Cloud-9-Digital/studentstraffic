import Link from "next/link";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { getDb } from "@/lib/db/server";
import { peerRequests, universities } from "@/lib/db/schema";

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

const statusTone: Record<string, string> = {
  new: "border-blue-200 bg-blue-50 text-blue-700",
  contacted: "border-amber-200 bg-amber-50 text-amber-700",
  matched: "border-emerald-200 bg-emerald-50 text-emerald-700",
  closed: "border-slate-200 bg-slate-100 text-slate-600",
};

async function PeerRequestDetail({ id }: { id: string }) {
  await connection();

  const db = getDb();
  if (!db) notFound();

  const [row] = await db
    .select({
      req: peerRequests,
      universityName: universities.name,
      universitySlug: universities.slug,
    })
    .from(peerRequests)
    .innerJoin(universities, eq(peerRequests.universityId, universities.id))
    .where(eq(peerRequests.id, Number(id)))
    .limit(1);

  if (!row) notFound();
  const { req, universityName, universitySlug } = row;

  return (
    <div className="space-y-4">
      {/* Back + header */}
      <div>
        <Link href="/admin/peer-requests" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0b312b]">
          <ArrowLeft className="size-4" /> Peer Requests
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-[#0b312b] md:text-3xl">{req.fullName}</h1>
            <p className="mt-1 text-sm text-slate-400">
              Requesting a peer at{" "}
              <a href={`/universities/${universitySlug}`} target="_blank" rel="noreferrer" className="text-[#0b312b] hover:underline">
                {universityName}
              </a>
              {" "}· Request #{req.id}
            </p>
          </div>
          <Badge variant="outline" className={`rounded-full px-3 py-1 text-sm capitalize ${statusTone[req.status] ?? "border-slate-200 bg-slate-50 text-slate-600"}`}>
            {req.status}
          </Badge>
        </div>
      </div>

      <Section title="Contact">
        <Field label="Full name" value={req.fullName} />
        <Field label="Phone" value={req.phone} />
        <Field label="Email" value={req.email} />
        <Field label="State" value={req.userState} />
      </Section>

      <Section title="Interest">
        <Field label="University" value={
          <a href={`/universities/${universitySlug}`} target="_blank" rel="noreferrer" className="text-[#0b312b] hover:underline">
            {universityName}
          </a>
        } />
        <Field label="Course interest" value={req.courseInterest} />
        <Field label="Language preference" value={req.languagePreference} />
        <Field label="District" value={req.userDistrict} />
      </Section>

      {req.message && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#0b312b]/60">Message</h2>
          <p className="text-sm leading-7 text-slate-700 whitespace-pre-wrap">{req.message}</p>
        </div>
      )}

      <Section title="Source">
        <Field label="Source path" value={req.sourcePath} />
        <Field label="Source URL" value={req.sourceUrl} />
        <Field label="Page title" value={req.pageTitle} />
        <Field label="Document referrer" value={req.documentReferrer} />
      </Section>

      <Section title="System">
        <Field label="Status" value={req.status} />
        <Field label="Lead ID" value={req.leadId} />
        <Field label="Matched peer ID" value={req.matchedPeerId} />
        <Field label="Created" value={req.createdAt ? fmt.format(req.createdAt) : undefined} />
        <Field label="Updated" value={req.updatedAt ? fmt.format(req.updatedAt) : undefined} />
      </Section>

      <Section title="Technical">
        <Field label="IP address" value={req.ipAddress} />
        <Field label="Accept language" value={req.acceptLanguage} />
        <Field label="User agent" value={req.userAgent} />
      </Section>

      {Object.keys(req.clientContext ?? {}).length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#0b312b]/60">Client context</h2>
          <pre className="overflow-x-auto rounded-xl bg-slate-50 p-4 text-xs text-slate-600">{JSON.stringify(req.clientContext, null, 2)}</pre>
        </div>
      )}

      {Object.keys(req.sourceQuery ?? {}).length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#0b312b]/60">Source query</h2>
          <pre className="overflow-x-auto rounded-xl bg-slate-50 p-4 text-xs text-slate-600">{JSON.stringify(req.sourceQuery, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default function PeerRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-400">Loading…</div>}>
      <PeerRequestDetailInner params={params} />
    </Suspense>
  );
}

async function PeerRequestDetailInner({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PeerRequestDetail id={id} />;
}
