import "server-only";

import { unstable_cache } from "next/cache";
import { sql } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";

export type LeadFilterOption = {
  value: string | null;
};

export type LeadFilterOptions = {
  sourcePathOptions: LeadFilterOption[];
  countryOptions: LeadFilterOption[];
  seminarEventOptions: LeadFilterOption[];
};

export const getCachedLeadFilterOptions = unstable_cache(
  async (): Promise<LeadFilterOptions> => {
    const db = getDb();

    if (!db) {
      return {
        sourcePathOptions: [],
        countryOptions: [],
        seminarEventOptions: [],
      };
    }

    const [sourcePathOptions, countryOptions, seminarEventOptions] = await Promise.all([
      db
        .selectDistinct({ value: leads.sourcePath })
        .from(leads)
        .where(sql`${leads.sourcePath} IS NOT NULL`)
        .orderBy(leads.sourcePath),
      db
        .selectDistinct({ value: leads.interestedCountry })
        .from(leads)
        .where(sql`${leads.interestedCountry} IS NOT NULL`)
        .orderBy(leads.interestedCountry),
      db
        .selectDistinct({ value: leads.seminarEvent })
        .from(leads)
        .where(sql`${leads.seminarEvent} IS NOT NULL`)
        .orderBy(leads.seminarEvent),
    ]);

    return {
      sourcePathOptions,
      countryOptions,
      seminarEventOptions,
    };
  },
  ["admin-lead-filter-options"],
  {
    revalidate: 300,
    tags: ["admin-leads"],
  },
);
