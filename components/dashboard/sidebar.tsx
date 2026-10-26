"use client";

import { useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  AlertCircle,
  BookmarkCheck,
  ExternalLink,
  FileText,
  Home,
  Inbox,
  LogOut,
  MessageSquare,
  MessagesSquare,
  MoreHorizontal,
  PhoneCall,
  Settings,
  Star,
  UserCog,
  Users,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  EMPTY_NAV_COUNTS,
  avatarInitial,
  formatBadgeCount,
  getBadgeCount,
  getMobileNav,
  getNavSections,
  isNavItemActive,
  type DashboardNavCounts,
  type DashboardNavIcon,
  type DashboardNavItem,
} from "@/lib/dashboard/nav";

/** Signed-in user, resolved on the server in app/dashboard/layout.tsx. */
export type DashboardUser = {
  name: string | null;
  email: string | null;
  image: string | null;
};

export type DashboardNavProps = {
  user: DashboardUser;
  isGuide: boolean;
  counts?: DashboardNavCounts;
};

const NAV_ICONS: Record<DashboardNavIcon, ComponentType<{ className?: string }>> = {
  home: Home,
  messages: MessagesSquare,
  calls: PhoneCall,
  shortlists: BookmarkCheck,
  applications: FileText,
  settings: Settings,
  guideHome: Star,
  guideInbox: MessageSquare,
  callRequests: Inbox,
  students: Users,
  guideProfile: UserCog,
};

