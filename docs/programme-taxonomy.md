# Canonical Programme Taxonomy

This document defines how Students Traffic names and maps the major worldwide university programme
families across health, technology, business, law, architecture, arts, sciences, social sciences,
design, education, agriculture, hospitality, public policy and professional study.
The executable registry is `lib/data/program-taxonomy.ts`. New university offerings must select a
canonical programme from that registry; agents must not invent catalogue names during research.

## Naming model

Every programme offering has two names:

- **Canonical programme name:** the consistent global catalogue label used for navigation,
  filters, related pages and programme grouping.
- **Official programme title:** the exact title published by the university, stored on the offering.

Example:

```text
Canonical programme: B.E./B.Tech in Computer Science and Engineering
Official programme: Bachelor of Engineering in Computer Science and Artificial Intelligence
Award shown by university: BEng
```

Do not rewrite an official award as B.E. or B.Tech. The university's actual title and award must be
the primary programme-page heading for the global audience. B.E./B.Tech labels may remain as
discovery aliases for readers who use that terminology.

## Matching rules

1. Select a canonical slug only after reading the official programme title and curriculum.
2. Aliases are matching suggestions, not automatic approvals.
3. Similar-sounding programmes with materially different curricula must not be merged.
4. A specialisation is a separate offering only when the university publishes it as a distinct
   programme or award. An elective, pathway or concentration inside a general MBA remains mapped to
   `mba` and is described in the programme content.
5. If no approved programme is accurate, hold the offering and propose a taxonomy addition. Do not
   use the nearest incorrect programme. Record the university, exact official programme title,
   award, level, proposed canonical name/slug, primary source and mismatch reason in
   `research/programme-taxonomy-gaps.md`, and reference that row in the university run report.
6. Adding a canonical programme requires a stable slug, globally understandable name, short name, level,
   stream, discipline, aliases, documentation review and a taxonomy test run.

## Qualification levels

The executable registry supports foundation, certificate, diploma, associate, bachelor's,
integrated-master's, postgraduate certificate, postgraduate diploma, master's, doctorate, residency
and professional qualifications. A level describes the actual award; agents must not infer it from
programme duration or entry requirements.

## Global programme-family coverage

The registry includes common UG and PG families for Architecture and Planning, Law, Arts and
Humanities, Social Sciences, Natural Sciences, Mathematics and Statistics, Economics and Commerce,
Design and Creative Arts, Psychology, Public Health and Allied Health, Media and Communication,
Environment and Sustainability, Agriculture and Forestry, Veterinary Science, Education,
Hospitality and Tourism, Aviation/Maritime/Logistics, Public Policy/International Relations and
Information Systems, alongside the existing Medicine, Engineering, Computing and Business scope.

This is broad coverage, not permission to approximate. Universities often use interdisciplinary or
regulated titles that do not fit an existing family exactly. Record those in
`research/programme-taxonomy-gaps.md` for review rather than weakening matching accuracy.

## Current medical catalogue decisions

- The parent category is **Medical PG / Residency**. Both terms are necessary: Medical PG is
  familiar to Indian students, while residency is the term used by many international universities
  and health systems.
- Every item under Medical PG / Residency must still be a named speciality, such as `MD in General
  Medicine / Internal Medicine Residency` or `MS in General Surgery / General Surgery Residency`.
  `Residency` by itself is a category, not a publishable programme.
- International undergraduate medicine awards such as MD, General Medicine and a single-cycle
  Medicine and Surgery degree may map to `mbbs` only after recognition and equivalence checks. The
  public offering must retain its actual award; it must not claim that the university awards an
  Indian MBBS.
- Medical PG offerings map to a named MD/MS speciality and its international residency equivalent.
  `Medical PG / Residency` is the approved parent category, but it is not an individual programme
  that can be published without a speciality.
- A university-level page saying only that it offers residency or postgraduate training is not an
  official programme source. Hold it until the speciality, award, eligibility and programme URL are
  verified.
- `B.Sc. Nursing` groups equivalent first-entry professional nursing bachelor's awards while keeping
  the exact official award on the offering.
- Bachelor of Pharmacy and an integrated/single-cycle Master of Pharmacy are separate canonical
  programmes. They must not continue to share one generic `pharmacy` mapping.

