/**
 * Seed authoritative blog posts with Cloudinary cover images.
 * Run: node scripts/seed-blogs.mjs
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// ── Load .env ──────────────────────────────────────────────────────────────
const envContent = readFileSync(join(root, ".env"), "utf8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      const key = l.slice(0, idx).trim();
      const val = l.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
      return [key, val];
    })
);

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// ── Upload a local image to Cloudinary ─────────────────────────────────────
async function uploadImage(localPath, publicId) {
  if (!existsSync(localPath)) {
    console.warn(`  [warn] Image not found: ${localPath}`);
    return null;
  }
  try {
    const existing = await cloudinary.api.resource(publicId);
    console.log(`  [skip] ${publicId} already exists`);
    return existing.secure_url;
  } catch {
    // not found — upload
  }
  const result = await cloudinary.uploader.upload(localPath, {
    public_id: publicId,
    overwrite: false,
  });
  console.log(`  [ok] Uploaded → ${result.secure_url}`);
  return result.secure_url;
}

// ── Blog post data ─────────────────────────────────────────────────────────
const BRAIN_DIR =
  "/Users/bharat/.gemini/antigravity/brain/6120125f-960e-4e07-a96e-a884a178093f";

const posts = [
  // ────────────────────────────────────────────────────────────────────────
  // POST 1: Complete Guide to MBBS Abroad
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "mbbs-abroad-complete-guide-for-indian-students",
    category: "Admissions Guide",
    coverLocalPath: join(BRAIN_DIR, "blog_mbbs_abroad_guide_1774956618715.png"),
    coverPublicId: "studentstraffic/blog/mbbs-abroad-complete-guide",
    title: "MBBS Abroad: The Complete Guide for Indian Students (2026)",
    excerpt:
      "Everything Indian students need to know before choosing MBBS abroad — NMC recognition, country comparisons, real total costs, admission timelines, and what nobody tells you before you leave.",
    metaTitle: "MBBS Abroad Complete Guide for Indian Students 2025 | Students Traffic",
    metaDescription:
      "Comprehensive guide to MBBS abroad for Indian students. NMC-recognized countries, fees, eligibility, admission process, FMGE/NExT prep — everything in one place.",
    content: `## Why 25,000+ Indian Students Choose MBBS Abroad Every Year

Every year, roughly 200,000 Indian students sit for NEET. Around 93,000 secure an MBBS seat in India. The remaining 100,000+ are left with a choice: wait another year, opt for a lesser-preferred course, or pursue MBBS abroad.

For the last decade, MBBS abroad has been the path taken by a growing share of that group. In 2025–26, estimates suggest over 25,000 Indian students enrolled in MBBS programs outside India, with Russia, Kazakhstan, Bangladesh, the Philippines, Georgia, and Kyrgyzstan accounting for the majority of enrollments.

But "MBBS abroad" is not a monolith. It spans 40+ countries, thousands of universities, wildly different fee structures, and dramatically different clinical training environments. This guide cuts through the noise.

---

## Who Is MBBS Abroad Actually Right For?

Before you read fee tables or university rankings, answer these four questions honestly.

**1. Did you clear NEET?**
NMC regulations require a minimum NEET score to be eligible for MBBS abroad. As of 2025, the cutoff is 50th percentile for General category, 40th for SC/ST/OBC. Without a valid NEET score, no NMC-listed university abroad will give you a degree recognized in India.

**2. Can your family realistically fund ₹30–70 lakh over 6 years?**
MBBS abroad is not cheap if you account for everything — tuition, hostel, food, visa extensions, flights home, study materials, and coaching for the NExT/FMGE screening test. A student who runs out of funds in Year 3 is in a very difficult position.

**3. Are you prepared to study in a second language for the first 1–2 years?**
Even English-medium programs at universities in Russia or Kazakhstan have professors with varying English proficiency. Pre-medical (foundation) years are often conducted partly in the local language. This is a real academic challenge.

**4. Do you understand you'll need to pass a screening test to practice in India?**
The Foreign Medical Graduate Examination (FMGE) — transitioning to NExT — is what stands between your MBBS degree and an Indian medical license. Pass rates have historically been around 15–20%. Preparation begins from Year 1, not after graduation.

If your answers to all four are honest and positive, MBBS abroad is worth considering seriously.

---

## NMC Recognition: The Only Metric That Matters

The National Medical Commission (NMC) is India's apex medical regulatory body. A foreign medical degree is valid in India only if:

1. The university appears on NMC's approved list (published periodically, check nmc.org.in)
2. The student passed NEET with the required percentile
3. The student completes the NExT Part 1 and Part 2 screening tests

**Common misconception:** Many agents claim their recommended university is "NMC recognized" and show fabricated certificates. Always verify independently on the NMC portal. Filter by country and university name.

NMC also requires that the university be listed in one or more of these directories:
- World Directory of Medical Schools (WDOMS / FAIMER)
- ECFMG (for US licensing)
- WHO World Directory (legacy entries)

A university not in WDOMS is a serious red flag regardless of what an agent claims.

---

## Country-by-Country Overview

### Russia

Russia is the largest destination for Indian MBBS students, with over 50 NMC-recognized universities. Medical education in Russia is deeply specialized. The degree is called "General Medicine MD" and is equivalent to MBBS.

**Duration:** 6 years (including 1-year internship in Russia)  
**Language:** English medium with Russian language taught as a subject  
**Approximate tuition:** $3,500–$8,000/year depending on university  
**Total cost (6 years):** ₹25–45 lakh including living expenses  
**FMGE pass rate from Russian universities:** Varies; top universities like Kazan, Sechenov, RUDN produce better outcomes  
**Key cities:** Moscow, St. Petersburg, Kazan, Novosibirsk  

**Pros:** Established system for Indian students, good clinical exposure in teaching hospitals, large Indian student communities in major cities  
**Cons:** Language barrier in clinical settings, quality varies dramatically between universities, geopolitical considerations post-2022 require updated assessment

### Kazakhstan

Kazakhstan has risen sharply in popularity following Russia's geopolitical situation. Several universities like Kazakh National Medical University (KazNMU) and Astana Medical University have strong track records.

**Duration:** 5 years + 1-year internship  
**Language:** English medium  
**Approximate tuition:** $4,000–$7,000/year  
**Total cost (6 years):** ₹30–50 lakh  
**Climate:** Harsh winters (−20°C in Astana/Nur-Sultan)  
**FMGE pass rate:** Competitive with Russia's top universities  

**Pros:** English-medium instruction, modern university infrastructure, growing NMC list, closer cultural affinity than Russia for many students  
**Cons:** Extremely cold climate in the north, fewer social activities, Almaty is more liveable than Nur-Sultan

### Philippines

The Philippines uniquely offers a pre-med BS (Biology/Health Sciences) degree before the MD program — a 4+4 or 5.5-year structure — making it the closest to India's MBBS structure.

**Duration:** 4 years BS + 4 years MD (or integrated 5.5 years at some universities)  
**Language:** English (official national language for education)  
**Approximate tuition:** $3,500–$6,000/year  
**Top universities:** University of Santo Tomas (UST), Our Lady of Fatima University, AMA School of Medicine  
**FMGE pass rate:** UST graduates historically outperform most other countries  

**Pros:** Full English medium (no language barrier), clinical training in well-equipped hospitals, culturally welcoming environment for Indian students  
**Cons:** Higher upfront cost due to BS degree, typhoon-prone region, the 4+4 structure is not always clearly communicated to students

### Georgia

Georgia is emerging as a top destination among students who want European medical education at lower costs. Tbilisi State Medical University and New Vision University are the most prominent.

**Duration:** 6 years  
**Language:** English medium  
**Approximate tuition:** $5,000–$7,000/year  
**Total cost (6 years):** ₹35–50 lakh  
**Advantages:** EU-compatible degree, relatively mild climate, safe country with well-developed tourism infrastructure  

**Pros:** European curriculum, good quality teaching hospitals, small class sizes, relatively safe and accessible  
**Cons:** Fewer Indian students means less peer support infrastructure, limited direct flights from India

### Kyrgyzstan

Kyrgyzstan is the budget option, with tuition fees as low as $2,500–$4,000/year. However, the clinical training quality and FMGE outcomes are generally lower than other countries.

**Duration:** 5–6 years  
**Language:** English medium (with Kyrgyz/Russian in clinical settings)  
**Approximate tuition:** $2,500–$4,000/year  
**Key concern:** Several universities here have been flagged by NMC; always verify the specific university

---

## Full Cost Breakdown: What Nobody Tells You

Indian students and parents often see tuition fees quoted in advertisements. The actual cost of MBBS abroad is substantially higher. Here is a realistic breakdown for a 6-year program in Russia (mid-tier university):

| Cost Component | Amount (₹) |
|---|---|
| Tuition (6 years × ₹3.5L) | ₹21,00,000 |
| Hostel (6 years × ₹1.5L) | ₹9,00,000 |
| Food & daily expenses (6 years × ₹1.5L) | ₹9,00,000 |
| Flights (6 round trips) | ₹3,00,000 |
| Visa fees and extensions | ₹60,000 |
| Medical insurance | ₹1,20,000 |
| Study materials and textbooks | ₹60,000 |
| NExT/FMGE coaching after degree | ₹3,00,000 |
| **Total realistic estimate** | **₹47,40,000** |

For Philippines or Georgia, add approximately ₹5–10 lakh to the total due to higher tuition. For Kyrgyzstan, the total can be ₹5–8 lakh lower — but with the corresponding trade-offs in training quality.

---

## Eligibility Requirements (2025–26)

| Requirement | Details |
|---|---|
| Age | 17 years on or before 31 December of admission year |
| NEET | Mandatory; minimum 50th percentile (General), 40th (SC/ST/OBC) |
| 10+2 Science | Physics, Chemistry, Biology — minimum 50% aggregate (General), 40% (SC/ST/OBC) |
| English proficiency | Most universities require Class 12 English; some require IELTS/TOEFL (verify per university) |
| Medical fitness | Standard medical certificate required |

---

## The Admission Timeline

Most universities abroad follow either a September/October intake or a February/March intake. The admission cycle for a September 2025 intake typically looks like this:

- **January–March 2026:** Research countries and universities, shortlist 3–5 options
- **April–May 2026:** NEET exam
- **June 2026:** NEET results; confirm shortlist
- **June–July 2026:** Apply to universities, submit documents
- **July–August 2026:** Receive admission letters, arrange finances
- **August 2026:** Apply for student visa (allow 4–6 weeks processing time)
- **September 2026:** Depart and begin pre-medical orientation

Documents typically required: 10th and 12th mark sheets and certificates, NEET scorecard, passport (valid for 5+ years), passport photos, medical certificate, gap certificate (if applicable), affidavit of financial support.

---

## What the First Year Is Really Like

Most students arrive expecting a campus experience similar to what they have seen in videos shared by consultants. The reality requires adjustment.

**Pre-medical year (Foundation year):** Many universities, especially in Russia and Kazakhstan, require a foundation year to learn the local language at a basic level and to adjust to the teaching style. This year is academically different — less clinical, more orientation-focused.

**Classroom teaching style:** Unlike India's NEET-style multiple-choice preparation, Russian and Eastern European medical universities use oral exams, written dissertations, and practical lab assessments. Students accustomed to MCQ coaching need to reorient.

**Clinical posting structure:** In Russia, clinical postings at teaching hospitals typically begin from Year 3 or 4. The quality depends heavily on the hospital affiliation. Top universities in Kazan or Moscow have excellent teaching hospitals; smaller cities may not.

**Hostel life:** Most universities provide on-campus hostels. Conditions vary from basic dormitory-style rooms to modern single-occupancy rooms. Food can be a challenge — many students cook their own Indian meals.

---

## The NExT Screening Test: Your Path Back to India

The Foreign Medical Graduates Examination (FMGE) is being replaced by the National Exit Test (NExT). Under the new system, foreign medical graduates will need to pass both NExT Part 1 (theory) and NExT Part 2 (clinical skills) to obtain a provisional license to practice in India.

**Historical FMGE pass rates** (to calibrate expectations):
- Overall pass rate: ~15–20%
- Top universities in Russia/Philippines: 30–45%
- Bottom-tier universities: <10%

This is not an exam you can prepare for only after returning. Students who consistently perform well in their MBBS program — particularly in subjects like Anatomy, Physiology, Biochemistry, Pathology, Pharmacology — and who supplement their university coursework with India-focused revision have significantly higher pass rates.

**Recommended preparation approach:**
1. Use Indian standard textbooks alongside university material (Grant's Atlas, Robbins Pathology, KD Tripathi Pharmacology)
2. Join a monthly online test series from Year 2 onwards
3. Connect with seniors at your university who have successfully cleared FMGE/NExT

---

## Red Flags: How to Spot a Bad University or Agent

**University-level red flags:**
- Not listed in WDOMS/FAIMER directory
- Not on current NMC approved list
- No teaching hospital affiliation mentioned clearly
- Claims of "guaranteed FMGE coaching" included in fees (this is a sales tactic, not a quality indicator)
- Tuition fees suspiciously lower than market rates

**Agent-level red flags:**
- Promises of admission with low NEET scores (below NMC cutoff)
- Upfront payment demands before any documentation
- Vague answers about which specific university you're applying to
- No registered office or verifiable track record
- Claims that "NMC recognition is being processed" (a university must already be recognized before you enroll)

---

## How Students Traffic Approaches This Differently

Most consultancies profit from placing students at specific universities, creating an inherent conflict of interest. Students Traffic's peer model works differently: we connect prospective students with Indian students already enrolled at specific universities abroad. You get an honest answer because the peer gives you the same advice they'd give their younger sibling.

Before deciding, talk to at least two current students at any university you're considering. Ask them about: clinical exposure, food situation, internet connectivity, hostel conditions, FMGE preparation resources, and whether they'd make the same choice again.

---

## Frequently Asked Questions

**Is MBBS abroad recognized in India?**
Yes, if the university is on NMC's approved list, you passed NEET, and you clear the NExT screening exam after returning.

**Which country is best for MBBS abroad for Indian students?**
There is no single answer. Russia and Kazakhstan offer the best combination of cost, NMC approval numbers, and established Indian student communities. Philippines offers strongest English medium and better FMGE outcomes from top universities. Georgia offers European curriculum quality. The "best" depends on your budget, language preference, and risk tolerance.

**Can I do internship in India after MBBS abroad?**
Under current NMC rules, foreign medical graduates must complete their internship abroad as part of their university program and then appear for NExT. There is no separate Indian internship pathway for foreign graduates as of 2024.

**What happens if FMGE/NExT is discontinued?**
NExT is the replacement, not the discontinuation of the screening requirement. All foreign medical graduates will still need to pass NExT Part 1 and Part 2 to practice in India.

**Is studying MBBS abroad worth it?**
For students who: (a) have a genuine NEET score, (b) choose a well-recognized university, (c) prepare seriously for NExT throughout their degree, and (d) have financial security for 6 years — yes, MBBS abroad can be a viable and rewarding path to becoming a doctor.

**How much does MBBS abroad cost in total?**
Realistically, budget ₹35–55 lakh for Russia or Kazakhstan, ₹45–65 lakh for Philippines or Georgia, and ₹25–35 lakh for Kyrgyzstan — all-inclusive over 6 years.

---

## The Bottom Line

MBBS abroad is not a shortcut, and it is not a trap. It is a legitimate pathway that requires careful university selection, realistic financial planning, and sustained academic effort throughout the program.

The students who succeed are those who approached the decision with clear eyes — understanding the NExT requirement before enrolling, choosing their university based on verifiable data, and starting their India-specific exam preparation from Year 1.

The students who struggle are those who relied on an agent's word, chose a university based on lowest fees alone, or discovered the FMGE/NExT requirement only after returning to India.

Use the peer connect feature on Students Traffic to speak with students already at universities you're considering. No marketing, no sales pitch — just a conversation with someone who is living the experience you're about to choose.`,
  },

  // ────────────────────────────────────────────────────────────────────────
  // POST 2: NMC Screening Test / NExT Complete Prep Guide
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "next-fmge-screening-test-complete-preparation-guide",
    category: "Exam Preparation",
    coverLocalPath: join(BRAIN_DIR, "blog_nmc_screening_test_1774956635068.png"),
    coverPublicId: "studentstraffic/blog/next-fmge-screening-guide",
    title: "NExT & FMGE 2026: The Complete Preparation Guide for Indian Students from Foreign Medical Universities",
    excerpt:
      "A subject-by-subject preparation roadmap for the NExT/FMGE screening test — understanding the exam pattern, high-yield topics, best resources, and a year-by-year study strategy from enrollment to exam day.",
    metaTitle: "NExT FMGE 2026 Preparation Guide for Foreign Medical Graduates | Students Traffic",
    metaDescription:
      "Complete NExT and FMGE preparation guide for Indian students studying MBBS abroad. Exam pattern, subject-wise strategy, high-yield topics, best books, and monthly study plan.",
    content: `## The Exam That Defines Your Career After MBBS Abroad

You can graduate from one of Russia's most reputable medical universities, return to India with your MBBS degree, and still be unable to practice medicine. That is the reality of the NExT (National Exit Test) — the mandatory screening examination for all foreign medical graduates seeking to practice in India.

For years this exam was called FMGE (Foreign Medical Graduates Examination). As of 2025–26, the regulatory framework is transitioning to NExT, which will apply to all medical graduates — those from India and abroad — making it even more consequential. This guide tells you exactly what it is, how it is structured, what to study, and how to prepare from your first year abroad.

---

## Understanding NExT vs FMGE: What Has Changed

**FMGE (old system):**
- Single exam, 300 multiple-choice questions
- 3.5-hour duration
- Passing score: 150/300 (50%)
- Conducted by National Board of Examinations (NBE)
- Result: Pass/fail, no marks communication to individual subjects

**NExT (new system, in transition as of 2025–26):**
- Two-part examination:
  - **NExT Part 1** (theory): Replaces FMGE; covers all pre-clinical and para-clinical subjects
  - **NExT Part 2** (clinical skills OSCE): Assesses practical and clinical competence
- Foreign medical graduates must clear both parts
- NExT Part 1 passing grants provisional registration; Part 2 grants full license

The core subject matter covered remains largely similar to FMGE, but NExT introduces clinical skills assessment — meaning you cannot pass on written knowledge alone.

**Practical implication:** Students who are currently enrolled abroad and will graduate in the next 2–5 years should prepare for NExT. The transition is governed by NMC's regulations, which will be updated; always verify the current rules at nmc.org.in.

---

## Historical Pass Rates: Calibrating Your Expectation

The FMGE has historically been one of India's most difficult licensing examinations, not because the content is inherently harder than MBBS subjects, but because:

1. Many students do not prepare systematically during their foreign MBBS
2. The exam tests Indian textbook-standard knowledge, not just general medical knowledge
3. Clinical reasoning is tested more rigorously than in many foreign university exams

**National FMGE pass rates (approximate, historical):**
- Overall: 13–22%
- Russia (top 10 universities): 30–45%
- Philippines (UST, Fatima): 35–50%
- Kyrgyzstan, some Uzbekistan universities: 6–15%

These numbers are not inevitable. Students who prepare actively from Year 2 onwards consistently outperform these averages.

---

## The NExT Part 1 Exam Blueprint

NExT Part 1 covers 19 subjects organized across three categories:

### Pre-Clinical Subjects
1. Anatomy
2. Physiology
3. Biochemistry

### Para-Clinical Subjects
4. Pathology
5. Pharmacology
6. Microbiology
7. Forensic Medicine and Toxicology
8. Community Medicine (PSM)

### Clinical Subjects
9. General Medicine
10. Pediatrics
11. Dermatology and Venereology
12. Psychiatry
13. General Surgery
14. Orthopedics
15. Ophthalmology
16. ENT (Ear, Nose, Throat)
17. Obstetrics and Gynaecology
18. Anaesthesiology
19. Radiology (Diagnostic)

**High-yield subjects by weightage:** Pathology, Pharmacology, General Medicine, Surgery, OB-GYN, and Community Medicine typically account for over 50% of questions. Do not neglect Anatomy — it consistently appears in clinical scenario questions.

---

## Year-by-Year Preparation Strategy

### Year 1–2: Build the Foundation

Most students abroad spend Year 1 adjusting to the academic environment and the local language. That's understandable. But this is also when pre-clinical subjects — Anatomy, Physiology, and Biochemistry — are taught.

**What to do:**
- Attend all university lectures and labs — clinical immersion at this stage is irreplaceable
- Supplement with Indian standard textbooks alongside your university material
- Anatomy: Snell's Clinical Anatomy, Gray's for reference; for FMGE/NExT use B.D. Chaurasia's Handbook
- Physiology: Guyton and Hall (primary), K.S. Sembulingam for NExT-oriented review
- Biochemistry: Harper's Illustrated Biochemistry; Satyanarayana for short review

**Monthly commitment:** 30–45 minutes of India-focused revision per day during active university semesters. This is not hours — it is consistency.

### Year 3–4: Paraclincal and Clinical Integration

This is the most important phase. Para-clinical subjects (Pathology, Pharmacology, Microbiology) are directly and heavily tested in NExT.

**Pathology (highest-yield subject):**
- Primary: Robbins and Cotran Pathologic Basis of Disease (standard reference)
- NExT review: Harsh Mohan's Textbook of Pathology (India-specific, exam-oriented)
- Practice: Pathology FMGE question banks — solve at least 2,000 questions with explanations
- Focus areas: General pathology (cell injury, inflammation, neoplasia), then organ-wise pathology

**Pharmacology:**
- Primary: KD Tripathi Essentials of Medical Pharmacology (Indian standard)
- Extra: Katzung for mechanisms; but KD Tripathi is the exam bible
- High-yield: Autonomic pharmacology, CVS drugs, antimicrobials, CNS drugs, endocrine pharmacology
- Reasoning over memorization: FMGE/NExT tests clinical application, not just drug names

**Microbiology:**
- Primary: Ananthanarayan and Panicker's Textbook of Microbiology (India)
- Focus: Bacterial characteristics, virulence factors, disease associations, specimen handling, serology

**Community Medicine (PSM):**
- Primary: K. Park's Textbook of Preventive and Social Medicine
- High-yield: National health programs (NVBDCP, RKSK, NHM, Ayushman Bharat), biostatistics, epidemiology calculations

**Year 3–4 study structure:**
- Join an online FMGE/NExT test series (DAMS, PrepLadder, Marrow — all have FMGE-specific modules)
- Target minimum 100 subject-wise questions per week
- Monthly grand test to track improvement

### Year 5–6: Clinical Subjects and Final Preparation

**General Medicine and Pediatrics:**
These subjects together often account for the largest single block of questions in NExT Part 1.

- General Medicine: Harrison's (reference); API Textbook of Medicine (India-specific); Davidson's
- Pediatrics: Nelson (reference); OP Ghai (India-exam standard)
- Focus: Short cases — specific fever workup, approach to dyspnea, interpretation of ECG/X-ray in clinical scenarios

**Surgery and Orthopedics:**
- Surgery: Bailey and Love (reference); Sriram Bhat and Rajan Surgery (India-exam standard)
- Orthopedics: Maheshwari (most exam-relevant)

**OB-GYN:**
- DC Dutta's Textbook of Obstetrics and Gynecology — the Indian exam standard

**Ophthalmology and ENT:**
- Khurana (Ophthalmology), PL Dhingra (ENT) — both comprehensive for NExT

**Year 5–6 study structure:**
- Full-length mock test every 2 weeks
- Subject revision in 3-week cycles
- High-yield notes from test series revisions — consolidate wrong answers

---

## The 6-Month Intensive Before the Exam

If you are returning to India after completing your degree, the 6 months before NExT are the most critical. Structure this phase:

**Month 1–2:** Rapid subject-wise revision
- Cover all 19 subjects in the first 8 weeks using short-form notes (from your test series or standard revision books like ROAMS/SARP/DAMS modules)
- Cover 2–3 subjects per week

**Month 3–4:** Integrated practice
- Attempt 3,000–5,000 questions across subjects
- Focus on clinical scenarios and case-based questions (these will increase in NExT)

**Month 5–6:** Mock exam and analysis
- Attempt 2–3 full-length mock exams per week (300 questions, timed)
- Analyze wrong answers meticulously — each wrong answer is a weak area to revisit
- Revise high-yield topics identified through mock analysis

---

## NExT Part 2: Clinical Skills Assessment

NExT Part 2 is the Objective Structured Clinical Examination (OSCE) component — a practical clinical skills assessment. For foreign medical graduates, this is particularly relevant because:

- Your clinical training happened in a foreign hospital setting
- Indian clinical presentation of diseases can differ from what you observed abroad
- Patient-doctor communication in regional languages may be tested

**Preparation approach for Part 2:**
1. Complete your foreign university internship rigorously — do not treat it as a formality
2. If possible, shadow Indian doctors during holidays or after graduation
3. Enroll in a structured NExT Part 2 preparatory course at an Indian medical center (several FMGE coaching institutes offer clinical skills programs)
4. Practice history-taking and clinical examination systematically

---

## Top Resources for NExT/FMGE Preparation

### Books (India-Standard)
| Subject | Recommended Book |
|---|---|
| Anatomy | B.D. Chaurasia Handbook (3 volumes) |
| Physiology | Sembulingam; Ganong for concepts |
| Biochemistry | Satyanarayana; Harper's |
| Pathology | Harsh Mohan; Robbins (reference) |
| Pharmacology | KD Tripathi |
| Microbiology | Ananthanarayan and Panicker |
| Community Medicine | K. Park's |
| Medicine | Davidson's; API Textbook |
| Surgery | Sriram Bhat |
| OB-GYN | DC Dutta |
| Pediatrics | OP Ghai |

### Online Platforms
- **Marrow:** Best for NBE-oriented question bank with video explanations; strong analytics
- **PrepLadder:** Excellent video lectures; popular for pre-clinical subjects
- **DAMS (Delhi Academy of Medical Sciences):** Long-established coaching with FMGE modules

### Test Series
Any consistent, structured test series will outperform self-study without practice questions. The key is not which platform, but whether you analyze incorrect answers systematically.

---

## Common Mistakes That Cause Failures

**1. Starting preparation only after returning to India**
The single biggest predictor of failure. Students who begin NExT prep in Year 1 of their foreign MBBS and maintain it consistently outperform those who start after graduation by a factor of 3–4.

**2. Studying only from foreign university material**
Foreign textbooks like Robbins or Harrison's are excellent as primary references. But the exam tests Indian-standard knowledge organization. You need Indian textbooks and Indian question banks.

**3. Neglecting Community Medicine**
PSM is frequently underestimated. It is heavily numerical (biostatistics, epidemiology measures) and program-specific (knowing India's specific health programs). A well-prepared PSM can add 15–20 marks to your score.

**4. Not tracking wrong answers**
Attempting 10,000 questions without reviewing errors is largely wasted time. Maintain an error log by subject. Revisit these systematically.

**5. Ignoring Forensic Medicine**
FM&T is short, relatively high-yield, and many students leave it entirely. 10 hours of focused revision can secure 8–12 marks.

---

## Building a Support Network

MBBS abroad students often feel isolated in their NExT preparation. Strategies that help:

- **Senior student WhatsApp groups:** Most universities have senior batches who have cleared FMGE. They share what worked and what did not
- **Online study groups:** Telegram groups specifically for university-specific FMGE prep (e.g., "KazNMU FMGE 2026 batch")
- **Students Traffic peer connect:** Connect with seniors at your specific university through the platform to get honest, experience-based guidance

---

## Frequently Asked Questions

**How many attempts are available for NExT?**
Under the current transition, NMC has not published a lifetime attempt cap for NExT. The FMGE had no attempt limit. Check nmc.org.in for updated regulations as NExT implementation progresses.

**Can I practice medicine in India with a foreign MBBS degree without clearing NExT?**
No. The degree alone does not grant practice rights. NExT Part 1 and Part 2 clearing is mandatory for registration with any State Medical Council in India.

**What is the passing score for NExT Part 1?**
NMC has indicated a 50% aggregate passing threshold, but this may be subject to revision. Check official NMC notifications.

**Does the FMGE score affect future opportunities like PG admissions?**
FMGE was pass/fail only — it did not generate a merit score for PG admission. Under NExT, the same NExT examination that domestic students take for PG admission will be used. This means foreign graduates who clear NExT Part 1 will get a score that can be used for PG admission — a significant change from FMGE.

**How long should I study before the NExT?**
6 months of intensive full-time preparation is the minimum for a student who has been doing consistent subject-wise preparation throughout their 6-year MBBS. For those starting from scratch after returning, 12 months minimum is more realistic.

**Which subject should I start with?**
Start with Pathology. It is the highest-yield subject, foundational to clinical diagnosis, present in every clinical subject, and gives you the most questions per hour of preparation.

---

## Final Assessment: Are You Ready?

Before sitting for NExT Part 1, self-assess against these benchmarks:

- [ ] Averaged 65%+ on full-length mock tests in the last 4 weeks
- [ ] Completed at least one pass through all 19 subjects with dedicated revision
- [ ] Attempted at least 5,000 questions total with error analysis
- [ ] Community Medicine national programs fully revised
- [ ] Pharmacology high-yield drug classes (autonomic, CVS, antimicrobials) strongly revised
- [ ] No unread error logs — all incorrect answers from mocks have been reviewed

If you can check all six, you are positioned to pass. If you cannot, identify which boxes are unchecked and structure the next 4–8 weeks around closing those gaps.

The exam is clearable. The 80%+ who do not pass are not less intelligent than those who do — they are less systematically prepared. Systematic preparation over a 6-year horizon is the structural advantage you can build from today.`,
  },

  // ────────────────────────────────────────────────────────────────────────
  // POST 3: MBBS Fees Comparison
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "mbbs-abroad-fees-country-comparison-2026",
    category: "Fees & Finance",
    coverLocalPath: join(BRAIN_DIR, "blog_mbbs_fees_comparison_1774956651550.png"),
    coverPublicId: "studentstraffic/blog/mbbs-fees-country-comparison-2026",
    title: "MBBS Abroad Fees 2026: Country-by-Country Cost Comparison for Indian Students",
    excerpt:
      "A verified, side-by-side breakdown of total MBBS costs across Russia, Kazakhstan, Philippines, Georgia, Kyrgyzstan, and Bangladesh — tuition, hostel, food, visa, and the hidden costs nobody includes in their brochures.",
    metaTitle: "MBBS Abroad Fees 2026 — Country-by-Country Cost Comparison | Students Traffic",
    metaDescription:
      "Detailed MBBS abroad fee comparison for Indian students in 2025. Russia, Kazakhstan, Philippines, Georgia, Kyrgyzstan, Bangladesh — total costs including tuition, hostel, meals, visa, flights, and NExT coaching.",
    content: `## Why MBBS Fee Comparisons Are Usually Wrong

Search "MBBS abroad fees" and you will find tuition figures ranging from ₹12 lakh to ₹55 lakh for a 6-year program. Almost all of them are incomplete.

Consultancies and university marketing materials advertise tuition fees because those are the lowest number in the cost structure. Hostel, food, visa, flights, insurance, and post-graduation exam coaching are rarely included — but they are real, recurring, and collectively often exceed tuition itself.

This guide gives you the honest total cost of MBBS in each major destination country for Indian students — based on verified fee disclosures, student-reported data, and publicly available university sources as of 2026.

Use this as a starting point. Verify specific university fees directly before committing.

---

## Methodology and Currency Note

All figures are presented in Indian Rupees (₹). USD-denominated costs are converted at approximately ₹84 = $1 (March 2026 rate). Currency movements over 6 years will affect actual costs; budget for a 10–15% currency risk buffer on USD-denominated programs.

Living costs reflect mid-range estimates based on student-reported data from university forums and Students Traffic peer community. Costs vary by city and lifestyle.

---

## Russia

Russia offers the widest range of NMC-recognized universities of any single country — over 50 universities, spanning very different price points and quality tiers.

### Tuition Fees (Annual, 2026)

| University Tier | Annual Tuition (USD) | Annual Tuition (₹) |
|---|---|---|
| Tier 1 (Sechenov, RUDN, Kazan Federal) | $7,000–$9,000 | ₹5.9–7.6L |
| Tier 2 (Regional state universities) | $4,500–$6,500 | ₹3.8–5.5L |
| Tier 3 (Smaller private/regional) | $2,800–$4,500 | ₹2.4–3.8L |

### Living Costs (Annual)

| Cost Component | Moscow/SPB | Regional cities |
|---|---|---|
| Hostel (university) | ₹1.8–2.4L | ₹60,000–1.2L |
| Food | ₹1.5–2.0L | ₹1.0–1.5L |
| Transport | ₹30,000–50,000 | ₹15,000–30,000 |
| Personal expenses | ₹60,000–1.2L | ₹40,000–80,000 |

### Total Cost (6 Years, 2026) by Tier

| Tier | Tuition (6Y) | Living (6Y) | Flights (6) | Visa | **Total** |
|---|---|---|---|---|---|
| Tier 1 (Moscow/SPB) | ₹35–46L | ₹25–32L | ₹3L | ₹60K | **₹64–82L** |
| Tier 2 (Mid-tier state) | ₹23–33L | ₹16–22L | ₹3L | ₹60K | **₹43–59L** |
| Tier 3 (Low-cost) | ₹14–23L | ₹12–18L | ₹3L | ₹60K | **₹30–44L** |

**Post-graduation (NExT coaching):** add ₹2–4L

### What the Numbers Mean

Russia's Tier 3 universities are genuinely affordable at ₹30–44L total. However, FMGE pass rates at bottom-tier Russian universities have historically been below 15%. The cost saving at enrollment can translate to a multi-year delay in practice start if NExT preparation is harder from a weaker clinical base.

Tier 2 universities in cities like Kazan, Saratov, and Perm represent the value zone — reasonable fees, NMC-recognized, and reasonable FMGE outcomes.

**Geopolitical risk note:** Post-2022 developments have affected banking (international transfers) and logistics (flight routes) for Russia. Most universities continue to receive students and payment. However, students should account for potential currency conversion difficulties and plan bank arrangements in advance.

---

## Kazakhstan

Kazakhstan has absorbed a significant portion of the Indian student flow that previously went exclusively to Russia. Several NMC-recognized universities here have strong track records.

### Tuition Fees (Annual, 2026)

| University | Annual Tuition (USD) | Annual Tuition (₹) |
|---|---|---|
| Kazakh National Medical University (KazNMU), Almaty | $5,000–$6,500 | ₹4.2–5.5L |
| Astana Medical University (Nur-Sultan) | $4,500–$6,000 | ₹3.8–5.0L |
| South Kazakhstan Medical Academy | $3,500–$5,000 | ₹2.9–4.2L |
| Other regional universities | $2,800–$4,500 | ₹2.4–3.8L |

### Living Costs (Annual)

| Cost Component | Almaty | Nur-Sultan |
|---|---|---|
| Hostel (university) | ₹80,000–1.4L | ₹1.0–1.6L |
| Food | ₹1.2–1.8L | ₹1.2–1.8L |
| Winter clothing (one-time) | ₹30,000–60,000 | ₹40,000–80,000 |
| Transport | ₹20,000–40,000 | ₹25,000–45,000 |

**Nur-Sultan warning:** The capital experiences temperatures of −20°C to −30°C during winter months. This is not an advisory note — it is a daily life reality. Many students from warmer Indian states struggle significantly.

### Total Cost (6 Years) — KazNMU Almaty

| Component | Cost |
|---|---|
| Tuition (6Y × ₹5L avg) | ₹30,00,000 |
| Hostel (6Y × ₹1.1L) | ₹6,60,000 |
| Food (6Y × ₹1.5L) | ₹9,00,000 |
| Personal expenses (6Y × ₹60K) | ₹3,60,000 |
| Flights (6 round trips) | ₹3,00,000 |
| Visa and extensions | ₹60,000 |
| Winter outfitting (one-time) | ₹50,000 |
| Medical insurance | ₹1,20,000 |
| **Total** | **₹54,50,000** |

Post-graduation NExT coaching: add ₹2–4L

**Kazakhstan advantage over Russia:** Relatively stable geopolitical position, improved banking access, growing Indian student community with established support infrastructure.

---

## Philippines

The Philippines is distinctive in structure. Students typically complete a 4-year BS degree (Biology or a Health Science equivalent) before entering a 4-year MD program — making the total timeline 8 years instead of 6. Some universities offer an integrated 5.5-year program. This structural difference has major cost and career implications.

### Understanding the BS+MD Model

**Year 1–4:** BS Biology/Health Sciences (~$2,500–3,500/year)  
**Year 5–8:** MD ($4,000–6,000/year at top universities)  

The BS years are less expensive, but the additional 2 years compared to other countries add 2 years of living costs and delay career start.

### Tuition Fees (Annual, 2026)

| University | BS/yr (USD) | MD/yr (USD) | Combined ₹ |
|---|---|---|---|
| University of Santo Tomas (UST) | $3,200 | $5,500 | ₹52–58L (8Y) |
| Our Lady of Fatima University | $2,800 | $4,800 | ₹46–52L (8Y) |
| AMA School of Medicine | $2,500 | $4,500 | ₹42–48L (8Y) |
| De La Salle Medical & Health Sciences | $3,000 | $5,200 | ₹50–55L (8Y) |

### Living Costs (Annual, Metro Manila / Laguna)

| Component | Annual |
|---|---|
| Accommodation (shared housing) | ₹1.2–2.0L |
| Food | ₹1.5–2.0L |
| Transport | ₹30,000–60,000 |
| Personal | ₹50,000–1.0L |

### Total Cost (8 Years) — UST

| Component | Cost |
|---|---|
| BS Tuition (4Y × ₹2.7L) | ₹10,80,000 |
| MD Tuition (4Y × ₹4.6L) | ₹18,40,000 |
| Living (8Y × ₹4L/yr) | ₹32,00,000 |
| Flights (8 round trips) | ₹4,00,000 |
| Visa and extensions | ₹80,000 |
| **Total** | **₹66,00,000** |

Post-graduation NExT coaching: add ₹2–4L

**Philippines advantage:** Strongest English medium in any MBBS abroad destination. No language barrier. Philippine teaching hospitals (e.g., UST Hospital) are well-equipped. UST historically produces among the best FMGE pass rates.

**Key consideration:** The 8-year timeline (vs 6 years) is a significant factor. Two extra years of study abroad means two extra years of income delay and living costs. This is why comparable total costs to Russia or Kazakhstan can be higher despite similar annual fees.

---

## Georgia

Georgia has positioned itself as the European-curriculum option at relatively accessible costs. The country is safe, culturally welcoming, and Tbilisi is a liveable city with growing Indian student communities.

### Tuition Fees (Annual, 2026)

| University | Annual Tuition (USD) | Annual Tuition (₹) |
|---|---|---|
| Tbilisi State Medical University | $6,000–$7,000 | ₹5.0–5.9L |
| David Tvildiani Medical University (DTMU) | $5,500–$7,000 | ₹4.6–5.9L |
| New Vision University | $6,000–$8,000 | ₹5.0–6.7L |
| Caucasus International University | $4,500–$6,000 | ₹3.8–5.0L |

### Living Costs (Annual, Tbilisi)

| Component | Annual |
|---|---|
| Accommodation (university dorm) | ₹80,000–1.4L |
| Food | ₹1.2–1.8L |
| Transport | ₹20,000–40,000 |
| Personal | ₹40,000–80,000 |

### Total Cost (6 Years) — Mid-tier Georgia University

| Component | Cost |
|---|---|
| Tuition (6Y × ₹5L) | ₹30,00,000 |
| Hostel (6Y × ₹1.1L) | ₹6,60,000 |
| Food (6Y × ₹1.5L) | ₹9,00,000 |
| Personal (6Y × ₹60K) | ₹3,60,000 |
| Flights (6Y, fewer direct routes) | ₹4,00,000 |
| Visa costs | ₹60,000 |
| **Total** | **₹53,80,000** |

Post-graduation NExT coaching: add ₹2–4L

**Georgia advantage:** European curriculum (often European university partnerships for elective rotations), English medium, relatively safe and modern city. Several Georgian medical universities have recognition in multiple countries. Climate is mild.

**Georgia consideration:** Fewer direct flights from India (typically via Istanbul or Dubai) affects travel cost and convenience. Smaller Indian student networks mean less peer support than Russia or Kazakhstan.

---

## Kyrgyzstan

Kyrgyzstan represents the lowest-cost MBBS abroad option with NMC-recognized universities. However, quality varies dramatically.

### Tuition Fees (Annual, 2026)

| University | Annual Tuition (USD) | Annual Tuition (₹) |
|---|---|---|
| International School of Medicine (ISM) | $3,500–$4,500 | ₹2.9–3.8L |
| Osh State Medical University | $2,800–$4,000 | ₹2.4–3.4L |
| Jalal-Abad State Medical Academy | $2,500–$3,500 | ₹2.1–2.9L |

### Total Cost (6 Years) — Mid-tier Kyrgyzstan

| Component | Cost |
|---|---|
| Tuition (6Y × ₹3L) | ₹18,00,000 |
| Hostel (6Y × ₹80K) | ₹4,80,000 |
| Food (6Y × ₹1.2L) | ₹7,20,000 |
| Personal (6Y × ₹50K) | ₹3,00,000 |
| Flights (6Y) | ₹3,00,000 |
| Visa | ₹40,000 |
| **Total** | **₹36,40,000** |

Post-graduation NExT coaching: add ₹2–4L

**Critical note on Kyrgyzstan:** The low tuition is real. The FMGE pass rate has historically been among the lowest of all countries. Some universities here have had NMC recognition issues. Always verify the specific university's current NMC status before enrolling — not just "Kyrgyzstan is NMC approved" but that specific university.

Students who choose Kyrgyzstan need to be disproportionately self-directed in NExT preparation throughout their 6 years, because the clinical training environment may not supplement exam readiness as effectively.

---

## Bangladesh

Bangladesh MBBS is a unique case — it is geographically close to India, and the medical curriculum is similar to India's (both based on British medical tradition). The degree from recognized Bangladeshi universities is accepted by NMC without FMGE — it is treated equivalently to an Indian MBBS.

### Tuition Fees (Annual, 2026)

| University Type | Annual Tuition (BDT) | Approx ₹ |
|---|---|---|
| Government medical colleges | Minimal (very competitive) | ₹25,000–50,000 |
| Private medical colleges (mid) | BDT 8–12L | ₹5.0–7.5L |
| Private medical colleges (high) | BDT 12–18L | ₹7.5–11L |

### Key Difference: No FMGE Required

NMC recognizes MBBS degrees from Bangladesh's Medical and Dental Council-recognized universities directly. Graduates can apply for Indian State Medical Council registration without clearing NExT/FMGE as a separate exam.

This is a significant advantage over other countries, particularly given the challenging NExT/FMGE pass rates.

**However:** Admission to Bangladeshi private medical colleges is itself competitive for Indian students, and the total cost at premium private colleges can approach ₹55–70L over 5 years. Government colleges are essentially inaccessible to non-Bangladeshi students.

**Bangladesh in context:** For Indian students near the West Bengal/Northeast border or those who prefer a South Asian clinical environment, Bangladesh is worth serious consideration. The English language of instruction, FMGE exemption, and cultural familiarity are genuine advantages.

---

## Side-by-Side Comparison

| Country | Duration | Total Cost (₹) | Language | FMGE Required | Quality Tier |
|---|---|---|---|---|---|
| Russia (Tier 2 state univ.) | 6Y | ₹43–59L | English + Russian | Yes (NExT) | Medium–High |
| Russia (Tier 1 Moscow/SPB) | 6Y | ₹64–82L | English + Russian | Yes (NExT) | High |
| Kazakhstan (KazNMU) | 6Y | ₹50–58L | English | Yes (NExT) | Medium–High |
| Philippines (UST) | 8Y | ₹62–70L | English | Yes (NExT) | High |
| Georgia (mid-tier) | 6Y | ₹50–58L | English | Yes (NExT) | Medium–High |
| Kyrgyzstan (ISM) | 6Y | ₹33–40L | English + Kyrgyz | Yes (NExT) | Medium–Low |
| Bangladesh (private) | 5Y | ₹40–65L | English | No | Medium |

---

## Hidden Costs Rarely Included in Fee Quotes

### 1. Currency Fluctuation Risk
If the rupee weakens against the USD, your annual tuition in rupees increases. Over 6 years, a 10% rupee depreciation adds approximately ₹3–5L to a $5,000/year program.

### 2. NExT / FMGE Coaching
₹2–4L for a structured 6-month intensive coaching program after graduation is standard. Many students budget for this as a single expense. Factor it in from day 1.

### 3. Health Insurance
Many countries require mandatory student health insurance. Russia typically requires annual insurance (₹15,000–25,000/year through university). Philippines and Philippines: student health plans through the university.

### 4. Technology and Equipment
Medical equipment for lab practicals, laptops, books (Indian + university textbooks), stationery: budget ₹30,000–60,000 for Year 1, ₹15,000–25,000/year thereafter.

### 5. One-Time Setup Costs
Arriving in a new country involves setting up an apartment/hostel room, purchasing winter clothing (Russia, Kazakhstan), household essentials. Budget ₹30,000–80,000 as one-time setup.

### 6. Emergency Fund
Medical emergencies, family emergencies requiring quick return flights, or equipment replacement. Maintain ₹1–2L in accessible savings at all times.

---

## How to Evaluate Affordability

A useful framework: Add total 6-year cost plus NExT coaching. Then consider:

**Annual income as an Indian doctor (approximate):**
- Fresher private hospital: ₹6–10L/year
- Government job (state): ₹10–15L/year
- After PG specialization: ₹20–60L/year depending on specialty

A ₹50L total MBBS cost, amortized over a career of 35 years, represents approximately ₹1.4L/year — less than one month's salary for a specialist. The financial calculus works if you practice medicine.

The risk scenario: students who do not clear NExT and do not practice. This risk is real. At a 20% national pass rate, 80% of foreign graduates either fail or take multiple attempts. The financial plan must account for this possibility: what happens if you need 2–3 NExT attempts over 2–3 years? The cost of delay (living expenses, coaching, opportunity cost) is real and should be modeled in your financial plan.

---

## Financing MBBS Abroad

### Education Loans
Most public sector banks offer education loans for MBBS abroad:
- **SBI Scholar Loan / Global Ed-Vantage:** Up to ₹1.5 crore; requires travel documents and admission letter from recognized university
- **Bank of Baroda Baroda Vidya:** Up to ₹80L abroad; collateral required above ₹10L
- **Axis Bank, HDFC Credila:** Private education loan providers; higher interest rates but more flexible processing

**NMC recognition matters here too:** Banks typically require the destination university to be NMC-recognized for education loan approval.

### Scholarships
Scholarships for MBBS abroad are rare but exist:
- Government of India scholarship schemes for ASEAN countries
- Specific country government scholarships (Russian Government Scholarship — competitive, bilateral agreement quota)
- Indian government scholarship for Bangladesh (limited seats)

Most students self-finance through family savings and education loans.

---

## Frequently Asked Questions

**Which country has the lowest total cost for MBBS abroad?**
Kyrgyzstan has the lowest tuition, with total 6-year costs around ₹33–40L. However, lower costs correlate with lower NExT pass rates from those universities. Bangladesh represents a unique case — 5 years, FMGE exemption, but private college fees can be comparably high.

**Is Russia MBBS still safe to invest in after 2022?**
Most Indian students continue successfully in Russia. Banking and logistics have additional friction but are not impossible. For new applicants in 2025, the situation is more stabilized than 2022. The risk is geopolitical uncertainty over a 6-year horizon — a risk that should be weighted according to your personal risk tolerance.

**Can education loans cover all MBBS abroad costs?**
Education loans typically cover tuition, hostel, and a portion of living costs. Full living coverage is not always approved. Family contribution is typically needed for day-to-day expenses.

**Are fees negotiable with universities abroad?**
Some universities offer early-bird admission discounts or loyalty scholarships. Group discounts (multiple students from the same family or school) are occasionally available. Negotiation is possible through direct university contact, not through agents who have their own commission interests.

**What is the total cost of MBBS plus NExT prep versus MBBS in India?**
Private MBBS in India (management quota): ₹60–1.5 crore over 5.5 years, without scholarship. MBBS abroad at a mid-tier university: ₹45–60L over 6 years plus ₹3–4L NExT coaching. The cost argument for MBBS abroad is strongest against Indian private college fees — but the NExT requirement adds back significant preparation investment.

---

## Making the Decision

Cost is important but should not be the only basis for choosing a country or university. The right framework:

1. **Confirm NMC recognition** of the specific university (not just country-level)
2. **Verify FMGE/NExT outcome data** from that university — ask Students Traffic peers who graduated from there
3. **Model total cost**, not just tuition — use the full cost tables above
4. **Assess clinical training quality** — talk to current students about hospital exposure and quality of teaching
5. **Consider personal fit** — language, climate, cultural environment, support network availability

For transparent, peer-verified information on any specific university abroad, use the Students Traffic peer connect — the only space where you get an unsponsored opinion from someone already there.`,
  },
];

// ── Insert into DB ──────────────────────────────────────────────────────────
async function run() {
  console.log("=== Students Traffic Blog Seeder ===\n");

  // 1) Upload images to Cloudinary
  console.log("── Step 1: Uploading cover images to Cloudinary...\n");
  for (const post of posts) {
    console.log(`  Post: ${post.slug}`);
    const url = await uploadImage(post.coverLocalPath, post.coverPublicId);
    post.coverUrl = url;
  }

  // 2) Insert into Neon DB
  console.log("\n── Step 2: Inserting blog posts into database...\n");

  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const client = await pool.connect();

  try {
    for (const post of posts) {
      const now = new Date();

      const result = await client.query(
        `
        INSERT INTO blog_posts (
          slug, title, excerpt, content, cover_url,
          category, meta_title, meta_description,
          status, published_at, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8,
          'published', $9, $10, $10
        )
        ON CONFLICT (slug) DO UPDATE SET
          title          = EXCLUDED.title,
          excerpt        = EXCLUDED.excerpt,
          content        = EXCLUDED.content,
          cover_url      = EXCLUDED.cover_url,
          category       = EXCLUDED.category,
          meta_title     = EXCLUDED.meta_title,
          meta_description = EXCLUDED.meta_description,
          status         = 'published',
          published_at   = EXCLUDED.published_at,
          updated_at     = EXCLUDED.updated_at
        RETURNING id, slug
        `,
        [
          post.slug,
          post.title,
          post.excerpt,
          post.content,
          post.coverUrl ?? null,
          post.category,
          post.metaTitle,
          post.metaDescription,
          now,
          now,
        ]
      );

      console.log(`  ✓ Upserted: [${result.rows[0].id}] ${result.rows[0].slug}`);
      console.log(`    Cover URL: ${post.coverUrl ?? "(no image)"}`);
    }
  } finally {
    client.release();
    await pool.end();
  }

  console.log("\n✅ Done! All blog posts published.\n");
  console.log("URLs:");
  for (const post of posts) {
    console.log(`  https://studentstraffic.com/blog/${post.slug}`);
  }
}

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
