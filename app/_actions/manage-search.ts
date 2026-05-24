"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth";
import {
  rebuildPostgresSearchIndex,
  syncTypesenseSearchIndex,
} from "@/lib/search/admin";

export type SearchAdminActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function rebuildSearchIndexAction(): Promise<SearchAdminActionState> {
  await requireAdminSession({ minimumRole: "owner" });

  try {
    const result = await rebuildPostgresSearchIndex();
    revalidatePath("/admin/search");

    return {
      status: "success",
      message: `Rebuilt Postgres search index with ${result.indexed.toLocaleString()} documents.`,
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Search rebuild failed.",
    };
  }
}

export async function syncTypesenseSearchAction(): Promise<SearchAdminActionState> {
  await requireAdminSession({ minimumRole: "owner" });

  try {
    const result = await syncTypesenseSearchIndex();
    revalidatePath("/admin/search");

    return {
      status: "success",
      message: `Synced ${result.imported.toLocaleString()} documents to Typesense.`,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Typesense search sync failed.",
    };
  }
}