## Approved postgraduate scope

Postgraduate programmes are a first-class catalogue scope, not an optional extension. The registry
covers common M.Sc. computing programmes, discipline-specific M.E./M.Tech Engineering groups,
Engineering Management, non-MBA Business master's programmes, MBA specialisations, Medical PG /
Residency specialities and integrated-master Pharmacy programmes.

Research and publish both undergraduate and postgraduate programmes offered by the selected
university when each programme has an exact approved canonical match and current primary-source
evidence. Do not omit a valid master's programme merely because the university also offers a related
bachelor's degree. Equally, do not map a specialised master's programme to a broad or inaccurate
canonical label. Hold it and propose a reviewed taxonomy addition when no exact match exists.

Programme pages and metadata must use the official programme title where the page describes one
specific university offering. Catalogue and discovery pages may use the canonical programme name.

## Shipping new canonical courses (India batch 3, 2026-09-21)

A catalogue payload must contain at least one university, so new canonical courses are not shipped in
a courses-only bundle. A new course is shipped in two steps:

1. Add the approved slug, name, short name, stream, level, discipline and aliases to
   `lib/data/program-taxonomy.ts`, then run `node --import tsx --test tests/program-taxonomy.test.ts`.
2. Keep the full course record in a reusable research file. The record includes the duration, a
   generic university-neutral summary, the meta title and the meta description. Copy it verbatim
   into the `courses` array of every university payload that references the slug. Publishing
   overwrites the shared course row, so the text must stay identical across bundles.

Batch 3 added 35 parent families: BBA, BCA, MCA, B.Sc. Computer Science, B.Sc. General Sciences,
M.Tech CSE/Biotechnology/Environmental/Materials/Energy, B.Tech Biotechnology/Environmental,
polytechnic diplomas, M.Pharm, D.Pharm, BUMS, MD Unani, GNM, M.Sc. Nursing, allied health,
optometry, social work, religious studies, library science, physical education and M.Sc. Forensic
Science. Their records are in `research/india-batch3-canonical-courses.json` and the mapping
rationale is in `research/india-batch3-taxonomy-decisions.md`. Traditional-system postgraduate
degrees (MD Unani) are not residencies, so the Medical PG / Residency alias rule excludes them.

The publishing fixes for batch 3 added the generic `mcom` record and one more parent family,
`ba-general-arts` (a B.A. with two or more humanities or social-science subjects fixed at admission,
the arts counterpart of `bsc-general-sciences`). Do not map a combined-subject B.A. to
`bachelor-liberal-arts`, which is for declared-major liberal-arts degrees.

## India batch 4 additions (2026-10-22)

`bsc-horticulture` (B.Sc. in Horticulture) was added for Kalasalingam Academy of Research and
Education's B.Sc. (Hons.) Horticulture. In India, ICAR treats Horticulture as a separate four-year
degree from B.Sc. (Hons.) Agriculture, with its own curriculum, so it is not mapped to
`bsc-agriculture`. The shared course record is in `research/india-batch4-kare-canonical-courses.json`
and was first shipped in content migration 0117 (Joy University); 0118 carries the same record.

## Tamil Nadu university continuation (2026-10-24)

`integrated-mtech-biotechnology`, `integrated-mtech-computer-science-engineering` and
`integrated-mtech-geoinformatics` are school-entry engineering families at the
`integrated-masters` level. They combine undergraduate and advanced master's study and remain
separate from postgraduate two-year M.E./M.Tech families requiring an existing degree.
Each offering retains its official award title and institution-specific duration. Reusable,
university-neutral records are in `research/india-bdu-canonical-courses.json`.

The Engineering Data Science family's default duration was corrected to four years in the
Panimalar/SNU Chennai continuation. Older shared records had carried a three-year default;
the verified B.E./B.Tech offerings themselves retain their four-year durations.


### Bharathiar postgraduate mappings — 24 October 2026

