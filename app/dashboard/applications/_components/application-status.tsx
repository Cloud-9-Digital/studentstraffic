import { Check } from "lucide-react";

import { getApplicationStatusMeta, getApplicationSteps, type StatusTone } from "@/lib/dashboard/application-model";
import { cn } from "@/lib/utils";

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: "bg-[#f3f4f6] text-[#4b5563]",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-50 text-violet-700",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-700",
};

export function StatusPill({ status, className }: { status: string; className?: string }) {
  const meta = getApplicationStatusMeta(status);
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", TONE_CLASSES[meta.tone], className)}>
      {meta.label}
    </span>
  );
}

/** Compact Draft → Submitted → In review → Decision tracker; wraps cleanly at 360px. */
export function ApplicationSteps({ status }: { status: string }) {
  const steps = getApplicationSteps(status);
  return (
    <ol className="flex w-full items-center gap-1.5" aria-label="Application progress">
      {steps.map((step, index) => (
        <li key={step.label} className="flex min-w-0 flex-1 items-center gap-1.5">
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
              step.state === "done" && "bg-[#0f3d37] text-white",
              step.state === "current" && "border-2 border-[#0f3d37] bg-white text-[#0f3d37]",
              step.state === "upcoming" && "border border-[#e5e7eb] bg-white text-[#9ca3af]",
            )}
            aria-hidden
          >
            {step.state === "done" ? <Check className="size-3" /> : index + 1}
          </span>
          <span
            className={cn(
              "truncate text-xs",
              step.state === "upcoming" ? "text-[#9ca3af]" : "font-medium text-[#0f1f1c]",
            )}
          >
            {step.label}
            <span className="sr-only">{step.state === "done" ? " (done)" : step.state === "current" ? " (current step)" : ""}</span>
          </span>
          {index < steps.length - 1 ? (
            <span aria-hidden className={cn("hidden h-px flex-1 sm:block", step.state === "done" ? "bg-[#0f3d37]" : "bg-[#e5e7eb]")} />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
