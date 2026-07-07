/**
 * Seed a single new blog post targeting "how to study MBBS in Russia" —
 * a step-by-step process guide (eligibility, university choice, application,
 * visa, arrival, and return-to-India licensing), distinct from the existing
 * "MBBS in Russia 2026: Complete Guide" overview/cost/safety post.
 *
 * Run: node scripts/seed-blog-how-to-study-mbbs-in-russia.mjs
 */
import "dotenv/config";

import { neonConfig, Pool } from "@neondatabase/serverless";
import readingTime from "reading-time";
import { WebSocket } from "ws";

neonConfig.webSocketConstructor = WebSocket;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required in .env before running this script.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Reuse the existing Russia cover image already used by the complete-guide
// post (same country/topic family); avoids a redundant Cloudinary upload.
const EXISTING_RUSSIA_COVER_URL =
  "https://res.cloudinary.com/dlh6tmx7h/image/upload/v1774957986/studentstraffic/blog/mbbs-russia-2026.jpg";

const post = {
  slug: "how-to-study-mbbs-in-russia",
  title: "How to Study MBBS in Russia: A Step-by-Step Guide for Indian Students (2026)",
  coverUrl: EXISTING_RUSSIA_COVER_URL,
  category: "MBBS Abroad",
  excerpt:
    "A practical, step-by-step walkthrough of how to study MBBS in Russia as an Indian student — from confirming NEET eligibility and choosing a university, through application, visa, arrival, and planning your FMGE/NExT return-to-India licensing path.",
  metaTitle: "How to Study MBBS in Russia: Step-by-Step Guide 2026",
  metaDescription:
    "Learn how to study MBBS in Russia step by step: NEET eligibility, choosing a university, application documents, intake timing, visa process, arrival, and the FMGE/NExT licensing path back to India.",
  content: `## Start Here: What "How to Study MBBS in Russia" Actually Means

Most guides answer "should I study MBBS in Russia" with fees, safety, and rankings. This one answers a different question: if you have already decided Russia is worth considering, **what do you actually need to do, in what order, to get from a Class 12 student to a Russian medical university seat, and eventually back to India as a licensed doctor?**

This is a process guide, not a comparison guide. If you still need to weigh Russia against other options, compare universities and costs, or understand the banking and safety picture, read our [complete MBBS in Russia guide](/blog/mbbs-in-russia-2026-complete-guide) first. Come back here once you are ready to move from "should I" to "how do I."

The process has six stages:

1. Confirm your NEET eligibility
2. Choose a university and city
3. Apply and assemble your documents
4. Get your invitation letter and visa
5. Arrive and settle in
6. Plan your return-to-India licensing path from day one

Each stage has specific requirements, and skipping the sequence — for example, paying a university before checking NEET eligibility, or ignoring the return-licensing plan until year six — is where families run into avoidable trouble. Let's go through each one.

---

## Stage 1: Confirm NEET Eligibility Before You Do Anything Else

This is the single most important gate in the entire process, and it comes before you research a single university.

Since 2018, NEET-UG has been mandatory for every Indian citizen and Overseas Citizen of India (OCI) who wants a medical degree from outside India to eventually be usable for practice in India. This is not a university-level rule — it is a National Medical Commission (NMC) requirement that sits above any individual college's admission policy.

**What "eligible" actually means:**

- You must have appeared for NEET-UG and qualified it — General category candidates need the 50th percentile, and SC/ST/OBC candidates need the 40th percentile (roughly, though the exact raw-score cutoff shifts slightly each year based on that year's results).
- There is no separate "higher score needed for abroad" rule. Qualifying NEET at the minimum percentile is sufficient eligibility for a foreign MBBS pathway, in the same way it is sufficient for a low-rank Indian college seat.
- Your NEET result is generally treated as satisfying the eligibility requirement for foreign medical study, provided you also meet the standard 10+2 criteria (Physics, Chemistry, Biology, with the required minimum aggregate, usually 50% for general category and slightly relaxed for reserved categories). NEET results are valid for a defined window of a few years from the date of declaration, so if there is a gap between qualifying NEET and starting your course, check that your result is still within the valid window.

**Why this matters more than any fee or ranking question:** if you travel to Russia without a qualifying NEET result, you are not just taking a risk — you are closing the door on ever registering to practice in India, regardless of how well you perform in university or in later exams. No amount of academic excellence in Russia reverses a missing or failed NEET qualification. Confirm this first, in writing, before you spend money on anything else.

If you have not yet appeared for NEET, or your results are pending, pause the rest of this process until that is resolved. If you have qualified, you can move to Stage 2 with confidence.

---

## Stage 2: Choosing a University and City

Once NEET eligibility is confirmed, the next decision is which university and city fit your goals, budget, and comfort level. This is where families most often outsource their judgment entirely to an agent — which is a mistake, because the choice has consequences for six years, not six months.

### Questions to ask about any Russian university before shortlisting it

| Question | Why it matters |
|---|---|
| Is the medium of instruction genuinely English for the full course, or only the early years? | Many programs are English-medium in years 1-2 and shift toward Russian-language clinical exposure later. Ask specifically how years 3-6 are taught. |
| What is the exact program name and duration on the admission letter? | The paperwork must match a recognizable MD/MBBS-equivalent program with a clear academic and internship structure, not a vaguely described course. |
| Where does clinical training happen, and with which hospitals? | A brochure listing "hospital tie-ups" is not the same as a documented, consistent clinical rotation schedule. |
| How large is the existing Indian student community at this specific campus? | A larger, longer-established Indian cohort usually means better peer support, more available information, and fewer surprises. |
| What is the city's cost of living, climate, and connectivity like? | Moscow and St. Petersburg differ substantially from smaller regional cities on cost, weather severity, and travel convenience. |
| Can the university or agent produce real documents (not just verbal reassurance) for compliance-facing questions? | If nobody can show you paperwork beyond a brochure, treat that as a warning sign, not a technicality. |

### A practical shortlisting approach

1. Start with a list of 8-10 universities that have a genuine, multi-year track record with Indian students.
2. Narrow to 3-4 based on your budget band (tuition and living costs vary significantly between Moscow-tier and regional universities).
3. For your shortlist, request the actual admission letter template, fee structure document, and a written description of the medium of instruction and clinical-year structure — not just a sales brochure.
4. Cross-check anything a counsellor tells you against at least one independent source (an existing student, a public university page, or your own research) before paying anything.

For a closer look at specific universities and how their profiles compare on cost and structure, see our [complete MBBS in Russia guide](/blog/mbbs-in-russia-2026-complete-guide).

---

## Stage 3: The Application Process and Document Checklist

Once you have a shortlist, the application itself is usually simpler than families expect — most Russian medical universities do not conduct a separate entrance exam for international students. Admission is typically based on your Class 12 marks (Physics, Chemistry, Biology, usually with a minimum aggregate) plus your qualifying NEET status.

### Typical document checklist

| Document | Notes |
|---|---|
| Class 10 certificate and mark sheet | Should be apostilled by India's Ministry of External Affairs (MEA) before use abroad |
| Class 12 certificate and mark sheet | Apostilled; PCB aggregate should meet the minimum threshold the university states |
| NEET scorecard | Confirms qualifying status; keep both a digital and physical copy |
| NEET admit card | Some universities ask for this as supplementary proof |
| Valid passport | Check validity comfortably covers your intended travel and stay |
| Passport-size photographs | Universities often want several for different registration steps |
| Birth certificate | Sometimes required, apostilled |
| Migration/transfer certificate | From your previous school, if requested |
| HIV-negative certificate | Must typically be recent (commonly within about three months of use) |

Apostille and notarized Russian translation of your academic documents are usually needed at some point in the process — either before the university issues your admission letter or before your visa application, depending on the specific university's process. Because apostille processing through the MEA can take time, especially during peak admission months, start this step as early as possible rather than leaving it until an invitation letter is already pending.

### Roughly how the sequence runs

1. **Shortlist and submit initial application** with scanned academic documents to your chosen university (directly or through a study-abroad partner).
2. **Receive an offer or admission letter** once the university has reviewed your documents and NEET status.
3. **Pay the requested initial fee** (procedures vary by university — confirm exactly what this covers and get a receipt before sending money).
4. **University applies for your official invitation letter** from the relevant Russian authority — this is a distinct document from your admission letter, and it is the document your visa application actually depends on.
5. **Apply for your student visa** once the invitation letter is issued.

Because timelines shift year to year and university to university, always confirm current deadlines directly with the university or the Indian VFS/embassy visa information channel rather than relying on a fixed date from any single article — including this one.

---

## Stage 4: Intake Timing — What to Expect

Russian medical universities generally run two intake windows for international students: a **primary intake around September** and, at a smaller number of universities, a **secondary intake around February**. The September intake is the one most Indian students use, since it is offered far more widely and aligns better with when NEET results are typically declared.

### A general planning timeline (confirm exact dates with your chosen university each year)

| Phase | Rough window | What happens |
|---|---|---|
| Research and shortlisting | Well before your NEET exam, through results | Identify universities, understand program structure, prepare a shortlist |
| Application submission | Shortly after NEET results, through mid-year | Submit documents, receive admission/offer letter |
| Document apostille and translation | Overlapping with application | MEA apostille, notarized Russian translation |
| Invitation letter processing | After initial fee payment | Handled by the university with the relevant Russian authority; can take several weeks |
| Visa application | Once invitation letter is in hand | Submitted at the embassy/consulate or an authorized visa center |
| Travel and arrival | Shortly before classes begin | Plan to arrive with enough buffer for registration and settling in |

The exact months move slightly each year and differ by university, so treat this as a sequence to plan around rather than a fixed calendar. The earlier in the cycle you start — ideally as soon as your NEET result is out — the more room you have to fix document issues, compare universities properly, and avoid the visa-processing crunch that hits families who start late.

---

## Stage 5: The Visa Process

The Russian student visa process depends entirely on one document: the **official invitation letter**, issued through the Russian authorities at the university's request. This is different from your university admission/offer letter, and visa processing cannot begin without it.

### Typical visa steps

1. **University requests your invitation letter** after you accept your offer and complete the required initial payment step.
2. **Invitation letter is issued** — this can take some weeks, so build in buffer time rather than assuming it will arrive instantly.
3. **Complete the visa application** through the applicable Russian visa portal, then take the printed, signed application along with your documents to a visa application center.
4. **Submit required documents**, which typically include your passport, the invitation letter, passport photographs, a recent HIV-negative certificate, proof of financial capacity, and health insurance covering your stay.
5. **Biometrics and in-person submission** at the visa center, since Russian student visas generally require in-person processing rather than a fully online-only route.
6. **Visa issuance**, after which you can finalize travel plans.

A few practical notes:

- Every detail on your visa application must match your passport exactly — a minor spelling mismatch is a common, entirely avoidable cause of delay.
- Keep your HIV-negative certificate current; if it expires before you actually apply or travel, you will need a fresh one.
- Do not book non-refundable flights before your visa is actually issued.

---

## Stage 6: Arrival and Settling In

Arriving with a plan reduces the stress of your first few weeks considerably.

**Before you travel:**

- Confirm your arrival date allows enough buffer before classes start for airport pickup, hostel allotment, and registration formalities.
- Pack for the season you are arriving in, but also prepare for the fact that Russian winters are genuinely severe if your course runs through the colder months — this surprises many first-time travelers.
- Carry extra passport photographs; Russian student registration processes tend to need more of these than students expect.
- Keep both digital and physical copies of every document from Stage 3, plus your invitation letter and visa, in hand luggage — not checked baggage.

**In your first one to two weeks after arrival, you can typically expect to:**

- Be met by university representatives for airport pickup (confirm this arrangement with the university in advance).
- Receive your hostel room allocation.
- Register your visa with the relevant local migration authority — this registration is usually required within a short window after arrival (commonly about seven working days), and missing it can create real complications, so confirm the exact local requirement with your university immediately on arrival.
- Undergo a local medical check as part of enrollment formalities.
- Submit your original academic documents for final university enrollment.
- Begin orientation, including an introduction to the Russian-language support that will matter increasingly as you move into clinical years.

Treat your first month as an administrative project, not just an academic one. Students who stay organized about registration deadlines and document submission in these early weeks generally have a much smoother first semester than those who leave paperwork for later.

---

## Stage 7: Planning Your Return-to-India Licensing Path (Start This Now, Not in Year 6)

This is the stage most students ignore until it is almost too late — and it is the one that determines whether your six years abroad actually convert into the ability to practice in India.

### The regulatory framework you need to understand

If you took admission in a foreign medical institution on or after 18 November 2021, your path back to Indian practice falls under the NMC's **Foreign Medical Graduate Licentiate (FMGL) Regulations, 2021**. Students who began earlier fall under the older Screening Test Regulations framework. Either way, the practical requirements are broadly similar:

- Your course must meet a minimum academic duration (broadly around 4.5 years of theoretical and practical training under the applicable regulations).
- You must complete a **12-month clinical internship**, generally at the same foreign institution where you studied, as part of your program.
- After returning to India, you must qualify a licensing/screening exam before you can register with an Indian State Medical Council and practice.

As of 2026, that licensing exam is the **Foreign Medical Graduate Examination (FMGE)**. The NMC has indicated that the National Exit Test (NExT) will eventually apply to foreign medical graduates as well, replacing FMGE, but no confirmed implementation date for FMGs currently exists. Because this detail can change, do not plan your final year around an assumption either way — check the NMC's official updates as you approach your return year, and treat this article's description as a snapshot rather than a permanent rule.

### What you actually need to do about this while still in Russia

1. **Keep every document from day one.** Admission letter, fee receipts, semester transcripts, internship certification, and any correspondence about your program structure. Do not assume you will be able to reconstruct these later — some students have struggled years afterward to get paperwork re-issued.
2. **Start FMGE/NExT-oriented preparation early**, not in your final semester. Many Indian students studying in Russia use structured online prep platforms alongside their regular coursework from around the third year onward, so that clinical-year study and exam preparation reinforce each other instead of competing for time in a rushed final year.
3. **Apply for your NMC eligibility documentation promptly** once you have your admission letter — do not leave this until your final year. NMC's own guidance is that these registration and eligibility steps should be handled as they come up, not deferred.
4. **Understand that a higher NEET score does not guarantee an easier FMGE/NExT outcome.** It generally gives you a stronger foundation in Biology, Chemistry, and Physics that helps in the early pre-clinical years, but what determines your exam outcome later is how consistently you study across all six years — not your NEET percentile.
5. **Track NMC circulars directly** (nmc.org.in) in your final one to two years. Licensing frameworks for foreign medical graduates have evolved before and may evolve again, and official NMC communication is the only reliable source for the exact rules that will apply when you actually return.

---

## A Quick Word on What Can Go Wrong

Most avoidable problems in this entire process come from three habits:

- **Skipping Stage 1** — starting university conversations before confirming NEET eligibility is settled.
- **Treating the university and city choice as a formality** — accepting whichever option an agent pushes hardest, without asking the questions in the Stage 2 table.
- **Deferring return-planning to the final year** — treating FMGE/NExT preparation and documentation as a "later problem" instead of something to build into your six years from the start.

None of these mistakes are exotic. They are common, well-understood, and entirely preventable if you follow the sequence above and insist on documentation over verbal assurance at every step.

---

## Where Students Traffic Fits In

Everything above is a process you can, in principle, manage yourself with enough time and diligence. Most families find it easier with a partner who has already been through this cycle with other students — someone who can help you verify a specific university's compliance paperwork, compare realistic budget bands for the cities on your shortlist, and keep your application and visa timeline on track instead of discovering a missing document two weeks before an intake closes.

If you are at the stage of narrowing your university shortlist or want your eligibility and documents checked before you commit any money, our counsellors can walk through your NEET status, budget, and target cities with you and help you build an application plan that avoids the common mistakes above. And if you would rather hear from students already on the ground in Russia before deciding, you can also connect with them directly through [Students Traffic's peer connect](/students).

---

## Frequently Asked Questions

**Q: Do I need NEET to study MBBS in Russia?**

Yes, if you want the degree to eventually be usable for medical practice in India. NEET-UG qualification (50th percentile for General category, 40th percentile for SC/ST/OBC) has been mandatory since 2018 for any Indian citizen or OCI pursuing medical study abroad. Some universities may admit students without checking NEET status, but that does not change the Indian regulatory requirement — it only means the student is taking on the risk themselves.

**Q: What is the difference between an admission letter and an invitation letter?**

The admission letter (or offer letter) is issued by the university confirming your seat. The invitation letter is a separate document issued through the relevant Russian authority at the university's request, and it is specifically what your student visa application depends on. Many delays happen because families confuse the two or assume the admission letter alone is sufficient for visa purposes.

**Q: When should I start the application process for MBBS in Russia?**

As early as possible after your NEET result is declared, since the primary intake for most universities is in September. Starting early gives you time to properly compare universities, complete document apostille and translation, and avoid the compressed timelines that hit families who begin the process only a few weeks before an application deadline.

**Q: Is the February intake a good option if I miss the September one?**

It can work, but fewer Russian universities offer a February intake compared to September, so your choice of universities will be narrower. If you have missed the September cycle, it is worth checking directly with a shortlist of universities whether a February option exists for your target program before assuming you must wait a full year.

**Q: Do I need to know Russian before I go?**

Not necessarily to start. Most programs teach the early, pre-clinical years in English. However, clinical years increasingly involve real patient interaction in Russian-speaking hospital settings, so most programs build in structured Russian-language coursework over the years. Ask any university you shortlist exactly how they handle the transition into clinical-year language requirements — a vague answer here is a warning sign.

**Q: What happens if I don't complete an internship at the same university?**

Under current NMC regulations, the required 12-month clinical internship generally needs to be completed at the same foreign institution where you studied, as part of your program. If your internship structure is unclear or handled outside the main university, clarify this in writing before you rely on it for your return-to-India plans.

**Q: Is FMGE still the exam I need to clear after returning to India, or has it been replaced by NExT?**

As of 2026, FMGE remains the applicable licensing/screening exam for foreign medical graduates. NMC has indicated NExT will eventually extend to foreign medical graduates as well, but no confirmed date for that transition exists yet. Check NMC's official updates as you approach your final year, since this is one of the more time-sensitive parts of the entire process.

**Q: Can I improve my chances of clearing FMGE/NExT while still studying in Russia?**

Yes. Many successful students begin structured, India-focused exam preparation from around their third year onward, running it alongside their regular coursework rather than cramming in the final semester. A strong NEET score can help with early subject foundations, but consistent preparation across all six years matters far more for the final licensing outcome.

Related reading: [MBBS in Russia 2026: Complete Guide](/blog/mbbs-in-russia-2026-complete-guide) | [Is MBBS in Russia Valid in India? NMC, NEET & NExT](/blog/is-mbbs-in-russia-valid-in-india-nmc-next-neet) | [MBBS in Russia Fees 2026](/blog/mbbs-in-russia-fees-2026-total-cost-guide)`,
};

async function run() {
  console.log("=== Blog Seeder: how-to-study-mbbs-in-russia ===\n");

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
        post.coverUrl ?? null,
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
