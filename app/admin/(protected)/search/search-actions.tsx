"use client";

import { useActionState } from "react";
import { RefreshCw } from "lucide-react";

import {
  rebuildSearchIndexAction,
  type SearchAdminActionState,
} from "@/app/_actions/manage-search";
import { Button } from "@/components/ui/button";

const initialState: SearchAdminActionState = {
  status: "idle",
};

export function SearchActions({ canManage }: { canManage: boolean }) {
  const [rebuildState, rebuildAction, isRebuilding] = useActionState(
    rebuildSearchIndexAction,
    initialState,
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <form action={rebuildAction}>
          <Button type="submit" disabled={!canManage || isRebuilding}>
            <RefreshCw className="size-4" />
            {isRebuilding ? "Rebuilding..." : "Rebuild Postgres index"}
          </Button>
        </form>
      </div>

      {!canManage ? (
        <p className="text-xs text-slate-500">
          Owner access is required to rebuild the search index.
        </p>
      ) : null}

      {rebuildState.status === "idle" || !rebuildState.message ? null : (
        <p
          className={
            rebuildState.status === "success"
              ? "rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
              : "rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          }
        >
          {rebuildState.message}
        </p>
      )}
    </div>
  );
}
