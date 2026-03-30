import Link from "next/link";
import Image from "next/image";
import { eq } from "drizzle-orm";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { notFound } from "next/navigation";

import { ApplicationReviewActions } from "@/components/admin/application-review-actions";
import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { studentPeerApplications, universities } from "@/lib/db/schema";

export default async function PeerApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();

  const { id } = await params;
  const applicationId = parseInt(id, 10);
  if (isNaN(applicationId)) notFound();

  const db = getDb();
  if (!db) notFound();

  const [application] = await db
    .select({
      id: studentPeerApplications.id,
      fullName: studentPeerApplications.fullName,
      email: studentPeerApplications.email,
      phone: studentPeerApplications.phone,
      photoUrl: studentPeerApplications.photoUrl,
      courseName: studentPeerApplications.courseName,
      currentYearOrBatch: studentPeerApplications.currentYearOrBatch,
      enrollmentStatus: studentPeerApplications.enrollmentStatus,
      proofUrl: studentPeerApplications.proofUrl,
      message: studentPeerApplications.message,
      status: studentPeerApplications.status,
      reviewNotes: studentPeerApplications.reviewNotes,
      createdAt: studentPeerApplications.createdAt,
      universityName: universities.name,
    })
    .from(studentPeerApplications)
    .innerJoin(
      universities,
      eq(studentPeerApplications.universityId, universities.id)
    )
    .where(eq(studentPeerApplications.id, applicationId))
    .limit(1);

  if (!application) notFound();

  const enrollmentLabel =
    application.enrollmentStatus === "current_student"
      ? "Currently studying"
      : "Alumnus / graduated";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin/peer-applications"
          className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0b312b]"
        >
          <ArrowLeft className="size-4" />
          Back to applications
        </Link>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Student application
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-[#0b312b]">
          {application.fullName}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Applied{" "}
          {application.createdAt
            ? new Date(application.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "—"}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
        {application.photoUrl && (
          <div className="flex items-start gap-4 px-6 py-4">
            <span className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Photo
            </span>
            <div className="relative size-16 overflow-hidden rounded-xl border border-slate-200">
              <Image
                src={application.photoUrl}
                alt={application.fullName}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          </div>
        )}
        <Field label="University" value={application.universityName} />
        <Field label="Enrollment status" value={enrollmentLabel} />
        {(application.courseName || application.currentYearOrBatch) && (
          <Field
            label="Course / Year"
            value={[application.courseName, application.currentYearOrBatch]
              .filter(Boolean)
              .join(" · ")}
          />
        )}
        <Field label="Email" value={application.email} />
        <Field label="Phone / WhatsApp" value={application.phone} />
        <div className="flex items-start gap-4 px-6 py-4">
          <span className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Proof
          </span>
          <div className="space-y-2">
            {application.proofUrl.match(/\.(jpg|jpeg|png|webp)(\?|$)/i) ? (
              <div className="relative h-40 w-64 overflow-hidden rounded-xl border border-slate-200">
                <Image
                  src={application.proofUrl}
                  alt="Proof of enrollment"
                  fill
                  sizes="256px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <FileText className="size-5 text-rose-500 shrink-0" />
                <span className="text-sm text-slate-600">PDF document</span>
              </div>
            )}
            <a
              href={application.proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-[#155e53] hover:underline"
            >
              Open full size
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
        {application.message && (
          <Field label="Message" value={application.message} />
        )}
        <div className="flex items-start gap-4 px-6 py-4">
          <span className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Status
          </span>
          <StatusBadge status={application.status} />
        </div>
        {application.reviewNotes && (
          <Field label="Review notes" value={application.reviewNotes} />
        )}
      </div>

      {application.status === "pending" && (
        <ApplicationReviewActions applicationId={applicationId} />
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4 px-6 py-4">
      <span className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="text-sm text-slate-800">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
        Pending review
      </span>
    );
  }
  if (status === "approved") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
        Approved — peer profile created
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
      Rejected
    </span>
  );
}
