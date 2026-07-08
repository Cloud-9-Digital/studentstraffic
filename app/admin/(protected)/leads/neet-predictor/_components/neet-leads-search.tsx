"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";

export function NeetLeadsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [searchDraft, setSearchDraft] = useState(search);

  useEffect(() => {
    setSearchDraft(search);
  }, [search]);

  const updateSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      params.delete("page");

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      startTransition(() => {
        router.push(`/admin/leads/neet-predictor?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (searchDraft === search) {
        return;
      }

      updateSearch(searchDraft);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchDraft, search, updateSearch]);

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, phone, or email..."
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          className="h-10 w-full max-w-md rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#0b312b] focus:ring-2 focus:ring-[#0b312b]/10"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="size-4 animate-spin rounded-full border-2 border-slate-200 border-t-[#0b312b]" />
          </div>
        )}
      </div>
    </div>
  );
}
