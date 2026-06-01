import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { applications, universities, countries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ChevronRight, Clock, FileText, GraduationCap, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Applications | Dashboard" };

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  draft:        { label: "Draft",        color: "text-[#9ca3af]",  dot: "bg-[#d1d5db]" },
  submitted:    { label: "Submitted",    color: "text-blue-600",   dot: "bg-blue-400"  },
  under_review: { label: "Under Review", color: "text-amber-600",  dot: "bg-amber-400" },
  accepted:     { label: "Accepted",     color: "text-emerald-600",dot: "bg-emerald-400"},
  rejected:     { label: "Rejected",     color: "text-red-500",    dot: "bg-red-400"   },
  waitlisted:   { label: "Waitlisted",   color: "text-violet-600", dot: "bg-violet-400"},
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

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0f1f1c]">My Applications</h1>
        <p className="mt-0.5 text-sm text-[#6b7280]">
          {apps.length === 0
            ? "Track the status of your university applications."
            : `${apps.length} ${apps.length === 1 ? "application" : "applications"}`}
        </p>
      </div>

      {apps.length === 0 ? (
        <>
          {/* How it works */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">How it works</p>
            <div className="divide-y divide-[#eaeaea]">
              {[
                { step: "1", title: "Shortlist universities", desc: "Save universities you're interested in" },
                { step: "2", title: "Start application",      desc: "Fill in your personal info and documents" },
                { step: "3", title: "Submit",                 desc: "We review and help you through the process" },
                { step: "4", title: "Get accepted",           desc: "Receive your admission letter" },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex items-center gap-4 py-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0f3d37] text-xs font-bold text-white">
                    {step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f1f1c]">{title}</p>
                    <p className="text-xs text-[#6b7280]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#f0f7f5]">
              <FileText className="size-7 text-[#0f3d37]" />
            </div>
            <p className="text-base font-semibold text-[#0f1f1c]">No applications yet</p>
            <p className="mt-1 text-sm text-[#6b7280]">
              Start by exploring universities and shortlisting your favourites.
            </p>
            <Link
              href="/universities"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0f3d37] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#184a43]"
            >
              <GraduationCap className="size-4" />
              Browse universities
            </Link>
          </div>
        </>
      ) : (
        <div className="divide-y divide-[#eaeaea]">
          {apps.map((app) => {
            const s = statusConfig[app.status] ?? statusConfig.draft;
            return (
              <div key={app.id} className="flex items-center gap-4 py-4">
                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#eaeaea] bg-[#f9fafb]">
                  {app.universityLogoUrl ? (
                    <Image
                      src={app.universityLogoUrl}
                      alt={app.universityName ?? ""}
                      width={48}
                      height={48}
                      className="size-full object-contain p-1"
                    />
                  ) : (
                    <GraduationCap className="size-5 text-[#9ca3af]" />
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
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${s.color}`}>
                      <span className={`size-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                    {app.submittedAt && (
                      <span className="flex items-center gap-0.5 text-[10px] text-[#c9c9c9]">
                        <Clock className="size-2.5" />
                        {new Date(app.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/university/${app.universitySlug}`}
                  className="shrink-0 text-[#c9c9c9] hover:text-[#0f3d37] transition"
                >
                  <ChevronRight className="size-5" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
