import "dotenv/config";

import { Pool, type PoolClient, neonConfig } from "@neondatabase/serverless";
import { WebSocket } from "ws";

import { env } from "@/lib/env";
import {
  countries,
  courses,
  landingPages,
  programOfferings,
  universities,
} from "@/lib/data/demo-dataset";
import { buildSearchDocuments } from "@/lib/search/documents";

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

async function seed() {
  if (!env.databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing. Add it to .env.local before running the seed."
    );
  }

  const pool = new Pool({ connectionString: env.databaseUrl });
  const client = await pool.connect();
  const searchDocuments = buildSearchDocuments({
    countries,
    courses,
    universities,
    programOfferings,
    landingPages,
  });

  try {
    await setupSearchInfrastructure(client);

    await client.query("BEGIN");
    await client.query("DELETE FROM search_documents");
    await client.query("DELETE FROM program_offerings");
    await client.query("DELETE FROM universities");
    await client.query("DELETE FROM courses");
    await client.query("DELETE FROM countries");

    for (const country of countries) {
      await client.query(
        `INSERT INTO countries (
          slug,
          name,
          region,
          summary,
          why_students_choose_it,
          climate,
          currency_code,
          meta_title,
          meta_description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          country.slug,
          country.name,
          country.region,
          country.summary,
          country.whyStudentsChooseIt,
          country.climate,
          country.currencyCode,
          country.metaTitle,
          country.metaDescription,
        ]
      );
    }

    for (const course of courses) {
      await client.query(
        `INSERT INTO courses (
          slug,
          name,
          short_name,
          duration_years,
          summary,
          meta_title,
          meta_description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          course.slug,
          course.name,
          course.shortName,
          course.durationYears,
          course.summary,
          course.metaTitle,
          course.metaDescription,
        ]
      );
    }

    for (const university of universities) {
      await client.query(
        `INSERT INTO universities (
          country_id,
          slug,
          name,
          city,
          type,
          established_year,
          summary,
          featured,
          logo_url,
          cover_image_url,
          gallery_images,
          official_website,
          campus_lifestyle,
          city_profile,
          clinical_exposure,
          hostel_overview,
          indian_food_support,
          safety_overview,
          student_support,
          why_choose,
          things_to_consider,
          best_fit_for,
          teaching_hospitals,
          recognition_badges,
          recognition_links,
          faq,
          "references",
          similar_university_slugs
        ) VALUES (
          (SELECT id FROM countries WHERE slug = $1),
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11::jsonb,
          $12,
          $13,
          $14,
          $15,
          $16,
          $17,
          $18,
          $19,
          $20::jsonb,
          $21::jsonb,
          $22::jsonb,
          $23,
          $24,
          $25::jsonb,
          $26::jsonb,
          $27::jsonb,
          $28
        )`,
        [
          university.countrySlug,
          university.slug,
          university.name,
          university.city,
          university.type,
          university.establishedYear,
          university.summary,
          university.featured,
          university.logoUrl ?? null,
          university.coverImageUrl ?? null,
          JSON.stringify(university.galleryImages),
          university.officialWebsite,
          university.campusLifestyle,
          university.cityProfile,
          university.clinicalExposure,
          university.hostelOverview,
          university.indianFoodSupport,
          university.safetyOverview,
          university.studentSupport,
          JSON.stringify(university.whyChoose),
          JSON.stringify(university.thingsToConsider),
          JSON.stringify(university.bestFitFor),
          university.teachingHospitals,
          university.recognitionBadges,
          JSON.stringify(university.recognitionLinks),
          JSON.stringify(university.faq),
          JSON.stringify(university.references),
          university.similarUniversitySlugs,
        ]
      );
    }

    for (const offering of programOfferings) {
      await client.query(
        `INSERT INTO program_offerings (
          university_id,
          course_id,
          slug,
          title,
          duration_years,
          annual_tuition_usd,
          total_tuition_usd,
          living_usd,
          official_program_url,
          medium,
          teaching_phases,
          yearly_cost_breakdown,
          license_exam_support,
          intake_months,
          featured
        ) VALUES (
          (SELECT id FROM universities WHERE slug = $1),
          (SELECT id FROM courses WHERE slug = $2),
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11::jsonb,
          $12::jsonb,
          $13::jsonb,
          $14,
          $15
        )`,
        [
          offering.universitySlug,
          offering.courseSlug,
          offering.slug,
          offering.title,
          offering.durationYears,
          offering.annualTuitionUsd,
          offering.totalTuitionUsd,
          offering.livingUsd,
          offering.officialProgramUrl,
          offering.medium,
          JSON.stringify(offering.teachingPhases),
          JSON.stringify(offering.yearlyCostBreakdown),
          JSON.stringify(offering.licenseExamSupport),
          offering.intakeMonths,
          offering.featured,
        ]
      );
    }

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
    console.log("Seed complete.");
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
