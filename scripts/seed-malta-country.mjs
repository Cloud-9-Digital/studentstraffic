/**
 * Seed Malta as a country destination for BSc Nursing.
 * Source: Students Traffic Malta MCAST Nursing Complete Guide, June 2026.
 * Run: node scripts/seed-malta-country.mjs
 */
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const MALTA_COUNTRY = {
  slug: "malta",
  name: "Malta",
  region: "Europe",
  summary:
    "Malta is the smallest EU member state — a compact Mediterranean island of 550,000 people south of Sicily — and the only EU country where English is an official language alongside Maltese. For Indian nursing students, this combination is unique: you can study, register, and work as a nurse entirely in English, with an EU-recognised qualification under EU Directive 2005/36/EC valid across all 27 member states. The primary nursing institution is MCAST (Malta College of Arts, Science and Technology), Malta's largest public institution, which offers two pathways: a 3-year BSc (Hons) Nursing for students entering from a qualifying health-sciences background, and a 6-month Nursing Bridging Course for Indian BSc Nursing graduates who want EU registration. After completing either programme and working as a CNM-registered nurse in Malta for one year, Indian nurses can register with the UK NMC with IELTS and OET completely waived — because the UK NMC lists Malta as an English-speaking country. Malta is an EU and Schengen Area member; a Maltese residence permit gives full Schengen mobility across 27 European countries. After 5 years of working and residing in Malta, non-EU professionals are eligible for EU Long-Term Residence status.",
  whyStudentsChooseIt:
    "Indian nursing students choose Malta for three reasons that no other EU country offers simultaneously. First, English is an official language — healthcare is delivered in English, there is no language integration barrier after graduation, and no post-study language investment is required to practise nursing. Second, the MCAST nursing qualification is recognised across all 27 EU member states under EU Directive 2005/36/EC, opening career pathways to Germany, Ireland, the Netherlands, and every other EU country. Third — and most powerfully — after just one year working as a registered nurse in Malta, Indian nurses become eligible for UK NMC registration with IELTS and OET completely waived. For Indian nurses who find IELTS Academic 7.0 a barrier for direct UK NMC registration, the Malta route eliminates that obstacle entirely: only the CBT and OSCE are required. The MCAST Nursing Bridging Course (6 months, approximately EUR 7,000–13,000 all-in) is one of the most cost-effective EU-registration routes available to Indian BSc Nursing graduates. Malta is also 35–40% cheaper than the UK and approximately 30% cheaper than Ireland for living costs, while remaining fully inside the EU and Schengen Area.",
  climate:
    "Mediterranean climate with approximately 300 days of sunshine per year. Summers are hot and dry (June–September): 28–35°C, minimal rainfall, intense sun. Winters are mild and pleasant (November–February): 12–18°C, some rain, rarely cold by European standards. Spring and autumn are warm and ideal: 18–25°C. Malta has no winter hardship — a major contrast to northern European study destinations. Indian students from warm-weather regions adapt immediately; no significant clothing investment is needed for cold weather. The sea moderates temperatures year-round. The climate is a significant quality-of-life advantage compared to Germany, Lithuania, or Canada.",
  currencyCode: "EUR",
  metaTitle:
    "BSc Nursing in Malta for Indian Students 2026 | MCAST | EU-Recognised | UK NMC Shortcut",
  metaDescription:
    "Complete guide to nursing in Malta for Indian students — MCAST BSc (Hons) Nursing and 6-month Bridging Course, English-medium EU degree, UK NMC registration after 1 year without IELTS/OET, visa, costs, and PR pathway.",
};

async function seed() {
  const client = await pool.connect();

  try {
    console.log("Upserting country: Malta...");

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
        MALTA_COUNTRY.slug,
        MALTA_COUNTRY.name,
        MALTA_COUNTRY.region,
        MALTA_COUNTRY.summary,
        MALTA_COUNTRY.whyStudentsChooseIt,
        MALTA_COUNTRY.climate,
        MALTA_COUNTRY.currencyCode,
        MALTA_COUNTRY.metaTitle,
        MALTA_COUNTRY.metaDescription,
      ]
    );

    const maltaId = result.rows[0].id;
    console.log(`Malta upserted (id=${maltaId})`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
