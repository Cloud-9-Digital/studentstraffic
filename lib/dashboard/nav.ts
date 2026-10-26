/**
 * Dashboard navigation model, shared by the desktop sidebar and the mobile
 * bottom bar so both use the same labels, order and badges. Pure data and
 * helpers only (no icons, no server code) so it can be unit tested and
 * imported by client components. Icons are mapped by `icon` key in the
 * sidebar component.
 */

export type DashboardNavIcon =
  | "home"
  | "messages"
  | "calls"
  | "shortlists"
  | "applications"
  | "settings"
  | "guideHome"
  | "guideInbox"
  | "callRequests"
  | "students"
  | "guideProfile";

export type DashboardNavBadge = "studentUnread" | "guideUnread" | "pendingRequests";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: DashboardNavIcon;
  /** Count shown as a badge next to the label. */
  badge?: DashboardNavBadge;
  /** Only active on the exact path (section roots like /dashboard). */
  exact?: boolean;
};

export type DashboardNavCounts = Record<DashboardNavBadge, number>;

export const EMPTY_NAV_COUNTS: DashboardNavCounts = {
  studentUnread: 0,
  guideUnread: 0,
  pendingRequests: 0,
};

export const STUDENT_NAV: readonly DashboardNavItem[] = [
  { href: "/dashboard", label: "Home", icon: "home", exact: true },
  { href: "/dashboard/messages", label: "Messages", icon: "messages", badge: "studentUnread" },
  { href: "/dashboard/calls", label: "Calls", icon: "calls" },
  { href: "/dashboard/shortlists", label: "Shortlists", icon: "shortlists" },
  { href: "/dashboard/applications", label: "Applications", icon: "applications" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

export const GUIDE_NAV: readonly DashboardNavItem[] = [
  { href: "/dashboard/peer", label: "Guide home", icon: "guideHome", exact: true },
  { href: "/dashboard/peer/messages", label: "Guide inbox", icon: "guideInbox", badge: "guideUnread" },
  { href: "/dashboard/peer/requests", label: "Call requests", icon: "callRequests", badge: "pendingRequests" },
  { href: "/dashboard/peer/students", label: "My students", icon: "students" },
  { href: "/dashboard/peer/edit", label: "Guide profile", icon: "guideProfile" },
];

/** Bottom-bar slots on mobile; a fifth "More" slot opens the rest. */
const MOBILE_PRIMARY_HREFS = ["/dashboard", "/dashboard/messages", "/dashboard/calls", "/dashboard/shortlists"];

export function getNavSections(isGuide: boolean): { title: string; items: readonly DashboardNavItem[] }[] {
  return isGuide
    ? [
        { title: "Student", items: STUDENT_NAV },
        { title: "Guide", items: GUIDE_NAV },
      ]
    : [{ title: "Student", items: STUDENT_NAV }];
}

/** Splits the nav into the 4 bottom-bar items and the items behind "More". */
export function getMobileNav(isGuide: boolean): { primary: DashboardNavItem[]; more: DashboardNavItem[] } {
  const all = getNavSections(isGuide).flatMap((section) => section.items);
  return {
    primary: MOBILE_PRIMARY_HREFS.map((href) => all.find((item) => item.href === href)).filter(
      (item): item is DashboardNavItem => Boolean(item),
    ),
    more: all.filter((item) => !MOBILE_PRIMARY_HREFS.includes(item.href)),
  };
}

export function isNavItemActive(pathname: string, item: Pick<DashboardNavItem, "href" | "exact">): boolean {
  if (pathname === item.href) return true;
  return !item.exact && pathname.startsWith(`${item.href}/`);
}

export function getBadgeCount(item: Pick<DashboardNavItem, "badge">, counts: DashboardNavCounts): number {
  return item.badge ? Math.max(0, counts[item.badge] ?? 0) : 0;
}

/** "3", "99+", or null when there is nothing to show. */
export function formatBadgeCount(count: number): string | null {
  if (!Number.isFinite(count) || count <= 0) return null;
  return count > 99 ? "99+" : String(Math.floor(count));
}

/** Initial for the avatar fallback: name first, then email, then "?". */
export function avatarInitial(name?: string | null, email?: string | null): string {
  const source = name?.trim() || email?.trim() || "";
  return source ? source.charAt(0).toUpperCase() : "?";
}
