/**
 * Seed a single new blog post targeting "how to study MBBS in Georgia" —
 * a step-by-step process guide (eligibility, university choice, application,
 * documents, visa, arrival, and return-to-India licensing), distinct from the
 * existing "MBBS in Georgia 2026: Complete Guide" overview/university/cost post.
 *
 * Cover image: uploads the local public/images/countries/georgia.jpg to
 * Cloudinary under a new, distinct public_id (skips upload if it already exists).
 *
 * Run: node scripts/seed-blog-how-to-study-mbbs-in-georgia.mjs
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

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required in .env before running this script.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const LOCAL_COVER_PATH = join(root, "public/images/countries/georgia.jpg");
const COVER_PUBLIC_ID = "studentstraffic/blog/how-to-study-mbbs-in-georgia";

async function uploadCover() {
  try {
    const existing = await cloudinary.api.resource(COVER_PUBLIC_ID);
    console.log(`  [skip] cover already on Cloudinary: ${existing.secure_url}`);
    return existing.secure_url;
  } catch {
    // not found, proceed to upload
  }
  try {
    const r = await cloudinary.uploader.upload(LOCAL_COVER_PATH, {
      public_id: COVER_PUBLIC_ID,
      overwrite: false,
    });
    console.log(`  [ok] uploaded cover: ${r.secure_url}`);
    return r.secure_url;
  } catch (e) {
    console.warn(`  [warn] cover upload failed, publishing without cover_url: ${e.message}`);
    return null;
  }
}

const post = {
  slug: "how-to-study-mbbs-in-georgia",
  title: "How to Study MBBS in Georgia: A Step-by-Step Guide for Indian Students (2026)",
  category: "MBBS Abroad",
  excerpt:
    "A practical, step-by-step walkthrough of how to study MBBS in Georgia as an Indian student — from confirming NEET eligibility and choosing a university, through documents, application, visa, arrival, and planning your FMGE/NExT return-to-India licensing path.",
  metaTitle: "How to Study MBBS in Georgia: Step-by-Step Guide 2026",
  metaDescription:
    "Learn how to study MBBS in Georgia step by step: NEET eligibility, choosing a university, document checklist, D3 visa process, arrival, and the FMGE/NExT licensing path back to India.",
  content: `## Before You Start: Who This Guide Is For

If you have already decided Georgia is the country you want to study MBBS in, and you are now asking "okay, what do I actually *do*, in what order?" — this guide is for you.

We have a separate, detailed [complete guide to MBBS in Georgia](/blog/mbbs-in-georgia-2026-complete-guide) that walks through university profiles, curriculum structure, and cost breakdowns. If you are still deciding *which* Georgian university to apply to, or comparing total cost of attendance, start there.

This guide assumes you are past the "why Georgia" stage. It walks through the actual sequence of steps: checking your eligibility, choosing a university sensibly, preparing documents, applying, getting your visa, flying out, settling in, and — the part most guides skip — what happens when you come back to India and need to get licensed to practice.

Treat this as a working checklist you can return to at each stage, not a one-time read.

---

## Step 1: Confirm You Actually Meet the Eligibility Requirements

Before you spend time shortlisting universities, settle three eligibility questions. Getting any of these wrong later is expensive and hard to undo.

### 1. Your academic eligibility (10+2)

You need Class 12 (or equivalent) with Physics, Chemistry, and Biology, from a recognized board. The commonly applied minimum aggregate under NMC's foreign medical graduate norms is around 50% in PCB for General category and 40% for SC/ST/OBC candidates — the same baseline used across most MBBS-abroad destinations, not something unique to Georgia. Always confirm the exact figure your target university is asking for, since some universities set their own (slightly stricter) internal minimums.

### 2. Your NEET score and category cutoff

This is the one rule with zero flexibility. To ever register with an Indian State Medical Council and practice in India, you must hold a NEET score that meets the National Medical Commission's qualifying percentile for your category:

- **General category:** 50th percentile
- **OBC / SC / ST:** 40th percentile

This is a percentile requirement, not a fixed mark — the raw score that corresponds to "50th percentile" shifts slightly every year depending on that year's paper and the number of candidates. Your NEET scorecard shows your percentile directly; that is the number to check, not just your marks.

A NEET score is commonly understood to remain usable for MBBS-abroad admission for a few years after the result (frequently cited as around three years), but this detail is revised from time to time. Before you finalize any admission plan around an older NEET attempt, confirm the current validity window directly rather than relying on what an agent tells you.

**Georgia specifically requires proof of a valid NEET score as part of the student visa documentation** — it is explicitly listed on the official visa checklist for MBBS and equivalent programs, alongside your passport and admission documents. There is no way around this step for Indian applicants.

### 3. Age

You need to be at least 17 years old by December 31 of your admission year. There is no upper age ceiling under current NMC rules.

If you clear all three of the above, you are eligible to move to the next step. If you are unsure whether your NEET score or academic percentage qualifies, sort that out first — it changes nothing about which university you can afford to consider, but it changes everything about whether the degree will be usable in India.

---

## Step 2: Choose a University — With the Right Filters, Not the Loudest Agent

Once eligibility is confirmed, the next decision is which university. This is where most of the marketing noise lives, so keep your filter list short and non-negotiable.

**What actually matters:**

1. **Is the university currently listed with the National Medical Commission and in the World Directory of Medical Schools (official regulatory sources)?** This is institution-specific — "Georgia is approved" means nothing on its own. Check the specific university's name against the current NMC list yourself, not through an agent's word.
2. **Is the medium of instruction genuinely English for the full 6 years**, including clinical rotations, or does it quietly shift to Georgian/Russian in later years?
3. **What is the university's actual clinical training setup** — affiliated teaching hospitals, patient case-load, simulation labs?
4. **What do current students say**, not what the brochure says?

We have covered university-by-university comparisons, ECTS structure, and realistic cost breakdowns for Georgia in detail in our [complete MBBS in Georgia guide](/blog/mbbs-in-georgia-2026-complete-guide) and our [Georgia medical universities ranking](/blog/best-georgia-medical-universities-for-indian-students-ranking) — use those to actually shortlist. Do not choose a university based on a single agent's recommendation without cross-checking NMC status yourself.

If you are simultaneously considering other countries, our [Russia vs Georgia](/blog/mbbs-in-russia-vs-georgia-for-indian-students) and [Vietnam vs Russia vs Georgia](/blog/mbbs-in-vietnam-vs-russia-vs-georgia-for-indian-students) comparisons may help you settle on the country before you go further into Georgia-specific paperwork.

---

## Step 3: Understand the Intake Calendar

Georgian medical universities primarily admit international students for a **September intake**, with the active application window typically running from around **May/June through July/August**. This is the cycle most Indian students plan around, since it lines up naturally with NEET results (usually out in June) and gives enough runway for documentation and visa processing before a September departure.

Some universities may run limited additional intake windows, but September is the one to plan your entire timeline against unless a specific university confirms otherwise in writing.

### Rough timeline for a September intake

| Phase | Approximate Window | What Happens |
|---|---|---|
| NEET result | June | Confirm your percentile qualifies for your category |
| University shortlisting & application | June – July | Submit application with academic documents, NEET scorecard, passport |
| Document verification | 2–4 weeks after application | University reviews and issues admission/invitation letter |
| Document attestation (HRD + MEA Apostille) | Can start earlier, in parallel | Get 10th/12th certificates apostilled — see Step 4 |
| Visa application (D3) | Once invitation letter is in hand | Submit at VFS Global / Georgian consular portal |
| Visa processing | Roughly 2–4 weeks, sometimes longer | Allow buffer time; do not book flights until visa is confirmed |
| Travel & arrival | August – September | Arrive in time for orientation |
| Residence permit registration | Soon after arrival, well before visa expiry | Register at the Public Service Hall |

Treat the middle column as a planning guide, not a guarantee — processing times move depending on document readiness on your end and verification load on the university/embassy end in any given year. Build in slack rather than planning to the exact day.

---

## Step 4: Prepare Your Documents (Do This Early, in Parallel)

This is the step families most often leave too late. Several of these documents take weeks to process and do not depend on your visa timeline — start them the moment you decide to apply.

### Document checklist

| Document | Why You Need It | When to Start |
|---|---|---|
| Passport (valid, ideally 3+ years validity remaining, blank pages) | Required for application and visa; Georgia's visa checklist asks for a passport issued within the last 10 years with at least 2 blank pages | Immediately if you don't already have one |
| 10th & 12th mark sheets and passing certificates | Core eligibility proof | Immediately |
| NEET scorecard (current, valid year) | Mandatory proof of NEET qualification — explicitly required on Georgia's own visa checklist for MBBS applicants | As soon as result is out |
| Apostille on academic documents | Georgia is a Hague Apostille Convention member; educational documents must be attested by Apostille through India's MEA before they are accepted | 4–8 weeks before you expect to need them — this queue is often the real bottleneck |
| Passport-size photographs | Application and visa forms | Any time |
| Medical fitness certificate | Standard requirement for most foreign study visas | Close to visa application |
| Proof of funds (self-funding declaration, or sponsor's bank statements, salary certificate, notarized sponsorship affidavit) | Visa requirement to show you can support yourself | 4+ weeks before visa filing |
| Travel and health insurance | Mandatory for the D3 visa validity period | Before visa filing |
| Proof of accommodation (university hostel confirmation, rental agreement, or notarized host letter) | Visa requirement | Once admission is confirmed |
| University admission/invitation letter | Your core "purpose of travel" document | Issued by university after document review |

### On attestation — the part people get wrong

Because Georgia participates in the Hague Apostille Convention (as does India), the standard process is: your state HRD department attests your educational certificates first, and then India's Ministry of External Affairs applies the Apostille stamp. Once a document carries a valid Apostille, Georgia's own visa checklist does not ask for further embassy legalization on top of it. This is simpler than the older-style attestation chain some countries still require — but the HRD-to-MEA queue itself can take several weeks depending on your state, so this is the document step to start earliest, not last.

### On language requirements

Most Georgian medical universities do not require IELTS or TOEFL for admission — instruction is in English and many universities substitute a short spoken-English interview instead of a formal test score. Georgia's own visa documentation checklist lists an IELTS/TOEFL result as "not obligatory." Do not let an agent talk you into an unnecessary test booking; confirm directly with your shortlisted university whether they require one.

---

## Step 5: Apply to the University

With documents in hand, the application itself is usually straightforward:

1. **Submit your application** directly to the university's international admissions office, or through a registered representative — either directly by email/portal, or via a consultancy.
2. **Send scanned academic documents, NEET scorecard, and passport** for the university's admissions team to verify.
3. **Attend a basic interview if required** — for most universities this is a short conversation to confirm your spoken English and motivation, not a rigorous entrance exam.
4. **Receive your admission/invitation letter.** This typically takes a few weeks after document submission, and is the single most important document for your visa application — nothing else on the visa checklist can substitute for it.
5. **Pay the seat-confirmation/registration fee** the university asks for to hold your seat, only after you have a genuine, verifiable admission letter — not before.

A practical filter: if anyone asks for a large payment before you have an official university admission/invitation letter in hand, slow down and verify independently with the university before paying anything.

---

## Step 6: Apply for Your Georgian D3 Student Visa

Indian students study in Georgia on a **D3 (study/immigration) visa**. Applications go through **VFS Global**, Georgia's official visa facilitation partner in India, with supporting document upload also required through Georgia's own consular portal.

### What the visa application generally requires

- Signed visa application form (parent/guardian signature if you are a minor)
- Valid passport (issued within the last 10 years, valid well beyond your visa period, with blank pages)
- Visa fee
- Travel booking / itinerary
- Proof of purpose of travel: your university's admission/invitation letter **and** your NEET scorecard (explicitly required for MBBS and equivalent programs)
- Apostilled educational documents
- Proof of accommodation in Georgia
- Proof of financial support — either a self-funding declaration or a sponsor's notarized affidavit with bank statements and salary proof
- Valid travel and health insurance covering your visa validity period

### Processing time

Visa processing timelines vary depending on the year and how complete your documentation is on first submission — commonly cited ranges run from around two to four weeks, sometimes longer if additional verification is needed. Do not book non-refundable flights until your visa is actually issued, and build in a buffer before your intended departure date rather than cutting it close to the intake start.

---

## Step 7: Travel and Register on Arrival

Once your visa is stamped, plan your arrival with enough runway before orientation begins — most universities coordinate airport pickup for new international students, so confirm this with your university in advance.

After arrival, you are required to register your residence status with Georgian authorities at the **Public Service Hall**. Exact windows quoted for this vary — some guidance frames it as registering within roughly a month of arrival, others frame it as needing to be done well before your visa's validity runs out. Rather than rely on a single number, treat it as: **register as early as possible after you arrive, and well before your visa expires.** Your university's international student office will typically walk incoming students through this process, since it is a routine step for every new batch.

Standard processing for the residence permit itself is commonly cited as around 30 days, with faster paid options sometimes available. Keep your passport, admission proof, and visa documents accessible during this window — you may need to present them again.

---

## Step 8: Focus on What Actually Determines Your India-Return Outcome

This is the step most admission-focused guides skip entirely, and it matters more than almost anything else in this list.

Getting into a Georgian medical university is the easy part. What determines whether your degree is *usable* in India is what you do with the six years in between — and how prepared you are for the licensing exam you must clear on return.

### The current licensing picture (2026)

As of 2026, **FMGE (the NMC Screening Test) remains the applicable licensing exam** for graduates of foreign medical universities returning to practice in India. The **NExT (National Exit Test)**, which had been proposed to eventually replace both FMGE and NEET-PG as a single unified exit exam, was **deferred by the NMC in late 2025** — reported timelines suggest a delay of several years before it is expected to actually roll out for foreign medical graduates.

What this means practically: plan your preparation around FMGE as it exists today, but stay updated, since exit-exam policy for foreign medical graduates has changed before and may change again before you graduate. Check nmc.org.in periodically rather than assuming today's rule is permanent for your batch.

### What to do about it, starting from Year 1

- Do not wait until Year 6 to start FMGE-oriented revision. Students who build clinical-subject recall systematically from the early clinical years consistently outperform those who cram in the final year.
- Prioritize India-relevant clinical subjects (Medicine, Surgery, OBGYN, Pediatrics, Community Medicine) alongside your university's own curriculum — Georgian MD programs are rigorous, but FMGE tests a specific Indian-context format that benefits from separate, deliberate preparation.
- Before you leave India, apply for your **NMC Eligibility Certificate** — a separate, mandatory pre-departure step confirming your Indian regulatory eligibility to pursue a foreign medical degree. We cover this in full in our [NMC Eligibility Certificate guide](/blog/nmc-eligibility-certificate-2026-complete-guide-mbbs-abroad) — do not treat it as optional or something to "sort out later."
- For a subject-by-subject FMGE/NExT preparation roadmap, see our [complete FMGE preparation guide](/blog/fmge-nmc-screening-test-2026-complete-preparation-guide).

---

## A Quick Word on Cost and Financing

This guide has deliberately stayed process-focused rather than repeating fee tables — those are covered, university by university, in our [complete MBBS in Georgia guide](/blog/mbbs-in-georgia-2026-complete-guide). But two practical points belong here:

- Budget for costs beyond tuition: apostille and document processing fees, visa fees, health insurance, flights, first-semester accommodation, and winter clothing/setup costs in your first year.
- If you plan to fund your MBBS through an education loan, start that conversation with your bank in parallel with your university application — not after you already have a visa deadline bearing down on you. Loan sanction and disbursement timelines do not compress just because your departure date is close.

---

## Common Mistakes Students Make in This Process

- **Starting apostille/attestation too late.** This is consistently the slowest-moving document in the entire chain — start it the moment your 12th-grade results and NEET scorecard are in hand.
- **Paying large sums before receiving a genuine university admission letter.** Verify directly with the university if anything about the request feels rushed.
- **Booking flights before the visa is actually issued.**
- **Treating the language requirement as mandatory when it usually isn't** — confirm with your specific university rather than paying for an unnecessary IELTS/TOEFL attempt.
- **Ignoring FMGE/NExT preparation until the final year abroad**, instead of building it into study habits from the first clinical year onward.
- **Not applying for the NMC Eligibility Certificate before departure**, assuming it can be handled "later" — it cannot be safely deferred.

---

## Where Students Traffic Fits In

Every step above is manageable on your own with patience and enough lead time. Where families most often get stuck is not any single step — it's coordinating all of them at once while also making sure the university itself is a sound, NMC-recognized choice.

If you want a second set of eyes on your shortlist, help getting your documents and timeline in order, or a straight answer on whether a specific Georgian university is genuinely worth your six years, talk to our counselling team through [Students Traffic](/contact) or connect with students already studying in Georgia through our [peer connect program](/students). We would rather you ask the inconvenient questions now than discover the answers after you have already paid a seat-confirmation fee.

---

## Frequently Asked Questions

**Q: What is the minimum NEET percentile needed to study MBBS in Georgia?**

The same NMC-wide requirement that applies to any MBBS-abroad destination: 50th percentile for General category, 40th percentile for OBC/SC/ST. There is no separate, higher NEET cutoff specific to Georgia.

**Q: Is IELTS or TOEFL mandatory for MBBS admission in Georgia?**

Generally no. Most Georgian medical universities teach in English and substitute a short spoken-English interview instead of requiring a formal test score. Georgia's own student-visa checklist lists an IELTS/TOEFL result as not obligatory. Confirm directly with your specific shortlisted university, since practices can vary.

**Q: Do my educational documents need embassy attestation for Georgia, or is apostille enough?**

Apostille is generally sufficient. Georgia is a Hague Apostille Convention member, as is India, so educational documents attested through your State HRD department and then apostilled by India's Ministry of External Affairs are accepted without a separate Georgian embassy legalization step, per Georgia's own visa documentation checklist.

**Q: What visa do Indian students need for MBBS in Georgia?**

A D3 (study/immigration) visa, applied for through VFS Global in India alongside Georgia's consular portal. It requires your university admission letter, NEET scorecard, apostilled academic documents, proof of funds, accommodation proof, and valid health insurance.

**Q: How long does the whole process take, from application to departure?**

For a September intake, most students who start their application in June and keep documents moving in parallel are ready to travel by late August or early September. The single biggest variable is how early you start apostille/attestation — that step, not the visa itself, is usually what determines whether your timeline stays on track.

**Q: Is FMGE still the exam I need to clear after MBBS in Georgia, or is it NExT now?**

As of 2026, FMGE remains the applicable NMC screening test for foreign medical graduates. NExT, which was proposed to eventually replace it, was deferred by the NMC in late 2025 with reports suggesting a multi-year delay. Confirm the current position on nmc.org.in as you approach your graduation year, since this policy area has changed before.

**Q: Do I need to register with Georgian authorities after I arrive?**

Yes. You need to register your residence status at the Public Service Hall after arrival and before your D3 visa validity expires. Your university's international student office typically guides new students through this as a routine onboarding step.

**Q: Can I apply to more than one Georgian university at the same time?**

Yes, there is generally no restriction on applying to multiple universities in parallel while you compare admission letters, timelines, and fit — just be careful about paying non-refundable registration fees to more than one until you have made your final decision.

Related reading: [MBBS in Georgia 2026: Complete Guide](/blog/mbbs-in-georgia-2026-complete-guide) | [Best Georgia Medical Universities Ranking](/blog/best-georgia-medical-universities-for-indian-students-ranking) | [NMC Eligibility Certificate Guide](/blog/nmc-eligibility-certificate-2026-complete-guide-mbbs-abroad) | [FMGE Preparation Guide](/blog/fmge-nmc-screening-test-2026-complete-preparation-guide)`,
};

async function run() {
  console.log("=== Blog Seeder: how-to-study-mbbs-in-georgia ===\n");

  const coverUrl = await uploadCover();

  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    console.log(`Post: ${post.slug}`);
    const now = new Date();
    const minutes = Math.ceil(readingTime(post.content).minutes);

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
        post.slug,
        post.title,
        post.excerpt,
        post.content,
        coverUrl ?? null,
        post.category,
        post.metaTitle,
        post.metaDescription,
        minutes,
        now,
      ]
    );
    console.log(`  Reading time: ${minutes} min`);
    console.log(`  Upserted [${r.rows[0].id}]: ${r.rows[0].slug}`);
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
