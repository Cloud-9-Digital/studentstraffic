"use client";

import { useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, GitCompare, X } from "lucide-react";

import { type CompareItem, useCompare } from "@/lib/compare-context";

function UniversitySlot({
  item,
  onRemove,
}: {
  item: CompareItem;
  onRemove?: () => void;
}) {
  return (
    <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-white">
        {item.logoUrl ? (
          <Image
            src={item.logoUrl}
            alt={item.name}
            width={28}
            height={28}
            className="h-full w-full object-contain p-0.5"
          />
        ) : (
          <span className="text-[0.5rem] font-bold text-primary">
            {item.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <span className="min-w-0 flex-1 truncate text-[0.65rem] font-medium text-white">
        {item.name}
      </span>
      <button
        type="button"
        aria-label={`Remove ${item.name}`}
        onClick={onRemove}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors hover:bg-white/20 hover:text-white"
      >
        <X className="size-2.5" />
      </button>
    </div>
  );
}

export function CompareTray() {
  const { items, clear, toggle } = useCompare();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const visible = items.length > 0;
  const ready = items.length >= 2;
  const canAddMore = items.length < 4;

  function handleCompare() {
    if (!ready) return;
    const keys = ["a", "b", "c", "d"] as const;
    const qs = items
      .slice(0, 4)
      .map((item, i) => `${keys[i]}=${item.slug}`)
      .join("&");
    startTransition(() => {
      router.push(`/compare/live?${qs}`);
    });
  }

  return (
    <div
      aria-live="polite"
      aria-label="University comparison tray"
      className={[
        "fixed left-0 right-0 z-[45] transition-transform duration-300 ease-in-out",
        "bottom-0",
        visible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
    >
      <div
        style={{
          background: "#0f3d37",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.25)",
        }}
      >
        <div className="container-shell py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            {/* Label row — icon + count on left, Clear on right */}
            <div className="flex w-full shrink-0 flex-col gap-0.5 sm:w-auto">
              <div className="flex items-center gap-2">
                <GitCompare className="size-4 text-accent" />
                <span className="whitespace-nowrap text-xs font-semibold text-white/70">
                  {ready ? `${items.length} selected` : `${2 - items.length} more to compare`}
                </span>
                <button
                  type="button"
                  onClick={clear}
                  className="ml-auto text-xs text-white/40 transition-colors hover:text-white/70"
                >
                  Clear
                </button>
              </div>
              {canAddMore && (
                <span className="pl-6 text-[0.6rem] text-white/30">
                  You can compare up to 4 universities
                </span>
              )}
            </div>

            {/* Filled slots only */}
            <div className="flex flex-1 flex-wrap gap-1.5 sm:flex-nowrap sm:gap-2">
              {items.map((item) => (
                <UniversitySlot
                  key={item.slug}
                  item={item}
                  onRemove={() => toggle(item)}
                />
              ))}
            </div>

            {/* Compare button */}
            <div className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={handleCompare}
                disabled={!ready || isPending}
                className={[
                  "flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                  ready && !isPending
                    ? "bg-accent text-white shadow-md hover:bg-accent-strong active:scale-[0.97]"
                    : "cursor-not-allowed bg-white/10 text-white/30",
                ].join(" ")}
              >
                {isPending ? "Loading…" : "Compare Now"}
                {!isPending && <ArrowRight className="size-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
