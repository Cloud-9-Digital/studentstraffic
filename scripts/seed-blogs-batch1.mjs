/**
 * Seed batch 1: Kazakhstan + NEET cutoff blog posts
 * Run: node scripts/seed-blogs-batch1.mjs
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import readingTime from "reading-time";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const envContent = readFileSync(join(root, ".env"), "utf8");
const env = Object.fromEntries(
  envContent.split("\n").filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^['"]|['"]$/g,"")]; })
);
cloudinary.config({ cloud_name: env.CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET });

const BRAIN = "/Users/bharat/.gemini/antigravity/brain/6120125f-960e-4e07-a96e-a884a178093f";

async function uploadImage(localPath, publicId) {
  try { const e = await cloudinary.api.resource(publicId); console.log(`  [skip] ${publicId}`); return e.secure_url; } catch {}
  const r = await cloudinary.uploader.upload(localPath, { public_id: publicId, overwrite: false });
  console.log(`  [ok] ${r.secure_url}`); return r.secure_url;
}

const posts = [
  {
    slug: "mbbs-in-kazakhstan-2026-complete-guide",
    category: "Country Guide",
    coverLocalPath: join(BRAIN, "blog_mbbs_kazakhstan_1774958921506.png"),
    coverPublicId: "studentstraffic/blog/mbbs-kazakhstan-2026",
    title: "MBBS in Kazakhstan 2026: Top Universities, Fees & Complete Guide for Indian Students",
    excerpt: "A thorough, no-fluff guide to MBBS in Kazakhstan — NMC-recognized universities, verified fees, Almaty vs Nur-Sultan, clinical training quality, student life, and how to prepare for NExT from day one.",
    metaTitle: "MBBS in Kazakhstan 2026: Universities, Fees & Admission Guide | Students Traffic",
    metaDescription: "Complete guide to MBBS in Kazakhstan for Indian students in 2026. NMC-recognized universities, fees, NExT prep, Almaty student life, and everything you need before applying.",
    content: `## Why Kazakhstan Has Become a Top MBBS Destination for Indian Students

Kazakhstan did not appear prominently on Indian students' radar until around 2020. The shift came from a mix of factors: Russia's geopolitical situation post-2022 making some families nervous, improving English-medium infrastructure at Kazakh universities, and growing NMC recognition of more institutions. By 2025–26, Kazakhstan ranks consistently among the top 5 countries chosen by Indian medical aspirants.

This guide covers everything you actually need to know — not the brochure version.

---

## Is MBBS in Kazakhstan Recognized in India?

Yes — provided you choose a university that is:

1. Listed on the **NMC (National Medical Commission) approved list** — verify at nmc.org.in before enrolling
2. Listed in the **World Directory of Medical Schools (WDOMS/FAIMER)**
3. You have a valid NEET score meeting the NMC cutoff (50th percentile for General, 40th for SC/ST/OBC)
4. You clear **NExT Part 1 and Part 2** after returning to India

NMC recognition is institution-specific, not country-wide. "Kazakhstan is NMC approved" is a statement that means nothing on its own. Verify the specific university name against the current NMC list.

---

## NMC-Recognized Universities in Kazakhstan (2026)

The following universities have been consistently listed on NMC's approved list. Always cross-check the current year's list directly:

| University | City | Est. | Type |
|---|---|---|---|
| Kazakh National Medical University (KazNMU / Asfendiyarov) | Almaty | 1930 | Public |
| Astana Medical University | Nur-Sultan (Astana) | 1964 | Public |
| South Kazakhstan Medical Academy (SKMA) | Shymkent | 1979 | Public |
| Semey Medical University | Semey | 1952 | Public |
| West Kazakhstan Medical University | Aktobe | 1957 | Public |
| Karaganda Medical University (KSMU) | Karaganda | 1950 | Public |

**KazNMU** is the most established and most sought-after. It is Kazakhstan's oldest and most research-active medical university, with affiliated teaching hospitals across Almaty. FMGE pass rates among KazNMU graduates have historically been above the national average for Kazakhstan.

---

## Fees: Verified 2026 Data

Fees are quoted in USD and converted at ₹84/$ for reference. Actual INR amounts will vary with exchange rates.

### KazNMU, Almaty
| Year | Annual Tuition (USD) | Annual Tuition (₹) |
|---|---|---|
| Year 1 (Foundation) | $5,200 | ₹4.37L |
| Years 2–6 (MD) | $5,800–6,200 | ₹4.87–5.21L |

**6-year tuition total: approx. ₹29–32L**

### Astana Medical University, Nur-Sultan
| Year | Annual Tuition (USD) | Annual Tuition (₹) |
|---|---|---|
| Years 1–6 | $4,800–5,500 | ₹4.03–4.62L |

**6-year tuition total: approx. ₹25–28L**

### SKMA, Shymkent
- Annual tuition: $3,800–$4,500/year
- **6-year tuition total: approx. ₹19–23L** (lower fees, regional city)

### Full Cost of Attendance (6 years) — KazNMU Almaty

| Component | Annual | 6-Year Total |
|---|---|---|
| Tuition | ₹5.0L | ₹30.0L |
| University hostel | ₹1.1L | ₹6.6L |
| Food | ₹1.5L | ₹9.0L |
| Personal expenses | ₹60K | ₹3.6L |
| Winter clothing (Year 1 only) | ₹50K | ₹50K |
| Medical insurance | ₹20K | ₹1.2L |
| Visa and renewals | — | ₹60K |
| Flights (6 round trips) | — | ₹3.0L |
| **Total** | | **₹54.5L** |

Post-graduation NExT coaching: add ₹2–4L separately.

---

## Almaty vs Nur-Sultan (Astana): Which City?

This is a practical question that substantially affects daily quality of life.

### Almaty
- Kazakhstan's largest city and commercial capital
- Climate: Cold winters (−10 to −20°C in December–February), mild summers
- **Tian Shan mountains** visible from the city — genuinely beautiful setting
- Well-developed infrastructure, restaurants, Indian grocery stores, active Indian student community
- More flight connections to India (via Delhi, Mumbai — connecting through Almaty airport)
- Home to KazNMU — the country's best medical university

### Nur-Sultan (Astana)
- Capital city, very modern architecture (Expo 2017 city)
- Climate: Extreme continental — among the world's coldest capital cities, reaching −30°C to −40°C in winter
- Smaller Indian student community
- Home to Astana Medical University

**Verdict for most Indian students:** Almaty is the more liveable choice. The extreme winters of Nur-Sultan are a genuine daily challenge for students from warmer Indian states. If you are applying to Kazakhstan, KazNMU Almaty should be your first choice unless cost is the overriding factor.

---

## Medium of Instruction and Language

All major NMC-recognized universities in Kazakhstan offer **English-medium tracks** for international students. The curriculum in Years 1–2 typically includes mandatory Kazakh or Russian language classes (basic communicative level, usually 2–4 hours/week). By Year 3–4 when clinical postings begin, some instruction from hospital staff may be in Russian or Kazakh, though most universities assign translators or bilingual faculty for international student postings.

**Practical expectation:** You will not be fluent in Russian or Kazakh, and you don't need to be. But learning basic conversational phrases substantially improves your clinical experience and daily life.

---

## Curriculum Structure at KazNMU

KazNMU's MBBS-equivalent program (General Medicine) runs for 6 years:

- **Year 1:** Pre-medical foundation — anatomy, histology, biology, Russian/Kazakh language
- **Year 2:** Physiology, biochemistry, normal anatomy (deep dive)
- **Year 3:** Pathology, microbiology, pharmacology — para-clinical phase begins
- **Year 4:** Internal medicine, surgery — first major clinical rotations
- **Year 5:** Pediatrics, OB-GYN, neurology, psychiatry — advanced clinical rotations
- **Year 6:** Internship — full-time hospital posting in KazNMU's affiliated hospitals

**Teaching hospitals:** KazNMU has affiliations with several Almaty hospitals including the Almaty Central Hospital, City Clinical Hospital #1, and specialized research hospitals. Clinical exposure in Almaty is generally considered among the better available in the region.

---

## FMGE/NExT Pass Rates from Kazakhstan

Verified national-level data by individual university is not publicly published by NBE. From aggregated student community data and coaching institute analysis:

- **KazNMU graduates:** Historically 28–42% pass rate in FMGE — above the national foreign graduate average of ~18%
- **Astana Medical University:** 20–32%
- **Regional universities (SKMA, Semey, WKMU):** 12–24%

These are ranges, not guarantees. Students who prepare systematically from Year 1 consistently outperform these averages. See our [NExT & FMGE Preparation Guide](/blog/next-fmge-screening-test-complete-preparation-guide) for subject-wise strategy.

---

## Admission Process for 2026 Intake

### Eligibility
- Class 12 with Physics, Chemistry, Biology (minimum 50% aggregate — General; 40% — SC/ST/OBC)
- Valid NEET score (minimum 50th percentile — General; 40th — SC/ST/OBC)
- Age: 17+ years as of 31 December 2026
- Valid Indian passport

### Documents Required
- 10th and 12th mark sheets and certificates (attested)
- NEET 2026 scorecard
- Passport (valid for 6+ years)
- Passport-size photographs (10–12 copies)
- Medical fitness certificate
- HIV test certificate (required for Kazakhstan student visa)
- Financial support affidavit (bank statement showing sufficient funds)
- Birth certificate

### Timeline for September 2026 Intake
| Month | Action |
|---|---|
| May 2026 | NEET exam |
| June 2026 | NEET results — confirm eligibility |
| June–July 2026 | Apply directly to university (or via authorized agent) |
| July 2026 | Receive Invitation Letter from university |
| July–August 2026 | Apply for Kazakhstan student visa at embassy in Delhi/Mumbai |
| August 2026 | Receive visa (allow 4–6 weeks) |
| September 2026 | Depart; orientation and enrollment |

**Kazakhstan student visa** is applied for at the Kazakhstan Embassy in New Delhi or the Consulate in Mumbai. Processing time is typically 15–25 business days. The university's Invitation Letter is mandatory for the visa application.

---

## Student Life in Almaty: What Indian Students Report

### Food
Almaty has a small but functional Indian food ecosystem. Several Indian restaurants exist near the university areas, and Indian grocery stores stock staples (dal, atta, spices). Most Indian students cook their own meals in hostel kitchens — this is the most economical approach. Buying monthly ration runs approximately ₹5,000–8,000.

### Weather Preparation
- October–November: Transition, 0–10°C — begin layering
- December–February: Peak winter, −10 to −25°C — heavy winter coat, woollen underlayers, insulated boots mandatory
- March–April: Thaw begins, −5 to +10°C
- May–August: Pleasant, 20–30°C

Budget ₹25,000–40,000 for first-winter clothing. Buy quality: cheap winter gear fails below −15°C.

### Safety
Almaty is generally safe for international students. The city has a visible police presence and a history of hosting international students from across Central and South Asia. Exercise standard urban precautions. The Indian student community is organized — most universities have an Indian Students' Association that helps new arrivals.

### Internet and Communication
Kazakhstan has reliable 4G/LTE coverage in Almaty. Local SIM cards (Beeline, Kcell, Tele2) cost approximately ₹500–800 for a monthly plan with data. International calls home via WhatsApp/Jio call work without any issues.

---

## Choosing an Admission Agent: What to Watch For

A significant share of problems Indian students face in Kazakhstan originate from poorly informed or dishonest admission agents. Red flags to avoid:

- Agent cannot confirm the specific NMC approval status of the university they are recommending
- Agent quotes only tuition in their fee summary and does not discuss total cost of attendance
- Agent demands full first-year fees upfront before any university documentation is provided
- Agent promises "guaranteed NExT coaching" as part of the package — this is a sales tactic
- Agent is not registered or does not have a verifiable physical office

The safest approach: Apply directly to the university after confirming NMC recognition, or work with an agent willing to show you a university offer letter before any payment is made.

---

## Kazakhstan vs Russia: Decision Framework

| Factor | Kazakhstan (KazNMU) | Russia (Tier 2 State Univ.) |
|---|---|---|
| Total 6-year cost (₹) | ₹50–58L | ₹43–59L |
| Language | English + basic Kazakh/Russian | English + Russian |
| FMGE outcomes | 28–42% (KazNMU) | 25–40% (mid-tier) |
| Geopolitical risk | Low | Moderate (post-2022) |
| Banking/transfer ease | Good | Moderate friction |
| Indian community size | Medium | Large |
| Clinical training quality | Good (Almaty) | Varies strongly by city |

For students who were considering Russia and are now uncertain about geopolitical factors, **KazNMU Almaty is the closest comparable alternative** — similar cost, similar curriculum structure, better English medium, and more stable banking access.

---

## Frequently Asked Questions

**Is MBBS from Kazakhstan valid in India?**
Yes, if the university is on the NMC approved list and you clear NExT Part 1 and Part 2. Verify your specific university on nmc.org.in.

**What is the minimum NEET score for MBBS in Kazakhstan?**
NMC requires a minimum 50th percentile for General category. In practice, universities in Kazakhstan accept students at the NMC floor — there is no additional institutional NEET cutoff above NMC's minimum.

**Can I get an education loan for MBBS in Kazakhstan?**
Yes. SBI, Bank of Baroda, and private lenders like HDFC Credila offer education loans for NMC-recognized universities abroad. Provide the university NMC approval documentation to the bank — most loan officers are unfamiliar with foreign medical education.

**Is Almaty or Nur-Sultan better for Indian students?**
Almaty. Better university (KazNMU), larger Indian community, more liveable climate, more flight connectivity to India.

**How cold does it get in Almaty?**
December to February averages −10 to −20°C, with occasional drops to −25°C. Cold but manageable with proper winter clothing. Nur-Sultan is significantly colder.

**What is the duration of MBBS in Kazakhstan?**
6 years total, including a foundation/pre-medical Year 1 and a Year 6 internship at an affiliated hospital.

**Can I work part-time in Kazakhstan as an Indian student?**
Student visa terms in Kazakhstan restrict formal employment. Informal tutoring or coaching is common among senior students but carries visa risk. Focus on studies — the NExT requirement demands full academic engagement.

---

## The Bottom Line

Kazakhstan is a legitimate, cost-effective option for MBBS abroad — provided you choose the right university. KazNMU Almaty is the clear first choice: established, NMC-recognized, reasonable FMGE outcomes, and a liveable city for Indian students.

The students who succeed here are prepared for cold winters, self-directed in their NExT preparation from Year 1, and realistic about the language environment in clinical settings.

Before committing, speak with an actual KazNMU student through [Students Traffic's peer connect](/students) — the unfiltered, unsponsored conversation is worth more than any brochure.`,
  },
  {
    slug: "neet-cutoff-for-mbbs-abroad-2026",
    category: "Admissions Guide",
    coverLocalPath: join(BRAIN, "blog_neet_cutoff_abroad_1774958956322.png"),
    coverPublicId: "studentstraffic/blog/neet-cutoff-mbbs-abroad-2026",
    title: "NEET Cutoff for MBBS Abroad 2026: Minimum Score, Percentile & Country-Wise Requirements",
    excerpt: "Exact NEET score and percentile requirements for MBBS abroad under NMC rules — what the cutoff actually means, how it's calculated, which countries require what, and what to do if you're just below the cutoff.",
    metaTitle: "NEET Cutoff for MBBS Abroad 2026: Minimum Score & Percentile Requirements | Students Traffic",
    metaDescription: "What NEET score do you need for MBBS abroad in 2026? NMC cutoff percentile, category-wise requirements, country-wise rules, and what options exist if you missed the cutoff.",
    content: `## The One Rule Every Student Must Understand

There is a single, non-negotiable prerequisite for pursuing MBBS abroad with an India-recognized degree: **you must have a valid NEET score meeting NMC's minimum cutoff**.

This is not a guideline. It is a statutory requirement under the National Medical Commission Act. Universities abroad can and do admit students without NEET scores — but those students will not be able to register with any State Medical Council in India, which means they cannot legally practice medicine in India regardless of the university's reputation.

This guide explains exactly what the cutoff is, how it is calculated, what happens at different score levels, and what your options are.

---

## NMC NEET Cutoff for MBBS Abroad: 2026 Requirements

The NMC cutoff is expressed as a **percentile**, not a raw score. This is an important distinction.

| Category | Minimum NMC Percentile | Approx. Raw Score Range |
|---|---|---|
| General (UR) | 50th percentile | ~360–400+ |
| OBC (Non-Creamy Layer) | 40th percentile | ~300–360 |
| SC / ST | 40th percentile | ~300–360 |
| PwD (General) | 45th percentile | ~330–370 |
| PwD (SC/ST/OBC) | 40th percentile | ~300–360 |

**Critical note:** The raw score equivalent to a given percentile changes every year based on that year's paper difficulty and the number of candidates. A 50th percentile in NEET 2024 corresponded to approximately 364 marks; in a more competitive year it may be higher. Always verify the qualifying cutoff for the specific NEET year you appeared in.

---

## What "50th Percentile" Actually Means

The 50th percentile means you scored **better than 50% of all NEET candidates** who appeared that year.

With approximately 24–25 lakh students appearing for NEET each year, the 50th percentile corresponds to around 12–12.5 lakh rank. This is a low barrier by NEET's overall competitive standard — but it is a statutory minimum that is absolutely enforced.

**How to find your percentile:**
Your NEET scorecard shows both your marks and your percentile. If your percentile is 50.00 or above (General), you are eligible. If it is 40.00 or above (SC/ST/OBC), you are eligible for those categories.

---

## Country-Wise NEET Requirements for MBBS Abroad

The NMC cutoff applies uniformly regardless of which country you are going to. There is no country where the cutoff is lower or higher. What varies is whether specific universities impose their own additional criteria.

| Country | NMC Cutoff Applies | Additional University Criteria |
|---|---|---|
| Russia | Yes (50th/40th percentile) | None typically; some top universities prefer higher scores |
| Kazakhstan | Yes | None; NMC floor is the admission floor |
| Georgia | Yes | None |
| Kyrgyzstan | Yes | None |
| Uzbekistan | Yes | None |
| Bangladesh | Yes* | Bangladesh Medical and Dental Council recognition required |
| China | Yes | Note: NMC removed China from its approved list as of 2023 — no Indian enrollment currently |

*Bangladesh MBBS graduates are not required to clear NExT/FMGE — their degree is treated equivalently to an Indian MBBS if the university is recognized by Bangladesh Medical and Dental Council.

---

## Year-Wise NEET Cutoff Scores for MBBS Abroad (General Category)

| NEET Year | Cutoff Percentile | Approx. Qualifying Score (General) |
|---|---|---|
| NEET 2022 | 50th | 316 |
| NEET 2023 | 50th | 360 |
| NEET 2024 | 50th | 364 |
| NEET 2025 | 50th | ~355–370 (est.) |

These figures illustrate how the raw score equivalent fluctuates. The percentile requirement is fixed; the marks behind it are not.

---

## Validity of NEET Score for MBBS Abroad

This is a question many students get wrong.

**NMC's position (as of 2026):** A NEET score is valid for **3 years** from the date of the result for the purpose of admission abroad. A student who appeared in NEET 2024 can use that score to enroll abroad until the 2026–27 academic year.

However, many universities and some agents will try to apply the score for longer periods. Always verify the current NMC guideline directly — regulations on this point have been subject to updates.

---

## What If You Scored Below the Cutoff?

If you did not meet the NMC cutoff, there are only three valid paths that lead to practicing medicine in India:

### Option 1: Re-appear for NEET
The most direct path. NEET allows unlimited attempts (as of current rules). If you scored below the 50th percentile, preparing for another year and clearing the cutoff is the only way to make a foreign MBBS India-valid.

**What changes in preparation:**
- The 50th percentile gap is often 30–60 marks for students who "nearly" cleared it
- Biology is the highest-scoring subject in NEET (360/720 marks). Improving Biology by 20 marks is achievable with 6–8 weeks of focused revision
- NEET coaching centers specifically offer "repeater batches" for students targeting the 50th percentile — these are different from top-rank programs and focus on reliable scoring

### Option 2: MBBS in India (Private)
Private MBBS in India (through state counselling or NRI/Management quota) does not require clearing the NEET cutoff at the same level as government seats. Management quota seats at private colleges are available at NEET scores significantly below government allotment cutoffs — but these come with fees of ₹60 lakh to ₹1.5 crore over 5.5 years.

This is a legitimate path for students with family financial capacity who prefer to stay in India.

### Option 3: Alternative Medical Careers
BDS (Dentistry), BAMS (Ayurveda), BUMS (Unani), BHMS (Homoeopathy), BVSc/BPT/BOT — all have separate NMC/respective council cutoffs and seat matrices. These are distinct clinical careers with their own licensing structures.

**What is not a valid path:** Enrolling in MBBS abroad without meeting the NMC cutoff, hoping the rule will change. It has not changed since 2018 and there is no current regulatory signal of relaxation.

---

## NEET Cutoff vs University Cutoff: Know the Difference

Some agents or universities will quote their own "admission cutoff" which is different from the NMC cutoff. This typically means the minimum score that university requires — which may be at or above the NMC floor.

Some examples:
- **KazNMU Almaty:** Accepts at NMC floor — no additional institutional cutoff above NMC minimum for international/Indian students
- **Sechenov University (Moscow):** Some programs have published preferred score ranges of 400+ for Indian applicants through their India-authorized partners
- **University of Santo Tomas (Philippines — for reference):** Has its own BS Biology admission criteria independent of NEET

The NMC cutoff is the floor. Universities can set ceilings above it. Meeting the NMC cutoff guarantees eligibility under Indian law — it does not guarantee admission to any specific university.

---

## NEET Score and NExT Outcomes: Is There a Correlation?

This is a question students rarely ask but should.

Data analysis from coaching institutes suggests a moderate positive correlation between NEET score and NExT/FMGE pass rate — but it is far weaker than most assume. Students who scored 400+ in NEET but did minimal India-focused preparation during their foreign MBBS have failed NExT. Students who scored at the 50th percentile cutoff but studied consistently and strategically abroad have passed.

The NEET score determines eligibility. What happens during 6 years abroad determines outcomes.

**The structural advantage of a higher NEET score:** Students with stronger Biology, Anatomy, and Physiology foundations from NEET preparation find the early years of MBBS abroad (pre-clinical subjects) significantly easier. This is a genuine advantage — but it is a starting advantage, not a career guarantee.

---

## NEET 2026: Key Dates and What To Do Now

NEET 2026 is expected to follow the established NTA schedule:

| Event | Expected Date |
|---|---|
| NEET 2026 application opens | December 2025 – January 2026 |
| Last date to apply | February 2026 |
| Admit card release | April 2026 |
| NEET 2026 exam date | First Sunday of May 2026 |
| Results | June 2026 |
| Counselling / abroad applications | June–August 2026 |

If you are reading this before the exam: focus entirely on clearing the 50th percentile. The subject split in NEET is Physics (180 marks), Chemistry (180 marks), Biology including Botany + Zoology (360 marks). Biology alone is 50% of NEET — it is the most efficient subject for score improvement if you are targeting the qualifying cutoff rather than a medical college rank.

---

## Documents Proving NEET Eligibility to Universities Abroad

When you apply to a foreign university, you will need to provide:

1. **NEET Scorecard** — downloaded from the NTA portal; shows roll number, marks, percentile, and qualifying status
2. **NEET Admit Card** — some universities request this as proof of exam appearance
3. **NTA/NMC Attestation** (if requested) — not standard but occasionally asked by some bilateral programs

Agents sometimes claim that "certified copies" of NEET scorecards need to be apostilled. This is generally not required for university admission — though some countries may require apostilled academic documents for visa applications. Verify per country requirements.

---

## If You Have a Double-Doubt: Is Your Score Really Valid?

Check directly:
1. Go to nmc.org.in
2. Navigate to "Undergraduate Medical Education" → "Eligibility Certificate for Foreign Medical Graduate"
3. NMC's eligibility certificate process confirms whether your NEET score and category qualify you under current rules

This certificate is actually required before you travel — you need to apply for an NMC Eligibility Certificate (earlier called "Eligibility Certificate for Foreign Medical Studies") before departing India. Without this certificate, you risk complications on return.

**Apply for the NMC Eligibility Certificate as soon as you have your admission letter from the foreign university.** Do not defer this.

---

## Frequently Asked Questions

**What is the minimum NEET score for MBBS abroad in 2026?**
There is no fixed minimum raw score — the requirement is the 50th percentile for General category, 40th percentile for SC/ST/OBC. The raw score corresponding to these percentiles changes each year.

**Can I go for MBBS abroad without NEET?**
You can enroll — some universities do not check. But you will not be able to register with any Indian State Medical Council to practice medicine in India. The NMC will reject your registration application.

**Is NEET compulsory for MBBS abroad?**
Yes, as per NMC regulations in force since 2018 and reaffirmed through subsequent updates.

**My NEET score is exactly at the 50th percentile. Am I eligible?**
Yes. The requirement is "50th percentile or above." Exactly 50th percentile qualifies.

**If I score 50th percentile in NEET 2026, which countries can I go to?**
Any NMC-recognized university in Russia, Kazakhstan, Georgia, Kyrgyzstan, Uzbekistan, or Bangladesh. The NEET percentile requirement is uniform across all countries.

**Does my NEET score affect which university I can get into abroad?**
Directly, no — most foreign universities take any student at the NMC floor. Indirectly, a higher NEET score suggests stronger Biology and Chemistry foundations which help in the first 2 years of MBBS.

**How do I get the NMC Eligibility Certificate?**
Apply on the NMC portal (nmc.org.in) after receiving your University Invitation/Admission Letter. Required documents include 10th and 12th certificates, NEET scorecard, passport, and the university's admission letter. Processing takes 2–4 weeks. This certificate must be obtained before departure.

---

## Summary

The NEET cutoff for MBBS abroad is 50th percentile (General) or 40th percentile (SC/ST/OBC). This is a statutory NMC requirement, not a guideline. Below this, no foreign MBBS degree is valid in India.

If you have cleared it: proceed to choose your country and university carefully. If you have not: re-appearing for NEET is the only path that keeps the foreign MBBS option open with India-valid recognition.

Use the [Students Traffic peer connect](/students) to ask students already studying abroad what NEET score they had, how the first year went, and whether the choice was worth it.`,
  },
];

async function run() {
  console.log("=== Blog Seeder: Batch 1 ===\n");

  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const client = await pool.connect();

  try {
    for (const post of posts) {
      console.log(`\nPost: ${post.slug}`);
      const coverUrl = await uploadImage(post.coverLocalPath, post.coverPublicId);

      const r = await client.query(
        `INSERT INTO blog_posts (slug, title, excerpt, content, cover_url, category, meta_title, meta_description, status, reading_time_minutes, published_at, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'published',$9,$10,$10,$10)
         ON CONFLICT (slug) DO UPDATE SET
           title=EXCLUDED.title, excerpt=EXCLUDED.excerpt, content=EXCLUDED.content,
           cover_url=EXCLUDED.cover_url, category=EXCLUDED.category,
           meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description,
           status='published', reading_time_minutes=EXCLUDED.reading_time_minutes,
           published_at=EXCLUDED.published_at, updated_at=EXCLUDED.updated_at
         RETURNING id, slug`,
        [post.slug, post.title, post.excerpt, post.content, coverUrl ?? null,
         post.category, post.metaTitle, post.metaDescription,
         Math.ceil(readingTime(post.content).minutes), new Date()]
      );
      console.log(`  ✓ Upserted [${r.rows[0].id}]: ${r.rows[0].slug}`);
    }
  } finally {
    client.release();
    await pool.end();
  }
  console.log("\n✅ Batch 1 done!\n");
}
run().catch(e => { console.error(e); process.exit(1); });
