import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { userShortlists, universities, countries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { BookmarkCheck, GraduationCap, MapPin, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Shortlists | Dashboard" };

export default async function ShortlistsPage() {
  const session = await auth();
  const db = getDb();

  let shortlists: Array<{
    id: number;
    universitySlug: string;
    notes: string | null;
    createdAt: Date;
    university: { name: string; city: string; logoUrl: string | null } | null;
    country: { name: string } | null;
  }> = [];

  if (db && session?.user?.id) {
    const rows = await db
      .select({
        id: userShortlists.id,
        universitySlug: universities.slug,
        notes: userShortlists.notes,
        createdAt: userShortlists.createdAt,
        universityName: universities.name,
        universityCity: universities.city,
        universityLogoUrl: universities.logoUrl,
        countryName: countries.name,
      })
      .from(userShortlists)
      .innerJoin(universities, eq(universities.id, userShortlists.universityId))
      .leftJoin(countries, eq(countries.id, universities.countryId))
      .where(eq(userShortlists.userId, session.user.id))
      .orderBy(userShortlists.createdAt);

    shortlists = rows.map((r) => ({
      id: r.id,
      universitySlug: r.universitySlug,
      notes: r.notes,
      createdAt: r.createdAt,
      university: r.universityName
        ? { name: r.universityName, city: r.universityCity ?? "", logoUrl: r.universityLogoUrl }
        : null,
      country: r.countryName ? { name: r.countryName } : null,
    }));
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1f1c]">My Shortlists</h1>
          <p className="mt-0.5 text-sm text-[#6b7280]">
            {shortlists.length === 0
              ? "Universities you've saved to review later."
              : `${shortlists.length} saved ${shortlists.length === 1 ? "university" : "universities"}`}
          </p>
        </div>
        <Link
          href="/universities"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#e5e7eb] bg-white px-3.5 py-2 text-sm font-medium text-[#374151] transition hover:border-[#0f3d37]/30 hover:text-[#0f3d37]"
        >
          <GraduationCap className="size-4" />
          <span className="hidden sm:inline">Browse more</span>
          <span className="sm:hidden">Browse</span>
        </Link>
      </div>

      {shortlists.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#f0f7f5]">
            <BookmarkCheck className="size-7 text-[#0f3d37]" />
          </div>
          <p className="text-base font-semibold text-[#0f1f1c]">No shortlists yet</p>
          <p className="mt-1 text-sm text-[#6b7280] max-w-xs mx-auto">
            Browse universities and save the ones you&apos;re interested in.
          </p>
          <Link
            href="/universities"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0f3d37] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#184a43]"
          >
            Browse universities
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-[#eaeaea]">
          {shortlists.map(({ id, universitySlug, university, country, notes, createdAt }) => (
            <div key={id} className="flex items-center gap-4 py-4">
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#eaeaea] bg-[#f9fafb]">
                {university?.logoUrl ? (
                  <Image
                    src={university.logoUrl}
                    alt={university.name ?? ""}
                    width={48}
                    height={48}
                    className="size-full object-contain p-1"
                  />
                ) : (
                  <GraduationCap className="size-5 text-[#9ca3af]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/university/${universitySlug}`}
                  className="text-sm font-semibold text-[#0f1f1c] hover:text-[#0f3d37] hover:underline"
                >
                  {university?.name ?? universitySlug}
                </Link>
                {(university?.city || country?.name) && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-[#6b7280]">
                    <MapPin className="size-3 shrink-0" />
                    {[university?.city, country?.name].filter(Boolean).join(", ")}
                  </p>
                )}
                {notes && <p className="mt-0.5 text-xs text-[#9ca3af] italic line-clamp-1">{notes}</p>}
                <p className="mt-0.5 text-[10px] text-[#c9c9c9]">
                  Saved {new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>

              <Link
                href={`/university/${universitySlug}`}
                className="shrink-0 flex items-center gap-1 text-xs font-medium text-[#374151] transition hover:text-[#0f3d37]"
              >
                <span className="hidden sm:inline">View</span>
                <ChevronRight className="size-4 text-[#c9c9c9]" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
