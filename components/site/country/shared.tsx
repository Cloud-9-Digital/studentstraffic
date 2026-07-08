import type { ReactNode } from "react";
import {
  Activity,
  Briefcase,
  BookOpenCheck,
  Cpu,
  GraduationCap,
  Hammer,
  Pill,
  Scale,
  Smile,
  Stethoscope,
  UtensilsCrossed,
  Wheat,
} from "lucide-react";

import { cn } from "@/lib/utils";

// ── Shared visual primitives for the country page sections ─────────────────
// Kept here (rather than in each section file) so the redesigned sections
// look like one coherent system instead of a pile of one-off components.

export function SectionKicker({
  icon,
  text,
  tone = "primary",
}: {
  icon?: ReactNode;
  text: string;
  tone?: "primary" | "white";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em]",
        tone === "white" ? "text-white/60" : "text-primary/70"
      )}
    >
      {icon}
      {text}
    </div>
  );
}

export function SectionHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "mt-4 font-display text-[1.9rem] font-semibold leading-[1.08] tracking-tight text-heading sm:text-4xl lg:text-[2.75rem]",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function SectionIntro({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-muted-foreground md:text-base md:leading-8">
      {children}
    </p>
  );
}

// A slot used for sections that are honest, general-guidance shells rather
// than country-specific facts (visa steps, student life). Visually distinct
// (dashed border) so editors can spot at a glance which sections still need
// country-specific research to be layered in.
export function ResearchSlotNote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 rounded-[1.1rem] border border-dashed border-border/80 bg-muted/40 px-4 py-3 text-xs leading-6 text-muted-foreground">
      {children}
    </div>
  );
}

export function FactTile({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[1.1rem] border border-border/60 bg-[#faf8f4] px-4 py-3.5">
      {icon ? (
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium leading-snug text-foreground">{value}</p>
      </div>
    </div>
  );
}

// ── Study-stream visual language ────────────────────────────────────────────
// CourseStream is a plain string union that keeps growing as the catalog goes
// multi-stream, so this map is intentionally non-exhaustive (Record<string,…>)
// with a safe default rather than a keyed-to-the-union Record — new stream
// values fall back to a generic icon/label instead of failing to build.

const STREAM_ICON: Record<string, ReactNode> = {
  medicine: <Stethoscope className="size-4" />,
  nursing: <Activity className="size-4" />,
  dental: <Smile className="size-4" />,
  pharmacy: <Pill className="size-4" />,
  physiotherapy: <Activity className="size-4" />,
  engineering: <Cpu className="size-4" />,
  business: <Briefcase className="size-4" />,
  law: <Scale className="size-4" />,
  hospitality: <UtensilsCrossed className="size-4" />,
  agriculture: <Wheat className="size-4" />,
  education: <BookOpenCheck className="size-4" />,
  vocational: <Hammer className="size-4" />,
};

const STREAM_LABEL: Record<string, string> = {
  medicine: "Medicine",
  nursing: "Nursing",
  dental: "Dental",
  pharmacy: "Pharmacy",
  physiotherapy: "Physiotherapy",
  engineering: "Engineering",
  business: "Business",
  law: "Law",
  hospitality: "Hospitality",
  agriculture: "Agriculture",
  education: "Education",
  vocational: "Vocational",
  other: "Other programs",
};

export function getStreamIcon(stream: string): ReactNode {
  return STREAM_ICON[stream] ?? <GraduationCap className="size-4" />;
}

export function getStreamLabel(stream: string): string {
  return STREAM_LABEL[stream] ?? (stream.charAt(0).toUpperCase() + stream.slice(1));
}
