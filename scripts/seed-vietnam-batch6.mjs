/**
 * Seed Vietnam batch 6: add Cuu Long University (Mekong University) and update
 * VNU-UHS (University of Health Sciences, VNU Ho Chi Minh City) with enriched
 * content reflecting the June 2024 rebrand from School of Medicine.
 *
 * Run: node scripts/seed-vietnam-batch6.mjs
 */
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const VIETNAM_ID = 46;
const COURSE_MBBS_ID = 13;

const universities = [
  // ── 1. Cuu Long University ─────────────────────────────────────────────────
  {
    slug: "cuu-long-university-medicine",
    name: "Cuu Long University Faculty of Medicine",
    city: "Vinh Long",
    type: "Private",
    establishedYear: 2000,
    officialWebsite: "https://cuulong.university/",
    summary:
      "The first non-public university in Vietnam's Mekong Delta, Cuu Long University operates a Doctor of Medicine (y khoa) program from its 22.5-hectare campus in Vinh Long Province. The university follows an 'on-demand' training model that partners with healthcare employers, keeping program intake tightly linked to actual workforce need. Tuition is among the most affordable for medicine in Southern Vietnam, and the Mekong Delta location gives students clinical exposure to tropical disease profiles directly relevant to Indian return-practice.",
    campusLifestyle:
      "Cuu Long University's campus spans 22.5 hectares in Long Ho District, Vinh Long Province — a calm, mid-size Mekong Delta town rather than a crowded city. The environment is practical and community-oriented. Student life is quiet compared to Ho Chi Minh City; the focus is professional training rather than metropolitan campus culture. The university has grown rapidly since 2023, with 4,000 new students enrolled in 2025, a 150% increase over two years.",
    cityProfile:
      "Vinh Long is a provincial capital in the Mekong Delta, roughly 65 km from Can Tho and 135 km from Ho Chi Minh City. The city sits on the Tien River, with a cost of living significantly lower than Vietnam's major metros. Monthly expenses for a student average ₹8,000–12,000 (food, transport, essentials). The Mekong Delta environment — tropical climate, rice-growing region, river delta geography — exposes medical students to disease patterns (dengue, leptospirosis, tropical infections) highly relevant to Indian clinical practice.",
    clinicalExposure:
      "The university's on-demand training model means students enter employment-linked hospital ecosystems early. Cuu Long has formal healthcare employer partnerships where companies sponsor students for specific clinical roles post-graduation. The university's health sciences students have been documented in community medical outreach involving 4,000+ patients, which speaks to practical clinical exposure in the region. For specific teaching-hospital depth and rotation structure, students should verify directly.",
    hostelOverview:
      "The official Cuu Long University sources do not publish a detailed hostel explainer with per-room pricing. Vinh Long is a small enough city that most students arrange housing near campus privately, typically at very low cost compared to Hanoi or Ho Chi Minh City. Students should verify current accommodation options directly with the university.",
    indianFoodSupport:
      "There is no advertised India-specific dining at Cuu Long University. Vinh Long's Mekong Delta food culture is rice-based and vegetable-forward, which is generally easier for Indian students to adapt to than Northern or Central Vietnamese cuisine. Self-cooking with Indian staples is feasible given access to produce markets. A small Indian student community in this region is unlikely — students should plan independently.",
    safetyOverview:
      "Vinh Long is a low-crime provincial city. There is no documented safety concern for international students in this region of Vietnam. The campus environment is settled and community-facing. Road safety follows standard Vietnam precautions — motorbike traffic requires awareness when crossing streets.",
    studentSupport:
      "Cuu Long University has an active student welfare framework. In 2025, it offered 20–50% tuition reductions for new students in the first semester and has a scholarship program. The on-demand training model means some students receive a monthly living stipend of 3 million VND/month under employer-sponsored programs. International student infrastructure is not heavily marketed.",
    whyChoose: [
      "First non-public university in the Mekong Delta — established 2000, with 25 years of operation and a clearly identified medicine program.",
      "Tuition is among the most affordable for Doctor of Medicine in Southern Vietnam, at approximately 78 million VND/year (~$3,100 USD), with scholarships available.",
      "Mekong Delta clinical environment exposes students to tropical disease patterns (dengue, leptospirosis, typhoid, tropical infections) identical to what Indian doctors treat in South India.",
      "Employer-partnered training model with documented healthcare company MOU agreements, linking medicine graduates to post-graduation employment pathways.",
      "Vinh Long cost of living is the lowest in any Vietnamese university city in the catalog, with monthly student expenses significantly below Hanoi or Ho Chi Minh City.",
    ],
    thingsToConsider: [
      "The medicine program is taught in Vietnamese — international students need to account for a full language transition before and during clinical rotations.",
      "NMC recognition status should be independently verified before applying; the university's official directory sources listing should be confirmed at official regulator websites.",
      "The on-demand employer-partnership model means some intake slots are employer-reserved — applicants should verify open international seats for the relevant year.",
      "Vinh Long has no established Indian student network and very limited English-language services outside campus academic structures.",
      "As a private institution, Cuu Long's international standing for India-return licensing purposes (NExT/FMGE) requires direct verification rather than assumption.",
    ],
    bestFitFor: [
      "Students who are comfortable with full-immersion Vietnamese-medium training and have already achieved a working level of Vietnamese or are committed to acquiring it quickly.",
      "Families seeking the lowest total cost of study in Southern Vietnam and willing to prioritize cost over established Indian student community size.",
      "Students interested in tropical and rural medicine who want clinical exposure to the Mekong Delta's disease environment.",
      "Applicants exploring employer-sponsored or bonded medicine pathways where the university's company-partnership model could provide direct post-graduation placements.",
    ],
    teachingHospitals: [
      "Vinh Long General Hospital",
      "Mekong Delta regional healthcare network",
      "TTH Group healthcare employer partners",
    ],
    recognitionBadges: [
      "Private medical university — Vinh Long",
      "Vietnam Ministry of Education registered",
      "Employer-partnered training model",
    ],
    faq: [
      {
        question: "Where is Cuu Long University located?",
        answer:
          "Cuu Long University is in Long Ho District, Vinh Long Province — a Mekong Delta city about 135 km from Ho Chi Minh City.",
      },
      {
        question: "When was Cuu Long University established?",
        answer:
          "In 2000, as the first non-public (private) university in Vietnam's Mekong Delta region.",
      },
      {
        question: "What is the medicine tuition at Cuu Long University?",
        answer:
          "Approximately 78 million VND per academic year (~$3,100 USD) for the Doctor of Medicine program, with scholarships reducing costs for qualifying students.",
      },
      {
        question:
          "Is Cuu Long University NMC-recognized for Indian students?",
        answer:
          "NMC recognition status must be independently verified at nmc.org.in before applying. Do not rely on generic Vietnam MBBS lists — always verify the specific institution.",
      },
      {
        question:
          "What language is the medicine program taught in at Cuu Long?",
        answer:
          "Vietnamese is the primary language of instruction. Students must factor in full language transition before and during clinical years.",
      },
    ],
    admissionsContent: {
      overview:
        "Cuu Long University admits students to the Doctor of Medicine program through Vietnam's national university entrance system. For the 2026 intake, the university offers 38 majors including health sciences. The on-demand training model means some seats in the medicine program are allocated to employer-partner applicants. International student admissions should be confirmed directly with the university's admissions office.",
      licensingPathway: [
        "Graduates from Cuu Long University's medicine program hold a Vietnamese Doctor of Medicine degree.",
        "India-return licensing (NExT/FMGE) depends on NMC recognition of the specific institution — verify current status at nmc.org.in before applying.",
        "The Vietnamese internship year is typically embedded in the sixth year of the program.",
      ],
    },
    lastVerifiedAt: "2026-06-11",
    programs: [
      {
        slug: "cuu-long-university-mbbs-2026",
        title: "Doctor of Medicine (Y khoa)",
        durationYears: 6,
        officialAnnualTuitionAmount: 78000000,
        officialTotalTuitionAmount: 468000000,
        officialFeeCurrency: "VND",
        annualTuitionUsd: 3100,
        totalTuitionUsd: 18600,
        livingUsd: 2000,
        medium: "Vietnamese",
        officialProgramUrl: "https://cuulong.university/",
      },
    ],
  },

  // ── 2. VNU-UHS (update existing vnu-hcmc-school-of-medicine) ──────────────
  {
    slug: "vnu-hcmc-school-of-medicine",
    name: "University of Health Sciences, Vietnam National University Ho Chi Minh City (VNU-UHS)",
    city: "Di An City",
    type: "Public",
    establishedYear: 2009,
    officialWebsite: "https://en.uhsvnu.edu.vn/",
    summary:
      "The University of Health Sciences (VNU-UHS) is the 8th member institution of Vietnam National University Ho Chi Minh City, officially established in June 2024 from the former School of Medicine — VNU-HCM. The school pioneered Vietnam's first integrated modular medical curriculum in 2010, modelled on the Medical University of Vienna's approach. Its six-year Doctor of Medicine program is AUN-QA accredited, linked to major Ho Chi Minh City teaching hospitals, and backed by a published year-by-year tuition roadmap — making it one of the most verifiably structured medicine programs in Southern Vietnam.",
    campusLifestyle:
      "VNU-UHS is based in the VNU-HCM Urban Area in Di An City, Binh Duong Province — a quieter academic zone on the northern edge of greater Ho Chi Minh City. The campus environment is institutional and research-oriented rather than lifestyle-marketed. Students get access to the broader VNU-HCM ecosystem (multiple universities, research centres, student infrastructure) while being somewhat shielded from the density of inner HCMC.",
    cityProfile:
      "Di An City is administratively part of Binh Duong Province but is functionally a northeastern extension of Ho Chi Minh City. The VNU-HCM urban area has its own shops, transport links, and student services. Students who want the full HCMC experience can access the city in 20–40 minutes. Cost of living inside the VNU-HCM urban area is moderate — lower than inner HCMC, higher than a provincial city like Vinh Long or Can Tho.",
    clinicalExposure:
      "VNU-UHS operates on a school-hospital model. Its major teaching hospital partnerships include Binh Dan Hospital (strategic alliance formalized in 2010 and re-cemented in 2024), Children's Hospital 2, Ho Chi Minh City Hospital of Traditional Medicine, and 115 People's Hospital. The 6-year curriculum moves from integrated foundation sciences into long clinical-rotation phases, aligned to AUN-QA competency standards.",
    hostelOverview:
      "The VNU-HCM urban area has an integrated student accommodation ecosystem. On-campus housing options and off-campus private housing near the university are both available. Specific room types, pricing, and policies should be confirmed directly with VNU-UHS. Housing here is less expensive than accommodation in inner Ho Chi Minh City.",
    indianFoodSupport:
      "The official VNU-UHS materials do not advertise dedicated India-specific food support. Di An City and the VNU-HCM urban area have student-facing restaurants and convenience stores. Indian grocery items require a trip into Ho Chi Minh City proper. Students from South India generally adapt to Vietnamese food quickly — both cuisines are rice and vegetable-forward.",
    safetyOverview:
      "The VNU-HCM urban area is a planned university zone with controlled access and a generally safe campus environment. The university publishes structured academic and institutional materials rather than generic safety pledges — a reliable trust signal. Students report no significant safety concerns in the Di An City campus area.",
    studentSupport:
      "VNU-UHS provides a published tuition roadmap, structured admissions materials, and academic support through the VNU-HCM university system. Its LMS and student portals are well-established. The university does not operate a high-volume agent-driven international recruitment programme, which means prospective students get direct institutional information rather than agent-inflated pitches.",
    whyChoose: [
      "AUN-QA accredited Doctor of Medicine programme — the first medical programme in the institution to achieve ASEAN-standard quality certification.",
      "Pioneer of Vietnam's first integrated modular medical curriculum (since 2010), modelled on the Medical University of Vienna — significantly more advanced than most Vietnam medical school formats.",
      "Official year-by-year tuition roadmap published at 62.2 million VND/year (~$2,450 USD) — one of the most transparent fee structures in the Vietnam catalog.",
      "Strategic clinical partnerships with Binh Dan Hospital, Children's Hospital 2, and Ho Chi Minh City Hospital of Traditional Medicine — active since 2010.",
      "Part of the VNU-HCM system, Vietnam's most prestigious university network, providing research depth, faculty quality, and institutional infrastructure well above standalone private medical schools.",
    ],
    thingsToConsider: [
      "The Doctor of Medicine programme is taught in Vietnamese — international students require a full language transition before and during clinical rotations.",
      "Di An City is quieter than inner Ho Chi Minh City — students who want an urban lifestyle will need to commute.",
      "The university was formally established as VNU-UHS only in June 2024; some older sources still refer to it as 'School of Medicine — VNU-HCM'.",
      "NMC recognition status for India-return licensing should be independently verified at nmc.org.in for the current year.",
      "The integrated modular curriculum is academically demanding — designed to produce high-quality graduates, not to minimise intensity for international fee-paying students.",
    ],
    bestFitFor: [
      "Students who want the most rigorous and accredited public medical education available in Southern Vietnam.",
      "Applicants who value proximity to Ho Chi Minh City's medical ecosystem while keeping costs lower than inner-city housing.",
      "Students motivated by a Vienna-model integrated curriculum with documented AUN-QA accreditation rather than a generic textbook-lecture format.",
      "Families who want verifiable fee documentation and strong institutional transparency before committing.",
    ],
    teachingHospitals: [
      "Binh Dan Hospital (strategic partner since 2010)",
      "Children's Hospital 2, Ho Chi Minh City",
      "Ho Chi Minh City Hospital of Traditional Medicine",
      "115 People's Hospital, Ho Chi Minh City",
    ],
    recognitionBadges: [
      "AUN-QA Accredited — Doctor of Medicine programme",
      "Public — VNU-HCM system member",
      "Published official tuition roadmap",
      "Vienna-model integrated modular curriculum",
    ],
    faq: [
      {
        question:
          "What is the difference between VNU-UHS and the old 'School of Medicine — VNU-HCM'?",
        answer:
          "They are the same institution. On June 3rd, 2024, the Vietnamese Prime Minister signed Decision No. 472/QĐ-TTg officially establishing the University of Health Sciences (UHS) as an independent member of VNU-HCM. Before that, it operated as the School of Medicine — VNU-HCM since 2009.",
      },
      {
        question:
          "What tuition does VNU-UHS charge for the Doctor of Medicine programme?",
        answer:
          "The published 2025-2026 tuition roadmap lists 62.2 million VND per academic year for General Medicine — approximately $2,450 USD at current exchange rates.",
      },
      {
        question: "Is VNU-UHS accredited?",
        answer:
          "Yes. The Doctor of Medicine programme at VNU-UHS is AUN-QA accredited — the first programme in the institution to achieve ASEAN University Network quality certification.",
      },
      {
        question: "What teaching hospitals does VNU-UHS use?",
        answer:
          "Primary partners include Binh Dan Hospital (strategic alliance since 2010), Children's Hospital 2, Ho Chi Minh City Hospital of Traditional Medicine, and 115 People's Hospital.",
      },
      {
        question: "What curriculum model does VNU-UHS use?",
        answer:
          "An integrated modular curriculum modelled on the Medical University of Vienna — the first of its kind in Vietnam when introduced in 2009-2010. It integrates basic sciences, clinical reasoning, and patient exposure from early years rather than separating them into rigid phases.",
      },
    ],
    admissionsContent: {
      overview:
        "VNU-UHS admits students to the six-year Doctor of Medicine programme through Vietnam's national university entrance examination system. Admission is score-based and competitive — as a VNU-HCM member institution, it typically draws high-scoring applicants. For the 2025-2026 year the university welcomed 1,065 new students across all programmes. International student applications should be directed to the VNU-HCM international admissions office.",
      licensingPathway: [
        "Graduates hold a Doctor of Medicine (Bác sĩ y khoa) degree from VNU-UHS, a public VNU-HCM member institution.",
        "India-return licensing under NExT/FMGE requires NMC recognition of the specific institution — verify at nmc.org.in before applying.",
        "The AUN-QA accreditation and official published curriculum strengthen the institution's documentation trail compared to lightly verified private-school pages.",
      ],
    },
    lastVerifiedAt: "2026-06-11",
    programs: [
      {
        slug: "vnu-hcmc-school-of-medicine-mbbs",
        title: "Doctor of Medicine",
        durationYears: 6,
        officialAnnualTuitionAmount: 62200000,
        officialTotalTuitionAmount: 373200000,
        officialFeeCurrency: "VND",
        annualTuitionUsd: 2450,
        totalTuitionUsd: 14700,
        livingUsd: 2400,
        medium: "Vietnamese",
        officialProgramUrl:
          "https://en.uhsvnu.edu.vn/medical-training-programme-academic-year-2023/",
      },
    ],
  },
];

