import { GUIDE_STUDENT_STATUS_LABEL, type GuideStudentStatus } from "@/lib/dashboard/guide-students";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-[#0f3d37] text-white",
  "bg-[#c2410c] text-white",
  "bg-violet-600 text-white",
  "bg-sky-600 text-white",
  "bg-emerald-600 text-white",
];

export function StudentAvatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const color = AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  return (
    <div
      aria-hidden
      className={cn("flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold", color, className)}
    >
      {initials || "S"}
    </div>
  );
}

const STATUS_STYLES: Record<GuideStudentStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  declined: "bg-[#f3f4f6] text-[#6b7280] ring-[#e5e7eb]",
  cancelled: "bg-[#f3f4f6] text-[#6b7280] ring-[#e5e7eb]",
  blocked: "bg-red-50 text-red-700 ring-red-200",
  introduced: "bg-sky-50 text-sky-700 ring-sky-200",
  contacted: "bg-[#f0f5f4] text-[#0f3d37] ring-[#cfe0dc]",
};

export function StudentStatusPill({ status, label }: { status: GuideStudentStatus; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        STATUS_STYLES[status],
      )}
    >
      {label ?? GUIDE_STUDENT_STATUS_LABEL[status]}
    </span>
  );
}
