import Link from "next/link";
import { eq } from "drizzle-orm";
import {
  ArrowLeft, Calendar, CheckCircle2, Clock, ExternalLink,
  Globe, Mail, MapPin, Phone, User, XCircle, AlertCircle
} from "lucide-react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";
import { LeadDetailDeleteButton } from "../_components/leads-table";

const fmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric", month: "short", year: "numeric",
  hour: "numeric", minute: "2-digit",
});

const shortDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric", month: "short", year: "numeric",
});

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-slate-400">—</span>;

  const styles = {
    synced: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
    pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
    failed: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
    skipped: "bg-slate-50 text-slate-600 ring-1 ring-slate-600/20",
    read: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
    delivered: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20",
    sent: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20",
    accepted: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20",
    replied: "bg-violet-50 text-violet-700 ring-1 ring-violet-600/20",
  };

  const style = styles[status as keyof typeof styles] || "bg-slate-50 text-slate-600 ring-1 ring-slate-600/20";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {status === "synced" || status === "read" ? (
        <CheckCircle2 className="size-3" />
      ) : status === "pending" ? (
        <Clock className="size-3" />
      ) : status === "failed" ? (
        <XCircle className="size-3" />
      ) : (
        <AlertCircle className="size-3" />
      )}
      {status}
    </span>
  );
}

