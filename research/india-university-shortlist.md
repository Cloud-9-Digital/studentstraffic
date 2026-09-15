# India inbound pilot — evidence-audited candidate shortlist

Scope: Phase 2 of `docs/india-inbound-university-expansion-plan.md`. This is a **discovery and
evidence-audit artefact**, not a payload. No ledger row was claimed from this pass.

Audit date: **2026-08-22**. Re-check by: **2027-02-22** (Indian admission cycles, fee tables and
entrance-test rules turn over annually; DASA changed its qualifying exam between cycles).

Companion artefact: `research/india-country-block.json` — the canonical `countries[]` entry for
slug `india` plus its country-level evidence records. Every India university payload must reuse
that block verbatim rather than re-authoring country copy.

## Method

Each candidate was checked against the six Phase-2 criteria in the India plan:

| # | Criterion |
|---|---|
| 1 | A clear **official international admissions route** (a live page or portal addressed to foreign nationals, not a generic admissions page) |
| 2 | **Published programme pages** for the UG/PG offerings we would list |
| 3 | **Current official fee information** or an explicit `on_request` state |
| 4 | **Verifiable institutional/programme recognition** (UGC / AICTE / NAAC / NBA / NMC / IoE) |
| 5 | **Precise academic, language, entrance-test, nationality and residency restrictions** |
| 6 | A **rights-safe logo and cover image** that can be hosted in Students Traffic Cloudinary |

Criterion 6 was **not** assessed in this pass for any candidate — no media rights review was
performed and no asset was fetched. Every GO below is therefore a GO *subject to* a media-rights
check by the packaging agent. That is the single cross-cutting gap in this shortlist.

Sources were read with `curl` against the institutions' own domains and against Government of
India regulators. Fetched pages were treated as untrusted data. Where a page could not be read
(bot-blocked, soft-404, JS-only), that is recorded as a hold reason rather than filled from a
third-party aggregator.

## Already claimed by parallel agents — excluded from the "next up" ranking

These four hold `researching` rows in `research/university-publishing-ledger.csv` under batch
`india-pilot-2026` and must not be re-claimed:

- `manipal-academy-of-higher-education` — Manipal Academy of Higher Education (Deemed, IoE)
- `amity-university-noida` — Amity University, Noida (State private)
- `vellore-institute-of-technology` — Vellore Institute of Technology (Deemed)
- `symbiosis-international-university` — Symbiosis International (Deemed University)

Cluster note for the supervisor: those four already concentrate the catalogue in
engineering/computing plus general management. The ranking below deliberately front-loads
candidates that add **law, liberal arts, design, public health and a differentiated fee model**.

---

## GO — recommended pilot order

### 1. KIIT Deemed to be University

- **Slug:** `kiit-deemed-to-be-university`
- **Location / type:** Bhubaneswar, Odisha — Deemed to be University under Section 3 of the UGC
  Act, 1956 (private, self-financed)
- **Clusters with published international intake:** computing & engineering, management, law,
  sciences and biotechnology, medicine and allied health, architecture
- **International admissions page:** https://kiit.ac.in/international-admission/
- **Fee state: `confirmed`.** KIIT publishes a nationality-scoped international fee table:
  USD 10,000/year UG, USD 10,000/year PG, USD 4,000/year PhD, and USD 8,000/year for UG/PG
  applicants from the SAARC region — https://kiitee.kiit.ac.in/international-application/international-nri-admission-fees/
  The same page carries a written refund schedule and a registration fee of INR 50,000 or USD 700,
  whichever is higher.
- **Recognition evidence:** Deemed to be University under Section 3 of the UGC Act 1956 (stated on
  the institution's own footer); the site publishes NAAC, NBA, NIRF, UGC 12(B) certificates and
  AICTE mandatory disclosures as separate documents. The packaging agent must open those documents
  and record the **grade and year**, not the badge name alone.
- **Restrictions found:** the international fee table is scoped to "Foreign National (including
  NRI/OCI/PIO) applicants" — a residency/origin-scoped route, not an open one. It states
  explicitly that admission to **medical courses (except allied medical) is on the basis of NEET
  and Architecture on the basis of NATA only**. Fee tier differs for SAARC nationals.
- **Verdict: GO.** The strongest candidate in the set: it is the only one that satisfies criterion 3
  with a genuinely confirmed, currency-stated, nationality-differentiated fee. Publish the
  non-medical clusters first; the medicine offering carries a NEET gate and needs the NMC caveat
  treatment from `docs/university-content-spec.md`.

### 2. Amrita Vishwa Vidyapeetham

