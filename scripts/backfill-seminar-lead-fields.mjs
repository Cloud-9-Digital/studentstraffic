#!/usr/bin/env node

/**
 * Backfill city and seminarEvent columns for existing seminar leads
 *
 * Parses the notes field for patterns like:
 * "Attending: Chennai — 10 May 2026 | Home city: Coimbatore"
 *
 * Usage: node scripts/backfill-seminar-lead-fields.mjs [--dry-run]
 */

import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);
const isDryRun = process.argv.includes("--dry-run");

console.log(isDryRun ? "🔍 DRY RUN MODE - No changes will be made\n" : "🚀 Starting backfill...\n");

// Pattern: "Attending: {seminarEvent} | Home city: {city}"
const PATTERN = /Attending:\s*(.+?)\s*\|\s*Home city:\s*(.+?)(?:\n|$)/i;

async function backfillSeminarLeads() {
  // Find leads where city or seminarEvent is null but notes contains the pattern
  const candidateLeads = await sql`
    SELECT
      id,
      full_name,
      city,
      seminar_event,
      notes
    FROM leads
    WHERE (city IS NULL OR seminar_event IS NULL)
      AND notes IS NOT NULL
      AND notes LIKE '%Attending:%Home city:%'
    LIMIT 1000
  `;

  console.log(`📋 Found ${candidateLeads.length} leads to check\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const lead of candidateLeads) {
    const match = lead.notes?.match(PATTERN);

    if (!match) {
      skipped++;
      continue;
    }

    const seminarEvent = match[1]?.trim();
    const city = match[2]?.trim();

    if (!seminarEvent || !city) {
      skipped++;
      continue;
    }

    console.log(`📝 Lead #${lead.id} - ${lead.full_name}`);
    console.log(`   Current seminar: ${lead.seminar_event || '(null)'}`);
    console.log(`   Current city: ${lead.city || '(null)'}`);
    console.log(`   Extracted seminar: ${seminarEvent}`);
    console.log(`   Extracted city: ${city}`);

    if (isDryRun) {
      console.log(`   ✓ Would update (dry run)\n`);
      updated++;
      continue;
    }

    try {
      await sql`
        UPDATE leads
        SET
          city = COALESCE(city, ${city}),
          seminar_event = COALESCE(seminar_event, ${seminarEvent})
        WHERE id = ${lead.id}
      `;

      console.log(`   ✓ Updated\n`);
      updated++;
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}\n`);
      failed++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("📊 Summary:");
  console.log(`   ✅ Updated: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log("=".repeat(50));

  if (isDryRun) {
    console.log("\n💡 Run without --dry-run to apply changes");
  }
}

backfillSeminarLeads()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  });
