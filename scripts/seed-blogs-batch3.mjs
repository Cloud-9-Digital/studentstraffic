/**
 * Seed batch 3: Bangladesh, Without NEET, Cheapest MBBS
 * Run: node scripts/seed-blogs-batch3.mjs
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
  // ── POST 1: Bangladesh ───────────────────────────────────────────────────
  {
    slug: "mbbs-in-bangladesh-2026-complete-guide",
    category: "Country Guide",
    coverLocalPath: join(BRAIN, "blog_mbbs_bangladesh_1774962148510.png"),
    coverPublicId: "studentstraffic/blog/mbbs-bangladesh-2026",
    title: "MBBS in Bangladesh 2026: Why It Has the Highest FMGE Pass Rate",
    excerpt: "Everything Indian students need to know about MBBS in Bangladesh — the 5-year curriculum, the high FMGE pass rates, fees, strict admission eligibility rules, and why it feels closest to studying in India.",
    metaTitle: "MBBS in Bangladesh 2026: Fees, Admission & FMGE Success | Students Traffic",
    metaDescription: "The complete guide to MBBS in Bangladesh for Indian students in 2026. Discover why Bangladesh graduates consistently secure the highest FMGE pass rates.",
    content: `## The Best Kept Secret in MBBS Abroad

When families discuss "MBBS abroad," the conversation usually circles around Russia, Kazakhstan, and Georgia. Yet, look at the historical data for the FMGE (NMC Screening Test), and one country consistently occupies the top spot for pass rates: **Bangladesh**.

Graduates from Bangladesh medical colleges often achieve FMGE pass rates of 25–40%, substantially outperforming the global average for foreign medical graduates. This is not arbitrary. It is a direct result of the country's medical curriculum, examination structure, and clinical environment being nearly identical to India's.

Here is the complete, honest guide to studying MBBS in Bangladesh in 2026.

---

## Why the FMGE Pass Rates Are So High

The success of Indian students in Bangladesh is built into the system:

1. **Identical Academic Curriculum:** The MBBS curriculum in Bangladesh follows the same British-legacy medical education system as India. The textbooks you study (B.D. Chaurasia, K.D. Tripathi, Robbins Pathology) are exactly the same.
2. **Identical Disease Pattern:** You are studying in South Asia. The clinical exposure features tropical diseases, nutritional deficiencies, and infectious diseases identical to what Indian doctors treat. You don't have to "re-learn" local diseases when you return for NExT/FMGE.
3. **No Language Barrier in Classes:** Instruction is 100% in English from Day 1. There is no bilingual foundation year, no translating professors, and no mandatory Russian or Kazakh language exams.
4. **Cultural Similarity:** For students from West Bengal and Northeast India, Bangladesh feels culturally identical. The food, the climate, and the daily rhythm of life are intimately familiar.

---

## The Catch: Strict Eligibility Rules

If Bangladesh is so good, why doesn't every Indian student go there? Because of the eligibility criteria. The Directorate General of Medical Education (DGME) of Bangladesh enforces strict rules that many Indian students cannot meet.

**Eligibility Rules for 2026 Intake:**
- **Year of passing Class 12:** Must be 2025 or 2026. If you passed Class 12 before 2025, you are not eligible.
- **Year of passing Class 10:** Must be 2023 or 2024 (a maximum gap of 2 years between Class 10 and 12 is allowed).
- **GPA Requirement:** You must have a minimum aggregate GPA of 7.0 (out of 10) combining Class 10 and 12. Specifically, a minimum GPA of 4.0 in Class 12 and a minimum GPA of 3.5 in Biology (roughly equating to 60%+ in Biology).
- **NEET:** Must have a valid NEET qualifying score (minimum 50th percentile for General, 40th for SC/ST/OBC).

**The Reality:** If you took multiple drop years in India preparing for NEET and your Class 12 passing year is 2023 or earlier, you cannot study MBBS in Bangladesh. The system filters out long-term repeaters, which also partly explains the higher academic success rate of the cohort.

---

## Costs: Fees and Financial Reality

Bangladesh is not the cheapest option for MBBS abroad, but it offers high value.

**Total Duration:** 5 years academic + 1 year internship.
*Note: As per current NMC regulations, foreign graduates must complete their internship in the country of study. Ensure your college in Bangladesh explicitly includes a clinical internship for foreign students.*

### Average Fee Structure (Private Medical Colleges)

| Expense Component | Amount (USD) | Approximate (₹) |
|---|---|---|
| Total 5-year Tuition | $35,000 – $45,000 | ₹29L – ₹38L |
| First Year Payment | $12,000 – $18,000 | ₹10L – ₹15L |
| Remaining Years | Paid annually/semester | Spread over 4 years |
| Hostel (5 years) | $3,000 – $5,000 | ₹2.5L – ₹4L |
| Total Institutional Cost | **$38,000 – $50,000** | **₹32L – ₹42L** |

**Important Payment Structure Note:** Unlike Russia or Kazakhstan where you pay year-by-year, Bangladesh colleges require a massive upfront payment in Year 1 (often 30–40% of the total 5-year fee). Your designated "seat booking" amount is also significant ($2,000–$5,000).

**Living Costs:**
Food and personal expenses are very low, roughly ₹5,000–8,000 per month.

---

## Top Medical Colleges for Indian Students (2026)

Most Indian students enroll in private medical colleges affiliated with major public universities (like Dhaka University, Rajshahi University, Chittagong University).

Some of the most reputable private colleges with high Indian enrollment:
- **Dhaka National Medical College**
- **Bangladesh Medical College**
- **Eastern Medical College, Comilla**
- **Enam Medical College**
- **Green Life Medical College**
- **Holy Family Red Crescent Medical College**

*Always verify your chosen college independently on the WDOMS list and current NMC advisories.*

---

## Student Life in Bangladesh

**Food:** You will not miss home food. Rice, dal, fish, chicken, and familiar vegetables are the daily staples.
**Safety:** Bangladesh is considered very safe for Indian students, including female students, largely due to strict hostel rules and a conservative social environment.
**Hostel Rules:** Hostels in Bangladesh medical colleges operate more like strict Indian boarding schools compared to European university dorms. Curfews are strictly enforced, and attendance is rigidly monitored.

---

## Summary: Is Bangladesh Right For You?

**Choose Bangladesh if:**
1. You meet the strict "no gap year" eligibility criteria.
2. You want an educational experience almost identical to an Indian private college.
3. You have the financial capacity to make a heavy first-year payment.
4. You prioritize clinical relevance (tropical medicine) and high NExT/FMGE pass probability.

**Do not choose Bangladesh if:**
1. You have multiple drop years post-Class 12.
2. You want a "European" university experience or a highly independent campus life.
3. You are looking for a budget option under ₹25 Lakhs total.`,
  },

  // ── POST 2: MBBS Without NEET ──────────────────────────────────────────────
  {
    slug: "mbbs-abroad-without-neet-truth-2026",
    category: "Admissions Guide",
    coverLocalPath: join(BRAIN, "blog_mbbs_without_neet_1774962166796.png"),
    coverPublicId: "studentstraffic/blog/mbbs-without-neet",
    title: "MBBS Abroad Without NEET 2026: Why It's a Career Trap for Indian Students",
    excerpt: "Can you do MBBS abroad without qualifying NEET? Technically yes. Can you ever practice medicine in India afterward? Absolutely not. The harsh truth about the 'NEET exemption' scam.",
    metaTitle: "MBBS Abroad Without NEET 2026: The Truth for Indian Students | Students Traffic",
    metaDescription: "Thinking about MBBS abroad without a qualifying NEET score? Read this first. Understand the NMC rules, the legal reality, and why agents promote this trap.",
    content: `## The Question Every Disappointed Applicant Asks

The NEET results are out. You missed the qualifying cutoff (50th percentile for General, 40th for reserved categories) by 10 or 20 marks. Desperate for a solution, you search online, and an advertisement promises: **"Direct Admission for MBBS Abroad — No NEET Required!"**

You call the consultant. They assure you that "rules have relaxed," or "you can practice abroad," or "you can bypass the NMC."

This guide explains the brutal, legal reality of that decision in 2026.

---

## Can You Physically Enroll Without NEET?

**Technically, yes.**

Many universities in Russia, Georgia, Kyrgyzstan, and other countries do not care about your NEET score. Their internal admission criteria involve passing your 12th board exams and perhaps a basic internal entrance test in Biology and Chemistry.

If you pay the fees, they will give you an admission letter. The Russian or Georgian embassy will give you a student visa. You can fly out, attend classes, take exams, and spend 6 years earning a medical degree.

But that degree will be fundamentally useless in India.

---

## The NMC Law: Uncompromising and Strict

The National Medical Commission (NMC) regulates medical practice in India. According to the foundational **NMC Foreign Medical Graduate Licentiate Regulations (2021)** and prior gazette notifications dating back to 2018:

**An Indian citizen must qualify NEET-UG in the year of admission (or hold a valid score from the previous two years) to be eligible to pursue MBBS in a foreign medical institution.**

If you do NOT have a qualifying NEET score before you depart:
1. You cannot obtain an NMC Eligibility Certificate.
2. When you return after 6 years, you will not be permitted to sit for the NExT (National Exit Test) or FMGE.
3. Without passing NExT, you cannot register with any State Medical Council.
4. Without registration, you cannot legally practice medicine, prescribe medication, or call yourself a doctor in India.

There are no loopholes. There are no "management quotas" in the NMC. There is no back-door registration.

---

## The 3 Lies Unscrupulous Agents Tell

Why do some agents aggressively promote admission without NEET? Because they receive a commission from the university upon your enrollment. What happens to your career 6 years later is not their problem.

Here are the specific lies they use to sell this path:

### Lie 1: "You can get an exemption letter from Delhi Court."
In the early days of the NEET mandate (2018–2019), a few students won one-off legal reprieves due to administrative confusion. Those days are permanently over. The Supreme Court of India has categorically upheld the mandatory nature of NEET for foreign medical graduates. No lawyer can buy you a career.

### Lie 2: "You don't need NEET if you plan to settle abroad anyway."
This is a half-truth wrapped in a massive gamble. Yes, the Indian NMC does not control licensing in the UK or USA. Theoretically, you could clear the USMLE or PLAB instead.
**The Reality:** The USMLE/PLAB pathways are extremely competitive and expensive. More importantly, most countries require a "Certificate of Good Standing" or confirmation of your license from your home country (India) or the country of education. If you cannot register in India, your international mobility is severely crippled.

### Lie 3: "Just go now and clear NEET next year while studying there."
This is explicitly illegal under current NMC rules. You must clear NEET *before* taking admission. A NEET score achieved in 2027 cannot retroactively validate an MBBS admission taken in 2026.

---

## What Are Your Actual Options If You Failed NEET?

If you did not meet the exact cutoff percentile, do not panic and make a 6-year mistake. Accept that you have only three valid paths:

**Option 1: Drop a Year and Prepare Exclusively for the Cutoff**
If you scored 100-130 marks, getting to the 160-200 range (approximate general cutoff) requires an improvement of just 15-20 correct questions in Biology. This is highly achievable with 6-8 months of dedicated study. A 1-year delay is vastly superior to a 6-year invalid degree.

**Option 2: Shift to Allied Healthcare in India**
Consider B.Sc. Nursing, Physiotherapy (BPT), Pharmacy (B.Pharm), or allied clinical sciences. These are respected, highly employable careers that do not require clearing the MBBS NEET cutoff.

**Option 3: Shift to Non-Medical Fields Abroad**
If your primary goal is international exposure, use your budget to pursue a Bachelor's in Biotechnology, Health Administration, or generic sciences in Europe or North America.

---

## Summary: A Warning

Doing MBBS abroad without NEET is an incredibly expensive 6-year vacation. You will return with a document that looks like a medical degree but carries no legal weight in your home country.

Protect your time, your family's money, and your future career. If a consultant tells you NEET isn't required, hang up the phone.`,
  },

  // ── POST 3: Cheapest MBBS Abroad ─────────────────────────────────────────
  {
    slug: "cheapest-mbbs-abroad-options-indian-students",
    category: "Fees & Finance",
    coverLocalPath: join(BRAIN, "blog_cheapest_mbbs_abroad_1774962184075.png"),
    coverPublicId: "studentstraffic/blog/cheapest-mbbs-abroad",
    title: "Cheapest MBBS Abroad Options for Indian Students (Under 25 Lakhs)",
    excerpt: "A realistic breakdown of the most affordable NMC-recognized MBBS abroad destinations in 2026. How to achieve a medical degree under ₹25 Lakhs total, and the academic trade-offs you must accept.",
    metaTitle: "Cheapest MBBS Abroad Options Under 25 Lakhs in 2026 | Students Traffic",
    metaDescription: "Looking for the most affordable MBBS abroad? Compare the lowest-cost NMC-recognized medical universities in Kyrgyzstan, Uzbekistan, and Russia.",
    content: `## The Reality of a Strict Budget

If your absolute maximum budget for 6 years of medical education—covering tuition, hostel, food, and flights—is between **₹20 Lakhs and ₹25 Lakhs**, your options shrink significantly.

You cannot afford Georgia, the Philippines, Bangladesh, or the top-tier universities in Russia and Kazakhstan (like KazNMU or Kazan Federal).

However, you *can* still become a doctor. There are fully NMC-recognized, WDOMS-listed universities that fit this budget. The key is understanding that "cheapest" involves trade-offs in clinical exposure, infrastructure, and native academic environment. If you accept those trade-offs and rely on intense self-study for NExT, the budget path is viable.

Here are the genuine, verifiable cheapest options for MBBS abroad in 2026.

---

## 1. Kyrgyzstan: The Ultra-Budget Destination

Kyrgyzstan has historically been the lowest-cost destination for Indian students. The country's economy makes both tuition and daily living extremely cheap by global standards.

**Realistic Total Cost (6 Years): ₹20 Lakhs – ₹25 Lakhs**

**Top Budget Universities:**
*   **Osh State University:** A designated public university. Annual tuition is approx. $3,000 to $3,500.
*   **Jalal-Abad State University (JASU):** Often effectively the cheapest recognized institution available.
*   **Kyrgyz State Medical Academy (Bishkek):** Slightly more expensive but considered the premier medical institution in the country.

**The Breakdown (Approximate):**
*   Tuition (6 years): ₹14L – ₹16L
*   Hostel & Food (6 years): ₹5L – ₹7L
*   Flights & Extras: ₹2.5L

**The Trade-off:** The FMGE (NExT) pass rates from Kyrgyzstan have historically been very low (often under 10-15%). The clinical facilities are generally older Soviet-era hospitals. To succeed here, you must rely almost entirely on Indian online test platforms (Marrow, PrepLadder) starting from Year 1, rather than depending solely on classroom lectures.

---

## 2. Uzbekistan: The Rising Budget Hub

Following political and academic reforms, Uzbekistan has heavily courted Indian medical students, positioning itself as a slightly more modern, safer alternative to Kyrgyzstan at a similar price point.

**Realistic Total Cost (6 Years): ₹22 Lakhs – ₹26 Lakhs**

**Top Budget Universities:**
*   **Samarkand State Medical University:** One of the oldest in Central Asia. Annual tuition approx. $3,200 – $3,500.
*   **Tashkent Medical Academy:** The capital's primary teaching hospital.
*   **Andijan State Medical Institute.**

**The Breakdown (Approximate):**
*   Tuition (6 years): ₹15L – ₹17L
*   Hostel & Food (6 years): ₹6L – ₹8L
*   Flights & Extras: ₹2.5L

**The Trade-off:** It is a newer market for Indian students compared to Russia. The English proficiency of older clinical faculty can be a hurdle. However, safety metrics are very high, and the infrastructure is seeing significant public investment. It is currently the best "value" play in the ultra-low budget tier.

---

## 3. Russia: Tier-3 Regional Universities

While top Russian universities (Moscow, St. Petersburg, Kazan) will cost ₹35L–₹50L, Russia has a vast network of regional state medical universities situated far from the capital where living costs and tuition drop dramatically.

**Realistic Total Cost (6 Years): ₹24 Lakhs – ₹28 Lakhs**

**Top Budget Universities:**
*   **Altai State Medical University (Barnaul):** Annual tuition roughly $3,000.
*   **Omsk State Medical University.**
*   **Chechen State University (Grozny).**

**The Breakdown (Approximate):**
*   Tuition (6 years): ₹15L – ₹18L
*   Hostel & Food (6 years): ₹6L – ₹8L
*   Flights & Translators/Insurance: ₹3L

**The Trade-off:** Universities in deep regional Russia (Siberia, etc.) experience extreme winter climates. There are far fewer English-speaking locals, making daily life harder. The clinical exposure is robust, but translating it from Russian to English in your head for NExT exams is a major challenge.

---

## Hidden Costs of "Cheap" Universities

When an agent quotes a package of "15 Lakhs Total," they are leaving things out. Always add these to your spreadsheet:

1.  **Contractor/Agent Fees:** In budget universities, you rarely pay the university directly. You pay a "contractor" who holds the Indian quota. Ask for the breakdown.
2.  **Visa Extension & Medical Checkups:** Required annually.
3.  **Food Inflation:** The raw cost of Indian groceries abroad has risen sharply. Cooking yourself saves money, but budget at least ₹5000/month.
4.  **NExT Coaching:** A non-negotiable expense if you choose a budget university. You must buy the premium subscription to an Indian test-prep app (₹30,000 to ₹50,000) and likely attend a physical crash course upon returning (₹1.5L).

---

## The Verdict

If you have exactly ₹25 Lakhs:
*   **For safety and modernity:** Look at **Uzbekistan** (Samarkand or Tashkent).
*   **For pure lowest cost:** Look at **Kyrgyzstan** (Jalal-Abad or Osh), but be prepared for a difficult NExT preparation journey.
*   **For the Russian degree cachet:** Look at **regional Russian state universities**, but accept the extreme climate.

A cheap degree is only cheap if you pass the licensing exam at the end. An extra ₹5 Lakhs saved in tuition is meaningless if you spend 3 years and ₹10 Lakhs attempting the NExT exam upon your return. Prioritize self-discipline above all else if you choose the budget route.`,
  }
];

async function run() {
  console.log("=== Blog Seeder: Batch 3 ===\n");
  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const client = await pool.connect();
  try {
    for (const post of posts) {
      console.log(`\nPost: ${post.slug}`);
      const coverUrl = await uploadImage(post.coverLocalPath, post.coverPublicId);
      const r = await client.query(
        `INSERT INTO blog_posts (slug,title,excerpt,content,cover_url,category,meta_title,meta_description,status,reading_time_minutes,published_at,created_at,updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'published',$9,$10,$10,$10)
         ON CONFLICT (slug) DO UPDATE SET
           title=EXCLUDED.title,excerpt=EXCLUDED.excerpt,content=EXCLUDED.content,
           cover_url=EXCLUDED.cover_url,category=EXCLUDED.category,
           meta_title=EXCLUDED.meta_title,meta_description=EXCLUDED.meta_description,
           status='published',reading_time_minutes=EXCLUDED.reading_time_minutes,
           published_at=EXCLUDED.published_at,updated_at=EXCLUDED.updated_at
         RETURNING id,slug`,
        [post.slug,post.title,post.excerpt,post.content,coverUrl??null,
         post.category,post.metaTitle,post.metaDescription,
         Math.ceil(readingTime(post.content).minutes),new Date()]
      );
      console.log(`  ✓ Upserted [${r.rows[0].id}]: ${r.rows[0].slug}`);
    }
  } finally { client.release(); await pool.end(); }
  console.log("\n✅ Batch 3 done!\n");
}
run().catch(e => { console.error(e); process.exit(1); });
