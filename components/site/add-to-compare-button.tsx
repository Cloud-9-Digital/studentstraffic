"use client";

import { Check, Plus } from "lucide-react";

import { useCompare } from "@/lib/compare-context";

/**
 * Client leaf — receives only serializable primitives from the server,
 * never the full FinderProgram object (server-serialization rule).
 */
export function AddToCompareButton({
  slug,
  name,
  logoUrl,
}: {
  slug: string;
  name: string;
  logoUrl?: string;
}) {
  const { isSelected, toggle, isFull } = useCompare();
  const selected = isSelected(slug);
  const disabled = isFull && !selected;

  return (
    <button
      type="button"
      aria-label={selected ? `Remove ${name} from comparison` : `Add ${name} to comparison`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({ slug, name, logoUrl });
      }}
      className={[
        "flex w-full h-8 items-center justify-center gap-1.5 rounded-lg border transition-all duration-150 text-xs font-semibold",
        selected
          ? "border-accent bg-accent text-white shadow-sm"
          : disabled
            ? "cursor-not-allowed border-border bg-muted text-muted-foreground/40"
            : "border-border bg-muted text-muted-foreground hover:border-accent hover:bg-accent/8 hover:text-accent",
      ].join(" ")}
    >
      {selected ? (
        <>
          <Check className="size-3 shrink-0" strokeWidth={2.5} />
          <span>Added</span>
        </>
      ) : (
        <>
          <Plus className="size-3 shrink-0" strokeWidth={2.5} />
          <span>Compare</span>
        </>
      )}
    </button>
  );
}
