import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getSafeCallbackPath } from "@/lib/auth/safe-callback";
import { LoginForm } from "@/components/login/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;
  const safeCallbackUrl = getSafeCallbackPath(callbackUrl);

  if (session?.user) {
    redirect(safeCallbackUrl);
  }

  return (
    <div className="flex min-h-screen">
      {/* ── Left: brand panel ─────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-[44%] flex-col overflow-hidden bg-[#0b2e2a]">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute -top-32 -left-32 size-[500px] rounded-full bg-[#155e53]/50 blur-[120px]" />
        <div className="absolute bottom-0 right-0 size-[400px] rounded-full bg-[#c2410c]/15 blur-[100px]" />

        <div className="relative flex h-full flex-col justify-between p-12">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo-white.png"
              alt="Students Traffic"
              width={180}
              height={44}
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Hero text + stats */}
          <div className="space-y-10">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#7ccfbf]">
                Your study abroad companion
              </p>
              <h1 className="text-[2.6rem] font-bold leading-[1.15] tracking-tight text-white">
                Find the right university.<br />
                <span className="text-[#7ccfbf]">Start your journey.</span>
              </h1>
              <p className="max-w-sm text-[15px] leading-relaxed text-[#7aada8]">
                Compare MBBS programs across 15+ countries, get free expert counselling, and manage your entire application in one place.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "1,000+", label: "Universities" },
                { value: "15+", label: "Countries" },
                { value: "10K+", label: "Students helped" },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="mt-0.5 text-xs text-[#7aada8]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="size-3.5 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-[#c0ddd9]">
              "Students Traffic made it so easy to compare universities in Russia and Kazakhstan. Got into my first choice with their help!"
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-full bg-[#155e53] text-xs font-bold text-white">
                P
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Priya Sharma</p>
                <p className="text-[11px] text-[#7aada8]">MBBS student, Kazan Federal University</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: form panel ──────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12">
        {/* Mobile logo */}
        <Link href="/" className="mb-10 lg:hidden">
          <Image src="/logo.webp" alt="Students Traffic" width={160} height={40} className="h-8 w-auto object-contain" />
        </Link>

        <div className="w-full max-w-[360px]">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error === "OAuthAccountNotLinked"
                ? "This email is linked to a different sign-in method."
                : "Something went wrong. Please try again."}
            </div>
          )}

          <LoginForm callbackUrl={safeCallbackUrl} />

          <p className="mt-8 text-center text-xs text-[#9ca3af]">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="hover:text-[#0f3d37] underline underline-offset-2">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="hover:text-[#0f3d37] underline underline-offset-2">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
