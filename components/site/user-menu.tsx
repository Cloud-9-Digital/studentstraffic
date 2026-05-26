"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookmarkCheck, FileText, LogOut, User, ChevronDown, AlertCircle } from "lucide-react";

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

const menuItems = [
  { href: "/dashboard",             icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/shortlists",  icon: BookmarkCheck,   label: "My Shortlists" },
  { href: "/dashboard/applications",icon: FileText,        label: "My Applications" },
];

function Avatar({ name, image, size = 8 }: { name?: string | null; image?: string | null; size?: number }) {
  const initial = name?.charAt(0).toUpperCase() ?? "U";
  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? "User"}
        width={size * 4}
        height={size * 4}
        className={`size-${size} rounded-full object-cover ring-2 ring-white`}
      />
    );
  }
  return (
    <div className={`flex size-${size} items-center justify-center rounded-full bg-[#0f3d37] text-xs font-bold text-white ring-2 ring-white`}>
      {initial}
    </div>
  );
}

export function UserMenu() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const keyHandler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [open]);

  if (!mounted || status === "loading") {
    return <div className="size-8 animate-pulse rounded-full bg-black/8" />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/8 px-3.5 py-2 text-sm font-semibold text-primary transition hover:bg-primary/14"
      >
        <User className="size-3.5" />
        Sign in
      </Link>
    );
  }

  const user = session.user;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-[#0f3d37]/15 bg-[#f0f7f5] pl-1.5 pr-3 py-1.5 transition hover:bg-[#e4f0ed]"
        aria-expanded={open}
      >
        <Avatar name={user.name} image={user.image} size={7} />
        <span className="text-sm font-semibold text-[#0f3d37]">
          {user.name?.split(" ")[0] ?? "Account"}
        </span>
        <ChevronDown className={`size-3.5 text-[#0f3d37]/60 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-white shadow-xl transition-all duration-200 ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        {/* User info */}
        <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
          <Avatar name={user.name} image={user.image} size={9} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#0f1f1c]">{user.name ?? "User"}</p>
            <p className="truncate text-xs text-[#6b7280]">{user.email}</p>
          </div>
        </div>

        {/* Menu items */}
        <div className="p-1.5">
          {menuItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f3f4f6] hover:text-[#0f3d37]"
            >
              <Icon className="size-4 shrink-0 text-[#9ca3af]" />
              {label}
            </Link>
          ))}
        </div>

        {/* Sign out */}
        <div className="border-t border-border/60 p-1.5">
          <button
            type="button"
            onClick={() => { setOpen(false); setConfirmSignOut(true); }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="size-4 shrink-0" />
            Sign out
          </button>
        </div>
      </div>

      <SignOutDialog
        open={confirmSignOut}
        onConfirm={() => signOut({ callbackUrl: "/" })}
        onCancel={() => setConfirmSignOut(false)}
      />
    </div>
  );
}

/** Compact version for mobile drawer */
export function UserMenuMobile({ onClose }: { onClose: () => void }) {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || status === "loading") return null;

  if (!session?.user) {
    return (
      <div className="space-y-2 border-t border-border px-3 pb-2 pt-3">
        <Link
          href="/login"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f3d37] py-3 text-sm font-semibold text-white"
        >
          <User className="size-4" />
          Sign in
        </Link>
        <Link
          href="/register"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#0f3d37]/20 py-3 text-sm font-semibold text-[#0f3d37]"
        >
          Create account
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="border-t border-border px-3 py-3 space-y-0.5">
      <div className="flex items-center gap-3 rounded-xl px-3 py-2 mb-1">
        <Avatar name={user.name} image={user.image} size={9} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#0f1f1c]">{user.name ?? "User"}</p>
          <p className="truncate text-xs text-[#6b7280]">{user.email}</p>
        </div>
      </div>

      {menuItems.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-black/5"
        >
          <Icon className="size-4 text-muted-foreground" />
          {label}
        </Link>
      ))}

      <button
        type="button"
        onClick={() => { onClose(); setConfirmSignOut(true); }}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
      >
        <LogOut className="size-4" />
        Sign out
      </button>

      <SignOutDialog
        open={confirmSignOut}
        onConfirm={() => signOut({ callbackUrl: "/" })}
        onCancel={() => setConfirmSignOut(false)}
      />
    </div>
  );
}
