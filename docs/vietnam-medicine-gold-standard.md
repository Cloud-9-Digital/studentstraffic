# Vietnam Medicine gold-standard scope — July 2026

## Objective

Replace legacy Vietnam university copy with admission-useful, source-backed profiles and package
the reviewed records as numbered content migrations. Research and validation remain offline; the
database is updated only in a deliberate `npm run content:migrate -- --apply` window.

"MBBS in Vietnam" is a catalogue/search label. Public profiles must retain the university's actual
award title (normally Doctor of Medicine, Medical Doctor or General Medicine). A university is not
described as an international English MBBS option merely because it teaches Medicine locally.

## Release 1 — validated and packaged

Migration `0003-vietnam-medicine-gold-standard` contains the following four universities:

| University | International route | Current tuition state | Package decision |
| --- | --- | --- | --- |
| Dai Nam University | Six-year, English Medical Doctor programme | USD 5,000/year; no fixed six-year promise published | Ready |
| Dong A University | Six-year, entirely English International Doctor of Medicine | 2026 gross USD 5,000/year, USD 500/year scholarship, fixed net USD 27,000/6 years | Ready |
| Buon Ma Thuot Medical University | 2026 English Medicine intake for foreign high-school graduates | USD 5,500/year for 2026 | Ready |
| Can Tho University of Medicine and Pharmacy | Six-year Medical Doctor route; English and Vietnamese listed | VND 131,890,000/year for 2026–27 | Ready with individual eligibility assessment |

The public fee cards show only academic-year-specific university tuition. Undated partner charges,
estimated hostel/food amounts, visa, travel, insurance and service packages are not university fees
and are excluded until a dated, itemised commercial schedule is supplied and approved separately.

## Existing Vietnam inventory

The repository contains 30 unique medicine-related slugs. Release 1 establishes the quality bar;
the remaining records are a research queue, not approved international MBBS inventory.

### Priority 2 — international-route research

These institutions show enough international or English-programme discovery evidence to justify the
next source review. Each still needs a current official programme, eligibility, intake, fee and
clinical-training packet before migration packaging:

- Hong Bang International University Faculty of Medicine
- Nam Can Tho University Faculty of Medicine
- Phan Chau Trinh University
- Tan Tao University School of Medicine
- VinUniversity College of Health Sciences
- Duy Tan University Faculty of Medicine
- Vo Truong Toan University Faculty of Medicine
- Nguyen Tat Thanh University Faculty of Medicine
- Phenikaa University Faculty of Medicine
- Cuu Long University Faculty of Medicine

### Priority 3 — local/public route qualification

These records must first establish that a current undergraduate Medicine route is open to foreign
applicants and identify its real teaching-language model. Until then, they may remain institutional
profiles but must not be marketed as English international MBBS options:

- Hanoi Medical University
- University of Medicine and Pharmacy at Ho Chi Minh City
- Hue University of Medicine and Pharmacy
- Thai Nguyen University of Medicine and Pharmacy
- University of Health Sciences, Vietnam National University Ho Chi Minh City
- University of Medicine and Pharmacy, Vietnam National University Hanoi
- Pham Ngoc Thach University of Medicine
- Tra Vinh University School of Medicine and Pharmacy
- Vietnam Military Medical University
- Vinh Medical University
- Tay Nguyen University Faculty of Medicine and Pharmacy
- Da Nang University of Medical Technology and Pharmacy
- Hai Phong University of Medicine and Pharmacy
- Thai Binh University of Medicine and Pharmacy
- University of Danang Faculty of Medicine and Pharmacy
- Vietnam University of Traditional Medicine

The two historical VNU-HCMC names resolve to one current identity/slug and must not create duplicate
university records.

## Per-university completion gate

A Vietnam Medicine record reaches `ready` only when one evidence packet establishes:

1. exact institution and official award identity;
2. international applicant availability and teaching-language model;
3. programme-specific academic and English eligibility;
4. application route, required records and current intake/deadline state;
5. academic-year tuition in the original currency, including any fixed-price or scholarship terms;
6. documented clinical phase/facilities without assigning an unsupported hospital guarantee;
7. precise recognition/directory labels that do not convert WDOMS listing into an approval claim;
8. six or more decision-oriented FAQs and eligibility, cost and application lead-capture actions.

Missing hostel, meal, scholarship, loan or placement data does not justify a thin section. The field
is omitted or its confirmed absence is stated in the relevant decision context. Current commercial
partner packages should be maintained as a separate dated internal schedule and must never be
silently blended with university tuition.
