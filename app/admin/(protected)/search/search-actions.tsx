"use client";

import { useActionState } from "react";
import { RefreshCw, UploadCloud } from "lucide-react";

import {
  rebuildSearchIndexAction,
  syncTypesenseSearchAction,
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
  const [syncState, syncAction, isSyncing] = useActionState(
    syncTypesenseSearchAction,
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

        <form action={syncAction}>
          <Button
            type="submit"
            variant="outline"
            disabled={!canManage || isSyncing}
          >
            <UploadCloud className="size-4" />
            {isSyncing ? "Syncing..." : "Sync Typesense"}
          </Button>
        </form>
      </div>

      {!canManage ? (
        <p className="text-xs text-slate-500">
          Owner access is required to rebuild or sync search indexes.
        </p>
      ) : null}

      {[rebuildState, syncState].map((state, index) =>
        state.status === "idle" || !state.message ? null : (
          <p
            key={index}
            className={
              state.status === "success"
                ? "rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
                : "rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            }
          >
            {state.message}
          </p>
        ),
      )}
    </div>
  );
}
