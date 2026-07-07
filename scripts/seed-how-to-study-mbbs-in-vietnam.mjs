/**
 * Seed: How to Study MBBS in Vietnam - Step-by-Step Guide for Indian Students (2026)
 * Run: node scripts/seed-how-to-study-mbbs-in-vietnam.mjs
 */
import "dotenv/config";

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import readingTime from "reading-time";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

neonConfig.webSocketConstructor = WebSocket;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(localPath, publicId) {
  try {
    const existing = await cloudinary.api.resource(publicId);
    console.log(`  [skip] already on cloudinary: ${publicId}`);
    return existing.secure_url;
  } catch {}
  const r = await cloudinary.uploader.upload(localPath, {
    public_id: publicId,
    overwrite: false,
  });
  console.log(`  [ok] uploaded: ${r.secure_url}`);
  return r.secure_url;
}

const slug = "how-to-study-mbbs-in-vietnam";
const coverLocalPath = join(root, "public", "images", "countries", "vietnam-hero.jpg");
const coverPublicId = "studentstraffic/blog/how-to-study-mbbs-in-vietnam";

const title =
  "How to Study MBBS in Vietnam: A Step-by-Step Guide for Indian Students (2026)";

const excerpt =
  "A practical, step-by-step walkthrough of how Indian students actually get from a NEET scorecard to a seat in a Vietnamese medical university - eligibility, documents, intake timing, visa, arrival, and the India-return licensing step most guides skip.";

const metaTitle =
  "How to Study MBBS in Vietnam: Step-by-Step Guide for Indian Students 2026";

const metaDescription =
  "Learn how to study MBBS in Vietnam step by step - NEET eligibility, application process, documents, intakes, student visa, medium-of-instruction reality, and the FMGE/NExT step after you return to India.";

