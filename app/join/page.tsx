import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCap, MessageCircle, Star } from "lucide-react";
import { asc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { countries, universities, users } from "@/lib/db/schema";
import { JoinFlow } from "@/components/site/join-flow";

export const metadata: Metadata = {
  title: "Help Other Students — Become a Guide | Students Traffic",
  description:
    "Are you studying MBBS abroad? Help fellow Indian students make the right choice. Share your experience and get listed on our platform.",
};

export default async function JoinPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/register?callbackUrl=/join");
  }

  const db = getDb();
  let hasPhone = false;
  let universityList: { id: number; name: string; countryId: number; countryName: string }[] = [];

  if (db) {
    const [userResult, uniRows] = await Promise.all([
      db.select({ phone: users.phone }).from(users).where(eq(users.id, session.user.id)).limit(1),
      db
        .select({
          id: universities.id,
          name: universities.name,
          countryId: universities.countryId,
          countryName: countries.name,
        })
        .from(universities)
        .innerJoin(countries, eq(universities.countryId, countries.id))
        .where(eq(universities.published, true))
        .orderBy(asc(universities.name)),
    ]);
    hasPhone = !!userResult[0]?.phone;
    universityList = uniRows;
  }

  return (
    <div className="flex min-h-screen">
      {/* ── Left: brand panel ─────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-[44%] flex-col overflow-hidden bg-[#0b2e2a]">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-32 -left-32 size-[500px] rounded-full bg-[#155e53]/50 blur-[120px]" />
        <div className="absolute bottom-0 right-0 size-[400px] rounded-full bg-[#c2410c]/15 blur-[100px]" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.png" alt="Students Traffic" className="h-9 w-auto object-contain" />
          </Link>

          <div className="space-y-10">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#7ccfbf]">
                Help other students
              </p>
              <h1 className="text-[2.4rem] font-bold leading-[1.15] tracking-tight text-white">
                Share what you know.<br />
                <span className="text-[#7ccfbf]">Help students choose right.</span>
              </h1>
              <p className="max-w-sm text-[15px] leading-relaxed text-[#7aada8]">
                You have been through it — the confusion, the research, the doubts. Now help the next batch of Indian students make the right choice.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: GraduationCap, text: "Get your profile listed on our platform for free" },
                { icon: MessageCircle, text: "Students can message you directly on WhatsApp" },
                { icon: Star,          text: "Build your reputation as a trusted guide" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#155e53]/50">
                    <Icon className="size-4 text-[#7ccfbf]" />
                  </div>
                  <span className="text-sm text-[#a8d5cf]">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div /> {/* spacer */}
        </div>
      </div>

      {/* ── Right: form panel ─────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12">
        <Link href="/" className="mb-10 lg:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.webp" alt="Students Traffic" className="h-8 w-auto object-contain" />
        </Link>

        <div className="w-full max-w-[420px]">
          <div className="mb-7 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-[#0f1f1c]">Apply to become a student guide</h2>
            <p className="mt-1 text-sm text-[#6b7280]">Fill in the details below and we will review your profile.</p>
          </div>

          <JoinFlow universities={universityList} hasPhone={hasPhone} />

          <p className="mt-6 text-center text-xs text-[#9ca3af]">
            Already a guide?{" "}
            <Link href="/dashboard" className="font-semibold text-[#0f3d37] hover:underline">
              Go to your dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
