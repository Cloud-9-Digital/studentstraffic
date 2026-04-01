import "dotenv/config";

import { Pool, type PoolClient, neonConfig } from "@neondatabase/serverless";
import { WebSocket } from "ws";

import { env } from "@/lib/env";
import { landingPages } from "@/lib/data/landing-pages";
import { buildSearchDocuments } from "@/lib/search/documents";
import type {
  Country,
  Course,
  ProgramOffering,
  University,
} from "@/lib/data/types";

neonConfig.webSocketConstructor = WebSocket;

async function setupSearchInfrastructure(
  client: PoolClient
) {
  await client.query(`CREATE EXTENSION IF NOT EXISTS pg_search`);
  await client.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
  await client.query(`CREATE EXTENSION IF NOT EXISTS vector`);
}

async function rebuildSearchIndexes(
  client: PoolClient
) {
  await client.query(`DROP INDEX IF EXISTS search_documents_bm25_idx`);
  await client.query(`
    CREATE INDEX search_documents_bm25_idx
    ON search_documents
    USING bm25 (
      id,
      title,
      subtitle,
      summary,
      search_text
    )
    WITH (
      key_field='id'
    )
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS search_documents_title_trgm_idx
    ON search_documents
    USING gin (title gin_trgm_ops)
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS search_documents_subtitle_trgm_idx
    ON search_documents
    USING gin (subtitle gin_trgm_ops)
  `);
}

async function readCatalogFromDb(client: PoolClient) {
  const [countryRows, courseRows, universityRows, programRows] =
    await Promise.all([
      client.query(`SELECT * FROM countries`),
      client.query(`SELECT * FROM courses`),
      client.query(`
        SELECT u.*, c.slug as country_slug
        FROM universities u
        JOIN countries c ON c.id = u.country_id
        WHERE u.published = true
      `),
      client.query(`
        SELECT po.*, u.slug as university_slug, c.slug as course_slug
        FROM program_offerings po
        JOIN universities u ON u.id = po.university_id
        JOIN courses c ON c.id = po.course_id
        WHERE po.published = true
          AND u.published = true
      `),
    ]);

  const countries: Country[] = countryRows.rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    region: r.region,
    summary: r.summary,
    whyStudentsChooseIt: r.why_students_choose_it,
    climate: r.climate,
    currencyCode: r.currency_code,
    metaTitle: r.meta_title,
    metaDescription: r.meta_description,
  }));

  const courses: Course[] = courseRows.rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    shortName: r.short_name,
    durationYears: r.duration_years,
    summary: r.summary,
    metaTitle: r.meta_title,
    metaDescription: r.meta_description,
  }));

  const universities: University[] = universityRows.rows.map((r) => ({
    slug: r.slug,
    countrySlug: r.country_slug,
    name: r.name,
    city: r.city,
    type: r.type,
    establishedYear: r.established_year,
    summary: r.summary,
    featured: r.featured,
    published: r.published,
    officialWebsite: r.official_website,
    logoUrl: r.logo_url ?? undefined,
    coverImageUrl: r.cover_image_url ?? undefined,
    campusLifestyle: r.campus_lifestyle,
    cityProfile: r.city_profile,
    clinicalExposure: r.clinical_exposure,
    hostelOverview: r.hostel_overview,
    indianFoodSupport: r.indian_food_support,
    safetyOverview: r.safety_overview,
    studentSupport: r.student_support,
    whyChoose: r.why_choose ?? [],
    thingsToConsider: r.things_to_consider ?? [],
    bestFitFor: r.best_fit_for ?? [],
    teachingHospitals: r.teaching_hospitals,
    recognitionBadges: r.recognition_badges ?? [],
    recognitionLinks: r.recognition_links ?? [],
    faq: r.faq ?? [],
    similarUniversitySlugs: r.similar_university_slugs ?? [],
    lastVerifiedAt: r.last_verified_at ?? undefined,
    researchSources: r.research_sources ?? [],
    researchNotes: r.research_notes ?? undefined,
  }));

  const programOfferings: ProgramOffering[] = programRows.rows.flatMap((r) => {
    if (!r.university_slug || !r.course_slug) {
      return [];
    }

    return [{
      slug: r.slug,
      universitySlug: r.university_slug,
      courseSlug: r.course_slug,
      title: r.title,
      durationYears: r.duration_years,
      annualTuitionUsd: r.annual_tuition_usd,
      totalTuitionUsd: r.total_tuition_usd,
      livingUsd: r.living_usd,
      officialFeeCurrency: r.official_fee_currency ?? undefined,
      officialAnnualTuitionAmount: r.official_annual_tuition_amount ?? undefined,
      officialTotalTuitionAmount: r.official_total_tuition_amount ?? undefined,
      officialProgramUrl: r.official_program_url,
      medium: r.medium,
      published: r.published,
      teachingPhases: r.teaching_phases ?? [],
      yearlyCostBreakdown: r.yearly_cost_breakdown ?? [],
      licenseExamSupport: r.license_exam_support ?? [],
      intakeMonths: r.intake_months ?? [],
      feeVerifiedAt: r.fee_verified_at ?? undefined,
      fxRateDate: r.fx_rate_date ?? undefined,
      fxRateSourceUrl: r.fx_rate_source_url ?? undefined,
      feeNotes: r.fee_notes ?? undefined,
      sourceUrls: r.source_urls ?? [],
      featured: r.featured,
    }];
  });

  return { countries, courses, universities, programOfferings };
}

async function seed() {
  if (!env.databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing. Add it to .env.local before running the seed."
    );
  }

  const pool = new Pool({ connectionString: env.databaseUrl });
  const client = await pool.connect();

  try {
    await setupSearchInfrastructure(client);

    const { countries, courses, universities, programOfferings } =
      await readCatalogFromDb(client);

    const searchDocuments = buildSearchDocuments({
      countries,
      courses,
      universities,
      programOfferings,
      landingPages,
    });

    await client.query("BEGIN");
    await client.query("DELETE FROM search_documents");

    for (const document of searchDocuments) {
      await client.query(
        `INSERT INTO search_documents (
          document_type,
          source_slug,
          path,
          title,
          subtitle,
          summary,
          search_text,
          highlights,
          country_slug,
          course_slug,
          university_slug,
          city,
          featured,
          annual_tuition_usd,
          medium,
          intake_months
        ) VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8::jsonb,
          $9,
          $10,
          $11,
          $12,
          $13,
          $14,
          $15,
          $16
        )`,
        [
          document.documentType,
          document.sourceSlug,
          document.path,
          document.title,
          document.subtitle ?? null,
          document.summary,
          document.searchText,
          JSON.stringify(document.highlights),
          document.countrySlug ?? null,
          document.courseSlug ?? null,
          document.universitySlug ?? null,
          document.city ?? null,
          document.featured,
          document.annualTuitionUsd ?? null,
          document.medium ?? null,
          document.intakeMonths,
        ]
      );
    }

    await client.query("COMMIT");
    await rebuildSearchIndexes(client);
    console.log(`Seed complete. Indexed ${searchDocuments.length} documents.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