function InfoCard({
  title,
  children,
  icon: Icon,
  className = ""
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 ${className}`}>
      <div className="mb-4 flex items-center gap-2">
        {Icon && <Icon className="size-4 text-slate-400" />}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value, href }: { label: string; value: React.ReactNode; href?: string }) {
  if (!value && value !== 0 && value !== false) return null;

  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-medium text-slate-500 shrink-0">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline shrink-0"
        >
          View <ExternalLink className="size-3" />
        </a>
      ) : (
        <span className="text-sm font-medium text-slate-900 text-right break-words overflow-wrap-anywhere min-w-0">{value}</span>
      )}
    </div>
  );
}

async function LeadDetail({ id }: { id: string }) {
  await connection();
  const session = await requireAdminSession();

  const db = getDb();
  if (!db) notFound();

  const [lead] = await db.select().from(leads).where(eq(leads.id, Number(id))).limit(1);
  if (!lead) notFound();

  const isSeminarLead = lead.seminarEvent || lead.city || lead.interestedCountry;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to Leads
          </Link>

          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{lead.fullName}</h1>
                <span className="text-sm text-slate-400">#{lead.id}</span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" />
                  {lead.createdAt ? shortDate.format(lead.createdAt) : "—"}
                </span>
                {lead.sourcePath && (
                  <span className="flex items-center gap-1.5">
                    <Globe className="size-4" />
                    {lead.sourcePath}
                  </span>
                )}
              </div>
            </div>

            {session.user.adminRole === "owner" && (
              <LeadDetailDeleteButton leadId={lead.id} leadName={lead.fullName} />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Left Column */}
          <div className="space-y-6">

            {/* Contact Info */}
            <InfoCard title="Contact Information" icon={User}>
              <InfoRow label="Phone" value={lead.phone} />
              <InfoRow label="Email" value={lead.email} />
              <InfoRow label="State" value={lead.userState} />
              {lead.fatherName && <InfoRow label="Father's Name" value={lead.fatherName} />}
              {lead.alternatePhone && <InfoRow label="Alternate Phone" value={lead.alternatePhone} />}
            </InfoCard>

            {/* Seminar Details - Only if seminar lead */}
            {isSeminarLead && (
              <InfoCard title="Seminar Registration" icon={Calendar} className="border-blue-200 bg-blue-50/50">
                {lead.city && <InfoRow label="City" value={lead.city} />}
                {lead.seminarEvent && (
                  <InfoRow
                    label="Event"
                    value={<span className="text-blue-700 font-semibold">{lead.seminarEvent}</span>}
                  />
                )}
                {lead.interestedCountry && <InfoRow label="Country Interest" value={lead.interestedCountry} />}
                {lead.budgetRange && <InfoRow label="Budget" value={`₹${lead.budgetRange} Lakhs`} />}
                {lead.needsFmgeSession !== null && (
                  <InfoRow
                    label="1-on-1 FMGE Session"
                    value={lead.needsFmgeSession ? "Yes" : "No"}
                  />
                )}
                {lead.documentType && <InfoRow label="Document Type" value={lead.documentType} />}
                {lead.documentUrl && <InfoRow label="Document" value="View" href={lead.documentUrl} />}
              </InfoCard>
            )}

            {/* Interest */}
            {(lead.courseSlug || lead.countrySlug || lead.universitySlug) && (
              <InfoCard title="Interest" icon={Globe}>
                {lead.courseSlug && <InfoRow label="Course" value={lead.courseSlug} />}
                {lead.countrySlug && <InfoRow label="Country" value={lead.countrySlug} />}
                {lead.universitySlug && <InfoRow label="University" value={lead.universitySlug} />}
              </InfoCard>
            )}

            {/* Notes */}
            {lead.notes && (
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Notes</h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed break-words overflow-wrap-anywhere">{lead.notes}</p>
              </div>
            )}

          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Sync Status */}
            <InfoCard title="Sync Status" icon={CheckCircle2}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500">CRM</span>
                  <StatusBadge status={lead.crmSyncStatus} />
                </div>
                {lead.crmSyncedAt && (
                  <p className="text-xs text-slate-400">{fmt.format(lead.crmSyncedAt)}</p>
                )}
                {lead.crmExternalId && (
                  <p className="text-xs text-slate-400 mt-1 break-words overflow-wrap-anywhere">External ID: {lead.crmExternalId}</p>
                )}
                {lead.crmSyncError && (
                  <p className="mt-2 rounded-lg bg-red-50 p-2 text-xs text-red-700 break-words overflow-wrap-anywhere">{lead.crmSyncError}</p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500">Pabbly</span>
                  <StatusBadge status={lead.pabblySyncStatus} />
                </div>
                {lead.pabblySyncedAt && (
                  <p className="text-xs text-slate-400">{fmt.format(lead.pabblySyncedAt)}</p>
                )}
                {lead.pabblySyncError && (
                  <p className="mt-2 rounded-lg bg-red-50 p-2 text-xs text-red-700 break-words overflow-wrap-anywhere">{lead.pabblySyncError}</p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500">WhatsApp</span>
                  <StatusBadge status={lead.watiMessageStatus} />
                </div>
                {lead.watiTemplateName && (
                  <p className="text-xs text-slate-400 mb-2 break-words overflow-wrap-anywhere">Template: {lead.watiTemplateName}</p>
                )}

                {/* Event Timeline */}
                <div className="mt-3 space-y-2 border-l-2 border-slate-200 pl-3">
                  {lead.watiAcceptedAt && (
                    <div className="relative">
                      <div className="absolute -left-[13px] top-1 size-2 rounded-full bg-blue-500" />
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-600">Sent</span>
                        <span className="text-xs text-slate-400">{fmt.format(lead.watiAcceptedAt)}</span>
                      </div>
                    </div>
                  )}
                  {lead.watiDeliveredAt && (
                    <div className="relative">
                      <div className="absolute -left-[13px] top-1 size-2 rounded-full bg-blue-600" />
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-600">Delivered</span>
                        <span className="text-xs text-slate-400">{fmt.format(lead.watiDeliveredAt)}</span>
                      </div>
                    </div>
                  )}
                  {lead.watiReadAt && (
                    <div className="relative">
                      <div className="absolute -left-[13px] top-1 size-2 rounded-full bg-emerald-600" />
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-600">Read</span>
                        <span className="text-xs text-slate-400">{fmt.format(lead.watiReadAt)}</span>
                      </div>
                    </div>
                  )}
                  {lead.watiFailedAt && (
                    <div className="relative">
                      <div className="absolute -left-[13px] top-1 size-2 rounded-full bg-red-600" />
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-600">Failed</span>
                        <span className="text-xs text-slate-400">{fmt.format(lead.watiFailedAt)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {lead.watiMessageError && (
                  <p className="mt-2 rounded-lg bg-red-50 p-2 text-xs text-red-700 break-words overflow-wrap-anywhere">{lead.watiMessageError}</p>
                )}
              </div>
            </InfoCard>

            {/* UTM Parameters */}
            {(lead.utmSource || lead.utmMedium || lead.utmCampaign) && (
              <InfoCard title="UTM Tracking">
                {lead.utmSource && <InfoRow label="Source" value={lead.utmSource} />}
                {lead.utmMedium && <InfoRow label="Medium" value={lead.utmMedium} />}
                {lead.utmCampaign && <InfoRow label="Campaign" value={lead.utmCampaign} />}
                {lead.utmTerm && <InfoRow label="Term" value={lead.utmTerm} />}
                {lead.utmContent && <InfoRow label="Content" value={lead.utmContent} />}
                {lead.gclid && <InfoRow label="Google Click ID" value={lead.gclid} />}
                {lead.fbclid && <InfoRow label="Facebook Click ID" value={lead.fbclid} />}
              </InfoCard>
            )}

            {/* Source Details */}
            <InfoCard title="Source Details">
              {lead.ctaVariant && <InfoRow label="CTA Variant" value={lead.ctaVariant} />}
              {lead.sourcePath && <InfoRow label="Source Path" value={lead.sourcePath} />}
              {lead.sourceUrl && <InfoRow label="Source URL" value={lead.sourceUrl} />}
              {lead.referrer && <InfoRow label="Referrer" value={lead.referrer} />}
              {lead.pageTitle && <InfoRow label="Page Title" value={lead.pageTitle} />}
              {lead.visitorId && <InfoRow label="Visitor ID" value={lead.visitorId} />}
            </InfoCard>

            {/* Technical Info - Collapsed by default */}
            {(lead.ipAddress || lead.userAgent) && (
              <details className="rounded-xl border border-slate-200 bg-white">
                <summary className="cursor-pointer p-5 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:bg-slate-50">
                  Technical Details
                </summary>
                <div className="space-y-3 px-5 pb-5">
                  {lead.ipAddress && <InfoRow label="IP Address" value={lead.ipAddress} />}
                  {lead.acceptLanguage && <InfoRow label="Language" value={lead.acceptLanguage} />}
                  {lead.userAgent && (
                    <div className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <span className="text-xs font-medium text-slate-500">User Agent</span>
                      <p className="mt-1 text-xs text-slate-700 break-words overflow-wrap-anywhere">{lead.userAgent}</p>
                    </div>
                  )}
                </div>
              </details>
            )}

          </div>
        </div>

        {/* Full Width Sections */}
        {Object.keys(lead.clientContext ?? {}).length > 0 && (
          <details className="mt-6 rounded-xl border border-slate-200 bg-white">
            <summary className="cursor-pointer p-5 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:bg-slate-50">
              Client Context (JSON)
            </summary>
            <div className="px-5 pb-5">
              <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
                {JSON.stringify(lead.clientContext, null, 2)}
              </pre>
            </div>
          </details>
        )}

        {Object.keys(lead.sourceQuery ?? {}).length > 0 && (
          <details className="mt-6 rounded-xl border border-slate-200 bg-white">
            <summary className="cursor-pointer p-5 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:bg-slate-50">
              Source Query (JSON)
            </summary>
            <div className="px-5 pb-5">
              <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
                {JSON.stringify(lead.sourceQuery, null, 2)}
              </pre>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-slate-400">Loading lead details...</div>
      </div>
    }>
      <LeadDetailInner params={params} />
    </Suspense>
  );
}

async function LeadDetailInner({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LeadDetail id={id} />;
}