Added university-neutral master's families `msc-electronics-instrumentation`, `master-educational-technology`, `master-career-guidance` and `master-gender-studies`. E-Learning Technology maps to Educational Technology; Career Guidance lateral entry retains its official title and one-year duration as a separate offering under the same master's category. Gender Studies includes Women's Studies as an alias. Biological-science specialisations map to `msc-biological-sciences`; Medical Biotechnology maps to `msc-biotechnology`; Biostatistics to `msc-statistics`; Medical Physics to `msc-physics`; Nanoscience and Technology to the dedicated `msc-nanoscience-technology` family. Exact programme titles are preserved in migration 0187. These decisions do not imply accreditation or international entrance exemptions.

The same batch adds `msc-information-technology` and `msc-nanoscience-technology` rather than compressing technically distinct IT and nanoscience awards into Information Systems or Materials Science.


### Law and policy postgraduate diplomas (2026-10-25)

`pg-diploma-law-policy` covers graduate-entry diplomas in specialised law and policy, including fisheries governance. It uses the `postgraduate-diploma` level and `law` stream, distinct from a practising-lawyer qualifying LLB or an LLM. Programme records retain exact specialisation, hybrid delivery, attendance requirements and national eligibility.


### B.Sc. Data Science (25 October 2026)

`bsc-data-science` is a university-neutral bachelor's family in `computing-information-systems`, distinct from `bsc-computer-science` and the four-year engineering family `be-btech-data-science`. Remove `BSc Data Science` from both former alias sets: the same award must not resolve to two unrelated families. Engineering aliases now name B.Tech./B.Eng. qualifications explicitly. HITS B.Sc. Data Science maps to the dedicated science degree family, with its verified three-year duration stored on the offering; B.Tech. AI and Data Science retains the engineering family and four-year duration. Historical applied payloads remain immutable; pending bundles use the corrected aliases.


### 2026-10-25 AMET degree families

Added generic degree families for undergraduate Marine Engineering, undergraduate/postgraduate Naval Architecture and Offshore Engineering, postgraduate Petroleum Engineering, B.E./B.Tech Food Technology, B.Sc Aviation, B.Sc AI and Machine Learning, and B.Sc Robotics and AI. These preserve award level and field rather than substituting engineering, management or computing families with a different degree discipline. B.Sc AI/Data Science maps to the existing Data Science family; M.E Power Systems maps to the existing Electrical Engineering family. University-specific names, eligibility, language and programme duration stay on offerings. Seagoing or professional licences are not inferred from degree taxonomy.



### Fisheries science and engineering (25 October 2026)

Distinct generic `bachelor-fisheries-science` and `master-fisheries-science` categories retain the fisheries-science qualification at bachelor and master levels. Fisheries engineering uses `be-btech-fisheries-engineering` and `me-mtech-fisheries-engineering`; the latter covers postgraduate aquacultural engineering and fish-process engineering specialisations. These categories are distinct from marine engineering, marine biology and general agriculture, and use university-neutral shared summaries.

### Physical education, coaching and Yoga qualifications (25 October 2026)

`bachelor-physical-education` represents the B.P.Ed. qualification, including graduate-entry bachelor routes; it remains at bachelor level and is distinct from the existing BPES physical-education-and-sports category. `bachelor-sports-coaching` represents coaching-focused bachelor awards. `bsc-yoga` and `msc-yoga` distinguish science qualifications in Yoga by level and do not imply medical licensure or an English-only track. All shared summaries are university-neutral.

### Engineering physics, design engineering and integrated engineering families (25 October 2026)

IIITDM Kancheepuram's current programme directory and 2026 reporting instructions distinguish four-year B.Tech Design Engineering and Engineering Physics from B.Des and B.Sc Physics. University-neutral `be-btech-design-engineering` and `be-btech-engineering-physics` preserve those science-and-engineering qualifications. Smart Manufacturing reuses Industrial and Production Engineering; M.Tech specialisations reuse their CSE, ECE or Mechanical Engineering parents.

Five-year B.Tech/M.Tech dual degrees use integrated-master's families: existing `integrated-mtech-computer-science-engineering`, plus `integrated-mtech-electronics-communication-engineering` and `integrated-mtech-mechanical-engineering`. Official programme titles retain both awards and the named master's specialisation. The CSE generic family's historical six-year default does not override the verified five-year IIITDM offering. No university-specific course family is added.


### IMU maritime award families — 25 October 2026

