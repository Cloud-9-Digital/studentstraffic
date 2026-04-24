"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LayoutDashboard, MessageCircleMore, MessageSquareQuote, NotebookPen, Users, Users2, WalletCards } from "lucide-react";
import type { AdminUserRole } from "@/lib/db/schema";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, ownerOnly: false },
  { href: "/admin/seminars", label: "Analytics", icon: BarChart3, ownerOnly: false },
  { href: "/admin/leads", label: "Leads", icon: WalletCards, ownerOnly: false },
  { href: "/admin/whatsapp-logs", label: "WhatsApp", icon: MessageCircleMore, ownerOnly: false },
  { href: "/admin/peer-requests", label: "Peers", icon: Users2, ownerOnly: false },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote, ownerOnly: false },
  { href: "/admin/blog", label: "Blog", icon: NotebookPen, ownerOnly: false },
  { href: "/admin/users", label: "Users", icon: Users, ownerOnly: true },
] as const;

export function AdminBottomNav({
  adminRole,
}: {
  adminRole?: AdminUserRole;
}) {
  const pathname = usePathname();
  const visibleNavigation = navigation.filter(
    (item) => !item.ownerOnly || adminRole === "owner"
  );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 border-t border-slate-200 bg-white lg:hidden">
      {visibleNavigation.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-1 flex-col items-center justify-center gap-1 transition-colors"
          >
            <Icon
              className="size-5 transition-colors"
              style={{ color: active ? "#0b312b" : "#94a3b8" }}
              strokeWidth={active ? 2.2 : 1.8}
            />
            <span
              className="text-[9px] font-semibold uppercase tracking-wider transition-colors"
              style={{ color: active ? "#0b312b" : "#94a3b8" }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
