import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DataPagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (p: number) => string;
}) {
  if (totalPages <= 1) return null;

  const prev = page - 1;
  const next = page + 1;

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  const btnBase =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-medium transition-colors";

  return (
    <div className="flex items-center justify-between gap-4 pt-1">
      <p className="text-xs text-[#9ca3af]">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        {page > 1 ? (
          <Link href={buildHref(prev)} className={`${btnBase} border border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6]`}>
            <ChevronLeft className="size-3.5" />
          </Link>
        ) : (
          <span className={`${btnBase} border border-[#e5e7eb] text-[#d1d5db] cursor-not-allowed`}>
            <ChevronLeft className="size-3.5" />
          </span>
        )}

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className={`${btnBase} text-[#9ca3af]`}>…</span>
          ) : (
            <Link
              key={p}
              href={buildHref(p)}
              className={`${btnBase} ${
                p === page
                  ? "bg-[#0f3d37] text-white"
                  : "border border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6]"
              }`}
            >
              {p}
            </Link>
          )
        )}

        {page < totalPages ? (
          <Link href={buildHref(next)} className={`${btnBase} border border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6]`}>
            <ChevronRight className="size-3.5" />
          </Link>
        ) : (
          <span className={`${btnBase} border border-[#e5e7eb] text-[#d1d5db] cursor-not-allowed`}>
            <ChevronRight className="size-3.5" />
          </span>
        )}
      </div>
    </div>
  );
}
