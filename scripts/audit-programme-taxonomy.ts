import "dotenv/config";

import { Pool } from "@neondatabase/serverless";

type LegacyOffering = {
  university_slug: string;
  offering_slug: string;
  title: string;
  course_slug: string;
  official_program_url: string;
};

function recommendation(row: LegacyOffering) {
  if (row.course_slug === "medical-pg") {
    return {
      status: "hold_for_research",
      proposedCanonicalSlug: null,
      reason: "A named speciality/residency cannot be verified from this generic title.",
    };
  }

  if (/integrated|single[- ]cycle|master/i.test(row.title)) {
    return {
      status: "review_mapping",
      proposedCanonicalSlug: "integrated-mpharm",
      reason: "The title indicates an integrated or single-cycle master's award.",
    };
  }

  if (/bachelor|b\.?\s?pharm/i.test(row.title)) {
    return {
      status: "review_mapping",
      proposedCanonicalSlug: "bpharm",
      reason: "The title indicates a bachelor's pharmacy award.",
    };
  }

  return {
    status: "hold_for_research",
    proposedCanonicalSlug: null,
    reason: "The pharmacy award level is not clear from the title.",
  };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const result = await pool.query<LegacyOffering>(`
      SELECT
        u.slug AS university_slug,
        po.slug AS offering_slug,
        po.title,
        c.slug AS course_slug,
        po.official_program_url
      FROM program_offerings po
      INNER JOIN universities u ON u.id = po.university_id
      INNER JOIN courses c ON c.id = po.course_id
      WHERE c.slug IN ('medical-pg', 'pharmacy')
      ORDER BY c.slug, u.slug, po.slug
    `);

    const report = result.rows.map((row) => ({ ...row, ...recommendation(row) }));
    console.log(JSON.stringify({ generatedAt: new Date().toISOString(), report }, null, 2));
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
