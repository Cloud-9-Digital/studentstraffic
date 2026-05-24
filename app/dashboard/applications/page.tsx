import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { applications, universities, countries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { FileText, GraduationCap, MapPin, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  draft:       { label: "Draft",       color: "text-[#9ca3af]",   bg: "bg-[#f3f4f6]" },
  submitted:   { label: "Submitted",   color: "text-[#2563eb]",   bg: "bg-blue-50" },
  under_review:{ label: "Under Review",color: "text-[#d97706]",   bg: "bg-amber-50" },
  accepted:    { label: "Accepted",    color: "text-[#16a34a]",   bg: "bg-green-50" },
  rejected:    { label: "Rejected",    color: "text-[#dc2626]",   bg: "bg-red-50" },
  waitlisted:  { label: "Waitlisted",  color: "text-[#7c3aed]",   bg: "bg-violet-50" },
};

export default async function ApplicationsPage() {
  const session = await auth();
  const db = getDb();

  let apps: Array<{
    id: number;
    universitySlug: string;
    courseSlug: string;
    status: string;
    submittedAt: Date | null;
    createdAt: Date;
    universityName: string | null;
    universityLogoUrl: string | null;
    countryName: string | null;
    universityCity: string | null;
  }> = [];

  if (db && session?.user?.id) {
    const rows = await db
      .select({
        id: applications.id,
        universitySlug: applications.universitySlug,
        courseSlug: applications.courseSlug,
        status: applications.status,
        submittedAt: applications.submittedAt,
        createdAt: applications.createdAt,
        universityName: universities.name,
        universityLogoUrl: universities.logoUrl,
        universityCity: universities.city,
        countryName: countries.name,
      })
      .from(applications)
      .leftJoin(universities, eq(universities.slug, applications.universitySlug))
      .leftJoin(countries, eq(countries.id, universities.countryId))
      .where(eq(applications.userId, session.user.id))
      .orderBy(applications.createdAt);

    apps = rows;
  }

  if (apps.length === 0) {
    return (
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1f1c]">My Applications</h1>
          <p className="mt-1 text-sm text-[#6b7280]">Track the status of your university applications.</p>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-semibold text-[#0f1f1c]">How applications work</h2>
          <div className="relative flex flex-col gap-0 sm:flex-row sm:gap-0">
            {[
              { step: "1", title: "Shortlist universities", desc: "Save universities you're interested in" },
              { step: "2", title: "Start application", desc: "Fill in your personal info and documents" },
              { step: "3", title: "Submit", desc: "We review and help you through the process" },
              { step: "4", title: "Get accepted", desc: "Receive your admission letter" },
            ].map(({ step, title, desc }, i, arr) => (
              <div key={step} className="flex flex-1 items-start gap-3 sm:flex-col sm:items-center sm:text-center">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0f3d37] text-xs font-bold text-white">
                  {step}
                </div>
                <div className="flex-1 sm:flex-none">
                  <p className="text-sm font-semibold text-[#0f1f1c]">{title}</p>
                  <p className="text-xs text-[#6b7280]">{desc}</p>
                </div>
                {i < arr.length - 1 && (
                  <ChevronRight className="hidden shrink-0 text-[#d1d5db] sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-12 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-[#f0f7f5]">
              <FileText className="size-8 text-[#0f3d37]" />
            </div>
            <div>
              <p className="text-base font-semibold text-[#0f1f1c]">No applications yet</p>
              <p className="mt-1 text-sm text-[#6b7280]">
                Start by exploring universities and shortlisting your favourites.
              </p>
            </div>
            <Link
              href="/universities"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#0f3d37] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#184a43]"
            >
              <GraduationCap className="size-4" />
              Browse universities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f1f1c]">My Applications</h1>
        <p className="mt-1 text-sm text-[#6b7280]">{apps.length} {apps.length === 1 ? "application" : "applications"}</p>
      </div>

      <div className="space-y-3">
        {apps.map((app) => {
          const s = statusConfig[app.status] ?? statusConfig.draft;
          return (
            <div
              key={app.id}
              className="flex items-center gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm transition hover:border-[#0f3d37]/30 hover:shadow-md"
            >
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e5e7eb] bg-[#f9fafb]">
                {app.universityLogoUrl ? (
                  <Image
                    src={app.universityLogoUrl}
                    alt={app.universityName ?? ""}
                    width={56}
                    height={56}
                    className="size-full object-contain p-1"
                  />
                ) : (
                  <GraduationCap className="size-6 text-[#9ca3af]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#0f1f1c]">{app.universityName ?? app.universitySlug}</p>
                {(app.universityCity || app.countryName) && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-[#6b7280]">
                    <MapPin className="size-3 shrink-0" />
                    {[app.universityCity, app.countryName].filter(Boolean).join(", ")}
                  </p>
                )}
                <p className="mt-0.5 text-xs capitalize text-[#9ca3af]">{app.courseSlug.replace(/-/g, " ")}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.bg} ${s.color}`}>
                    {s.label}
                  </span>
                  {app.submittedAt && (
                    <span className="flex items-center gap-0.5 text-[10px] text-[#d1d5db]">
                      <Clock className="size-2.5" />
                      Submitted {new Date(app.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  )}
                </div>
              </div>

              <Link
                href={`/universities/${app.universitySlug}`}
                className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[#e5e7eb] px-3 py-1.5 text-xs font-medium text-[#374151] transition hover:border-[#0f3d37]/30 hover:text-[#0f3d37]"
              >
                View
                <ChevronRight className="size-3" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