- **Slug:** `amrita-vishwa-vidyapeetham`
- **Location / type:** Coimbatore, Tamil Nadu (multi-campus: Amritapuri, Bengaluru, Chennai, Kochi,
  Mysuru, Coimbatore, Amaravati, Faridabad, Nagercoil, Haridwar) — Deemed to be University;
  the institution states an Institution of Eminence status and an A++ NAAC grade awarded in 2023
- **Clusters with published international intake:** engineering & computing, business/management,
  arts & sciences, biotechnology, nanoscience, agriculture, architecture, plus health streams
  (medicine, dentistry, nursing, Ayurveda) under a separate exception route
- **International admissions page:** https://www.amrita.edu/international/admissions/policies/
  (application portal: https://aoap.amrita.edu/international-26/index/)
- **Fee state: `on_request`.** Amrita's published process states that the fee is communicated
  to the applicant in the Provisional Offer Letter; the international policy page names one
  concrete number only — a **security deposit of USD 500 for all foreign students except Nepalese
  nationals, and INR 10,000 for Nepalese nationals**. Do not publish an annual tuition figure for
  Amrita from this evidence.
- **Recognition evidence:** NAAC A++ (2023) and Institution of Eminence, both asserted on the
  institution's own pages — **corroborate against the UGC/MoE IoE list before publishing either
  badge.** Programme-level accreditation (NBA, INC, NMC) not yet checked.
- **Restrictions found (the most precisely documented in this set):** international admission is
  open to "foreign nationals (persons of foreign origin)" only — an explicit nationality
  restriction; full-time UG applicants **must be aged 17 to 23**; an **AIU equivalency certificate**
  is required where Grade 12 (UG) or the bachelor's degree (PG) was awarded outside India;
  applications must be routed through the AOAP portal and not by email or WhatsApp;
  **Medicine, Ayurveda, Nursing, Live-in-Labs, Internship and Observership are named exceptions**
  to the standard international route.
- **Verdict: GO.** Best-documented eligibility and restriction set of any candidate, which is
  exactly what the India plan's fit-labelling depends on. Package with `on_request` fees and do not
  invent a range. Restrict the first payload to non-exception programmes.

### 3. SRM Institute of Science and Technology

- **Slug:** `srm-institute-of-science-and-technology`
- **Location / type:** Kattankulathur, Chengalpattu (Chennai), Tamil Nadu — Deemed to be
  University; further campuses at Ramapuram, Vadapalani, Tiruchirappalli, Delhi-NCR and
  Baburayanpettai
- **Clusters with published international intake:** engineering & technology, management,
  science & humanities, law, agricultural sciences, design (B.Des), architecture (B.Arch),
  medicine & health sciences (medicine, dentistry, pharmacy, physiotherapy, occupational therapy,
  nursing, public health)
- **International admissions page:** https://www.srmist.edu.in/admission-international/ ;
  per-cluster eligibility at e.g. https://www.srmist.edu.in/admission-international/engineering/ ;
  International Relations route at https://www.srmist.edu.in/ir/international-admission-details/
- **Fee state: `on_request`.** No international tuition figure was found on the international
  admissions pages read. A downloadable international FAQ exists
  (`webstor.srmist.edu.in/.../faqs-ir-international-admissions-2025-2026.pdf`) and should be opened
  by the packaging agent before the fee state is finalised — it may upgrade this to `indicative`.
- **Recognition evidence:** SRMIST's own international page states that admissions conform to AIU
  guidelines and to the Indian statutory bodies (AICTE, Council of Architecture, Pharmacy Council
  of India, Indian Nursing Council, Dental Council of India). Note the page still names the
  "Medical Council of India", the body **superseded by the National Medical Commission** — do not
  reproduce that wording; verify current NMC status independently.
- **Restrictions found:** UG entry requires a qualification recognised by AIU as equivalent to the
  Indian +2 stage, with an AIU eligibility certificate where required; the page enumerates accepted
  foreign qualifications (GCE A-Level, IB Diploma, STPM, Ontario Secondary School Diploma, South
  Australian Matriculation, Canadian provincial senior secondary); **minimum age 17 by 31 December
  of the admission year**; B.Tech requires ≥50% aggregate in PCM (60% for biotechnology/biomedical
  streams), and a Computer Science/IT third subject narrows eligibility to CS programmes only;
  **B.Arch requires NATA or JEE (Main) Paper 2**; PG and PhD entry is "as per AIU norms".
- **Verdict: GO.** Criteria 1, 2, 4 and 5 are clearly met and the subject-level eligibility detail
  is unusually granular. Criterion 3 is the open item — package as `on_request` unless the
  international FAQ PDF yields a current figure.

### 4. Lovely Professional University

- **Slug:** `lovely-professional-university`
- **Location / type:** Phagwara, Punjab — State private university
- **Clusters with published international intake:** computing & engineering, business/management,
  design, agriculture, hotel management, sciences, law
- **International admissions page:** https://www.lpu.in/international/
  (visa/FRRO guidance at https://www.lpu.in/international/visa-frro-faq.php)
- **Fee state: `indicative` at best, more safely `on_request`.** LPU publishes a **fee mechanism**
  rather than a fee table on the international landing page: fees are quoted in USD for applicants
  to whom USD pricing applies, with the initial instalment payable in USD and later semesters in
  USD or INR. Scholarships of up to 60% tuition waiver are offered through the LPUIST scholarship
  test, so any headline figure would be misleading without the waiver context. Find the actual
  per-programme USD table before choosing anything other than `on_request`.
- **Recognition evidence:** the page asserts NAAC A++ and an NIRF position of 31. **Both must be
  year-stamped and verified against naac.gov.in and nirfindia.org before publication** — an
  unstamped NIRF number is exactly the pattern `docs/university-content-spec.md` prohibits.
  The QS/THE positions quoted on the page are self-asserted and should be omitted unless
  independently confirmed.
- **Restrictions found:** LPU maintains **country-specific requirement pages** for roughly two
  dozen origin countries (Afghanistan, Bangladesh, Bhutan, Nepal, Nigeria, Ghana, Sri Lanka,
  Tanzania, Zambia, Zimbabwe, Rwanda, Mongolia, Myanmar, Cameroon and others) plus a separate NRI
  track. This is a genuine nationality-varying rule set and maps directly onto the India plan's
  applicant-origin profile.
- **Verdict: GO.** The strongest fit for the plan's origin-profile work because the restrictions
  are already published per origin country. Weakest on fee determinacy — do not publish a tuition
  number from the landing page alone.

### 5. Sharda University

- **Slug:** `sharda-university`
- **Location / type:** Greater Noida, Uttar Pradesh — State private university
- **Clusters with published international intake:** engineering & computing, business, design,
  law, basic sciences, pharmacy, medical and allied health, nursing
- **International admissions page:** https://www.sharda.ac.in/international
- **Fee state: `indicative` (verify).** Sharda publishes separate Programme Fee, Hostel Fee and
  Transportation Fee pages plus a refund policy in its admissions navigation, so a real fee record
  is reachable; the international landing page itself carries scholarship terms rather than
  figures. The packaging agent must open the Programme Fee page and confirm whether it is scoped
  to international applicants before choosing `confirmed`.
- **Recognition evidence:** UGC-approved; **NAAC A+**; **NBA accreditation for engineering
  programmes**; NIRF 2023 band positions (overall 87, pharmacy 62, management 101-125, engineering
  151-200). Use the NIRF figures **only with the 2023 year attached**. The ASSOCHAM, FICCI, ARIIA
  and QS-Asia items on the page are awards and rankings, not accreditations, and must not go into
  `recognitionBadges`.
- **Restrictions found:** a single published international bar — **minimum 50% in the qualifying
  examination plus the prerequisite subjects for the chosen programme**. Scholarship claims on the
  page ("assured 50%", "minimum 20% assured") are marketing terms with attached conditions and must
  not be restated as guaranteed. Medical programmes remain NEET-gated per the national rule in the
  country block.
- **Verdict: GO.** Good cluster breadth including design and health, published recognition, and a
  reachable fee page. Editorial risk is the page's promotional register — the payload must strip it.

### 6. O.P. Jindal Global University

- **Slug:** `op-jindal-global-university`
- **Location / type:** Sonipat, Haryana — State private university; **Institution of Eminence**
  (asserted on the institution's own masthead; verify against the MoE IoE list)
- **Clusters with published international intake:** law, business, liberal arts, psychology,
  economics, media & journalism, architecture, design, banking & finance, environment,
  **public policy and public health**, languages, international relations
- **International admissions page:** https://jgu.edu.in/internationaloffice/international-students
  (school-level example: https://jgu.edu.in/jsbf/international-aspirants/)
- **Fee state: `on_request`.** JGU's published position is that Indian, NRI and international
  students **pay the same tuition and residential fees** and that there is no NRI or foreign-national
  quota. That is a material, decision-relevant fact worth publishing, but it is not a fee figure —
  per-programme fee pages exist per school and must be opened individually.
- **Recognition evidence:** Institution of Eminence status and UGC recognition as a state private
  university. Programme-level recognition (Bar Council of India for the law programmes in
  particular) was **not** verified in this pass and is a required check before any law programme is
  published.
- **Restrictions found:** UG entry requires 12 years of education recognised in the applicant's own
  country; for IB applicants JGU accepts the **IB Diploma Programme only**, not IB certificates;
  PG entry requires a bachelor's degree plus an **AIU equivalency certificate** for degrees awarded
  outside India; admission is stated to be strictly on merit with no management, donation,
  NRI or foreign-national quota.
- **Verdict: GO.** The single most valuable candidate for cluster diversification — it is the only
  audited candidate covering law, liberal arts, public policy and public health together, and the
  four already-claimed universities cover none of those well. Hold the law programmes until BCI
  recognition is confirmed.

### 7. CHRIST (Deemed to be University)

- **Slug:** `christ-university`
- **Location / type:** Bengaluru, Karnataka (with Delhi-NCR, Pune-Lavasa campuses) — Deemed to be
  University
- **Clusters with published international intake:** commerce & business, computing, engineering,
  law, psychology, media studies, sciences, liberal arts
- **International admissions page:** https://christuniversity.in/admissions/international-students
  (also reachable at https://christuniversity.in/international-students)
- **Fee state: `on_request`.** No international fee table was extractable from the pages read.
- **Recognition evidence:** Deemed to be University; **NAAC A+** (stated on the institution's own
  header). Year of the NAAC cycle not captured — must be pinned before use as a badge.
- **Restrictions found: not yet captured.** The international-admissions page is heavily
  JavaScript-driven and the readable text returned navigation and alumni content rather than
  eligibility rules. Eligibility, entrance-test and nationality restrictions remain **unverified**.
- **Verdict: GO (conditional).** Criteria 1, 2 and 4 hold; criteria 3 and 5 are unmet from this
  pass. Assign only to an agent that can render the page (or locate the international prospectus
  PDF). If eligibility rules cannot be extracted, this drops to HOLD rather than being padded.

---

## HOLD — do not claim yet, with the exact blocking fact

### 8. Shiv Nadar Institution of Eminence

- **Slug:** `shiv-nadar-institution-of-eminence` · Delhi-NCR (Greater Noida), Uttar Pradesh ·
  State private university, **Institution of Eminence (recognised 3 August 2022)**
- Clusters: engineering & computing, natural sciences, management, humanities & social sciences
- **Blocking fact (criterion 1):** no dedicated international-admissions page exists.
  `https://snu.edu.in/admissions/` is a single all-applicant page; `/admissions/international-students/`
  and `/international/` both 404. The institution accepts **SAT and ACT** alongside its own SNUSAT
  and APT tests and national examinations, which is an international-friendly *route* but not a
  published international-admissions *process*.
- **Also missing:** criteria 3 and 5 — no international fee state and no nationality/residency rules found.
- Re-check trigger: an `/international` section appearing, or an international prospectus PDF.

### 9. Ashoka University

- **Slug:** `ashoka-university` · Sonipat, Haryana · State private university
- Clusters: liberal arts & sciences, economics, computer science, psychology, English, history
- **Blocking fact (criterion 1):** no international-applicant page located.
  `/admissions/` resolves, but `/international-students/` and
  `/admissions/undergraduate/international-applicants/` both 404. Criteria 3, 4 and 5 unverified.
- Worth a second discovery pass — Ashoka would fill the liberal-arts cluster if a route exists.

### 10. FLAME University

- **Slug:** `flame-university` · Pune, Maharashtra · State private university
- Clusters: liberal education, business, communication, computing, economics, psychology, design
- **Blocking fact (criterion 1):** `https://www.flame.edu.in/admissions/international-students`
  returns HTTP 200 but serves the **homepage** — a soft-404. There is no readable international
  admissions content behind that URL. Criteria 2-5 unverified.

### 11. World University of Design

- **Slug:** `world-university-of-design` · Sonipat, Haryana · State private university,
  design-specialist (Architecture, Design, Fashion, Communication, Visual Arts, Business,
  Performing Arts)
- **Blocking fact (criterion 1):** `https://www.wud.ac.in/international-students/` returns HTTP 200
  with a **"Page Not Found"** body. An "International Admission" item exists in the admissions
  navigation and a Fee Structure page exists, so a real route may be one URL away.
- This is the highest-value HOLD for cluster coverage: design is otherwise represented only as a
  sub-offering of SRM, LPU and Sharda. Recommend one targeted discovery pass before the pilot closes.

### 12. Chandigarh University

- **Slug:** `chandigarh-university` · Gharuan, Mohali, Punjab · State private university
- **Blocking fact (method, not evidence):** the domain **refused every request** from this
  environment (`curl` exit with HTTP 000 on three separate paths). Nothing about this candidate was
  verified — no route, no fee, no recognition, no restriction. It must not be published from
  third-party aggregator content.
- Re-check requires an agent with browser rendering, not `curl`.

### 13. Sri Ramachandra Institute of Higher Education and Research

- **Slug:** `sri-ramachandra-institute-of-higher-education-and-research` · Porur, Chennai,
  Tamil Nadu · Deemed to be University (health-sciences focused: medicine, dentistry, pharmacy,
  nursing, allied health, **public health**, biomedical sciences)
- **Blocking fact (criterion 1):** both
  `https://www.sriramachandra.edu.in/university/international-admission.php` and
  `https://sriramachandra.edu.in/international-students/` return a ~300-character stub with no
  admissions content.
- **Additional gate (criterion 5):** as a medical candidate this needs the full NMC treatment —
  NEET (UG) eligibility, state and institutional counselling rules, and an explicit statement that
  eligibility varies by nationality and by the applicant's home-country licensing body. Per the
  India plan, medical candidates are eligible "only when their international route, regulator
  requirements, and professional-recognition caveats are complete and specific." None of the three
  are complete here.

### 14. JSS Academy of Higher Education & Research

- **Slug:** `jss-academy-of-higher-education-and-research` · Mysuru, Karnataka · Deemed to be
  University (medicine, dentistry, pharmacy, life sciences, **public health**)
- **Blocking fact (criteria 1-3):** the international page
  (`jssuni.edu.in/JSSWeb/WebShowFromDB.aspx?MODE=INTERNATIONAL`) resolves but returned only ~3.6 KB
  of text with no eligibility, fee or restriction content. Same NMC gate as candidate 13.

### Screened out before audit

- **BITS Pilani** (Deemed, IoE) — admission runs through BITSAT with no separately published
  international route found; would be a `local-only`/test-gated availability record at best.
- **Thapar Institute of Engineering & Technology** (Deemed) — no international page found at the
  paths tried; engineering-only, and the cluster is already well covered by candidates 1-5.

---

## What blocks the pilot

1. **Media rights (criterion 6) are unassessed for every candidate.** No logo or cover image was
   reviewed, and no Cloudinary asset exists for any Indian university. This is a hard gate on all
   seven GO candidates, not a per-candidate note. It needs an explicit rights decision before the
   first payload is packaged.
2. **Fee determinacy is the weakest criterion across the set.** Only KIIT publishes a confirmed,
   currency-stated international fee. Six of seven GO candidates will ship `on_request` or
   `indicative` unless a per-programme fee page is opened. That is schema-legal but it weakens the
   product promise, so the supervisor should decide whether an `on_request`-heavy first release is
   acceptable.
3. **Self-asserted recognition is pervasive.** NAAC grades, NIRF ranks and Institution of Eminence
   claims were read from the institutions' own marketing pages in every case. Under
   `docs/university-content-spec.md` these must be corroborated against naac.gov.in, nirfindia.org
   and the MoE IoE list, with the grade/rank **year** attached, before they enter
   `recognitionBadges`. Award items (ASSOCHAM, FICCI, ARIIA, QS/THE positions) are not
   accreditations and must be excluded.
4. **No work-rights or part-time-earnings content may be published for India.** The Bureau of
   Immigration states that student-visa holders must not engage in employment or business activity.
   This contradicts the "earn while you study" framing used on some other country pages in the
   catalogue and must be enforced at review.
5. **Medical candidates are not pilot-ready.** Both health-specialist candidates (13, 14) are held.
   NEET (UG) is a hard national gate for foreign nationals into MBBS/BDS, and eligibility is
   explicitly conditional on individual state and institution rules — so a generic India medical
   page cannot be written. The plan's instruction to start non-medical should be followed literally.
6. **Two Phase-0 product decisions are still open and gate the public pages, not the payloads:**
   the applicant-origin profile does not yet exist, and the support boundary (information-only vs
   assisted application) has not been set per university. LPU's per-origin-country rules and
   Amrita's foreign-origin-only restriction are the concrete cases that will break a page which
   assumes a universal applicant.

## Recommended claim order

`kiit-deemed-to-be-university` → `op-jindal-global-university` → `amrita-vishwa-vidyapeetham` →
`srm-institute-of-science-and-technology` → `sharda-university` → `lovely-professional-university`
→ `christ-university`.

KIIT first because it is the only candidate that can carry a `confirmed` fee. JGU second because it
is the only one that adds law, liberal arts and public health, and the four already-claimed
universities leave those clusters empty.
