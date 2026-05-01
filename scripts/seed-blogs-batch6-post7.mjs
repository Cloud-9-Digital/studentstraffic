/**
 * Seed Batch 6 — Post 7: MBBS Abroad Admission Process Step by Step
 * Run: node scripts/seed-blogs-batch6-post7.mjs
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

const LOCAL_IMAGE = "/Users/bharat/.gemini/antigravity/brain/b236d4cf-2de8-4a26-a722-9c74a626dfa4/mbbs_admission_process_hero_1775057058996.png";
const CLOUDINARY_ID = "studentstraffic/blog/mbbs-abroad-admission-process-2026";

async function uploadImage(localPath, publicId) {
  try { const e = await cloudinary.api.resource(publicId); console.log(`  [skip] ${publicId}`); return e.secure_url; } catch {}
  const r = await cloudinary.uploader.upload(localPath, { public_id: publicId, overwrite: false });
  console.log(`  [ok] ${r.secure_url}`); return r.secure_url;
}

const post = {
  slug: "mbbs-abroad-admission-process-step-by-step-2026",
  category: "Admissions Guide",
  title: "MBBS Abroad Admission Process 2026: 18 Steps from NEET Result to First Day at University",
  excerpt: "The complete, step-by-step execution guide for pursuing MBBS abroad — from the moment your NEET result is declared to landing at your destination university. Every action, every document, every deadline, with country-specific variations for Russia, Georgia, Kazakhstan, Kyrgyzstan, and Uzbekistan.",
  metaTitle: "MBBS Abroad Admission Process 2026: Step-by-Step Guide from NEET to University",
  metaDescription: "Complete 18-step MBBS abroad admission process for Indian students. NEET to NMC EC, invitation letter, visa, departure — exact documents and timelines for Russia, Georgia, Kazakhstan.",
  content: `## Why This Guide Exists

MBBS abroad admission is not complicated — but it has 18 sequential steps that must be completed in the right order, with the right documents, within tight windows. Most students learn this process piecemeal: from agents with commercial incentives, from seniors who did it 3 years ago (and whose memory may be incomplete), or from blog posts that cover theory but not execution.

This is an execution guide. Every step is actionable. Every document is named. Every deadline is realistic. Country-specific differences are called out where they matter.

---

## Pre-Step: Confirm Your Eligibility

Before Step 1, confirm three things:

1. **NEET qualifying percentile:** 50th percentile (General); 40th percentile (SC/ST/OBC). Your NEET scorecard shows your percentile — confirm this before anything else.
2. **Class 12 aggregate:** 50%+ in Physics, Chemistry, Biology combined (General); 40%+ (SC/ST/OBC).
3. **Age:** 17+ years as of December 31 of the year of admission.

If all three are confirmed, proceed.

---

## STEP 1: Research and Select Your Country + University
**When:** Week 1–2 post-NEET result
**Time required:** 3–7 days of dedicated research

Do not let an agent pick your country and university. This is your career — your research must drive it.

**Research framework:**
1. Set your total budget (6-year all-in cap)
2. Selection countries that fit the budget (see our [fees comparison guide](/blog/mbbs-abroad-fees-country-comparison-2026))
3. Within each country, look up NMC-approved universities at nmc.org.in
4. Check WDOMS listing at wdoms.org for each selected university
5. Research FMGE/NExT pass rate data for each university (coaching institute data, student forums)
6. Talk to current students at those universities (Students Traffic peer connect)

**Country-wise intake timing:**

| Country | Primary Intake | Secondary Intake |
|---|---|---|
| Russia | September | February (limited) |
| Kazakhstan | September | February (limited) |
| Georgia | September | February |
| Kyrgyzstan | September | February |
| Uzbekistan | September | — |
| Bangladesh | January | July |

---

## STEP 2: Apply to University
**When:** 8–12 weeks before intake (June–July for September intake)
**How:** Online application on university website OR via authorized agent

**Documents for application:**
- Class 10 and 12 mark sheets (scanned copies)
- NEET scorecard
- Passport scan (biographic page)
- Passport-size photograph
- Application form (university-provided)

**Apply directly:** Go to the university's official website. Find the International Admissions section. Submit the online application. Note the application/reference number.

**Using an agent:** An agent can facilitate the application — but ensure you have direct contact with the university's admissions department. Do not be isolated from the university by your agent (a red flag in itself).

---

## STEP 3: Receive University Invitation Letter (Offer Letter)
**When:** 1–3 weeks after applying
**What to check in the letter:**
- Your name exactly as on your passport
- The degree name and program duration
- The academic year start date
- Annual tuition amount
- The university's official letterhead, stamp, and authorized signature

Do not proceed to any payment or government application without this letter in hand. If the letter has errors in your name or program details, request a corrected version before proceeding.

---

## STEP 4: Verify NMC Recognition (Again, Before Any Payment)
**When:** Immediately upon receiving invitation letter

Cross-check the exact institution name on the letter against the current NMC approved list (nmc.org.in → Undergraduate → Approved Foreign Medical Colleges). The name must match precisely. Also verify on WDOMS (wdoms.org).

If there is a discrepancy in the name (even minor), confirm with NMC which version is the recognized entity — do not assume.

---

## STEP 5: Apply for NMC Eligibility Certificate
**When:** Immediately after Step 4 (do not delay)
**Where:** eportal.nmc.org.in

This is your most time-sensitive step. The NMC EC takes 3–6 weeks to process. With a September intake, apply no later than early July.

**Documents needed for EC application:**
- Class 10 certificate and mark sheet (attested)
- Class 12 certificate and mark sheet (attested)
- NEET scorecard
- Passport (biographic page)
- University invitation letter (from Step 3)
- Aadhaar
- Passport-size photograph
- Category certificate (if SC/ST/OBC)

**Fee:** ₹5,000 (pay online via NMC portal)

Track your EC application on the portal. If additional documents are requested by NMC, respond within 48 hours to avoid delays.

---

## STEP 6: Arrange Financial Documents and Education Loan
**When:** Parallel to Step 5 (both can be done simultaneously)

**Education loan:** If taking a loan:
1. Approach the bank's education loan desk with the university invitation letter and NMC approval evidence
2. Provide co-applicant income documents + property papers (collateral)
3. Target a sanction letter (not disbursement yet — disbursement happens closer to fee deadline)

**Personal funds:** If self-financing, ensure funds are accessible for international transfer. Open a forex account or arrange with your bank for outward remittance to the university's bank account.

**Country-specific banking notes:**

| Country | Banking/Transfer Method |
|---|---|
| Russia | Post-2022 sanctions: wire transfers via Sberbank intermediaries or Russian payment intermediaries favoured by universities; some universities have India-based fee collection accounts |
| Kazakhstan | Standard SWIFT transfer to Kazakh bank; relatively smooth |
| Georgia | Standard SWIFT; Georgian banks are not under sanctions |
| Kyrgyzstan | Via UniCredit-linked CIS banks or via agent's India-based account for university's India collection |
| Uzbekistan | SWIFT transfer; some universities use India-based collection accounts |

---

## STEP 7: Pay University Confirmation / Seat Booking Fee
**When:** After receiving invitation letter AND verifying NMC status
**Amount:** Typically $500–$2,000 first installment (varies by university)

**Pay only to the university's official bank account** as listed in the invitation letter from the university. Not to an agent's account. Get a payment receipt, which the university uses to issue you a formal enrollment confirmation.

---

## STEP 8: Apply for Student Visa
**When:** 8–10 weeks before departure (immediately after receiving university's enrollment confirmation)

**Country-specific visa details:**

### Russia
- **Visa type:** Student Visa
- **Embassy:** Embassy of Russia, New Delhi (+ Consulates in Mumbai, Chennai)
- **Key documents:** Enrollment confirmation from university + invitation letter from Ministry of Education of Russia (Minobrazovaniya approval — the university coordinates this), NEET scorecard, passport, photos, health certificate
- **Processing time:** 15–25 business days
- **Health certificate:** Medical checkup (HIV, tuberculosis, general fitness) — conducted at government-approved centres

### Kazakhstan
- **Visa type:** Student Visa (Category D)
- **Embassy:** Embassy of Kazakhstan, New Delhi
- **Key documents:** University invitation letter (university applies to Kazakhstan Ministry of Internal Affairs for official invitation — this takes 2–3 weeks), NEET scorecard, passport, financial statement, HIV test certificate
- **Processing time:** 15–20 business days

### Georgia
- **Visa type:** Student Visa (Category D)
- **Embassy:** Embassy of Georgia, New Delhi
- **Key documents:** University letter of acceptance, financial proof, passport
- **Processing time:** 10–15 business days (Georgia is relatively easy for Indian students — some nationalities even get visa-on-arrival for short stays, but a formal student visa is required for study)

### Kyrgyzstan
- **Visa type:** Student Visa
- **Embassy:** Embassy of Kyrgyzstan, New Delhi
- **Key documents:** University invitation, NEET scorecard, passport, HIV test
- **Processing time:** 10–20 business days

### Uzbekistan
- **Visa type:** Student Visa
- **Embassy:** Embassy of Uzbekistan, New Delhi
- **Key documents:** University invitation letter, passport, financial proof, NEET scorecard
- **Processing time:** 10–15 business days

---

## STEP 9: Complete Pre-Departure Medical Tests
**When:** After visa application; results needed before travel
**What is typically needed:**
- HIV test (mandatory for Russia, Kazakhstan, Kyrgyzstan, Uzbekistan visas)
- Tuberculosis screening (sometimes required for Russia, Kazakhstan)
- General fitness certificate
- COVID-19 vaccination certificate (varies by current country requirements — check embassy website)

Conduct these tests at government hospitals or private labs with government certification. Get results on official letterhead with doctor/hospital stamp.

---

## STEP 10: Book Flights
**When:** Once visa is stamped
**Routing:** Delhi/Mumbai → destination (Almaty, Moscow, Tbilisi, Bishkek, Tashkent)

**Cost:** ₹35,000–₹65,000 round trip depending on routing, season, and booking advance.

**Connecting routes used by Indian students:**
- Russia (Moscow): Via Dubai (Emirates/flydubai), Istanbul (Turkish Airlines), Doha (Qatar Airways)
- Kazakhstan (Almaty): Via Delhi–Almaty direct (Air Astana); or via Dubai
- Georgia (Tbilisi): Via Istanbul (Turkish Airlines); Via Dubai (FlyDubai)
- Kyrgyzstan (Bishkek): Via Delhi–Bishkek (Kyrgyz Air / connecting); Via Almaty
- Uzbekistan (Tashkent): Via Delhi–Tashkent (Uzbekistan Airways direct)

Book at least 4–6 weeks in advance. The summer travel window (August–September) is high season — prices rise sharply closer to departure.

---

## STEP 11: Prepare and Pack
**When:** 2–3 weeks before departure

**Documents to carry (originals + 5 attested copies of each):**
- [ ] Passport
- [ ] Visa
- [ ] NMC Eligibility Certificate
- [ ] NEET scorecard
- [ ] Class 10 + 12 certificates and mark sheets (attested)
- [ ] University invitation/offer letter
- [ ] University payment receipt
- [ ] Birth certificate
- [ ] Medical fitness and HIV test certificates
- [ ] Education loan sanction letter (if applicable)
- [ ] 20+ passport-size photographs
- [ ] Aadhaar card
- [ ] Category certificate (if applicable)

**Essential items to pack (not buying abroad):**
- Indian spices mix (3–4 kg — cumin, coriander, turmeric, chili, garam masala)
- Pressure cooker (2L, compact)
- Medicines (any prescription drugs — 3-month supply; OTC basics: Crocin, ORS, antacid)
- Warm innerwear/thermals (at least 2 sets — for arrival in transition weather)
- Microfiber towels (4–6 pieces)
- Indian pickles (amla/mango — long shelf life)
- Power strip/universal adapter

**Do not overpack winter clothing from India.** Indian winter gear is designed for 5–15°C. Gear for −15°C to −25°C must be bought locally in the first few weeks.

---

## STEP 12: Set Up Forex and Banking
**When:** 1–2 weeks before departure

**Multi-currency forex cards to get:**
- Niyo Global (works well in Russia-adjacent regions via local partnerships)
- Wise (excellent for Georgia, Kazakhstan, Uzbekistan)
- HDFC Forex Card (widely accepted internationally)

**Cash:** Carry $200–$400 equivalent in local currency for the first 48 hours (ATM access isn't always available immediately on arrival).

**Keep your Indian bank account active** with a UPI-linked number — you will transfer money from India throughout your studies.

Russia-specific note: Post-2022 sanctions, some international card networks (Visa, Mastercard) have limited functionality in Russia. Confirm with your specific bank and the university's guidance for the current year. Mir card (Russia's domestic payment system) is the workaround — the university International Office will guide you on local banking setup after arrival.

---

## STEP 13: Enroll in Medical Insurance
**When:** Before departure
**Cost:** ₹15,000–₹30,000/year depending on cover

Most countries require proof of health insurance as part of the student visa or university enrollment. Options:
- University-provided group insurance (check if available — often the simplest option)
- Indian general insurance international student plans (HDFC ERGO, Bajaj Allianz international student plans)
- Some universities in Russia and Kazakhstan have mandatory insurance built into the annual fee

Confirm what the university provides vs what you need to arrange separately.

---

## STEP 14: Departure Day Preparation
**When:** 24 hours before flight

Final checklist:
- [ ] All documents in hand luggage (never checked baggage — document loss is catastrophic)
- [ ] Forex card loaded and activated
- [ ] Flight details confirmed
- [ ] University pick-up/airport transfer confirmed (most universities organize this)
- [ ] Emergency contacts saved on phone: Indian Embassy in destination country (after-hours line), University International Dean, Senior Indian student contact
- [ ] Family informed of full itinerary and accommodation details

---

## STEP 15: Arrival and Orientation
**When:** Day 1–7 at university

**Immediate priorities on arrival:**
1. Get a local SIM card (request from senior students which network to use at your campus)
2. Report to International Student Office with all documents — they process your official registration
3. Attend orientation — do not skip this; residence permit, hostel allocation, and class schedule are communicated here
4. Locate the nearest Indian grocery store or connect with the Indian Students' Association for supply chain information

---

## STEP 16: Complete Residence Permit Registration
**When:** Within 7–30 days of arrival (varies by country)

| Country | Requirement | Deadline | Who Handles |
|---|---|---|---|
| Russia | Temporary Registration (propiska) — mandatory | 7 working days from arrival | University International Office (they file on your behalf) |
| Kazakhstan | Foreigners Registration | 30 days from arrival | Local migration authority (university assists) |
| Georgia | Residence permit for stays >180 days | Before visa expires | Civil Registry Agency |
| Kyrgyzstan | Registration with State Registration Service | 30 days | University + migration authority |
| Uzbekistan | Registration in OVIR | 15 days | University coordinates |

Missing registration deadlines creates significant administrative problems. Follow up with the university's International Office proactively if this is not completed in your first week.

---

## STEP 17: Open a Local Bank Account
**When:** Week 2–4 after arrival

A local bank account is essential for receiving money from India and paying locally without forex card fees. The International Office will advise on the standard bank used by students at that university. Required documents typically: passport, visa, residence registration certificate, university enrollment letter.

---

## STEP 18: Begin NExT Preparation From Day 1 of Year 1

This is not a study tip — it is career protective infrastructure. Students who begin parallel NExT preparation from Year 1 (30–45 minutes of Indian-syllabus revision per day) consistently outperform peers who defer it to Year 4–5.

**Minimum setup for Year 1:**
- Subscribe to Marrow or PrepLadder (Indian NExT/FMGE test series) — from the first month
- Use Indian textbooks alongside foreign university textbooks (BD Chaurasia for Anatomy, AK Jain for Physiology)
- Solve subject-wise MCQs weekly, not just before exams

The students who clear NExT in their first attempt, register by Year 7–8, and build strong careers from MBBS abroad — they started this discipline on arrival, not after graduation.

---

## Country-Specific KEY Differences Summary

| Step | Russia | Kazakhstan | Georgia | Kyrgyzstan | Uzbekistan |
|---|---|---|---|---|---|
| Visa processing | 15–25 days | 15–20 days | 10–15 days | 10–20 days | 10–15 days |
| Ministry invitation (additional requirement) | Yes (Minobrazovaniya) | Via university + BI | No | Via university | Via university |
| HIV test required for visa | Yes | Yes | No | Yes | No |
| Banking complexity | High (sanctions) | Moderate | Low | Moderate | Low |
| Registration deadline | 7 working days | 30 days | Before visa expiry | 30 days | 15 days |

---

## Frequently Asked Questions

**How early should I start the MBBS abroad process?**
Start immediately after NEET results — which are declared in June. For a September intake, you have 10–12 weeks. This sounds like ample time but between NMC EC (5–6 weeks), visa processing (3–4 weeks), and document collection, every week counts. Do not start later than the first week of July.

**Can I apply to multiple universities simultaneously?**
Yes. Apply to 2–3 universities simultaneously in your preferred countries. Once an offer letter is received from your top choice and NMC status confirmed, you proceed with that one and decline others.

**What is the single most common reason students miss their intake?**
Late NMC Eligibility Certificate application — which delays the visa application, which delays departure. Apply for the EC within 48 hours of receiving the university offer letter.

**Can I travel without the NMC EC?**
Technically yes — no border check requires it. But you should not travel for MBBS without it. The consequences of not having it on return (inability to sit NExT) are severe and irreversible. Apply before departure regardless.

**Do I need to report to the Indian Embassy in the destination country?**
You are required to register with the Indian Embassy in your destination country as an overseas Indian student (overseas citizen registration at the Embassy). This is not enforced with penalties but is advisable — in case of emergency evacuation, consular assistance, or administrative issues, registered students get priority assistance.

**What if my visa gets rejected?**
Visa rejections happen — usually due to incomplete documents or an issue with the university's invitation process. Reapply with corrected documents. If the university's Ministry invitation was the issue (Russia/Kazakhstan), the university's International Office must coordinate a re-invitation. This can add 4–6 weeks. For September intake, a visa rejection in late August may mean deferring to the February intake.

---

## Summary: The Master Timeline for September 2026 Intake

| Date | Action |
|---|---|
| June 2026 | NEET results declared — confirm percentile |
| June Week 1 | Research universities — confirm NMC status |
| June Week 2 | Apply to 2–3 universities |
| June Week 3 | Receive university offer letters |
| June Week 3–4 | Apply for NMC Eligibility Certificate (eportal.nmc.org.in) |
| June Week 4 | Approach bank for education loan sanction |
| July Week 1 | Receive NMC EC → Apply for student visa |
| July Week 1 | Pay university seat booking/first installment |
| July Week 2–4 | HIV test + medical fitness certificate |
| August Week 1 | Receive visa |
| August Week 1 | Book flights |
| August Week 2 | Obtain forex card, arrange remaining funds |
| August Week 3 | Buy essentials, photocopy all documents |
| September Week 1 | Depart India |
| September Week 1 | Arrive, orientation, SIM card, registration |

Related: [NMC Eligibility Certificate Guide](/blog/nmc-eligibility-certificate-mbbs-abroad-complete-guide) | [MBBS Abroad Fraud: How to Verify](/blog/how-to-avoid-mbbs-abroad-fraud-agent-scams) | [Education Loan for MBBS Abroad](/blog/education-loan-for-mbbs-abroad-2026)`,
};

async function run() {
  console.log("=== Blog Batch 6 — Post 7: Admission Process Step by Step ===\n");
  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const client = await pool.connect();
  try {
    console.log(`\nPost: ${post.slug}`);
    const coverUrl = await uploadImage(LOCAL_IMAGE, CLOUDINARY_ID);
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
    console.log(`  Word count: ~${post.content.split(' ').length}`);
    console.log(`  Read time: ${Math.ceil(readingTime(post.content).minutes)} min`);
  } finally { client.release(); await pool.end(); }
  console.log("\n✅ Post 7 done!\n");
}
run().catch(e => { console.error(e); process.exit(1); });
