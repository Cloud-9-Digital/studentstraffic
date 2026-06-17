/**
 * Seed Germany as a BSc Nursing country destination.
 * Source: Students Traffic Germany BSc Nursing research, June 2026.
 * Run: node scripts/seed-germany-bscn.mjs
 *
 * This script upserts Germany into the countries table.
 * Universities are added separately via individual seed scripts.
 */
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const GERMANY_COUNTRY = {
  slug: "germany",
  name: "Germany",
  region: "Europe",
  summary:
    "Germany is the largest economy in the European Union and the primary career destination for EU-trained Indian nurses worldwide. With a documented shortage of 150,000+ additional nurses by 2027 (Bundesagentur fur Arbeit), the German healthcare system is actively recruiting internationally educated nurses at salaries of EUR 2,800-3,800/month gross — a figure 10-15x higher than Indian hospital pay. For Indian students, Germany offers two distinct pathways: (1) Direct BSc Nursing study in Germany — 3-4 year dual study programmes (Duales Studium Pflege) at German Fachhochschulen (universities of applied sciences), combining academic nursing education with a paid hospital training contract generating EUR 1,000-1,200/month; (2) EU-to-Germany career migration — studying BSc Nursing in a lower-cost EU country (Lithuania, Albania) and obtaining German Anerkennung (credential recognition) via EU Directive 2005/36/EC. Both pathways lead to the same outcome: Pflegefachmann/-frau registration in Germany. The critical prerequisite for all routes is German language proficiency at B2 level — non-negotiable for all nursing degree programmes and for the Anerkennung recognition process. Germany is an EU and Schengen Area founding member; a German residence permit gives full Schengen mobility across 26 European countries.",
  whyStudentsChooseIt:
    "India's nurses choose Germany for one compelling reason: salary. Germany's entry-level registered nurse (Pflegefachmann/-frau) earns EUR 2,800-3,800/month gross under the TVoD (public sector collective agreement) — approximately INR 2.5-3.4 lakhs per month, compared to INR 20,000-50,000/month in Indian hospitals. The 10-15x salary differential creates a powerful economic case, and Germany's nursing shortage makes job access highly reliable: 150,000+ additional nurses are needed by 2027 and the Fachkrafteeinwanderungsgesetz (Skilled Immigration Act, 2023) has streamlined immigration specifically for qualified nurses from third countries. For Indian students choosing the direct German study pathway, the Duales Studium Pflege is uniquely advantageous: hospitals pay a monthly training allowance of EUR 1,000-1,200 during the programme, partially offsetting Germany's higher living costs. For Indian students who completed BSc Nursing in Lithuania or Albania, Germany is the natural next step — the EU Directive 2005/36/EC Anerkennung pathway converts an EU nursing degree into full German nursing registration. Germany's quality-of-life, healthcare infrastructure, and long-term permanent residency pathway (after 2-4 years of skilled employment) make it the single most strategically valuable European nursing career destination for Indian nursing graduates.",
  climate:
    "Temperate oceanic climate with four distinct seasons. Summers: 20-30°C (May-September), warm and pleasant with long daylight hours. Winters: 0 to -5°C (November-February), cold with overcast skies and snow, heavier in Bavaria and eastern Germany. Spring and autumn are mild at 8-18°C. Southern Germany (Bavaria, Baden-Wurttemberg) has colder, snowier winters; northern cities (Hamburg, Bremen) are milder. Berlin has a more continental climate. Indian students should budget INR 15,000-25,000 for a quality winter wardrobe in Year 1. Germany's indoor heating infrastructure is excellent and public transport runs reliably in all weather.",
  currencyCode: "EUR",
  metaTitle:
    "BSc Nursing in Germany for Indian Students 2026 | Dual Study, Anerkennung & Career Guide",
  metaDescription:
    "Complete guide to studying nursing in Germany for Indian students — dual study programmes, German B2 requirement, APS certificate, EUR 2,800-3,800/month salary, Anerkennung pathway from Lithuania/Albania, and living costs by city.",
};

async function seed() {
  const client = await pool.connect();

  try {
    console.log("Upserting country: Germany...");

    const result = await client.query(
      `
      INSERT INTO countries (
        slug, name, region, summary,
        why_students_choose_it, climate, currency_code,
        meta_title, meta_description,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7,
        $8, $9,
        NOW(), NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        name                   = EXCLUDED.name,
        region                 = EXCLUDED.region,
        summary                = EXCLUDED.summary,
        why_students_choose_it = EXCLUDED.why_students_choose_it,
        climate                = EXCLUDED.climate,
        currency_code          = EXCLUDED.currency_code,
        meta_title             = EXCLUDED.meta_title,
        meta_description       = EXCLUDED.meta_description,
        updated_at             = NOW()
      RETURNING id
      `,
      [
        GERMANY_COUNTRY.slug,
        GERMANY_COUNTRY.name,
        GERMANY_COUNTRY.region,
        GERMANY_COUNTRY.summary,
        GERMANY_COUNTRY.whyStudentsChooseIt,
        GERMANY_COUNTRY.climate,
        GERMANY_COUNTRY.currencyCode,
        GERMANY_COUNTRY.metaTitle,
        GERMANY_COUNTRY.metaDescription,
      ]
    );

    const germanyId = result.rows[0].id;
    console.log(`Germany upserted (id=${germanyId})`);
    console.log("Germany BSc Nursing country seed complete.");
    console.log("Add universities via individual seed scripts.");
  } catch (err) {
    console.error("FATAL:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
