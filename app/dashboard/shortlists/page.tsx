import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { userShortlists, universities, countries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { BookmarkCheck, GraduationCap, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function ShortlistsPage() {
  const session = await auth();
  const db = getDb();

  let shortlists: Array<{
    id: number;
    universitySlug: string;
    notes: string | null;
    createdAt: Date;
    university: { name: string; city: string; logoUrl: string | null; coverImageUrl: string | null } | null;
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
        universityCoverImageUrl: universities.coverImageUrl,
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
        ? {
            name: r.universityName,
            city: r.universityCity ?? "",
            logoUrl: r.universityLogoUrl,
            coverImageUrl: r.universityCoverImageUrl,
          }
        : null,
      country: r.countryName ? { name: r.countryName } : null,
    }));
  }

  if (shortlists.length === 0) {
    return (
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1f1c]">My Shortlists</h1>
          <p className="mt-1 text-sm text-[#6b7280]">Universities you've saved to review later.</p>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-12 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-[#f0f7f5]">
              <BookmarkCheck className="size-8 text-[#0f3d37]" />
            </div>
            <div>
              <p className="text-base font-semibold text-[#0f1f1c]">No shortlists yet</p>
              <p className="mt-1 text-sm text-[#6b7280]">
                Browse universities and save the ones you're interested in. They'll appear here.
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1f1c]">My Shortlists</h1>
          <p className="mt-1 text-sm text-[#6b7280]">{shortlists.length} saved {shortlists.length === 1 ? "university" : "universities"}</p>
        </div>
        <Link
          href="/universities"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#374151] shadow-sm transition hover:border-[#0f3d37]/30 hover:text-[#0f3d37]"
        >
          <GraduationCap className="size-4" />
          Browse more
        </Link>
      </div>

      <div className="space-y-3">
        {shortlists.map(({ id, universitySlug, university, country, notes, createdAt }) => (
          <div
            key={id}
            className="group flex items-center gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm transition hover:border-[#0f3d37]/30 hover:shadow-md"
          >
            {/* Logo */}
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e5e7eb] bg-[#f9fafb]">
              {university?.logoUrl ? (
                <Image
                  src={university.logoUrl}
                  alt={university.name}
                  width={56}
                  height={56}
                  className="size-full object-contain p-1"
                />
              ) : (
                <GraduationCap className="size-6 text-[#9ca3af]" />
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <Link
                href={`/universities/${universitySlug}`}
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
              {notes && <p className="mt-1 text-xs text-[#9ca3af] italic line-clamp-1">{notes}</p>}
              <p className="mt-1 text-[10px] text-[#d1d5db]">
                Saved {new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/universities/${universitySlug}`}
                className="flex items-center gap-1.5 rounded-xl border border-[#e5e7eb] px-3 py-1.5 text-xs font-medium text-[#374151] transition hover:border-[#0f3d37]/30 hover:text-[#0f3d37]"
              >
                View
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