Added Diploma in Nautical Science (one-year diploma), Postgraduate Diploma in Marine Engineering (one-year graduate conversion award), and M.E./M.Tech in Dredging and Harbour Engineering (two-year master’s). DNS leads towards later B.Sc. Applied Nautical Science stages and must not be classified as a one-year bachelor’s. Graduate Marine Engineering is a postgraduate diploma, not a B.Tech. Naval architecture/ocean and shipbuilding degrees use the existing naval architecture engineering families; M.Tech. Marine Technology uses the marine-engineering master’s family. Campus and admission audience remain offering data.


### Computer and communication engineering — 25 October 2026

Added the generic B.E./B.Tech in Computer and Communication Engineering family for the combined computing and communications engineering award. It is not an institution-specific branded specialisation. Sri Sairam’s CSE IoT and Computer Science and Business Systems offerings retain their exact titles under the existing CSE parent; Cyber Security and AI/ML use their existing specialist families. Integrated M.Tech remains distinct from two-year engineering master’s and was not published without its own verified medium.


### Science, interdisciplinary engineering and dedicated cybersecurity awards — 25 October 2026

IIT Madras exact awards require dedicated Bachelor of Cybersecurity, science bachelor families in Electronics, Aerospace Science and Medical Sciences and Engineering, and integrated Aerospace/Design Engineering master's families. These preserve award type: B.Cyber is not B.Tech, BS Medical Sciences and Engineering is not MBBS, and non-campus BS Aeronautics is not an operational Aviation degree. Actual delivery, eligibility and verified duration remain offering-level facts.

Development Studies uses a social-sciences master family. Engineering master's families in Applied Mathematics, Complex Systems, Computational Engineering and Quantum Technology reflect distinct disciplinary curricula; regular Data Science and AI reuses the engineering CSE parent, not MSc Data Science. Ocean Structures/Technology reuse Naval Architecture engineering; other named engineering specialties reuse their appropriate parent. No institution brand, funding category, admission mode or minor creates a new family.


### Integrated undergraduate science and teacher education — 25 October 2026

`integrated-bsc-bed` represents the four-year undergraduate-entry B.Sc. B.Ed. dual-major science/teacher-education qualification at bachelor level. It is distinct from graduate-entry standalone B.Ed. and from an integrated master's. NIT Tiruchirappalli's Physics, Chemistry and Mathematics routes have separate applications, preferences and major-level seats at admission; each retains its exact title under this subject-neutral family. A later three-year BSc exit is progression, not a separate direct admission offering. NCTE's original SRC decision naming BSc BEd supersedes the erroneous BA BEd label in an older compiled table; the provenance is recorded in the institution's source audit.

VISTAS source reconciliation (25 October 2026) adds neutral `bachelor-music`,
`master-performing-arts` and `master-astrology` families. A BA music award retains the
bachelor's level; an MA in a performing art belongs to the master's performing-arts
family and must not be relabelled as an MFA. Astrology is recorded as its own arts
and humanities subject, with academic curriculum descriptions and no unsupported
predictive, clinical or professional outcomes. Exact award title, duration,
qualifying route, language and institution remain offering-level facts.

The neutral `bsc-information-technology` family records the science bachelor's
award in Information Technology. Its BSc aliases were removed from the engineering
`be-btech-information-technology` family: a BSc IT award is distinct from a BE or
BTech IT award. Duration and admission requirements remain offering-level facts.

`msc-hospital-administration` preserves the exact science master's award in
hospital administration. It is distinct from an MBA or a clinical medical degree;
its curriculum and career descriptions must not imply a licence to practise medicine.

The neutral postgraduate diploma families in Human Resource Management and Business
Management preserve the diploma award and level; they are not master's or MBA
families. `integrated-msc-software-systems` records the five-year HSC-entry science
master's award, distinct from graduate-entry software engineering master's degrees.
Programme-specific duration, language and intake evidence remain mandatory even
when a family exists; taxonomy availability does not clear an evidence hold.

`be-btech-fashion-technology` represents the engineering bachelor's award in
Fashion Technology, covering technical apparel and manufacturing study. It is
distinct from non-engineering fashion design awards and from Textile Technology;
the exact curriculum, duration and entry route remain institutional facts.


### Agriculture science and engineering awards (25 October 2026)