async function seed() {
  console.log("=== Vietnam Batch 6: Cuu Long University + VNU-UHS update ===\n");
  const client = await pool.connect();

  try {
    for (const uni of universities) {
      console.log(`Processing: ${uni.name}...`);

      const uniResult = await client.query(
        `
        INSERT INTO universities (
          country_id, slug, name, city, type, established_year, summary,
          published, featured, official_website,
          campus_lifestyle, city_profile, practical_exposure,
          hostel_overview, dietary_support, safety_overview, student_support,
          why_choose, things_to_consider, best_fit_for,
          industry_partners, recognition_badges, faq,
          admissions_content, last_verified_at,
          updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10,
          $11, $12, $13,
          $14, $15, $16, $17,
          $18, $19, $20,
          $21, $22, $23,
          $24, $25,
          NOW()
        )
        ON CONFLICT (slug) DO UPDATE SET
          name                = EXCLUDED.name,
          city                = EXCLUDED.city,
          type                = EXCLUDED.type,
          established_year    = EXCLUDED.established_year,
          summary             = EXCLUDED.summary,
          published           = EXCLUDED.published,
          featured            = EXCLUDED.featured,
          official_website    = EXCLUDED.official_website,
          campus_lifestyle    = EXCLUDED.campus_lifestyle,
          city_profile        = EXCLUDED.city_profile,
          practical_exposure   = EXCLUDED.practical_exposure,
          hostel_overview     = EXCLUDED.hostel_overview,
          dietary_support = EXCLUDED.dietary_support,
          safety_overview     = EXCLUDED.safety_overview,
          student_support     = EXCLUDED.student_support,
          why_choose          = EXCLUDED.why_choose,
          things_to_consider  = EXCLUDED.things_to_consider,
          best_fit_for        = EXCLUDED.best_fit_for,
          industry_partners  = EXCLUDED.industry_partners,
          recognition_badges  = EXCLUDED.recognition_badges,
          faq                 = EXCLUDED.faq,
          admissions_content  = EXCLUDED.admissions_content,
          last_verified_at    = EXCLUDED.last_verified_at,
          updated_at          = NOW()
        RETURNING id;
        `,
        [
          VIETNAM_ID,
          uni.slug,
          uni.name,
          uni.city,
          uni.type,
          uni.establishedYear,
          uni.summary,
          true,
          false,
          uni.officialWebsite,
          uni.campusLifestyle,
          uni.cityProfile,
          uni.clinicalExposure,
          uni.hostelOverview,
          uni.indianFoodSupport,
          uni.safetyOverview,
          uni.studentSupport,
          JSON.stringify(uni.whyChoose),
          JSON.stringify(uni.thingsToConsider),
          JSON.stringify(uni.bestFitFor),
          uni.teachingHospitals,
          uni.recognitionBadges,
          JSON.stringify(uni.faq),
          JSON.stringify(uni.admissionsContent),
          uni.lastVerifiedAt,
        ]
      );

      const universityId = uniResult.rows[0].id;
      console.log(`  ✓ University upserted with id=${universityId}`);

      for (const prog of uni.programs) {
        await client.query(
          `
          INSERT INTO program_offerings (
            university_id, course_id, slug, title,
            duration_years, annual_tuition_usd, total_tuition_usd, living_usd,
            official_annual_tuition_amount, official_total_tuition_amount, official_fee_currency,
            medium, official_program_url, published,
            updated_at
          ) VALUES (
            $1, $2, $3, $4,
            $5, $6, $7, $8,
            $9, $10, $11,
            $12, $13, $14,
            NOW()
          )
          ON CONFLICT (slug) DO UPDATE SET
            title                        = EXCLUDED.title,
            duration_years               = EXCLUDED.duration_years,
            annual_tuition_usd           = EXCLUDED.annual_tuition_usd,
            total_tuition_usd            = EXCLUDED.total_tuition_usd,
            living_usd                   = EXCLUDED.living_usd,
            official_annual_tuition_amount = EXCLUDED.official_annual_tuition_amount,
            official_total_tuition_amount  = EXCLUDED.official_total_tuition_amount,
            official_fee_currency        = EXCLUDED.official_fee_currency,
            medium                       = EXCLUDED.medium,
            official_program_url         = EXCLUDED.official_program_url,
            published                    = EXCLUDED.published,
            updated_at                   = NOW();
          `,
          [
            universityId,
            COURSE_MBBS_ID,
            prog.slug,
            prog.title,
            prog.durationYears,
            prog.annualTuitionUsd,
            prog.totalTuitionUsd,
            prog.livingUsd,
            prog.officialAnnualTuitionAmount,
            prog.officialTotalTuitionAmount,
            prog.officialFeeCurrency,
            prog.medium,
            prog.officialProgramUrl,
            true,
          ]
        );
        console.log(`  ✓ Program upserted: ${prog.slug}`);
      }

      console.log();
    }
  } catch (err) {
    console.error("FATAL:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }

  console.log("✅ Vietnam Batch 6 complete.");
  console.log("   Added:   cuu-long-university-medicine");
  console.log("   Updated: vnu-hcmc-school-of-medicine → VNU-UHS (June 2024 rebrand)");
}

seed();
