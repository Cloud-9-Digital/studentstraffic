/**
 * Seed: "How to Study MBBS in Uzbekistan" — step-by-step process guide
 * Distinct angle from mbbs-in-uzbekistan-2026-complete-guide (which covers the
 * overview/comparison/fees ground). This post is process-first: eligibility,
 * choosing a university, application steps, documents, timeline, visa, arrival,
 * and the FMGE/NExT path back in India.
 *
 * Run: node scripts/seed-how-to-study-mbbs-uzbekistan.mjs
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
  envContent
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, "")];
    })
);

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

async function uploadImage(localPath, publicId) {
  try {
    const existing = await cloudinary.api.resource(publicId);
    console.log(`  [skip, already uploaded] ${publicId}`);
    return existing.secure_url;
  } catch {
    // not found, continue to upload
  }
  try {
    const r = await cloudinary.uploader.upload(localPath, {
      public_id: publicId,
      overwrite: false,
    });
    console.log(`  [ok] ${r.secure_url}`);
    return r.secure_url;
  } catch (err) {
    console.warn(`  [cloudinary upload failed, continuing without cover] ${err.message}`);
    return null;
  }
}

const post = {
  slug: "how-to-study-mbbs-in-uzbekistan",
  category: "MBBS Abroad",
  coverLocalPath: join(root, "public", "images", "countries", "uzbekistan.jpg"),
  coverPublicId: "studentstraffic/blog/how-to-study-mbbs-in-uzbekistan",
  title: "How to Study MBBS in Uzbekistan: A Step-by-Step Guide for Indian Students (2026)",
  excerpt:
    "A practical, step-by-step walkthrough of how to study MBBS in Uzbekistan — from NEET eligibility and choosing a university to application documents, the visa process, arrival, and the FMGE/NExT path back home.",
  metaTitle: "How to Study MBBS in Uzbekistan: Step-by-Step Process Guide (2026)",
  metaDescription:
    "Learn exactly how to study MBBS in Uzbekistan as an Indian student: eligibility, university selection, application steps, documents, visa process, arrival, and licensing back in India.",
  content: `## Who This Guide Is For

If you have already decided Uzbekistan is worth considering and now want to know the *actual mechanics* of getting there — what you need before you apply, what the application looks like, which documents to gather, how the visa works, and what happens after you land — this guide walks through it in order.

This is a process guide, not a comparison of universities or a fee breakdown. If you are still deciding whether Uzbekistan is the right country, or you want a side-by-side look at universities, city life, and costs, read our [complete MBBS in Uzbekistan guide](/blog/mbbs-in-uzbekistan-2026-complete-guide) first and come back here once you are ready to act.

---

## Step 1: Confirm You Actually Meet the Eligibility Requirements

Before you look at a single university website, make sure you clear the baseline requirements that apply to *any* MBBS-abroad plan, not just Uzbekistan. Skipping this step is the single most common way students waste a year.

### NEET is non-negotiable

Under the NMC's Foreign Medical Graduate Licentiate (FMGL) Regulations, 2021, every Indian student who wants their foreign MBBS degree recognized in India must have qualified NEET. There is no separate "abroad" exam and no way around this — a foreign MBBS degree without a valid NEET qualification simply will not be accepted for licensing in India, regardless of how good the university is.

The qualifying bar is a percentile, not a fixed score:

- **General/EWS category:** 50th percentile
- **SC/ST/OBC category:** 40th percentile

Your NEET score is valid for admission purposes for **three years** from the year you qualified. If you cleared NEET in 2024, you can still use that scorecard for a 2026 intake.

### Academic eligibility

- Minimum 50% aggregate in Physics, Chemistry, and Biology (PCB) in Class 12 (40% for SC/ST/OBC)
- Minimum age of 17 years by December 31 of the admission year
- English as a subject (or medium of instruction) in your prior schooling is generally expected, though requirements vary slightly by university

### Course structure requirements you should know now (even though they apply later)

The NMC requires any foreign MBBS program to run a minimum of **54 months (4.5 years)** of academic instruction plus a **12-month internship** completed at the same institution, entirely in English. Uzbekistan's 6-year MD structure — with Year 6 functioning as the clinical internship year — is designed to satisfy this. But it is your responsibility to confirm the specific university you choose actually delivers the program this way, with English as the genuine medium of instruction, not just the language listed in the prospectus.

**Practical takeaway:** if you have qualified NEET at or above your category's percentile, and your 12th-grade PCB aggregate clears the bar, you are eligible to start the university selection process.

---

## Step 2: Choose a University — What to Actually Check

This guide will not rank universities for you (see the [complete guide](/blog/mbbs-in-uzbekistan-2026-complete-guide) for that). But before you shortlist anywhere, verify these four things directly, not through an agent's word:

1. **NMC and official regulatory sources status.** Check the university's exact name against the NMC's current approved list at nmc.org.in and against the World Directory of Medical Schools (official directory sources). Recognition is granted to a specific institution, not to "Uzbekistan" as a country — a nearby or similarly named institute may not carry the same status.
2. **Genuine English-medium delivery**, especially in the clinical years (Years 4–6) when instruction shifts from lecture halls to hospital wards. Ask specifically how clinical postings are conducted for international students and whether translators or bilingual faculty are assigned.
3. **Teaching hospital access.** Confirm which hospitals the university is affiliated with, how many beds they have, and whether international students get real patient contact or mostly observation.
4. **Realistic FMGE/NExT outcomes.** Ask the university (or better, ask actual alumni) for their graduates' licensing exam pass rates. Treat marketing claims of "90%+ pass rate" with skepticism unless backed by verifiable numbers.

If you already have 2–3 universities in mind, our [counselling team](/contact) can help you cross-check current NMC status and compare shortlists before you commit to an application.

---

## Step 3: Prepare Your Application Documents

Once you've picked a university (or a shortlist of 2–3 to apply to in parallel), gather documents early. Universities in Uzbekistan generally move fast once a complete file is submitted — the delays almost always come from students, not the institution.

### Document checklist

| Document | Notes |
|---|---|
| Passport | Valid for at least 2 years from your intended date of travel |
| NEET scorecard | Downloaded from the NTA portal; must show qualifying percentile |
| NEET admit card | Some universities request this alongside the scorecard |
| Class 10 marksheet and certificate | Original + scanned copy |
| Class 12 marksheet and certificate | Must show PCB aggregate clearly |
| Passport-size photographs | Typically 8–10, white background, per university specification |
| Medical fitness certificate | Includes HIV and general fitness screening; some universities also ask for Hepatitis B/C |
| Filled university application form | Provided directly by the university or its authorized regional office |
| Migration/transfer certificate (if applicable) | Only if you are transferring from another program |

### A caution on document handling

Do not route your original academic documents through unverified agents. Submit scanned copies for the initial application and provide originals only when the university or embassy explicitly requires them, through a traceable process. If an agent asks to "hold" your passport or originals for an extended period before travel, that is a red flag.

---

## Step 4: Understand the Realistic Admission Timeline

Uzbekistan's main intake for international students is centered on the **September** academic year start, though exact dates shift slightly year to year and by university. Treat the following as a planning framework, not a fixed calendar — always confirm current-cycle dates directly with your shortlisted university.

| Phase | Approximate Window | What Happens |
|---|---|---|
| Research & shortlisting | January – March | Compare universities, verify NMC and official regulatory sources status, talk to current students if possible |
| Document preparation | March – May | Gather NEET scorecard, academic records, passport, photographs, medical certificate |
| Application submission | April – July | Submit application form and documents to the university; most universities review within days to a couple of weeks |
| Admission/invitation letter | Within days to a few weeks of a complete application | University issues an official offer/admission letter |
| Fee payment (as instructed) | After admission letter | Universities typically require initial fee payment before starting the formal visa invitation process |
| Visa Invitation Letter (VIL) | 10–15 working days after payment confirmation | University applies to Uzbekistan's migration/immigration authority on your behalf |
| Embassy visa application | Once VIL is issued | Submit passport and documents at the Embassy of Uzbekistan in New Delhi (or the relevant consulate) |
| Visa issuance | Roughly 2–4 weeks, can vary | Visa stamped on passport |
| Travel & arrival | August – September | Fly to Uzbekistan ahead of orientation/semester start |

Because the visa steps depend on the university's internal processing speed, the realistic total time from "application submitted" to "visa in hand" is often **2–3 months**. Starting your paperwork in January or February for a September intake gives you comfortable margin; starting in July does not.

---

## Step 5: The Visa Process, in Plain Terms

1. **You apply, the university admits you.** Once your file is complete and reviewed, the university issues an admission/offer letter.
2. **You pay the required first-installment fees**, as instructed by the university. This step typically has to happen before the university will start the formal invitation process — confirm exact amounts and payment channels directly with the university's finance office, not through a third party.
3. **The university requests a Visa Invitation Letter (VIL)** from Uzbekistan's immigration/migration authority. This is the document the embassy needs to see before it will issue you a student visa, and it is the university's responsibility to obtain it, not yours.
4. **You apply for the visa** at the Embassy of Uzbekistan in New Delhi (or the applicable consulate), submitting your passport, the VIL, academic documents, and the medical certificate.
5. **Visa is issued**, generally stamped directly into your passport.

Processing times quoted by different sources vary — some report the embassy stage alone taking roughly 2–4 weeks, others quote longer end-to-end windows. Build in buffer time and avoid booking non-refundable flights until the visa is actually in hand.

---

## Step 6: Arrival and Settling In

### Airport pickup and orientation

Most universities organize airport pickup for new international students arriving ahead of orientation. Confirm your exact arrival flight and timing with the university's international student office in advance so pickup is arranged correctly.

### OVIR / migration registration — do this within days, not weeks

Uzbekistan's immigration rules require foreign nationals to register their presence with local migration authorities shortly after arrival (commonly cited as within a few days). If you live in a university dormitory, this registration is typically handled automatically as part of your hostel check-in — one of the practical advantages of choosing dormitory housing in your first year. If you arrange private accommodation instead, you are personally responsible for completing this registration, and missing it can result in fines or complications later. Confirm with your university's international office exactly how registration is handled for your specific housing situation — do not assume.

### First few weeks

- Get a local SIM card (usually straightforward with a passport)
- Set up a basic bank/payment method for local expenses
- Attend every orientation session — this is where you'll learn the specific clinical rotation structure, exam calendar, and who your assigned faculty coordinator is
- Start (or continue) basic conversational Uzbek/Russian early. You won't need fluency, but even simple phrases materially improve your clinical years, when many patients will not speak English.

---

## Step 7: Structure Your Six Years With Licensing in Mind From Day One

This is the step students most often treat as an afterthought — and the one that determines whether the degree is actually usable in India.

### Don't wait until Year 5 to think about FMGE/NExT

The National Exit Test (NExT) is being implemented as the unified licensing exam that Indian and foreign medical graduates will both take to obtain an Indian medical license, progressively replacing the standalone FMGE screening test. Regulations and transition timelines have shifted more than once, so treat the exact FMGE-to-NExT cutover date as something to verify closer to your graduation year rather than something to assume today.

What does not change regardless of which exam is current when you graduate:

- You need a valid NEET qualification and, before you go abroad, you should apply for the **NMC Eligibility Certificate** (apply as soon as you have your university admission letter — do not defer this)
- Your foreign degree must reflect the full 54-month academic period plus a genuine 12-month internship at your parent institution
- You will need to independently prepare for the licensing exam; university coursework abroad is not designed around FMGE/NExT question patterns

### A realistic year-by-year approach

- **Years 1–2:** Build a genuinely strong foundation in Anatomy, Physiology, and Biochemistry. These fundamentals disproportionately show up in licensing exam questions later.
- **Years 3–4:** As pathology, pharmacology, and clinical subjects begin, start layering in structured FMGE/NExT-oriented question practice alongside your university curriculum — don't wait for finals to begin this.
- **Years 5–6:** Prioritize hands-on clinical exposure and OSCE-style clinical assessment practice, since the practical component of Indian licensing exams increasingly mirrors this format. Take mock licensing tests seriously in Year 6 rather than treating them as optional.
- **After graduation:** Return to India, apply for FMGE/NExT as per the exam framework in force that year, complete the mandatory Compulsory Rotating Medical Internship (CRMI) in India if required under current NMC rules, and only then register with your State Medical Council.

---

## Common Mistakes That Delay or Derail the Process

- **Applying without confirming NMC and official regulatory sources status of the exact institution name.** A similar-sounding university name is not the same as the one on the approved list.
- **Treating an agent's fee quote as final** without independently confirming amounts and payment channels with the university.
- **Booking flights before the visa is issued.**
- **Assuming dormitory housing is automatic** — confirm this at the admission stage if you want it, since availability can be limited.
- **Ignoring the NMC Eligibility Certificate** until close to graduation. Apply for it right after you receive your admission letter, not years later.
- **Deferring FMGE/NExT preparation to the final year.** By the time most students start, they've lost 3–4 years of easy foundational review.

---

## Frequently Asked Questions

**Do I need NEET to study MBBS in Uzbekistan?**

Yes. NEET qualification at or above your category's percentile (50th for General/EWS, 40th for SC/ST/OBC) is mandatory if you want your Uzbekistan MBBS degree to be valid for practicing medicine in India. Some universities may technically admit students without it, but the NMC will not register a degree earned without a valid NEET qualification.

**How long does the whole process take, from application to arrival?**

For a September intake, realistically 4–6 months if you start preparing documents by February or March. The visa stage alone (VIL issuance plus embassy processing) can take 4–8 weeks after your admission and fee payment are confirmed, so starting early gives you a real safety margin.

**What documents do I need to start my application?**

At minimum: passport, NEET scorecard and admit card, Class 10 and 12 marksheets, passport-size photographs, and a medical fitness certificate. The university will specify any additional requirements once you begin the formal application.

**Is a visa guaranteed once I have an admission letter?**

No admission or visa process is ever "guaranteed," but a complete, accurate application with a legitimate NMC-recognized university and correctly documented Visa Invitation Letter has a strong track record of approval. Delays typically stem from incomplete documentation, not from the university or embassy being unusually restrictive.

**Do I need to know Russian or Uzbek before I go?**

No. Instruction for international students is delivered in English. That said, most patients in clinical settings speak Uzbek or Russian, so basic conversational ability — built up gradually through your first few years — meaningfully improves your clinical training experience.

**What happens if I don't register with migration authorities after arrival?**

You risk fines and administrative complications. If you live in a university dormitory, registration is usually handled as part of check-in. If you arrange private housing, you are personally responsible for completing it — confirm the exact process with your university's international office as soon as you arrive.

**Will I need to write FMGE or NExT after finishing MBBS in Uzbekistan?**

Yes. Regardless of which licensing exam is in force in your graduation year — FMGE or its planned successor, NExT — every Indian student who studies MBBS abroad must clear a licensing exam and, where applicable, complete a supervised internship in India before registering with a State Medical Council. Build exam preparation into your study routine from Year 1 rather than treating it as a post-graduation project.

---

## Where to Go From Here

The process above is manageable, but it rewards students who start early and verify every step directly rather than relying entirely on an agent's word. If you want a side-by-side comparison of Uzbekistan's universities, cities, and costs before you commit to an application, read our [complete MBBS in Uzbekistan guide](/blog/mbbs-in-uzbekistan-2026-complete-guide).

If you are ready to move from research to action — shortlisting a specific NMC-recognized university, getting your documents in order, or understanding what a realistic timeline looks like for your target intake — [Students Traffic's counselling team](/contact) can walk through your specific NEET score, category, and target intake with you and help you avoid the document and timeline mistakes that delay most applications.`,
};

async function run() {
  console.log("=== Seeding: how-to-study-mbbs-in-uzbekistan ===\n");

  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const client = await pool.connect();

  try {
    console.log(`Post: ${post.slug}`);
    const coverUrl = await uploadImage(post.coverLocalPath, post.coverPublicId);

    const stats = readingTime(post.content);
    const readingMinutes = Math.ceil(stats.minutes);
    const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length;
    console.log(`  Word count: ${wordCount}`);
    console.log(`  Reading time: ${readingMinutes} min`);

    const r = await client.query(
      `INSERT INTO blog_posts (slug, title, excerpt, content, cover_url, category, meta_title, meta_description, status, reading_time_minutes, published_at, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'published',$9,$10,$10,$10)
       ON CONFLICT (slug) DO UPDATE SET
         title=EXCLUDED.title, excerpt=EXCLUDED.excerpt, content=EXCLUDED.content,
         cover_url=EXCLUDED.cover_url, category=EXCLUDED.category,
         meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description,
         status='published', reading_time_minutes=EXCLUDED.reading_time_minutes,
         published_at=COALESCE(blog_posts.published_at, EXCLUDED.published_at),
         updated_at=EXCLUDED.updated_at
       RETURNING id, slug, published_at`,
      [
        post.slug,
        post.title,
        post.excerpt,
        post.content,
        coverUrl ?? null,
        post.category,
        post.metaTitle,
        post.metaDescription,
        readingMinutes,
        new Date(),
      ]
    );
    console.log(`  Upserted [id=${r.rows[0].id}]: ${r.rows[0].slug} (published_at=${r.rows[0].published_at})`);
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
