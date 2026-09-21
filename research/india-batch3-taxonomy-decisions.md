# India batch 3: taxonomy decisions (Phase C)

Date: 2026-09-21. Scope: the six batch-3 programme inventories in
`research/india-programme-inventory/`: Jamia Millia Islamia (JMI), Jamia Hamdard (JH), University of
Hyderabad (UoH), Manipal University Jaipur (MUJ), Marwadi University (MU) and BITS Pilani (BITS).
The inventories hold 532 rows.

## Outcome

- **124 distinct `GAP:` proposals across 192 rows** (122 visible proposals plus 2 that were hidden by
  unquoted commas in JMI/JH titles). All are now resolved, and no `GAP:` value remains in
  `canonical_course_match`.
- **14 → existing canonical** (a synonym, a specialisation of an existing parent, or the same
  mapping already used for an integrated programme elsewhere in the batch).
- **53 → a new canonical course created in this batch** (the course is the proposal's exact home).
- **57 → a broader parent** (37 existing parents and 20 of the new parents). Each one has a
  `Taxonomy batch-3: former gap proposal …` note in the row's `notes` column.
- **35 new canonical courses** were added to `lib/data/program-taxonomy.ts` (listed below).
- Consistency fix: the MUJ and UoH MCA rows previously mapped to `msc-computer-science` now map to
  the new exact `mca` course, and each row has a note.
- Row repairs: 12 JMI/JH rows had unquoted commas in the title or notes, which shifted their columns.
  They were re-joined into their correct columns without changing any text.

Principles applied:

1. **Integrated programmes map to the parent for their terminal award.** This follows the UoH
   precedent in the same batch: Integrated M.Sc. → `msc-*`, Integrated M.A. → `ma-*`, Integrated
   M.Tech → `me-mtech-*`, BBA–MBA → `mba`. The offering must state that the programme is entered
   after Class 12.
2. **Specialisations map to their parent.** Examples: M.Tech (CSE) with AI or cyber forensics,
   B.Ed./M.Ed. special education, MBA sectors, and individual-language M.A.s.
3. **A new course is created only for a parent family that serves many universities.** Each new course
   below appears in other India inventories as well (Amity, Amrita, Christ, CU, KIIT, LPU, JSS, SRM,
   SRIHER), or is a regulated award with no honest substitute (BUMS, MD Unani, GNM, D.Pharm,
   M.Pharm).
4. **One-off niche titles map to the nearest broader parent.** No thin single-university courses
   were created. The weakest fit is flagged: JMI's *Diploma in Leather Goods & Footwear Technology*
   maps to `diploma-mechanical-engineering`. The packager should lead with the official title, or
   hold the row if the page would mislead.

## How the new courses ship

`catalogPayloadSchema` needs at least one university per bundle, so a courses-only taxonomy bundle
cannot be validated or applied. No `content:reserve` migration number was used. The new courses
follow the documented mechanism instead:

- **Approval:** the 35 slugs are added to the executable registry `lib/data/program-taxonomy.ts`.
  The publisher rejects any course slug that is not in the registry.
- **Records:** the full course records are in `research/india-batch3-canonical-courses.json`. Each
  record has a generic, university-neutral summary, meets the schema limits and passes the
  focus-keyword rule for its meta title and description. A Phase D university payload that
  references one of these slugs must copy the record **verbatim** into its `courses` array. The
  first bundle applied creates the row, and later bundles overwrite it with the same text.
- `tests/program-taxonomy.test.ts`: the Medical PG / Residency alias rule now excludes
  `unani-medicine`, because MD (Unani) is not a residency. The registry tests pass.
- `be-btech-computer-science-engineering` no longer has the alias "BSc Computer Science", which now
  belongs to `bsc-computer-science`.

## New canonical courses (35)

| Slug | Name | Short name | Stream | Level |
|---|---|---|---|---|
| `bba` | Bachelor of Business Administration | BBA | business | bachelors |
| `bca` | Bachelor of Computer Applications | BCA | computing-information-systems | bachelors |
| `mca` | Master of Computer Applications | MCA | computing-information-systems | masters |
| `bsc-computer-science` | B.Sc. in Computer Science | B.Sc. Computer Science | computing-information-systems | bachelors |
| `bsc-general-sciences` | B.Sc. in General Sciences | B.Sc. General Sciences | natural-sciences | bachelors |
| `me-mtech-computer-science-engineering` | M.E./M.Tech in Computer Science and Engineering | M.E./M.Tech CSE | engineering | masters |
| `be-btech-biotechnology` | B.E./B.Tech in Biotechnology | B.E./B.Tech Biotechnology | engineering | bachelors |
| `me-mtech-biotechnology` | M.E./M.Tech in Biotechnology | M.E./M.Tech Biotechnology | engineering | masters |
| `be-btech-environmental-engineering` | B.E./B.Tech in Environmental Engineering | B.E./B.Tech Environmental | engineering | bachelors |
| `me-mtech-environmental-engineering` | M.E./M.Tech in Environmental Engineering | M.E./M.Tech Environmental | engineering | masters |
| `me-mtech-materials-engineering` | M.E./M.Tech in Materials Engineering | M.E./M.Tech Materials | engineering | masters |
| `me-mtech-energy-engineering` | M.E./M.Tech in Energy Engineering | M.E./M.Tech Energy | engineering | masters |
| `diploma-civil-engineering` | Diploma in Civil Engineering | Diploma Civil Engineering | engineering | diploma |
| `diploma-mechanical-engineering` | Diploma in Mechanical Engineering | Diploma Mechanical Engineering | engineering | diploma |
| `diploma-electrical-electronics-engineering` | Diploma in Electrical and Electronics Engineering | Diploma Electrical & Electronics | engineering | diploma |
| `diploma-computer-engineering` | Diploma in Computer Engineering | Diploma Computer Engineering | engineering | diploma |
| `diploma-chemical-engineering` | Diploma in Chemical Engineering | Diploma Chemical Engineering | engineering | diploma |
| `mpharm` | Master of Pharmacy | M.Pharm | pharmacy | masters |
| `dpharm` | Diploma in Pharmacy | D.Pharm | pharmacy | diploma |
| `bums` | Bachelor of Unani Medicine and Surgery | BUMS | medicine | bachelors |
| `md-unani` | M.D. in Unani Medicine | MD Unani | medicine | masters |
| `diploma-general-nursing-midwifery` | Diploma in General Nursing and Midwifery | GNM | nursing | diploma |
| `msc-nursing` | M.Sc. Nursing | M.Sc. Nursing | nursing | masters |
| `bsc-allied-health-sciences` | B.Sc. in Allied Health Sciences | B.Sc. Allied Health Sciences | public-health-allied-health | bachelors |
| `msc-allied-health-sciences` | M.Sc. in Allied Health Sciences | M.Sc. Allied Health Sciences | public-health-allied-health | masters |
| `bachelor-optometry` | Bachelor's in Optometry | Bachelor's Optometry | public-health-allied-health | bachelors |
| `master-optometry` | Master's in Optometry | Master's Optometry | public-health-allied-health | masters |
| `bachelor-social-work` | Bachelor's in Social Work | Bachelor's Social Work | social-sciences | bachelors |
| `master-social-work` | Master's in Social Work | Master's Social Work | social-sciences | masters |
| `ba-religious-studies` | B.A. in Religious Studies | B.A. Religious Studies | arts-humanities | bachelors |
| `ma-religious-studies` | M.A. in Religious Studies | M.A. Religious Studies | arts-humanities | masters |
| `bachelor-library-information-science` | Bachelor's in Library and Information Science | Bachelor's Library Science | social-sciences | bachelors |
| `master-library-information-science` | Master's in Library and Information Science | Master's Library Science | social-sciences | masters |
| `bachelor-physical-education-sports` | Bachelor's in Physical Education and Sports | Bachelor's Physical Education | education | bachelors |
| `msc-forensic-science` | M.Sc. in Forensic Science | M.Sc. Forensic Science | natural-sciences | masters |

## Additions after Phase D (2026-09-21 publishing fixes)

- **`mcom` course record.** `mcom` was already in the registry but had no course record (not live, not in the
  batch-3 file). A generic record is now in `research/india-batch3-canonical-courses.json`, which released
  Manipal University Jaipur's M.Com (Financial Analysis).
- **New canonical `ba-general-arts`** (B.A. in General Arts, arts-humanities, bachelors). It is the arts
  counterpart of `bsc-general-sciences`: a B.A. in which two or more humanities or social-science subjects
  are studied together, with the combination fixed at admission. Marwadi's BA in Sociology, Psychology and
  Political Science maps here. `bachelor-liberal-arts` was rejected because it describes declared-major
  liberal-arts degrees and its live summary names one university.
- **Existing course records rewritten in 0108.** `bachelor-forestry`, `bachelor-food-science-technology`
  and `master-occupational-therapy` carry new generic summaries and metadata in 0108 (the only batch-3
  bundle that uses them). `msc-environmental-science` moves to the `environment-sustainability` stream,
  matching the registry, in both bundles that use it (0108, 0112). These slugs were already registered, so
  no registry change was needed.
- **Teaching languages.** `hindi`, `sanskrit`, `telugu` and `urdu` were added to `teachingLanguageCodes`
  (`lib/catalogue-facets.ts`) and to the database guard (`drizzle/0079_indian_teaching_languages.sql`), which
  released the University of Hyderabad's 7 language M.A. programmes.

## Decisions: every GAP proposal (124)

Abbreviations for the Rows column: JMI, JH, UoH, MUJ, MU and BITS; `x2` means two rows.

| GAP proposal | Rows | Decision | Canonical used | Reasoning |
|---|---|---|---|---|
| `ba-hindustani-music` | JH | Broader parent (existing) | `bfa` | Performing-arts (music) bachelor's; no performing-arts canonical, BFA is the nearest creative-arts bachelor's parent. |
| `ba-islamic-studies` | JMI, JH | New | `ba-religious-studies` | Islamic studies is a named specialisation of the new religious-studies family (also serves comparative religion/theology). |
| `ba-llb-integrated` | JMI x2, JH | Existing | `llb` | Integrated B.A. LL.B. confers the LL.B.; same mapping as the existing MUJ BA LLB row. |
| `bachelor-business-administration` | MU x4 | New | `bba` | BBA and its specialisations map to the new BBA parent. |
| `bachelor-computer-applications` | MU | New | `bca` | Exact match to the new BCA parent. |
| `bachelor-healthcare-management` | JH | Broader parent (new) | `bba` | Bachelor of Management Studies (Healthcare Management) is an undergraduate management degree; BMS is an alias of the BBA parent. |
| `bachelor-human-resource-management` | JMI | Broader parent (new) | `bba` | B.A. (Hons) HRM is an undergraduate business-management degree; nearest parent is BBA. |
| `bachelor-interior-design` | MUJ | Broader parent (existing) | `bdes` | Interior design is a design discipline; the Bachelor of Design parent covers it without a thin one-off course. |
| `bachelor-library-information-science` | JMI | New | `bachelor-library-information-science` | BLISc is a common standalone award (also in KIIT/LPU inventories); new parent. |
| `bachelor-optometry` | JH, UoH | New | `bachelor-optometry` | Optometry is a distinct licensed eye-care profession offered widely (also Amrita/CU/JSS); new parent. |
| `bachelor-physical-education-sports` | MUJ | New | `bachelor-physical-education-sports` | BPES / sports-science bachelor's recurs across Indian inventories (Amity/KIIT); new parent. |
| `bachelor-public-policy` | JH | Broader parent (existing) | `bachelor-political-science` | No bachelor's public-policy canonical; political science is the nearest UG parent. |
| `bachelor-social-work` | JMI | New | `bachelor-social-work` | BSW is a major professional family (also Amity/Amrita/Christ); new parent. |
| `bba` | JMI, JH, MUJ x2 | New | `bba` | Exact match to the new BBA parent. |
| `bba-integrated-mba` | MUJ | Existing | `mba` | Integrated BBA-MBA terminates in an MBA; consistent with the OP Jindal integrated BBA+MBA mapping. |
| `bca` | JH, MUJ x2 | New | `bca` | Exact match to the new BCA parent. |
| `be-btech-bioinformatics-engineering` | MU | Broader parent (new) | `be-btech-biotechnology` | Bioinformatics engineering is a computational branch of biotechnology engineering; new B.E./B.Tech Biotechnology parent. |
| `be-btech-biotechnology` | MUJ | New | `be-btech-biotechnology` | B.Tech Biotechnology is a large engineering branch with no canonical; new parent. |
| `be-btech-electronics-computer-engineering` | BITS | Broader parent (existing) | `be-btech-electronics-communication-engineering` | Electronics and Computer Engineering is an electronics-core branch; nearest existing parent is ECE. |
| `be-btech-electronics-instrumentation-engineering` | BITS x3 | Broader parent (existing) | `be-btech-electrical-electronics-engineering` | E&I sits in the EEE department family; nearest existing parent is Electrical and Electronics Engineering. |
| `be-btech-environmental-sustainability-engineering` | BITS x3 | New | `be-btech-environmental-engineering` | Environmental and Sustainability Engineering maps to the new B.E./B.Tech Environmental Engineering parent. |
| `be-btech-fashion-technology` | MUJ | Broader parent (existing) | `bachelor-fashion-design` | Fashion technology (apparel design/production) has no engineering parent; nearest home is the fashion family. |
| `be-btech-mathematics-and-computing` | BITS x3 | Broader parent (existing) | `be-btech-computer-science-engineering` | Mathematics and Computing B.E. is a computing-heavy engineering degree; nearest existing parent is CSE. |
| `bed-nursery-education` | JMI | Existing | `bed` | B.Ed. specialisation (nursery education) of the existing B.Ed parent. |
| `bed-special-education` | JMI x2 | Existing | `bed` | B.Ed. specialisation (special education) of the existing B.Ed parent. |
| `bsc-anesthesia-ot-techniques` | JH | New | `bsc-allied-health-sciences` | Anaesthesia & OT technology is an allied-health specialisation; new allied-health parent. |
| `bsc-biochemistry` | JH | Broader parent (existing) | `bsc-biological-sciences` | Biochemistry is a life-science discipline; existing biological-sciences parent (as UoH M.Sc. Biochemistry). |
| `bsc-biomedical-science` | JH | Broader parent (existing) | `bsc-biological-sciences` | Biomedical science is a life-science degree; existing biological-sciences parent. |
| `bsc-cardiology-laboratory-techniques` | JH | New | `bsc-allied-health-sciences` | Cardiac laboratory technology is an allied-health specialisation. |
| `bsc-clinical-research` | JH | Broader parent (new) | `bsc-allied-health-sciences` | No clinical-research canonical; the allied-health parent explicitly covers clinical research as a health-science specialisation. |
| `bsc-computer-science` | JMI, JH | New | `bsc-computer-science` | B.Sc. Computer Science had no bachelor's canonical (only B.E./B.Tech CSE); new parent. |
| `bsc-data-science` | MU | Broader parent (new) | `bsc-computer-science` | B.Sc. Data Science is a science-faculty computing degree; the B.E./B.Tech Data Science parent would misstate the award. |
| `bsc-dialysis-techniques` | JH | New | `bsc-allied-health-sciences` | Dialysis technology is an allied-health specialisation. |
| `bsc-emergency-trauma-care-techniques` | JH | New | `bsc-allied-health-sciences` | Emergency & trauma care technology is an allied-health specialisation. |
| `bsc-general` | JMI | New | `bsc-general-sciences` | Undesignated multi-subject B.Sc.; new general-sciences parent. |
| `bsc-material-science-nanotechnology` | JH | Broader parent (existing) | `bsc-physics` | Materials science/nanotechnology B.Sc. is physics-led; nearest existing parent is B.Sc. Physics. |
| `bsc-medical-imaging-techniques` | JH | New | `bsc-allied-health-sciences` | Medical imaging technology is an allied-health specialisation. |
| `bsc-multidisciplinary-sciences` | MUJ | New | `bsc-general-sciences` | Combined Chemistry/Physics/Mathematics honours admission; new general-sciences parent. |
| `bsc-toxicology` | JH | Broader parent (existing) | `bsc-biological-sciences` | Toxicology is a life-science specialisation; existing biological-sciences parent. |
| `bums` | JH | New | `bums` | BUMS is a regulated professional medical degree (NCISM); new parent. |
| `bvoc-medical-electrophysiology` | JMI | Broader parent (new) | `bsc-allied-health-sciences` | B.Voc. award, but the field is allied-health neuro/cardiac electrophysiology technology. |
| `bvoc-solar-energy` | JMI | Broader parent (existing) | `be-btech-electrical-engineering` | B.Voc. solar energy is electrical/PV technology at bachelor's level; no energy bachelor's canonical. Offering must keep the B.Voc award title. |
| `diploma-chemical-engineering` | MU | New | `diploma-chemical-engineering` | Polytechnic chemical-engineering diploma; new diploma parent. |
| `diploma-civil-engineering` | JMI, MU | New | `diploma-civil-engineering` | Polytechnic civil-engineering diploma; new diploma parent. |
| `diploma-computer-engineering` | JMI, MU | New | `diploma-computer-engineering` | Polytechnic computer-engineering diploma; new diploma parent. |
| `diploma-electrical-engineering` | JMI, MU | New | `diploma-electrical-electronics-engineering` | Electrical diploma maps to the new electrical & electronics diploma parent. |
| `diploma-electronics-engineering` | JMI | New | `diploma-electrical-electronics-engineering` | Electronics diploma maps to the new electrical & electronics diploma parent. |
| `diploma-general-nursing-midwifery` | JH | New | `diploma-general-nursing-midwifery` | GNM is a distinct nursing diploma (not B.Sc. Nursing); new parent. |
| `diploma-information-technology` | MU | Broader parent (new) | `diploma-computer-engineering` | ICT/IT diploma shares the computer-engineering diploma base (alias on the parent). |
| `diploma-leather-footwear-technology` | JMI | Broader parent (new) | `diploma-mechanical-engineering` | Weakest fit: leather-goods & footwear manufacturing technology mapped to the mechanical/production diploma parent; packager must lead with the official title, or hold it if the page would mislead. |
| `diploma-mechanical-engineering` | JMI, MU | New | `diploma-mechanical-engineering` | Polytechnic mechanical-engineering diploma; new diploma parent. |
| `diploma-pharmacy` | JH | New | `dpharm` | D.Pharm is a distinct regulated pharmacy diploma; new parent. |
| `diploma-unani-pharmacy` | JH | Broader parent (new) | `dpharm` | Traditional-medicine (Unani) pharmacy diploma; D.Pharm parent, whose summary flags traditional-system pharmacy diplomas and recognition differences. |
| `gnm-nursing-midwifery` | MU | New | `diploma-general-nursing-midwifery` | Same award as DGNM; new GNM parent. |
| `integrated-llb` | MU x2 | Existing | `llb` | Integrated BA/BCom LL.B. confers the LL.B.; existing LLB parent. |
| `integrated-msc-biological-sciences` | BITS x3 | Existing | `msc-biological-sciences` | Integrated M.Sc. maps to its terminal-award parent (as UoH Integrated M.Sc. Biology); offering must state it is a first degree entered after Class 12. |
| `integrated-msc-chemistry` | BITS x3 | Existing | `msc-chemistry` | Integrated M.Sc. maps to its terminal-award parent (UoH precedent); first-degree entry stated on the offering. |
| `integrated-msc-economics` | BITS x3 | Existing | `master-economics` | Integrated M.Sc. Economics maps to the economics master's parent (UoH Integrated M.A. Economics precedent). |
| `integrated-msc-mathematics` | BITS x3 | Existing | `msc-mathematics` | Integrated M.Sc. maps to its terminal-award parent (UoH precedent). |
| `integrated-msc-physics` | BITS x3 | Existing | `msc-physics` | Integrated M.Sc. maps to its terminal-award parent (UoH precedent). |
| `integrated-msc-semiconductor-nanoscience` | BITS x3 | Broader parent (existing) | `msc-physics` | Semiconductor and nanoscience is a condensed-matter physics specialisation; M.Sc. Physics parent. |
| `ma-comparative-literature` | UoH | Broader parent (existing) | `ma-english-literature` | Comparative literature is literary study taught in English; the English and Literature M.A. parent is nearest. |
| `ma-comparative-religion` | JMI | New | `ma-religious-studies` | Comparative religion is the core of the new religious-studies M.A. parent. |
| `ma-development-communication` | JMI | Broader parent (existing) | `master-media-communication` | Development communication is a media & communication specialisation. |
| `ma-development-studies` | JMI | Broader parent (new) | `master-social-work` | M.A./M.Sc. Development Extension (community/rural development and extension practice) is closest to the social-work master's family. |
| `ma-early-childhood-development` | JMI | Broader parent (existing) | `med-education` | Early childhood development/education master's; nearest parent is Master of Education. |
| `ma-education` | JMI | Existing | `med-education` | M.A. Education is a master's in education; existing M.Ed parent (M.A. award retained on the offering). |
| `ma-educational-planning-administration` | JMI | Broader parent (existing) | `med-education` | Educational planning & administration is an education master's specialisation. |
| `ma-federal-studies` | JH | Broader parent (existing) | `master-political-science` | Federal studies is a political-science specialisation. |
| `ma-gender-studies` | JMI | Broader parent (existing) | `ma-sociology` | Gender studies is an interdisciplinary social-science M.A.; sociology is the nearest parent. |
| `ma-human-resource-management` | JMI | Broader parent (existing) | `mba-human-resource-management` | Discipline match (HRM) at master's level; award differs (M.A.) and is retained on the offering. |
| `ma-human-rights` | JH | Broader parent (existing) | `master-political-science` | Human rights M.A. sits within political science/governance. |
| `ma-human-rights-education` | JMI | Broader parent (existing) | `master-political-science` | Human rights & duties education M.A. sits within political science/governance. |
| `ma-indian-languages` | UoH x7 | Broader parent (existing) | `ma-languages-linguistics` | Individual language M.A.s (Hindi/Telugu/Urdu/Sanskrit) map to the languages parent, as JMI's M.A. Hindi/Urdu/Sanskrit already do. |
| `ma-islamic-studies` | JMI, JH | New | `ma-religious-studies` | Islamic studies is a named specialisation of the new religious-studies M.A. parent. |
| `ma-social-work` | JMI | New | `master-social-work` | MSW is a major professional family; new parent. |
| `march-computer-aided-architectural-design` | MUJ | Broader parent (existing) | `me-mtech-mechanical-engineering` | M.Tech Computer-Aided Analysis and Design is a CAD/CAE engineering M.Tech, not architecture; nearest parent is Mechanical. Row is not_open anyway. |
| `master-interior-design` | MUJ | Broader parent (existing) | `mdes` | Interior design master's maps to the Master of Design parent. |
| `master-library-information-science` | JMI x2 | New | `master-library-information-science` | MLISc/MLIS is the professional librarianship award; new parent. |
| `master-optometry` | JH | New | `master-optometry` | Postgraduate optometry award; new parent (also needed by Chandigarh University). |
| `master-performing-arts` | UoH x5 | Broader parent (existing) | `mfa` | M.P.A. (dance/theatre/music) has no performing-arts canonical; MFA is the nearest creative-arts master's parent. |
| `master-visual-arts` | UoH x4 | Existing | `mfa` | Master of Visual Arts is equivalent to a Master of Fine Arts; existing MFA parent. |
| `mba-pharmaceutical-management` | JMI | Broader parent (existing) | `mba` | MBA specialisation without its own canonical; general MBA parent. |
| `mba-real-estate-management` | MUJ | Broader parent (existing) | `mba` | MBA specialisation without its own canonical; general MBA parent. |
| `mca` | JMI, JH, MU | New | `mca` | Exact match to the new MCA parent. |
| `md-unani` | JH | New | `md-unani` | MD (Unani) is a regulated PG in a traditional system, not an allopathic MD/residency; new parent. |
| `me-mtech-bioinformatics` | UoH, MUJ | Broader parent (new) | `me-mtech-biotechnology` | M.Tech Bioinformatics / Computational Biology maps to the new M.Tech Biotechnology parent (computational-biology alias). |
| `me-mtech-computer-science-engineering` | UoH x3, MUJ x2, MU | New | `me-mtech-computer-science-engineering` | M.Tech CSE (incl. AI and integrated variants) had no canonical; new parent. |
| `me-mtech-energy-science-technology` | MUJ | New | `me-mtech-energy-engineering` | Energy science & technology M.Tech maps to the new Energy Engineering parent. |
| `me-mtech-environmental-engineering` | MUJ | New | `me-mtech-environmental-engineering` | Exact match to the new M.Tech Environmental Engineering parent. |
| `me-mtech-materials-engineering` | UoH | New | `me-mtech-materials-engineering` | Exact match to the new M.Tech Materials Engineering parent (integrated variant keeps its title). |
| `med-special-education` | JMI x2 | Existing | `med-education` | M.Ed. specialisation (special education) of the existing M.Ed parent. |
| `mpharm` | JH x2, MU x3 | New | `mpharm` | Postgraduate M.Pharm after B.Pharm is distinct from integrated-mpharm; new parent. |
| `msc-anesthesia-ot-techniques` | JH | New | `msc-allied-health-sciences` | Allied-health master's specialisation; new parent. |
| `msc-biochemistry` | JMI, JH | Existing | `msc-biological-sciences` | Same mapping as UoH M.Sc. Biochemistry (existing parent). |
| `msc-bioinformatics` | JMI, JH | Broader parent (existing) | `msc-biological-sciences` | Bioinformatics/computational & systems biology M.Sc. in a biosciences department; as UoH M.Sc. Systems & Computational Biology. |
| `msc-biomedical-science` | JH | Broader parent (existing) | `msc-biological-sciences` | Biomedical science is a life-science master's. |
| `msc-biophysics` | JMI | Broader parent (existing) | `msc-biological-sciences` | Biophysics M.Sc. is life-science led; biological-sciences parent. |
| `msc-clinical-research` | JH | Broader parent (new) | `msc-allied-health-sciences` | No clinical-research canonical; the allied-health master's parent explicitly covers clinical research. |
| `msc-dialysis-techniques` | JH | New | `msc-allied-health-sciences` | Allied-health master's specialisation. |
| `msc-disaster-management-climate-sustainability` | JMI | Broader parent (existing) | `master-sustainability` | Disaster management & climate sustainability maps to the sustainability master's parent. |
| `msc-electronics` | JMI | Broader parent (existing) | `msc-physics` | M.Sc. Electronics (electronic science) is physics-based; M.Sc. Physics parent. |
| `msc-forensic-science` | JH | New | `msc-forensic-science` | Forensic science recurs widely (30+ rows in other India inventories); new parent. |
| `msc-medical-laboratory-science` | JH | Broader parent (new) | `msc-allied-health-sciences` | No master's lab-science canonical; allied-health master's parent (lab-technology alias). |
| `msc-medical-radiology-imaging-techniques` | JH | New | `msc-allied-health-sciences` | Allied-health master's specialisation (imaging alias). |
| `msc-neuroscience-cognitive-science` | UoH | Broader parent (existing) | `msc-biological-sciences` | Neuroscience is a life-science discipline; biological-sciences parent (cognitive component described on the offering). |
| `msc-nursing` | JH | New | `msc-nursing` | M.Sc. Nursing is a core postgraduate nursing award; new parent. |
| `msc-pharmacovigilance` | JH | Broader parent (new) | `msc-allied-health-sciences` | Pharmacovigilance sits with clinical research in the allied-health master's parent. Row is not_open anyway. |
| `msc-renewable-energy` | JMI | Broader parent (existing) | `master-sustainability` | M.Sc. (not M.Tech) renewable energy; award-neutral sustainability master's parent. |
| `msc-toxicology` | JH | Broader parent (existing) | `msc-biological-sciences` | Toxicology is a life-science specialisation. |
| `msc-virology` | JMI, JH | Broader parent (existing) | `msc-biological-sciences` | Virology is a life-science specialisation. |
| `mtech-biotechnology` | JH | New | `me-mtech-biotechnology` | Exact match to the new M.Tech Biotechnology parent. |
| `mtech-computational-mathematics` | JMI | Broader parent (new) | `me-mtech-computer-science-engineering` | Computational mathematics M.Tech is computing-focused; M.Tech CSE parent. |
| `mtech-computer-engineering-ai-ml` | JMI | New | `me-mtech-computer-science-engineering` | M.Tech Computer Engineering (AI&ML) maps to the new M.Tech CSE parent. |
| `mtech-computer-science-engineering` | JH | New | `me-mtech-computer-science-engineering` | Exact match to the new M.Tech CSE parent. |
| `mtech-cyber-forensics-information-security` | JH | New | `me-mtech-computer-science-engineering` | Award is M.Tech (CSE) with a specialisation; new M.Tech CSE parent. |
| `mtech-energy-science-technology` | JMI | New | `me-mtech-energy-engineering` | Energy science & technology M.Tech maps to the new Energy Engineering parent. |
| `mtech-environmental-engineering` | JMI | New | `me-mtech-environmental-engineering` | Environmental science & engineering M.Tech; new parent. |
| `mtech-environmental-health-safety-management` | JMI | Broader parent (new) | `me-mtech-environmental-engineering` | Environmental health, risk & safety M.Tech sits within environmental engineering. |
| `mtech-material-science-technology` | JMI | New | `me-mtech-materials-engineering` | Material science & technology M.Tech; new materials parent. |
| `mtech-nanotechnology` | JMI | Broader parent (new) | `me-mtech-materials-engineering` | Nanotechnology M.Tech is a materials specialisation (alias on the parent). |
| `mtech-solid-state-technology` | JMI | Broader parent (new) | `me-mtech-materials-engineering` | Solid-state (semiconductor/materials) technology M.Tech is a materials specialisation. (Row was hidden by an unquoted comma in the title; repaired.) |
| `pgd-medical-laboratory-technology` | MU | Broader parent (new) | `msc-allied-health-sciences` | Postgraduate diploma (below master's level) in lab technology; nearest postgraduate allied-health parent. Offering must show the PG Diploma award. |
| `pre-tib-foundation` | JH | Broader parent (new) | `bums` | One-year Unani foundation route into BUMS; package only as a foundation offering if international eligibility is confirmed (row is unknown). |
