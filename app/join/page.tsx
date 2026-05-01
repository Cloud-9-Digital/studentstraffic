import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { asc } from "drizzle-orm";

import { JoinForm } from "@/components/site/join-form";
import { getDb } from "@/lib/db/server";
import { universities } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Become a Student Guide | Students Traffic",
  description:
    "Are you studying MBBS abroad? Help fellow Indian students make the right choice. Share your experience and connect with aspiring students.",
};

async function getJoinUniversities() {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("student-peers");

  const db = getDb();

  if (!db) {
    return [] as Array<{ id: number; name: string }>;
  }

  return db
    .select({ id: universities.id, name: universities.name })
    .from(universities)
    .orderBy(asc(universities.name));
}

export default async function JoinPage() {
  const universityList = await getJoinUniversities();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#155e53]">
            Join the community
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-[#0b312b] sm:text-4xl">
            Become a student guide
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Currently studying or have studied MBBS abroad? Help Indian students
            make informed decisions — and get featured on our platform.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <JoinForm universities={universityList} />
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          We review all applications within 2–3 business days. You&apos;ll
          receive a confirmation email once approved.
        </p>
      </div>
    </main>
  );
}