function SignOutDialog({ open, onConfirm, onCancel }: { open: boolean; onConfirm: () => void; onCancel: () => void }) {
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div role="alertdialog" aria-modal="true" aria-labelledby="sign-out-title" className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="size-5 text-red-500" />
          </div>
          <div>
            <p id="sign-out-title" className="font-semibold text-[#0f1f1c]">Sign out?</p>
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

function Avatar({ user, size = 36 }: { user: DashboardUser; size?: number }) {
  if (user.image) {
    return (
      <Image
        src={user.image}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full bg-[#0f3d37] text-sm font-bold text-white"
      style={{ width: size, height: size }}
    >
      {avatarInitial(user.name, user.email)}
    </div>
  );
}

function NavBadge({ count, active, className }: { count: number; active?: boolean; className?: string }) {
  const label = formatBadgeCount(count);
  if (!label) return null;
  return (
    <span
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold leading-5 tabular-nums",
        active ? "bg-white text-[#0f3d37]" : "bg-[#0f3d37] text-white",
        className
      )}
    >
      {label}
    </span>
  );
}

function badgeAriaLabel(item: DashboardNavItem, count: number) {
  if (count <= 0) return undefined;
  const noun = item.badge === "pendingRequests" ? "pending" : "unread";
  return `${item.label}, ${count} ${noun}`;
}

export function DashboardSidebar({ user, isGuide, counts = EMPTY_NAV_COUNTS }: DashboardNavProps) {
  const pathname = usePathname();
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const sections = getNavSections(isGuide);
  const displayName = user.name?.trim() || user.email || "Your account";

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-[#e5e7eb] bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[#e5e7eb] px-6">
        <Link href="/" aria-label="Students Traffic home">
          <Image src="/logo.webp" alt="Students Traffic" width={140} height={32} className="h-5 w-auto object-contain" />
        </Link>
      </div>

      {/* Nav */}
      <nav aria-label="Dashboard" className="flex-1 space-y-5 overflow-y-auto p-3">
        {sections.map((section) => (
          <div key={section.title} className="space-y-0.5">
            {sections.length > 1 && (
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af]">{section.title}</p>
            )}
            {section.items.map((item) => {
              const Icon = NAV_ICONS[item.icon];
              const active = isNavItemActive(pathname, item);
              const count = getBadgeCount(item, counts);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  aria-label={badgeAriaLabel(item, count)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    active ? "bg-[#0f3d37] text-white" : "text-[#374151] hover:bg-[#f3f4f6] hover:text-[#0f1f1c]"
                  )}
                >
                  <Icon className={cn("size-4 shrink-0", active ? "text-white" : "text-[#9ca3af]")} />
                  <span className="flex-1 truncate">{item.label}</span>
                  <NavBadge count={count} active={active} />
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="px-3 pb-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#6b7280] transition-colors hover:bg-[#f3f4f6] hover:text-[#0f3d37]"
        >
          <ExternalLink className="size-3.5 shrink-0" />
          Back to site
        </Link>
      </div>

      {/* Footer: who is signed in + sign out */}
      <div className="border-t border-[#e5e7eb] p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <Avatar user={user} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#0f1f1c]">{displayName}</p>
            {user.name?.trim() && user.email ? <p className="truncate text-xs text-[#6b7280]">{user.email}</p> : null}
          </div>
          <button
            type="button"
            onClick={() => setConfirmSignOut(true)}
            aria-label="Sign out"
            title="Sign out"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#9ca3af] transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>

      <SignOutDialog
        open={confirmSignOut}
        onConfirm={() => signOut({ callbackUrl: "/" })}
        onCancel={() => setConfirmSignOut(false)}
      />
    </aside>
  );
}

/** Mobile top header: logo and the signed-in user (sign out lives in the "More" sheet). */
export function DashboardMobileHeader({ user }: { user: DashboardUser }) {
  const firstName = user.name?.trim().split(/\s+/)[0] || user.email || "Account";
  return (
    <header
      className="sticky top-0 z-30 border-b border-[#e5e7eb] bg-white lg:hidden"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        <Link href="/" aria-label="Students Traffic home" className="shrink-0">
          <Image src="/logo.webp" alt="Students Traffic" width={120} height={28} className="h-5 w-auto object-contain" />
        </Link>
        <Link href="/dashboard/settings" className="flex min-w-0 items-center gap-2" aria-label="Your settings">
          <span className="truncate text-sm font-semibold text-[#0f1f1c]">{firstName}</span>
          <Avatar user={user} size={32} />
        </Link>
      </div>
    </header>
  );
}

/** Mobile bottom nav: 4 main items plus "More" (rest of the nav, back to site, sign out). */
export function DashboardBottomNav({ isGuide, counts = EMPTY_NAV_COUNTS }: Omit<DashboardNavProps, "user">) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const { primary, more } = getMobileNav(isGuide);
  const moreActive = more.some((item) => isNavItemActive(pathname, item));
  const moreHasBadge = more.some((item) => getBadgeCount(item, counts) > 0);

  return (
    <>
      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setDrawerOpen(false)} />
      )}

      {/* "More" sheet sits above the bar; bottom offset = bar height + home indicator */}
      {drawerOpen && (
        <div
          id="dashboard-more-sheet"
          className="fixed left-0 right-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-[#e5e7eb] bg-white px-4 py-4 shadow-2xl lg:hidden"
          style={{ bottom: "calc(57px + env(safe-area-inset-bottom))" }}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">More</p>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setDrawerOpen(false)}
              className="flex size-8 items-center justify-center rounded-full text-[#9ca3af] hover:bg-[#f3f4f6]"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {more.map((item) => {
              const Icon = NAV_ICONS[item.icon];
              const active = isNavItemActive(pathname, item);
              const count = getBadgeCount(item, counts);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  aria-current={active ? "page" : undefined}
                  aria-label={badgeAriaLabel(item, count)}
                  className={cn(
                    "flex min-w-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? "bg-[#0f3d37] text-white" : "text-[#374151] hover:bg-[#f3f4f6]"
                  )}
                >
                  <Icon className={cn("size-4 shrink-0", active ? "text-white" : "text-[#9ca3af]")} />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <NavBadge count={count} active={active} />
                </Link>
              );
            })}
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
              className="flex min-w-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f3f4f6]"
            >
              <ExternalLink className="size-4 shrink-0 text-[#9ca3af]" />
              <span className="truncate">Back to site</span>
            </Link>
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

      <nav
        aria-label="Dashboard"
        className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[#e5e7eb] bg-white lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {primary.map((item) => {
          const Icon = NAV_ICONS[item.icon];
          const active = isNavItemActive(pathname, item);
          const count = getBadgeCount(item, counts);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              aria-label={badgeAriaLabel(item, count)}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors",
                active ? "text-[#0f3d37]" : "text-[#6b7280]"
              )}
            >
              <span className="relative">
                <Icon className="size-5" />
                <NavBadge count={count} className="absolute -right-3 -top-2 min-w-4 px-1 text-[10px] leading-4" />
              </span>
              <span className="max-w-full truncate px-1">{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          aria-expanded={drawerOpen}
          aria-controls="dashboard-more-sheet"
          onClick={() => setDrawerOpen((open) => !open)}
          className={cn(
            "flex min-w-0 flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors",
            drawerOpen || moreActive ? "text-[#0f3d37]" : "text-[#6b7280]"
          )}
        >
          <span className="relative">
            <MoreHorizontal className="size-5" />
            {moreHasBadge && <span className="absolute -right-1 -top-0.5 size-2 rounded-full bg-[#0f3d37] ring-2 ring-white" />}
          </span>
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
