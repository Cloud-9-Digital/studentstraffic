"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, GraduationCap, LayoutDashboard, MessageSquareQuote, Users, Users2, WalletCards } from "lucide-react";
import type { AdminUserRole } from "@/lib/db/schema";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, ownerOnly: false },
  { href: "/admin/leads", label: "Leads", icon: WalletCards, ownerOnly: false },
  { href: "/admin/peers", label: "Students", icon: GraduationCap, ownerOnly: false },
  { href: "/admin/peer-applications", label: "Applications", icon: ClipboardList, ownerOnly: false },
  { href: "/admin/peer-requests", label: "Peer Requests", icon: Users2, ownerOnly: false },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote, ownerOnly: false },
  { href: "/admin/users", label: "Users", icon: Users, ownerOnly: true },
] as const;

export function AdminDesktopNav({
  adminRole,
}: {
  adminRole?: AdminUserRole;
}) {
  const pathname = usePathname();
  const visibleNavigation = navigation.filter(
    (item) => !item.ownerOnly || adminRole === "owner"
  );

  return (
    <nav className="flex flex-col gap-0.5">
      {visibleNavigation.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-white/15 text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
