import "dotenv/config";
import { getDb } from "@/lib/db/core";
import { programOfferings, universities, countries } from "@/lib/db/schema";
import { eq, not, like, and, or } from "drizzle-orm";

async function main() {
  const db = getDb();
  if (!db) throw new Error("Missing DATABASE_URL");

  const rows = await db
    .select({
      slug: programOfferings.slug,
      annualTuitionUsd: programOfferings.annualTuitionUsd,
      totalTuitionUsd: programOfferings.totalTuitionUsd,
      feeVerifiedAt: programOfferings.feeVerifiedAt,
      yearlyCostBreakdown: programOfferings.yearlyCostBreakdown,
      countrySlug: universities.countrySlug,
    })
    .from(programOfferings)
    .leftJoin(universities, eq(programOfferings.universitySlug, universities.slug));

  // Group by country
  const byCountry: Record<string, typeof rows> = {};
  for (const r of rows) {
    const country = r.countrySlug ?? "unknown";
    // Skip Russia, Georgia, Vietnam
    if (country === "russia" || country === "georgia" || country === "vietnam") continue;
    if (!byCountry[country]) byCountry[country] = [];
    byCountry[country].push(r);
  }

  console.log("=== Non-Russia/Georgia/Vietnam Program Audit ===\n");

  for (const [country, programs] of Object.entries(byCountry).sort()) {
    console.log(`\n── ${country.toUpperCase()} (${programs.length} programs) ──`);
    for (const r of programs) {
      const bd = Array.isArray(r.yearlyCostBreakdown) ? r.yearlyCostBreakdown : [];
      const hasHostel = bd.some((row: any) => (row.hostelUsd ?? 0) > 0);
      const problems: string[] = [];
      if (!r.annualTuitionUsd) problems.push("no tuition");
      if (bd.length === 0)     problems.push("NO breakdown");
      if (bd.length > 0 && !hasHostel) problems.push("hostelUsd=0");
      if (!r.feeVerifiedAt)    problems.push("not verified");

      const icon = problems.length ? "❌" : "✅";
      const y1 = bd[0] as any;
      console.log(`  ${icon} ${r.slug}`);
      console.log(`     tuition=$${r.annualTuitionUsd}/yr | total=$${r.totalTuitionUsd} | breakdown:${bd.length}rows${y1 ? ` Y1-hostel=$${y1.hostelUsd ?? 0}` : ""}`);
      if (problems.length) console.log(`     ⚠️  ${problems.join(" | ")}`);
    }
  }
}

main().catch(console.error).finally(() => process.exit(0));
