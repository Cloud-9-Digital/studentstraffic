import Image from "next/image";
import type { Session } from "next-auth";

import { AdminBottomNav } from "@/components/admin/admin-bottom-nav";
import { AdminDesktopNav } from "@/components/admin/admin-desktop-nav";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";

type AdminShellProps = {
  children: React.ReactNode;
  session: Session;
};

export function AdminShell({ children, session }: AdminShellProps) {
  const role = session.user?.adminRole === "owner" ? "Owner" : "Admin";

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ── Desktop sidebar ─────────────────────────────────────────────────── */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-[#0b312b] text-white lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-white/8 px-5">
          <Image
            src="/logo-white.png"
            alt="Students Traffic"
            width={140}
            height={36}
            className="h-5 w-auto object-contain"
            priority
          />
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <AdminDesktopNav adminRole={session.user?.adminRole} />
        </div>

        {/* User + sign out */}
        <div className="border-t border-white/8 px-3 py-4">
          <div className="mb-2 px-3 py-2">
            <p className="truncate text-sm font-semibold text-white leading-none">
              {session.user?.name ?? "Admin"}
            </p>
            <p className="mt-1 truncate text-xs text-white/45 leading-none">
              {session.user?.email ?? "—"}
            </p>
            <span className="mt-2.5 inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/45">
              {role}
            </span>
          </div>
          <AdminSignOutButton />
        </div>
      </aside>

      {/* ── Mobile top bar ───────────────────────────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/8 bg-[#0b312b] px-4 lg:hidden">
        <Image
          src="/logo-white.png"
          alt="Students Traffic"
          width={130}
          height={32}
          className="h-5 w-auto object-contain"
          priority
        />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold text-white leading-none">
              {session.user?.name ?? "Admin"}
            </p>
            <p className="mt-0.5 text-[10px] text-white/45 leading-none">{role}</p>
          </div>
          <AdminSignOutButton iconOnly />
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <main className="flex min-w-0 flex-1 flex-col pt-14 pb-20 lg:pt-0 lg:pb-0">
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* ── Mobile bottom nav ───────────────────────────────────────────────── */}
      <AdminBottomNav adminRole={session.user?.adminRole} />
    </div>
  );
}
