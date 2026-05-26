import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCap, MessageCircle, ClipboardList } from "lucide-react";

import { auth } from "@/lib/auth";
import { getSafeCallbackPath } from "@/lib/auth/safe-callback";
import { RegisterForm } from "@/components/register/register-form";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const [session, { callbackUrl }] = await Promise.all([auth(), searchParams]);
  if (session?.user) redirect(getSafeCallbackPath(callbackUrl) ?? "/dashboard");

  const safeCallback = getSafeCallbackPath(callbackUrl);

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
            <Image src="/logo-white.png" alt="Students Traffic" width={180} height={44} className="h-9 w-auto object-contain" />
          </Link>

          <div className="space-y-10">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#7ccfbf]">
                Join thousands of students
              </p>
              <h1 className="text-[2.6rem] font-bold leading-[1.15] tracking-tight text-white">
                Create your free<br />
                <span className="text-[#7ccfbf]">account today.</span>
              </h1>
              <p className="max-w-sm text-[15px] leading-relaxed text-[#7aada8]">
                Get access to verified university profiles, expert counselling, and a personalised application tracker — all for free.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: GraduationCap, text: "1,000+ verified university profiles" },
                { icon: MessageCircle, text: "Free counselling from MBBS experts" },
                { icon: ClipboardList, text: "Track applications end-to-end" },
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

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="size-3.5 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-[#c0ddd9]">
              "I found my university in under 10 minutes. The counselling team was incredibly helpful throughout my application."
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-full bg-[#155e53] text-xs font-bold text-white">R</div>
              <div>
                <p className="text-xs font-semibold text-white">Rahul Mehta</p>
                <p className="text-[11px] text-[#7aada8]">MBBS student, Tbilisi State Medical University</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: form panel ─────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12">
        <Link href="/" className="mb-10 lg:hidden">
          <Image src="/logo.webp" alt="Students Traffic" width={160} height={40} className="h-8 w-auto object-contain" />
        </Link>

        <div className="w-full max-w-[360px]">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-[#0f1f1c]">Create an account</h2>
            <p className="mt-1 text-sm text-[#6b7280]">Start your study abroad journey today</p>
          </div>

          <RegisterForm callbackUrl={safeCallback} />

          <p className="mt-6 text-center text-sm text-[#6b7280]">
            Already have an account?{" "}
            <Link
              href={safeCallback ? `/login?callbackUrl=${encodeURIComponent(safeCallback)}` : "/login"}
              className="font-semibold text-[#0f3d37] hover:underline"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-[#9ca3af]">
            By registering, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-[#0f3d37]">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline hover:text-[#0f3d37]">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
