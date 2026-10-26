import Link from "next/link";
import type { ComponentType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Shared building blocks for every student and guide dashboard page, so all
 * pages share one layout: a readable content width, a page header with the
 * primary action on the right, content in bordered section cards, honest empty
 * states and clickable stat cards. Use these instead of page-specific chrome.
 */

type Icon = ComponentType<{ className?: string }>;

/** Page container: centred, readable width. `wide` for tables and the chat workspace. */
export function DashboardPage({ children, wide = false, className }: { children: ReactNode; wide?: boolean; className?: string }) {
  return <div className={cn("mx-auto w-full space-y-6", wide ? "max-w-6xl" : "max-w-4xl", className)}>{children}</div>;
}

/** Title + one-line description on the left, primary/secondary actions on the right (stacked on mobile). */
export function PageHeader({ title, description, actions }: { title: ReactNode; description?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-[#0f1f1c]">{title}</h1>
        {description ? <p className="mt-1 text-sm text-[#6b7280]">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

/** A bordered card with an optional header row (title, description, action link/button). */
export function Section({
  title,
  description,
  action,
  children,
  flush = false,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  /** Remove body padding, e.g. for lists whose rows have their own padding and dividers. */
  flush?: boolean;
  className?: string;
}) {
  return (
    <section className={cn("overflow-hidden rounded-xl border border-[#eaeaea] bg-white", className)}>
      {title || action ? (
        <div className="flex items-start justify-between gap-3 border-b border-[#f0f0f0] px-5 py-4">
          <div className="min-w-0">
            {title ? <h2 className="text-sm font-semibold text-[#0f1f1c]">{title}</h2> : null}
            {description ? <p className="mt-0.5 text-xs text-[#6b7280]">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      <div className={flush ? undefined : "p-5"}>{children}</div>
    </section>
  );
}

/** Rows inside a flush Section: consistent padding and dividers. */
export function SectionList({ children }: { children: ReactNode }) {
  return <ul className="divide-y divide-[#f0f0f0]">{children}</ul>;
}

/** Empty state: what this area is for and the one action that fills it. */
export function EmptyState({ icon: IconComponent, title, description, action }: { icon?: Icon; title: ReactNode; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      {IconComponent ? (
        <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-[#f0f5f4] text-[#0f3d37]">
          <IconComponent className="size-5" />
        </div>
      ) : null}
      <p className="text-sm font-semibold text-[#0f1f1c]">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-sm text-[#6b7280]">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/** Clickable summary number; links to the page that holds the detail. */
export function StatCard({ href, label, value, icon: IconComponent, hint }: { href: string; label: string; value: ReactNode; icon?: Icon; hint?: ReactNode }) {
  return (
    <Link href={href} className="group rounded-xl border border-[#eaeaea] bg-white p-4 transition hover:border-[#cfe0dc] hover:shadow-sm focus-visible:ring-2 focus-visible:ring-[#0f3d37]/30">
      <div className="flex items-center justify-between text-[#6b7280]">
        <span className="text-xs font-medium">{label}</span>
        {IconComponent ? <IconComponent className="size-4" /> : null}
      </div>
      <p className="mt-2 text-2xl font-bold text-[#0f1f1c]">{value}</p>
      {hint ? <p className="mt-0.5 text-xs text-[#6b7280] group-hover:text-[#0f3d37]">{hint}</p> : null}
    </Link>
  );
}

/** Primary and secondary button styles as class strings, for Links and buttons alike. */
export const dashboardButton = {
  primary: "inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0f3d37] px-3.5 py-2 text-sm font-medium text-white transition hover:bg-[#0f3d37]/90 focus-visible:ring-2 focus-visible:ring-[#0f3d37]/30 disabled:opacity-50",
  secondary: "inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-3.5 py-2 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb] focus-visible:ring-2 focus-visible:ring-[#0f3d37]/30 disabled:opacity-50",
  danger: "inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-200 disabled:opacity-50",
} as const;
