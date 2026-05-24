import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { userShortlists, applications } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { BookmarkCheck, FileText, GraduationCap, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { label: "Browse universities", description: "Explore 1,000+ programs across 15+ countries", href: "/universities", icon: GraduationCap },
  { label: "View my shortlists",  description: "See universities you've saved for later",       href: "/dashboard/shortlists", icon: BookmarkCheck },
  { label: "My applications",     description: "Track the status of all your applications",      href: "/dashboard/applications", icon: FileText },
];

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  let shortlistCount = 0;
  let applicationCount = 0;

  const db = getDb();
  if (db && session?.user?.id) {
    const [shortlistResult, applicationResult] = await Promise.all([
      db.select({ count: count() }).from(userShortlists).where(eq(userShortlists.userId, session.user.id)),
      db.select({ count: count() }).from(applications).where(eq(applications.userId, session.user.id)),
    ]);
    shortlistCount = shortlistResult[0]?.count ?? 0;
    applicationCount = applicationResult[0]?.count ?? 0;
  }

  const stats = [
    { label: "Shortlisted universities", value: String(shortlistCount), icon: BookmarkCheck, href: "/dashboard/shortlists", color: "bg-blue-50 text-blue-600" },
    { label: "Applications",             value: String(applicationCount), icon: FileText,       href: "/dashboard/applications", color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-[#0f1f1c]">Welcome back, {firstName}</h1>
        <p className="mt-1 text-sm text-[#6b7280]">Here's an overview of your study abroad journey.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition hover:border-[#0f3d37]/30 hover:shadow-md"
          >
            <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
              <Icon className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0f1f1c]">{value}</p>
              <p className="text-sm text-[#6b7280]">{label}</p>
            </div>
            <ArrowRight className="ml-auto size-4 text-[#d1d5db] transition-transform group-hover:translate-x-0.5 group-hover:text-[#0f3d37]" />
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-[#0f1f1c]">Recent activity</h2>
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#f3f4f6]">
            <Clock className="size-5 text-[#9ca3af]" />
          </div>
          <p className="text-sm font-medium text-[#374151]">No activity yet</p>
          <p className="text-xs text-[#9ca3af]">Start by exploring universities and shortlisting your favourites.</p>
          <Link
            href="/universities"
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[#0f3d37] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#184a43]"
          >
            Browse universities
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[#0f1f1c]">Quick links</h2>
        <div className="space-y-2">
          {quickLinks.map(({ label, description, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 rounded-2xl border border-[#e5e7eb] bg-white px-5 py-4 shadow-sm transition hover:border-[#0f3d37]/30 hover:shadow-md"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f7f5]">
                <Icon className="size-5 text-[#0f3d37]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0f1f1c]">{label}</p>
                <p className="text-xs text-[#6b7280]">{description}</p>
              </div>
              <ArrowRight className="ml-auto size-4 shrink-0 text-[#d1d5db] transition-transform group-hover:translate-x-0.5 group-hover:text-[#0f3d37]" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