`bsc-sericulture` preserves the science degree in silk production and silkworm
rearing; `bsc-agribusiness-management` preserves an agricultural science award
that combines production knowledge with business study. The latter is distinct
from a Bachelor of Business Administration. `me-mtech-agricultural-engineering`
is the engineering master's counterpart to the existing agricultural engineering
bachelor family. More specific food technology and energy engineering parents
remain available where they fit the actual specialism.

`phd-agriculture-allied-sciences` covers original research in agricultural,
horticultural and forestry disciplines. Use existing engineering, business or
natural science doctoral parents where those describe the actual research field
more accurately. A doctorate's offering must distinguish minimum registration
from expected or guaranteed completion, and must not infer full-course tuition
from a minimum residential period.

`bachelor-visual-arts` preserves B.V.A. and other visual-arts bachelor's awards,
covering studio practice, visual expression and critical study without relabelling
an institution's B.V.A. as B.F.A. `master-art-history` covers academic master's
study of art history, visual culture and historical interpretation, including
M.A. History of Fine Arts. It is distinct from a practice-based Master of Fine
Arts. Exact award names, entry qualifications and duration remain offering facts.


`be-btech-poultry-technology` preserves the engineering bachelor's award in Poultry
Technology, including the older Poultry Production Technology name. It combines
poultry production with hatchery systems, feed processing, equipment and industrial
training. It is distinct from a veterinary degree or a non-engineering poultry
science award. Exact campus, entry route, instruction language and fees remain
programme-level facts.

### Non-MBA master's Human Resource Management

`master-human-resource-management` covers academic master's awards such as M.A. Human Resource Management and MHRM. Keep the exact institutional award title. It is distinct from `mba-human-resource-management`, which represents an MBA award, and from the postgraduate diploma family. HRM study may cover recruitment, organisational behaviour, employment relations, people development and analytical methods; curriculum and entry requirements vary by institution.

### Science and engineering awards in AI and cyber security

`be-btech-artificial-intelligence-machine-learning` and `be-btech-cyber-security`
represent engineering bachelor's awards. A B.Sc. in Artificial Intelligence or
Cyber Security must not resolve to these parents merely because the subject names
overlap. The incorrect science-award aliases have been removed from these two
registry entries. Use a suitable science family for a verified B.Sc. award, and
retain the exact degree title and curriculum scope in its offering. Historical
applied content bundles remain immutable; any published mapping correction needs
a forward migration after an offering-title audit.

## Defence and Strategic Studies

`bachelor-defence-strategic-studies` is the neutral undergraduate family for a distinct Defence and Strategic Studies award. It covers national defence, security policy, military strategy, geopolitics and related international relations; it does not imply military recruitment, professional appointment or a postgraduate qualification. Preserve each institution's exact award title and verified duration separately. International Relations and Political Science remain separate families.

## Home Science and postgraduate Music

`bachelor-home-science` and `master-home-science` cover interdisciplinary Home Science
and Community Science awards. Study can combine household resource management,
human development, community education and applied scientific methods. Use the
existing specialised nutrition, fashion design or psychology family when that is
the actual discipline; membership of a Home Science faculty alone does not change
an unrelated qualification. The Home Science families use the nearest existing
`natural-sciences` stream and the `home-science` discipline. Preserve an institution's
exact B.Sc./M.Sc. specialty, campus, duration and qualification requirements in its
offering. An interior-design and resource-management Home Science award must not
be relabelled as a professional architecture degree.

`master-music` covers academic and performance master's awards in Music, including
M.A. Music and Master of Music. It uses `design-creative-arts`, the `music` discipline
and the master's level, matching the existing bachelor's Music family. Musical
traditions, performance requirements, language and entry experience remain
programme facts. It does not convert a dance award into Music or a vocational
award into an academic science or engineering degree.

`me-mtech-food-technology` preserves engineering master's awards in Food Technology,
using the `engineering` stream, master's level and `food-technology` discipline.
Study can cover food processing operations, preservation, process equipment,
quality systems and engineering research. It is distinct from a science award in
Nutrition or Food Science and from a general Agricultural Engineering master's.
Keep each institution's exact qualifying engineering/science degree list and
entrance conditions; the family does not imply that every science graduate is
eligible for an engineering master's.