const content = `## Who This Guide Is For

If you are trying to figure out how to study MBBS in Vietnam - not whether Vietnam is the "best" country, but the actual mechanics of getting from where you are today to a confirmed seat and a visa - this guide is built for that question.

It walks through the process in the order it actually happens: eligibility first, then university and application, then documents, then visa, then arrival, and finally the part almost nobody explains properly - what you need to do after you graduate to legally practise in India.

This is a process guide. For university-by-university comparisons, fee breakdowns, and city-by-city detail, see [MBBS in Vietnam 2026: Complete Guide](/blog/mbbs-in-vietnam-2026-complete-guide), [Best Medical Universities in Vietnam 2026](/blog/best-vietnam-medical-universities-for-indian-students-ranking), and [MBBS in Vietnam Fees 2026](/blog/mbbs-in-vietnam-fees-2026-total-cost-guide). This article focuses on the how-to sequence itself.

---

## Step 1: Confirm You Actually Meet the NEET Requirement

Before you research a single university, settle this question, because everything else depends on it.

Under National Medical Commission (NMC) rules, any Indian citizen who wants a foreign medical degree to be usable for practice in India must hold a qualifying NEET score. This is a statutory requirement, not a university preference - Vietnamese universities do not enforce it, but the Indian system does, at the point you try to register as a doctor back home.

The qualifying bar is expressed as a **percentile**, not a fixed mark:

| Category | Minimum NMC percentile |
|---|---|
| General (UR) | 50th percentile |
| OBC (Non-Creamy Layer) | 40th percentile |
| SC / ST | 40th percentile |
| PwD (General) | 45th percentile |
| PwD (SC/ST/OBC) | 40th percentile |

Two practical points that trip students up:

- **The percentile is fixed; the raw mark behind it is not.** The mark equivalent to "50th percentile" changes every year depending on how the exam went nationally. Check your own scorecard for the percentile figure directly rather than comparing your marks to a friend's from a different year.
- **Your NEET score has a validity window for the purpose of admission abroad** - commonly cited as three years from your result. If you are using an older NEET attempt, verify current validity on [nmc.org.in](https://www.nmc.org.in/information-desk/for-students-to-study-in-abroad/) before relying on it.

No Vietnamese university that Indian students commonly apply to sets its own NEET cutoff above the NMC floor. If you clear the NMC percentile for your category, you meet the eligibility bar for admission purposes. What NEET does **not** guarantee is a smooth return to practice in India later - that depends on a separate exam after you graduate, which this guide covers in Step 8.

---

## Step 2: Be Honest About Why Vietnam - and Where It Genuinely Fits

Vietnam has become a serious option for Indian families, not because it is the cheapest or the most prestigious choice, but because of a specific combination of factors:

- **Geography and travel:** Vietnam sits inside a familiar Asian time zone and flight radius, which matters more than families expect once you factor in vacations, emergencies, and homesickness.
- **Climate:** Warm to tropical, without the severe winters that shape student life in Russia or parts of Central Asia.
- **A mix of public and private universities:** Established public schools (Hanoi Medical University, University of Medicine and Pharmacy Ho Chi Minh City, Hue, Can Tho) sit alongside newer, more service-oriented private medical faculties (Duy Tan, Phan Chau Trinh, Dai Nam, and others).
- **Cost that can be moderate relative to some Eastern European and CIS options** - though exact figures vary significantly by university and should always be checked directly against a current fee sheet, not a blog average.

What Vietnam is **not**: a shortcut around NEET, a guaranteed-easy licensing path, or a country where "English medium" means the whole six-year experience happens in English with no adaptation required. The honest version of "why Vietnam" includes the trade-offs in Step 6 below.

---

## Step 3: Shortlist Universities - Don't Choose the Country, Choose the University

This is the step most students skip too quickly. "I'm going to Vietnam" is not a decision. "I'm applying to this specific university, in this specific city, on this specific fee structure" is a decision.

At a minimum, compare shortlisted universities on:

| What to check | Why it matters |
|---|---|
| Public or private | Different fee levels, different administrative style, different campus culture |
| City | Hanoi, Ho Chi Minh City, Da Nang, Hue, Can Tho, and smaller cities all offer very different daily-life experiences |
| Recognition documentation | Ask for the university's current listing status and program-level documents rather than accepting a verbal claim |
| Actual medium of instruction, year by year | See Step 6 - ask specifically how years 3 to 6 are taught, not just year 1 |
| Hospital/clinical affiliations | Which hospitals, which departments, from which year |
| Total cost structure | Tuition, registration fee, one-time charges, and hostel are usually separate line items - ask for all of them, not just the headline tuition number |

A shortlist of 3 to 5 universities, compared side by side on these points, is far more useful than a longer list compared only on marketing brochures.

---

## Step 4: Understand the Application Process

The application process for Indian students is generally more straightforward than for competitive-exam-based systems, but "straightforward" does not mean "skip due diligence." In broad terms, most universities follow this sequence:

1. **Initial enquiry / shortlisting** - direct to the university's international office, or through a registered admission consultant
2. **Submit academic documents** for eligibility screening (see Step 5 for the full list)
3. **Receive an eligibility or acceptance communication** from the university
4. **Confirm the fee structure for your specific intake** in writing - not verbally
5. **Pay the required registration/first-payment amount** as specified by the university (confirm exactly what this covers before paying)
6. **Receive the formal admission/invitation letter** - this is the document you will need for your visa application
7. **Begin visa processing** (Step 7)

Most Vietnamese medical universities do not require a separate entrance test such as IELTS, an interview-based exam, or an aptitude test for Indian applicants - eligibility screening is based on your academic transcripts and NEET status. Always verify this directly with your shortlisted university, since individual programs can add requirements.

---

## Step 5: Documents You Will Need

Start collecting these early - document delays are one of the most common reasons families miss an intake.

### Academic documents
- Class 10 marksheet and certificate
- Class 12 marksheet and certificate (with Physics, Chemistry, Biology)
- NEET scorecard (showing marks and percentile)

### Identity and travel documents
- Passport (check validity - most universities and visa processes want several years of validity remaining)
- Passport-size photographs (multiple copies, specifications vary by document)

### Supporting documents (requirements vary by university and visa stage)
- Birth certificate
- Medical fitness certificate
- Financial capability proof (bank statement or sponsorship letter)
- Admission/invitation letter from the university (needed for the visa stage)

### Document checklist at a glance

| Document | Needed for |
|---|---|
| Class 10 & 12 certificates | University application |
| NEET scorecard | University application, and later the NMC Eligibility Certificate |
| Passport | Application, visa, travel |
| Photographs | Application and visa forms |
| Medical fitness certificate | Visa / university enrollment |
| Financial proof | Visa application |
| University admission/invitation letter | Visa application |

Keep certified or attested copies where required, and retain digital scans of everything. You will need several of these documents again after graduation for the NMC Eligibility Certificate and FMGE/NExT registration (Step 8) - do not assume you'll be able to easily recreate this file six years from now.

---

## Step 6: Understand the Medium-of-Instruction Reality Before You Commit

This is the point where Indian families most often get an incomplete picture, and it deserves a direct, honest answer rather than a marketing one.

Most Vietnamese medical universities that actively recruit Indian students **advertise an English-medium program**, and for the pre-clinical years (roughly years 1-2, covering anatomy, physiology, biochemistry, and similar foundational subjects) this is generally accurate - lectures and coursework are delivered in English, sometimes alongside optional Vietnamese-language classes.

The honest caveat is what happens from the clinical years onward (roughly years 3-6), when training moves into hospital wards and patient contact:

- Patients in Vietnamese public hospitals overwhelmingly speak Vietnamese, not English.
- Some universities provide translators, bilingual clinical faculty, or structured English-medium clinical tracks; others rely more heavily on students picking up working Vietnamese as they go.
- The depth of this support varies significantly by university, and brochure language like "English medium" or "international program" does not by itself tell you how clinical years actually function.

**What to do about this practically:**

1. Ask your shortlisted university, in writing, exactly how clinical rotations are conducted from year 3 onward - ask for specifics, not reassurance.
2. Ask whether Vietnamese-language instruction is compulsory, and how many hours per week it typically involves in years 1-2.
3. Treat "we'll figure it out" or "don't worry about it" as a reason to ask harder questions, not a reason to stop asking.
4. Go in expecting to build basic conversational Vietnamese over your first two years - it is a realistic expectation, not a worst-case one, and it will meaningfully improve your clinical experience regardless of how English-supported the program is.

This is a genuine consideration, not a disqualifying one. Students who plan for it upfront generally adapt without major difficulty. Students who assume the entire six years will run exactly like an English-medium program in India are the ones who find the transition harder than expected.

---

## Step 7: Intake Timing and the Visa Process

### When intakes typically happen

Most Vietnamese medical universities align their main intake with the September/October academic year start, similar to much of the region. Application windows commonly open in the January-to-June period ahead of that intake, though exact dates vary by university and should be confirmed directly with your shortlisted institution rather than assumed from a generic calendar.

A widely cited rule of thumb: **the full process from first application to arrival in Vietnam typically takes 3 to 4 months**, once you include document preparation, admission processing, and visa issuance. Build in buffer time rather than starting at the last possible moment.

### Indicative timeline for a September intake

| Phase | Approximate window |
|---|---|
| NEET result and eligibility confirmation | June |
| University shortlisting and application | June-July |
| Document submission and eligibility screening | July |
| Admission/invitation letter issued | July-August |
| Visa application filed | August |
| Visa processing | Typically several weeks - confirm current processing time with the embassy/consulate |
| Travel and arrival | Late August-September |
| Orientation and semester start | September/October |

### The visa process

Indian students typically apply for a **Vietnamese student visa (category DH)**. In practice:

- You generally cannot apply for the student visa entirely on your own before the university acts - the university (or its authorized sponsor) typically first submits your enrollment details to Vietnamese immigration authorities to obtain a pre-approval, and only after that do you formally lodge your visa application, commonly through the Vietnamese Embassy in New Delhi or the Consulate in a city like Mumbai or Ho Chi Minh City-adjacent posts.
- Core documents needed include your passport, the university's admission/invitation letter, visa application forms, photographs, and financial/accommodation proof.
- Processing timelines vary and can run to several weeks in total once you include the university-side pre-approval step - do not assume a fast turnaround and file well ahead of your intended travel date.

Always confirm the current visa category, documents, and fees directly with the Vietnamese Embassy in India or your university's international office, since visa procedures are periodically updated.

---

## Step 8: Arrival and Settling In

Once you land:

- Most universities or their partner hostels arrange initial airport pickup and orientation for new international students - confirm this in writing before you travel, and know who to contact if plans change.
- Expect an orientation period covering campus logistics, hostel allocation, local registration/paperwork, and often a basic introduction to Vietnamese language and campus life.
- Hostel arrangements are typically shared (2-, 3-, or 4-sharing rooms are common), and costs vary by sharing pattern - confirm which sharing type your quoted fee actually assumes.
- Budget time in your first few weeks for local SIM card registration, opening any required local banking or payment arrangements, and learning your daily commute between hostel, classes, and (later) hospital postings.

The practical adjustment period is real but manageable. Students who arrive with realistic expectations - rather than expecting an immediate like-for-like replica of home - settle in faster.

---

## Step 9: The Part Most Guides Skip - Coming Back and Getting Licensed in India

This is arguably the most important step in the entire process, and it happens years after admission, which is exactly why it gets neglected.

Completing an MBBS-equivalent degree in Vietnam does not, by itself, allow you to practise medicine in India. Two separate compliance steps apply:

### 1. The NMC Eligibility Certificate

Before you can register for the licensing screening exam, you need an **Eligibility Certificate from the NMC** (sometimes still referred to by its earlier name from the pre-NMC era). You should apply for this as soon as you have your university admission letter - not after you graduate. Required documents typically include your 10th and 12th certificates, NEET scorecard, passport, and the university's admission letter. Apply through the NMC's student portal and keep confirmation of submission.

### 2. FMGE or NExT - the screening exam itself

After completing your medical degree abroad, Indian law requires you to clear a licensing screening exam before you can register with a State Medical Council and practise in India.

- **As of now, this exam is the FMGE (Foreign Medical Graduate Examination)**, conducted by the National Board of Examinations, and it remains the operative requirement for foreign medical graduates in the current cycle.
- **The National Exit Test (NExT)** has been planned by the NMC as an eventual replacement for both FMGE and NEET-PG, intended to serve as a common final-year and licensing exam for Indian-trained and foreign-trained graduates alike. As of this writing, **NExT's rollout timeline for foreign medical graduates has not been definitively finalized** - students currently preparing to graduate should plan around the FMGE requirement that is presently in force, while staying alert to official NMC notifications about when NExT will apply to their graduating batch.

**What this means practically:** do not treat this as a footnote to sort out in your final year. Students who prepare consistently through their clinical years - keeping India's exam pattern in mind alongside their Vietnamese coursework - consistently do better than students who leave screening-exam preparation entirely until after they return.

Because this requirement, and its exact exam format, is subject to updates from the NMC, verify the current position directly on [nmc.org.in](https://www.nmc.org.in/) or with National Board of Examinations sources before finalizing your own preparation plan, rather than relying on any single year's blog post - including this one.

---

## The Full Process, Start to Finish

| Stage | What happens |
|---|---|
| 1. Eligibility | Confirm your NEET percentile meets the NMC minimum for your category |
| 2. Research | Understand honestly what Vietnam offers and where the trade-offs are |
| 3. Shortlist | Compare 3-5 specific universities, not just "Vietnam" as a country |
| 4. Apply | Submit documents, receive eligibility/admission communication |
| 5. Documents | Assemble academic, identity, and supporting paperwork |
| 6. Verify medium of instruction | Get clarity in writing on how years 3-6 are actually taught |
| 7. Visa | University pre-approval, then formal visa filing and processing |
| 8. Arrival | Orientation, hostel, local registration, settling in |
| 9. Study | Six years, pre-clinical then clinical, with ongoing screening-exam preparation |
| 10. Return and license | NMC Eligibility Certificate, then FMGE/NExT before you can practise in India |

---

## Where Students Traffic Fits Into This Process

Everything above is information you can verify yourself with enough time and patience. Where it usually helps to have a partner is in the judgment calls: which university genuinely fits your academic profile and budget, how to read a fee sheet that spreads costs across tuition, registration, and hostel charges, and how to structure your document trail so nothing is missing when you need it again for your NMC Eligibility Certificate years later.

Students Traffic's counsellors work with Indian families comparing Vietnam specifically for this reason - not to push one university, but to help you shortlist against your own priorities, check eligibility properly before you commit money, and think through the medium-of-instruction and India-return questions honestly rather than after you've already paid a registration fee. If you're at the shortlisting stage, [reach out for admissions guidance](/students) or explore the [Vietnam country guide](/countries/vietnam) for university-level detail.

---

## Frequently Asked Questions

**Q: What is the minimum NEET score needed to study MBBS in Vietnam?**

There is no separate Vietnam-specific score. You need to meet the NMC's national minimum: 50th percentile for General category, 40th percentile for SC/ST/OBC/PwD categories, as shown on your official NEET scorecard.

**Q: Is the medium of instruction in Vietnam actually English?**

For pre-clinical years (roughly years 1-2), most universities that recruit Indian students do teach in English. From the clinical years onward, real patient interaction happens substantially in Vietnamese, and support for this varies by university. Ask your shortlisted university for specifics on years 3-6 before you commit, rather than accepting "English medium" as a complete answer.

**Q: How long does the whole process take, from application to arrival?**

Commonly cited as 3 to 4 months from initial application to arrival, assuming you start well ahead of your target intake and do not have document delays. Most main intakes align with the September/October academic year start.

**Q: Do I need to clear an entrance exam to get into a Vietnamese medical university?**

Most Vietnamese universities that admit Indian students do not require a separate entrance test - eligibility is generally assessed on your Class 12 academic record and NEET status. Confirm this directly with your shortlisted university, since requirements can vary.

**Q: What exam do I need to clear after returning to India?**

Currently, the FMGE (Foreign Medical Graduate Examination), conducted by the National Board of Examinations. The NMC has proposed NExT as an eventual replacement, but its implementation timeline for foreign medical graduates has not been conclusively finalized as of this writing - verify the current requirement with the NMC before your graduation year.

**Q: Can I work part-time in Vietnam as a student?**

Student visa terms are restrictive around formal employment, and the six-year MBBS structure plus screening-exam preparation leaves little practical room for outside work. Treat your visa status and academic schedule as the priority.

**Q: Is Vietnam a good choice compared to Russia, Georgia, or Central Asia?**

It depends on what you're optimizing for - see [MBBS in Vietnam vs Russia vs Georgia](/blog/mbbs-in-vietnam-vs-russia-vs-georgia-for-indian-students) for a direct comparison across cost, climate, travel time, and language reality.

**Q: Where can I check if my Vietnamese university choice is properly documented?**

Ask the university directly for its current recognition and program-level documentation rather than relying on a consultant's verbal assurance, and cross-check with [Is MBBS in Vietnam Valid in India?](/blog/is-mbbs-in-vietnam-valid-in-india-nmc-next-neet) for the questions worth asking before you pay any fee.`;

async function run() {
  console.log("=== Blog Seeder: How to Study MBBS in Vietnam ===\n");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    let coverUrl = null;
    try {
      coverUrl = await uploadImage(coverLocalPath, coverPublicId);
    } catch (e) {
      console.warn("  [warn] cover upload failed, publishing without cover:", e.message);
    }

    const stats = readingTime(content);
    const readingMinutes = Math.max(1, Math.ceil(stats.minutes));
    const wordCount = stats.words;
    console.log(`  words: ${wordCount}, reading time: ${readingMinutes} min`);

    const now = new Date();
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
      [
        slug,
        title,
        excerpt,
        content,
        coverUrl,
        "Country Guide",
        metaTitle,
        metaDescription,
        readingMinutes,
        now,
      ]
    );
    console.log(`  Upserted [id=${r.rows[0].id}]: ${r.rows[0].slug}`);
  } finally {
    client.release();
    await pool.end();
  }
  console.log("\nDone.\n");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
