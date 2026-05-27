"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BookmarkCheck,
  FileText,
  Settings,
  LogOut,
  AlertCircle,
  ExternalLink,
  Star,
  Users,
  UserCog,
  Inbox,
  PhoneCall,
  MoreHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

function SignOutDialog({ open, onConfirm, onCancel }: { open: boolean; onConfirm: () => void; onCancel: () => void }) {
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="size-5 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-[#0f1f1c]">Sign out?</p>
            <p className="mt-0.5 text-sm text-[#6b7280]">You will be signed out of your account.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-[#e5e7eb] py-2.5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

const studentNavItems = [
  { href: "/dashboard",              icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/calls",        icon: PhoneCall,       label: "My Calls" },
  { href: "/dashboard/shortlists",   icon: BookmarkCheck,   label: "Shortlists" },
  { href: "/dashboard/applications", icon: FileText,        label: "Applications" },
  { href: "/dashboard/settings",     icon: Settings,        label: "Settings" },
];

const peerNavItems = [
  { href: "/dashboard/peer",           icon: Star,    label: "Overview" },
  { href: "/dashboard/peer/requests",  icon: Inbox,   label: "Requests" },
  { href: "/dashboard/peer/students",  icon: Users,   label: "My Students" },
  { href: "/dashboard/peer/edit",      icon: UserCog, label: "Edit Profile" },
];

function Avatar({ name, image }: { name?: string | null; image?: string | null }) {
  if (image) {
    return <Image src={image} alt={name ?? "User"} width={36} height={36} className="size-9 rounded-full object-cover" />;
  }
  return (
    <div className="flex size-9 items-center justify-center rounded-full bg-[#0f3d37] text-sm font-bold text-white">
      {name?.charAt(0).toUpperCase() ?? "U"}
    </div>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" || href === "/dashboard/peer"
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[#e5e7eb] bg-white h-screen sticky top-0 overflow-hidden">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[#e5e7eb] px-6">
        <Link href="/">
          <Image src="/logo.webp" alt="Students Traffic" width={140} height={32} className="h-5 w-auto object-contain" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {/* Student section */}
        <div className="space-y-0.5">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af]">Student</p>
          {studentNavItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(href)
                  ? "bg-[#0f3d37] text-white"
                  : "text-[#374151] hover:bg-[#f3f4f6] hover:text-[#0f1f1c]"
              )}
            >
              <Icon className={cn("size-4 shrink-0", isActive(href) ? "text-white" : "text-[#9ca3af]")} />
              {label}
            </Link>
          ))}
        </div>

        {/* Guide section */}
        <div className="space-y-0.5">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af]">Guide</p>
          {peerNavItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(href)
                  ? "bg-[#0f3d37] text-white"
                  : "text-[#374151] hover:bg-[#f3f4f6] hover:text-[#0f1f1c]"
              )}
            >
              <Icon className={cn("size-4 shrink-0", isActive(href) ? "text-white" : "text-[#9ca3af]")} />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Back to site — above separator */}
      <div className="px-3 pb-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#9ca3af] transition-colors hover:bg-[#f3f4f6] hover:text-[#0f3d37]"
        >
          <ExternalLink className="size-3.5 shrink-0" />
          Back to site
        </Link>
      </div>

      {/* Footer — user card + sign out */}
      <div className="border-t border-[#e5e7eb] p-3 space-y-2">
        <div className="flex items-center gap-3 rounded-xl bg-[#f8fbfa] px-3 py-3">
          <Avatar name={user?.name} image={user?.image} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#0f1f1c]">{user?.name ?? "Student"}</p>
            <p className="truncate text-xs text-[#6b7280]">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setConfirmSignOut(true)}
          className="flex w-full items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
        >
          <LogOut className="size-3.5" />
          Sign out
        </button>
      </div>

      <SignOutDialog
        open={confirmSignOut}
        onConfirm={() => signOut({ callbackUrl: "/" })}
        onCancel={() => setConfirmSignOut(false)}
      />
    </aside>
  );
}

/** Mobile top header */
export function DashboardMobileHeader() {
  const { data: session } = useSession();
  const user = session?.user;
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-30 flex flex-col border-b border-[#e5e7eb] bg-white lg:hidden"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/">
          <Image src="/logo.webp" alt="Students Traffic" width={120} height={28} className="h-5 w-auto object-contain" />
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <Avatar name={user?.name} image={user?.image} />
            <span className="text-sm font-semibold text-[#0f1f1c]">
              {user?.name?.split(" ")[0] ?? "Account"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setConfirmSignOut(true)}
            aria-label="Sign out"
            className="flex items-center text-red-500 transition hover:text-red-600"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
      </header>

      <SignOutDialog
        open={confirmSignOut}
        onConfirm={() => signOut({ callbackUrl: "/" })}
        onCancel={() => setConfirmSignOut(false)}
      />
    </>
  );
}

const bottomNavItems = [
  { href: "/dashboard",              icon: LayoutDashboard, label: "Home" },
  { href: "/dashboard/calls",        icon: PhoneCall,       label: "Calls" },
  { href: "/dashboard/shortlists",   icon: BookmarkCheck,   label: "Shortlists" },
  { href: "/dashboard/applications", icon: FileText,        label: "Applications" },
];

/** Mobile bottom nav */
export function DashboardBottomNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const drawerItems = [
    { href: "/dashboard/settings",      icon: Settings,     label: "Settings" },
    { href: "/dashboard/peer",          icon: Star,         label: "Guide Overview" },
    { href: "/dashboard/peer/requests", icon: Inbox,        label: "Requests" },
    { href: "/dashboard/peer/students", icon: Users,        label: "My Students" },
    { href: "/dashboard/peer/edit",     icon: UserCog,      label: "Edit Guide Profile" },
    { href: "/",                        icon: ExternalLink, label: "Back to main site" },
  ];

  const isDrawerItemActive = (href: string) =>
    href === "/dashboard/peer" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* More drawer — sits above the nav bar; bottom offset = nav height + home-indicator */}
      {drawerOpen && (
        <div
          className="fixed left-0 right-0 z-50 rounded-t-2xl border-t border-[#e5e7eb] bg-white px-4 py-4 shadow-2xl lg:hidden"
          style={{ bottom: "calc(57px + env(safe-area-inset-bottom))" }}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">More</p>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="flex size-7 items-center justify-center rounded-full text-[#9ca3af] hover:bg-[#f3f4f6]"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {drawerItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setDrawerOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isDrawerItemActive(href) && href !== "/"
                    ? "bg-[#0f3d37] text-white"
                    : "text-[#374151] hover:bg-[#f3f4f6]"
                )}
              >
                <Icon className={cn(
                  "size-4 shrink-0",
                  isDrawerItemActive(href) && href !== "/" ? "text-white" : "text-[#9ca3af]"
                )} />
                {label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => { setDrawerOpen(false); setConfirmSignOut(true); }}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="size-4 shrink-0 text-red-400" />
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* Bottom bar — padding-bottom pushes items above the iOS home indicator */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[#e5e7eb] bg-white lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {bottomNavItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors",
              isActive(href) ? "text-[#0f3d37]" : "text-[#9ca3af]"
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setDrawerOpen((o) => !o)}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors",
            drawerOpen ? "text-[#0f3d37]" : "text-[#9ca3af]"
          )}
        >
          <MoreHorizontal className="size-5" />
          More
        </button>
      </nav>

      <SignOutDialog
        open={confirmSignOut}
        onConfirm={() => signOut({ callbackUrl: "/" })}
        onCancel={() => setConfirmSignOut(false)}
      />
    </>
  );
}
