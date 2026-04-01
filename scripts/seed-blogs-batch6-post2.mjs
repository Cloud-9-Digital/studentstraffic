/**
 * Seed Batch 6 — Post 2: MBBS Abroad Return to India Process
 * Run: node scripts/seed-blogs-batch6-post2.mjs
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

const LOCAL_IMAGE = "/Users/bharat/.gemini/antigravity/brain/b236d4cf-2de8-4a26-a722-9c74a626dfa4/mbbs_return_india_next_hero_1775056089144.png";
const CLOUDINARY_ID = "studentstraffic/blog/mbbs-abroad-return-india-next-registration";

async function uploadImage(localPath, publicId) {
  try { const e = await cloudinary.api.resource(publicId); console.log(`  [skip] ${publicId}`); return e.secure_url; } catch {}
  const r = await cloudinary.uploader.upload(localPath, { public_id: publicId, overwrite: false });
  console.log(`  [ok] ${r.secure_url}`); return r.secure_url;
}

const post = {
  slug: "mbbs-abroad-return-india-process-next-registration",
  category: "Career Guidance",
  title: "MBBS Abroad Return to India: The Complete Step-by-Step Process (NExT, Registration, Career)",
  excerpt: "After 6 years of MBBS abroad, students face a process most agents never explain: NExT Part 1, provisional registration, internship, NExT Part 2, State Medical Council registration, and PG admission. This is the complete, step-by-step guide to your return journey — from graduation day to your first day of independent practice.",
  metaTitle: "MBBS Abroad Return to India 2026: NExT, Registration & Career After Foreign MBBS",
  metaDescription: "Complete guide to the MBBS abroad return process for Indian students. NExT Part 1 & 2, provisional registration, State Medical Council, PG admission — exact steps and timelines.",
  content: `## The Journey Most Agents Don't Talk About

When you sit through an MBBS abroad consultation, you hear about the admission process, the fees, the hostel, the city. What you almost never hear is a clear, honest explanation of what happens when you return to India after 6 years — and yet this return journey is where many foreign medical graduates discover, too late, that they were underprepared.

This guide covers the entire post-graduation process in precise sequence: the NExT examination, provisional registration, internship recognition, permanent registration, and how PG admission works for foreign graduates. Every step is grounded in the current NMC FMGL Regulations 2021.

---

## Overview: The Complete Return Process

Here is the sequence every Indian student who graduates from a foreign medical institution must complete before they can practice medicine independently in India:

| Stage | What Happens | Approximate Duration |
|---|---|---|
| 1. Foreign graduation | Complete all years + internship abroad | 6 years |
| 2. Degree attestation | Get degree apostilled/attested | 4–8 weeks |
| 3. NExT Part 1 application | Apply on NMC portal; appear for theory exam | Exam held twice a year |
| 4. NExT Part 1 result | Pass all subjects to proceed | 6–8 weeks after exam |
| 5. Provisional registration | Apply to State Medical Council after Part 1 | 2–4 weeks |
| 6. Internship (if required) | Complete NMC-mandated internship in India | 12 months |
| 7. NExT Part 2 application | Apply for OSCE/clinical skills exam | After internship |
| 8. NExT Part 2 result | Pass to achieve permanent registration eligibility | 4–6 weeks after exam |
| 9. Permanent registration | Apply to State Medical Council | 2–4 weeks |
| 10. Independent practice | Can prescribe, practice, open clinic | Ongoing |
| Optional: PG admission | Use NExT Part 1 score for MD/MS/DNB seat | Annual counselling |

This is not a process you start thinking about in Year 6. The students who navigate it most efficiently start preparing for NExT from Year 2 of their foreign MBBS.

---

## Stage 1: Completing Your Foreign Degree and Internship

Under NMC FMGL Regulations 2021, you must complete both the academic program **and** a mandatory clinical internship at the foreign institution (or an affiliated hospital in that country) before returning to sit for NExT.

**This is a change from older MCI rules** — previously, some students completed their foreign MBBS coursework and then returned to India for their internship (called "compulsory rotating internship" or CRIP). The 2021 regulations eliminated this option for most categories. The internship must now be done in the country of study.

### What Counts as a Valid Foreign Internship?
- Must be at a hospital affiliated with or approved by the foreign university
- Must be of the duration specified in the country's medical education framework (typically 12 months)
- The university must issue a formal Internship Completion Certificate that can be verified by NMC

**Before graduating, collect:**
1. Final mark sheets for all years (original, attested)
2. MBBS/MD equivalency degree certificate (original)
3. Internship Completion Certificate (original, on official letterhead)
4. Migration/Transfer Certificate from the university
5. Medium of instruction certificate (some State Medical Councils ask for this)
6. University NMC/WHO recognition letter (print from current year NMC list)

---

## Stage 2: Degree Attestation and Apostille

Your foreign degree must be officially authenticated before Indian authorities will accept it. The process depends on whether your host country is a signatory to the Hague Convention (which covers the Apostille process):

| Country | Authentication Method |
|---|---|
| Russia | Apostille via Russian Ministry of Foreign Affairs + Indian Embassy attestation |
| Kazakhstan | Apostille + Indian Embassy, Almaty attestation |
| Georgia | Apostille (Georgia is a Hague Convention member) |
| Kyrgyzstan | Apostille + Indian Embassy, Bishkek attestation |
| Uzbekistan | Apostille + Indian Embassy, Tashkent attestation |
| Bangladesh | Notarization + Bangladesh High Commission in India attestation |

**After returning to India:** Your apostilled documents must then be attested by the Ministry of External Affairs (MEA) in New Delhi or via an authorized centre. The MEA attestation is the final authentication step recognized by Indian State Medical Councils.

**Timeline:** Allow 4–8 weeks for the full attestation chain. Get started on this while you are still completing your final year or internship — do not wait until you have landed back in India.

---

## Stage 3: NExT Part 1 — The Theory Examination

NExT (National Exit Test) Part 1 is a theory-based, computer-adaptive examination. It replaces the old FMGE (Foreign Medical Graduate Examination) and simultaneously serves as the theory component for domestic MBBS graduates entering PG admission.

### Who Appears for NExT Part 1?
- Indian MBBS graduates from foreign institutions (foreign medical graduates / FMGs)
- Indian MBBS graduates from domestic NMC-recognized colleges (for PG admission ranking)

For foreign graduates, NExT Part 1 is also the **licensing exam** — clearing it is required for provisional registration and the right to practice.

### Exam Structure

| Component | Details |
|---|---|
| Format | Computer-based multiple choice questions |
| Duration | Two sessions across two days |
| Subjects | 19 pre-clinical, para-clinical, and clinical subjects |
| Total marks | 800 marks (2 marks per correct answer; −0.5 for wrong) |
| Passing criteria | Must pass each subject individually; a combined overall pass is insufficient |
| Exam frequency | Twice a year (tentatively January and June/July) |

### Subject-Wise Coverage
NExT Part 1 covers: Anatomy, Physiology, Biochemistry, Pathology, Microbiology, Pharmacology, Forensic Medicine, Community Medicine, General Medicine, General Surgery, Obstetrics & Gynaecology, Paediatrics, Psychiatry, Dermatology, Orthopaedics, ENT, Ophthalmology, Radiology, Anaesthesia.

**The critical difference from FMGE:** NExT is subject-wise qualifying — if you score below the subject pass threshold in Pharmacology but pass all others, you must re-appear for Pharmacology in the next attempt. You do not have to redo the entire exam. This is both more forgiving and more demanding than the old pass/fail FMGE structure.

### Applying for NExT Part 1

1. Log in to the NMC NExT portal (next.nmc.org.in — verify current URL on nmc.org.in at time of application)
2. Create your profile and submit eligibility documentation:
   - Original degree/provisional certificate from the foreign university
   - Internship Completion Certificate
   - NMC Eligibility Certificate (the EC you applied for before departing)
   - Degree attestation/apostille documents
   - NEET scorecard (the one used at the time of admission abroad)
   - Passport
   - Aadhaar
3. Pay the examination fee (fees are set by NMC; verify current amount at time of application — earlier FMGE was ₹5,500; NExT fees are in a similar range per attempt)
4. Select exam city and date slot
5. Download admit card

**When to apply:** NExT Part 1 application typically opens 8–10 weeks before the exam date. Return from abroad with your documents ready so you can apply in the first available window.

---

## Stage 4: Preparation Strategy for NExT Part 1

This is where the 6-year investment in your foreign MBBS either pays dividends or creates a crisis.

### The Reality of NExT Pass Rates
Under the old FMGE system, the national pass rate for foreign medical graduates was 15–22%. NExT is expected to show a similar bifurcation: students who prepared systematically throughout their foreign program will pass; those who relied on the hope of clearing an exam they hadn't prepared for consistently will not.

### Preparation Framework

**Years 1–2 (Pre-clinical):** Master the Indian textbook versions of Anatomy (BD Chaurasia), Physiology (Guyton base + AK Jain for India), Biochemistry (Vasudevan). These subjects are tested heavily in NExT and form the foundation.

**Years 3–4 (Para-clinical):** Pathology (Robbins + Harsh Mohan for India-specific), Microbiology (Ananthanarayan for MCQ patterns), Pharmacology (KD Tripathi). Subscribe to an Indian test series (Marrow or PrepLadder) by Year 3 — these platforms are designed specifically for the NExT/FMGE pattern.

**Years 5–6 (Clinical):** OBG, Paediatrics, Surgery, Medicine, PSM — these are the high-weightage clinical subjects. Attend all clinical postings seriously — NExT Part 2 will test your clinical skills.

**Year 6/Post-graduation:** Dedicated crash course, 3–4 months of intensive revision, full-length NExT mock tests. Online coaching platforms and physical crash courses available in India.

---

## Stage 5: Provisional Registration After NExT Part 1

On clearing NExT Part 1 (all subjects passed), you become eligible for **Provisional Registration** with the State Medical Council in your home state.

### Documents for Provisional Registration Application

| Document | Authority |
|---|---|
| NExT Part 1 pass certificate / marksheet | NMC |
| MBBS degree (original, attested) | Foreign university + MEA |
| Internship Completion Certificate (attested) | Foreign university + MEA |
| NMC Eligibility Certificate | NMC |
| NEET scorecard | NTA |
| Passport (copy) | — |
| Aadhaar | — |
| Domicile/residence proof | State authorities |
| Registration fee | State Medical Council |

Registration fees vary by state (typically ₹1,000–₹5,000). Processing time is typically 2–4 weeks once complete documents are submitted.

**Provisional registration allows you to:**
- Work as a medical officer or junior resident under supervision
- Practice in clinical settings under the oversight of a senior registered doctor
- Participate in government health programs that accept provisionally registered doctors
- Earn a salary (Junior Resident government stipend: ₹40,000–₹95,000/month depending on state and hospital)

**Provisional registration does not allow:**
- Independent private practice
- Prescribing as the treating physician without supervising doctor
- Opening your own clinic

---

## Stage 6: Internship in India (Post-NExT Part 1)

Under NMC FMGL 2021, there is provision for a **post-NExT Part 1 internship in India** for certain students. This applies in cases where:

- The foreign internship was not completed or not recognized by NMC
- The student's foreign program was structured differently (e.g., Bangladesh pathway where students need India-specific clinical exposure)

**For most students from Russia, Kazakhstan, Georgia, Kyrgyzstan, Uzbekistan:** If the foreign university internship was of standard 12-month duration at a recognized affiliated hospital and documentation is in order, this India-based internship is generally not required. NMC verifies the foreign internship on a case-by-case basis during the Provisional Registration documentation review.

**If an India-based internship is mandated:** It is conducted at an NMC-recognized medical college hospital in India, duration 12 months, with a monthly stipend (varies by institution, typically ₹20,000–₹50,000/month). This is a supervised clinical rotation covering all major specialties.

---

## Stage 7: NExT Part 2 — The OSCE Clinical Skills Examination

NExT Part 2 is an OSCE (Objective Structured Clinical Examination) — a practical, station-based clinical skills assessment. It evaluates your ability to take a history, examine a patient, interpret investigations, and manage clinical scenarios in a structured setting.

### Format

| Component | Details |
|---|---|
| Format | Multi-station OSCE (each station 5–8 minutes) |
| Assessment areas | History taking, physical examination, clinical case management, procedural skills |
| Venue | Conducted at designated NMC centres across India |
| Frequency | Aligned with NExT Part 1 cycle (twice yearly) |
| Passing criteria | Subject-wise pass threshold (same principle as Part 1) |

NExT Part 2 is designed to be passed by a graduate who has completed a genuine clinical internship. Students who attended postings seriously in Year 3–6 abroad and completed a full internship will find Part 2 manageable with targeted OSCE preparation (structured cases, clinical approach revision, procedural checklist practice).

---

## Stage 8: Permanent Registration

On clearing NExT Part 2, you become eligible for **Permanent Registration** with the State Medical Council. This grants full rights to:

- Practice medicine independently
- Prescribe medications as the treating physician
- Open and run a private clinic, hospital, or polyclinic
- Apply for government medical officer posts
- Practice under all Indian medical practice regulations (IMC Act / NMC Act)

The permanent registration process mirrors provisional registration — same State Medical Council, updated documents (including NExT Part 2 certificate), and a revised fee.

Once permanently registered, your name appears in the State Medical Council register and the NMC national register, verifiable by any hospital or patient.

---

## Stage 9: PG Admission — How NExT Changes the Playing Field

Under the new NExT framework, your **NExT Part 1 score becomes your PG admission ranking score** — replacing the old NEET-PG for PG seat allocation.

### Implications for Foreign Graduates

1. **Same exam, same competition:** For the first time, domestic and foreign graduates compete on numerically identical scores for PG seats. A foreign graduate who scores 560/800 in NExT Part 1 competes equally with an Aiims graduate who scored 560.

2. **Score bank:** Your NExT Part 1 score is valid for PG counselling for multiple cycles (NMC to specify exact validity window — expected 3 years). You can appear in multiple PG counselling rounds with the same NExT score.

3. **Seat competition reality:** Government MD/MS seats at premier institutions (AIIMS, PGI, CMC) are exceptionally competitive. Regional government medical college PG seats are more accessible. DNB seats through National Board of Examinations are a viable alternative with a wider national distribution.

### High-Demand Specialties and Expected Competition

| Specialty | Competition Level | Notes |
|---|---|---|
| Dermatology | Extreme | Among the most competed PG seats nationally |
| Radiology | Very High | High earning potential drives competition |
| Anaesthesia | Moderate-High | Many seats available; good earnings |
| General Medicine | High | Gateway to subspecialty DM programs |
| General Surgery | High | Multiple seats; strong career base |
| Paediatrics | Moderate | High seats, moderate competition |
| Community Medicine (PSM) | Low | Many seats, lower competition — often overlooked |
| Psychiatry | Moderate | Growing demand, moderate competition |

Foreign graduates who clear NExT with a strong score and choose lower-competition specialties or regional institutions for PG have historically had good outcomes.

---

## Stage 10: Career After MBBS Abroad — First 5 Years

After permanent registration, here is the realistic career trajectory:

### Year 1 Post-Registration: Junior Resident or Medical Officer
- **Government hospital junior resident:** ₹50,000–₹95,000/month stipend (varies by state and hospital type)
- **Private hospital Junior Resident (PG preparation):** ₹20,000–₹50,000/month
- **Government Medical Officer (district hospital / CHC / PHC):** ₹55,000–₹85,000/month basic (7th Pay Commission scale, varies by state)

### Year 2–4: PG Training (MD/MS/DNB)
- Stipend during PG: ₹60,000–₹1,20,000/month (major government hospitals)
- DNB centers: ₹50,000–₹80,000/month
- Full independence after completing PG + super-registration

### Year 5+: Specialist Practice
- **Government specialist:** ₹1.2L–₹2.0L/month (7th Pay Commission + NPA)
- **Private hospital consultant:** ₹1.5L–₹5.0L/month depending on specialty and city
- **Private clinic (MBBS general practice):** Urban ₹60K–₹1.5L/month; rural ₹40K–₹80K/month
- **Specialist consultant (post-MD/MS):** ₹2L–₹8L+/month for high-demand specialties in metro cities

---

## Common Mistakes That Delay This Entire Process

1. **Not getting the NMC EC before departure** — discovered only when applying for NExT; causes 6–18 month retrospective processing delay
2. **Degree not properly attested** — arriving with photocopies when originals + apostille are needed; add 6–8 weeks
3. **Foreign internship not at an affiliated hospital** — NMC refuses to recognize it; India-based internship mandated
4. **Attempting NExT without preparation** — multiple failed attempts can delay registration by 2–3 years
5. **Missing the NExT application window** — exam is twice a year; missing one window is a 6-month delay
6. **State Medical Council paperwork errors** — different states have slightly different documentation requirements; verify directly with your home state's SMC
7. **Not starting NExT preparation during foreign MBBS** — the single most impactful mistake in terms of career outcomes

---

## Frequently Asked Questions

**How long after returning from MBBS abroad can I start practicing in India?**
Minimum 6–9 months from return, assuming: immediate NExT Part 1 application, successful first attempt, prompt provisional registration. Realistically, 1–2 years including internship and Part 2 is the typical timeline for a well-prepared graduate.

**Is the NExT easier than the old FMGE?**
It is structurally different, not necessarily easier. NExT is more comprehensive (covers all 19 subjects) but subject-wise passing means partial passes are carried forward. For well-prepared candidates, NExT is designed to be fairer. For those unprepared, subject-wise failure tracking makes retakes more structured but still requires genuine subject mastery.

**Can I practice in India while waiting for NExT?**
No. Until you have at least Provisional Registration (which requires clearing NExT Part 1), you cannot legally practice medicine in India as a doctor, prescribe, or call yourself a physician.

**What if I fail NExT Part 1 on the first attempt?**
You re-appear only for the subjects you failed in the next available attempt (NExT is twice yearly). There is no cap on the number of attempts currently specified in NMC regulations. Prepare seriously for each attempt.

**Can I directly apply for government Medical Officer posts without PG?**
Yes. After permanent registration (post-NExT Part 2), you are eligible for MBBS-level government posts — Medical Officers at PHC, CHC, district hospitals, and similar. Most state recruitments through State Public Service Commissions or Health Department cadres accept MBBS with permanent registration.

**Does completing PG outside India affect NExT?**
This guide addresses the MBBS-level NExT requirement. Post-graduate degrees from abroad have a separate equivalency and registration process under NMC's FMGL framework for PG (NMC PG Foreign Medical Graduate regulations).

**How do I verify my State Medical Council registration?**
All State Medical Council registrations are linked to NMC's national register. Once registered, your registration number is searchable on nmc.org.in under the public registry.

**Can I appear for the USMLE from India after MBBS abroad?**
Yes. The USMLE is a separate pathway and is not governed by NMC. You can pursue USMLE preparation simultaneously with NExT preparation. However, most students who want to practice in India prioritize NExT — the USMLE pathway is a different career trajectory.

---

## Summary: Your Action Plan From Graduation Day

| Immediately on graduation | Collect original degree, internship cert, migration cert from university |
|---|---|
| Month 1–2 | Complete apostille/attestation in country of study + Indian Embassy attestation |
| Month 2–3 on return to India | MEA attestation in New Delhi + NExT Part 1 application |
| Month 4–7 | Appear for NExT Part 1 → await results |
| Month 7–9 | Apply for Provisional Registration → State Medical Council |
| Month 9–21 | India internship (if mandated) / NExT Part 2 preparation |
| Month 18–24 | NExT Part 2 → Permanent Registration |
| After permanent registration | Independent practice, PG admission counselling, career in India |

The students who complete this process in 18–24 months are those who prepared for NExT throughout their foreign MBBS, collected all documents before leaving, and submitted applications without delays. The process is completely navigable — it requires information and preparation, not luck.

Related: [NExT vs FMGE 2026: Complete Guide](/blog/next-vs-fmge-2026-complete-guide) | [NMC Eligibility Certificate: How to Apply](/blog/nmc-eligibility-certificate-mbbs-abroad-complete-guide) | [Career After MBBS Abroad: Salary & PG](/blog/career-after-mbbs-abroad-salary-pg-specialization-india)`,
};

async function run() {
  console.log("=== Blog Batch 6 — Post 2: MBBS Return to India Process ===\n");
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
  console.log("\n✅ Post 2 done!\n");
}
run().catch(e => { console.error(e); process.exit(1); });
