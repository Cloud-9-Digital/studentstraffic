import Image from "next/image";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getAdminSession, isAdminSession } from "@/lib/auth";
import { env } from "@/lib/env";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await getAdminSession();
  const { callbackUrl } = await searchParams;

  if (isAdminSession(session)) {
    redirect(callbackUrl || "/admin");
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-white lg:flex-row">

      {/* ── Brand panel — desktop only ──────────────────────────────────────── */}
      <div className="relative hidden overflow-hidden bg-[#0b312b] lg:flex lg:w-[52%] lg:flex-col">
        {/* Grid texture */}
        <div className="hero-grid-lines absolute inset-0 opacity-60" />

        {/* Orbs */}
        <div className="hero-orb hero-orb--warm absolute -top-20 -left-20 h-80 w-80 opacity-40" />
        <div className="hero-orb hero-orb--cool absolute bottom-10 right-0 h-64 w-64 opacity-25" style={{ animationDelay: "-5s" }} />
        <div className="hero-orb hero-orb--warm absolute bottom-1/3 left-1/2 h-48 w-48 opacity-20" style={{ animationDelay: "-10s" }} />

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col px-14 py-14">
          <div className="flex-shrink-0">
            <Image
              src="/logo-white.png"
              alt="Students Traffic"
              width={180}
              height={44}
              className="h-9 w-auto object-contain"
              priority
            />
          </div>

          <div className="mt-auto pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45 mb-6">
              Internal workspace
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.15] text-white max-w-sm">
              Guiding students{" "}
              <span className="italic text-[#b9efd0]">to the right</span>{" "}
              university.
            </h1>
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/60">
              Students Traffic connects Indian students with top medical universities
              in Vietnam — we handle the journey from application to arrival.
            </p>

            <div className="mt-10 flex items-center gap-6">
              <div className="text-center">
                <p className="font-display text-3xl font-semibold text-white">30+</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-widest text-white/45">Universities</p>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div className="text-center">
                <p className="font-display text-3xl font-semibold text-white">NMC</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-widest text-white/45">Recognised</p>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div className="text-center">
                <p className="font-display text-3xl font-semibold text-white">WHO</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-widest text-white/45">Listed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Form panel ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-12">
        <div className="w-full max-w-[400px]">
          <AdminLoginForm
            hasAuthConfig={env.hasAdminAuthConfig}
          />
        </div>
      </div>

    </div>
  );
}
