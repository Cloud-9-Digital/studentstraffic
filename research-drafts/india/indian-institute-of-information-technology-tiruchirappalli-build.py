"""Build content-migrations/0407-india-indian-institute-of-information-technology-tiruchirappalli/payload.json.

Owner claude-tn-iiitt-20261027. Checked 2026-10-27. Run from repo root:
    python3 -I research-drafts/india/indian-institute-of-information-technology-tiruchirappalli-build.py
Research packet: tn-fresh10-20261027 (PR #3); DASA brochure, seat matrix and fee sheets re-read on 2026-10-27.
Source copies: research/india-source-bundles/indian-institute-of-information-technology-tiruchirappalli/
"""
import csv
import glob
import json
import os

ROOT = os.getcwd()
MIG = "0407-india-indian-institute-of-information-technology-tiruchirappalli"
OUT = os.path.join(ROOT, "content-migrations", MIG, "payload.json")
D = "2026-10-27"
REVIEW = "2027-01-31"
SLUG = "indian-institute-of-information-technology-tiruchirappalli"
NAME = "Indian Institute of Information Technology Tiruchirappalli"

SITE = "https://iiitt.ac.in/"
ABOUT = "https://iiitt.ac.in/about"
HOSTEL = "https://iiitt.ac.in/hostel"
UG = "https://iiitt.ac.in/admission_ug"
UGJSON = "https://iiitt.ac.in/json/admission/ug.json"
PROGS = "https://iiitt.ac.in/programs"
BROCHURE = "https://cdnbbsr.s3waas.gov.in/s305a70454516ecd9194c293b0e415777f/uploads/2026/06/202607281804466532.pdf"
MATRIX = "https://cdnbbsr.s3waas.gov.in/s305a70454516ecd9194c293b0e415777f/uploads/2026/07/20260730113349078.pdf"
DASA_FEE = "https://store.iiitt.ac.in/downloads/admission/IIITT-Fee%20Structure%20for%20the%20AY-202627%20ODD%20Semester_%20DASA.pdf"
REPORTING = "https://store.iiitt.ac.in/downloads/admission/DASA%20-%20First%20yearr%20Reporting%20details%202026-27%20-1.pdf"
HOSTEL_RULES = "https://store.iiitt.ac.in/downloads/hostel/Hostel%20Residents%20Rules%20and%20Regulation_IIITT-2024-2025.pdf"
LOK = "https://sansad.in/getFile/loksabhaquestions/annex/10/AU1873.pdf?source=pqals"
ACT = "https://www.indiacode.nic.in/handle/123456789/2245"

FEE_NOTE = (
    "The 2026-27 DASA fee sheet prices first-semester tuition by category: INR 1,15,200 for CIWG, USD 4,000 for Non-SAARC and USD 2,000 for SAARC students. "
    "A further INR 92,000 is due in the first semester for one-time charges (INR 32,400, including refundable deposits), additional institute fees "
    "(INR 14,000) and hostel and mess advance (INR 45,600). These are first-semester amounts, not annual tuition, so annual tuition is on request. "
    "The category is set by the DASA candidate tag."
)

# slug suffix, canonical, official title, DASA matrix label, seats Non-CIWG, seats CIWG, curriculum phrase
ROWS = [
    ("btech-computer-science-engineering", "be-btech-computer-science-engineering", "B.Tech. Computer Science and Engineering", 9, 5),
    ("btech-computer-science-engineering-ai-data-science", "be-btech-data-science", "B.Tech. Computer Science and Engineering (Artificial Intelligence and Data Science)", 9, 5),
    ("btech-electronics-communication-engineering", "be-btech-electronics-communication-engineering", "B.Tech. Electronics and Communication Engineering", 6, 3),
    ("btech-electronics-communication-engineering-vlsi-design", "be-btech-electronics-communication-engineering", "B.Tech. Electronics and Communication Engineering (VLSI Design)", 6, 2),
]


def programme(row):
    suffix, canon, title, non_ciwg, ciwg = row
    return {
        "slug": f"iiitt-{suffix}",
        "canonicalCourseSlug": canon,
        "officialTitle": title,
        "durationYears": 4,
        "fee": {"status": "on_request", "verifiedAt": D, "notes": FEE_NOTE},
        "officialProgramUrl": UG,
        "audienceEligibility": {
            "availability": "restricted",
            "eligibleAudiences": [
                "Foreign nationals admitted through DASA 2026",
                "OCI and PIO candidates admitted through DASA 2026",
                "Non-resident Indians admitted through DASA 2026, with the prescribed two years of schooling abroad",
                "Children of Indian Workers in Gulf (CIWG) admitted against the CIWG seats",
            ],
            "restrictions": [
                "This record covers the DASA route only; seats reach you through DASA seat allocation, with a valid JEE (Main) 2026 Paper 1 score and rank.",
                "Indian nationals and OCI/PIO(I) candidates need at least two years of education, including Classes 11 and 12, in a foreign country during the last eight years.",
                "Candidates must have been born on or after 1 October 2001 for the 2026 cycle, with 75 per cent (CGPA 7.5/10) in Class 12 across five subjects.",
                "The 2026 cycle is complete; the next cycle's rules and seats are not yet published.",
            ],
            "notes": f"The 2026 DASA seat matrix lists {non_ciwg} Non-CIWG and {ciwg} CIWG seats for this branch. Admission through other central counselling routes is not described in this record.",
            "verifiedAt": D,
            "sourceUrl": BROCHURE,
        },
        "admissionsContent": {
            "overview": f"The {title} is a four-year degree. The 2026 DASA matrix lists seats in it for Non-CIWG and CIWG candidates. Admission follows DASA registration, document verification, choice filling and seat allocation, then physical reporting at the institute.",
            "eligibility": {
                "intro": "These conditions come from the DASA 2026 brochure, which governed the completed 2026-27 admission cycle.",
                "items": [
                    "Valid JEE (Main) 2026 score card and rank for Paper 1 (B.E./B.Tech.)",
                    "Class 12 or equivalent with Mathematics, Physics and one of Chemistry, Biotechnology, Computer Science or Biology",
                    "At least 75 per cent (CGPA 7.5 out of 10) in aggregate across five Class 12 subjects",
                    "Born on or after 1 October 2001",
                    "Foreign nationals may have studied in any country; Indian nationals and OCI/PIO(I) need two years of schooling abroad, including Classes 11 and 12",
                ],
            },
            "applicationSteps": [
                "Register on the DASA 2026 portal (csab.nic.in) with your JEE (Main) 2026 application details and pay the registration fee",
                "Upload category-specific documents, answer verification queries, then fill and lock your branch choices",
                "Accept the allotted seat in the DASA rounds and pay the institute and hostel fees by NEFT or UPI as the institute's reporting guide directs",
                "Report in person with original documents; 2026 reporting was on 20 and 21 August 2026, with classes from 24 August 2026",
            ],
            "documentsRequired": {
                "academic": [
                    "Class 10, Class 11 and Class 12 mark sheets",
                    "School certificate confirming completion of Classes 11 and 12 in the DASA format",
                    "Percentage or CGPA equivalence from the examining authority where grades or another scale apply",
                    "Proof of two years of education abroad for NRI and OCI/PIO(I) candidates",
                ],
                "application": [
                    "JEE (Main) admit card and score card, and the DASA provisional admission letter",
                    "Passport, date-of-birth proof, medical certificate in the DASA format and OCI card or visa where applicable",
                    "For CIWG: the parent's passport, visa, work permit and employer certificate for Gulf employment",
                ],
            },
            "deadlinesNote": "The 2026 DASA cycle is complete: online document submission ran 18 to 21 August 2026 and classes began on 24 August 2026. No later cycle dates are inferred from these.",
            "reportedFeeQuote": {
                "currency": "USD",
                "minAmount": 2000,
                "maxAmount": 4000,
                "status": "confirmed",
                "period": "semester",
                "componentBasis": "First-semester tuition only: USD 2,000 for SAARC and USD 4,000 for Non-SAARC DASA students; CIWG students pay INR 1,15,200. A further INR 92,000 of one-time, institute, hostel and mess charges is due separately.",
                "audience": "international",
                "category": "DASA SAARC and Non-SAARC",
                "academicYear": "2026-27 odd semester",
                "sourceUrl": DASA_FEE,
                "sourceLabel": "IIIT Tiruchirappalli DASA fee structure 2026-27 (first semester)",
                "verifiedAt": D,
            },
        },
        "medium": "",
        "instructionLanguages": [],
        "intakeMonths": [],
        "intakeCodes": [],
        "feeVerifiedAt": D,
        "feeNotes": FEE_NOTE,
        "teachingPhases": [
            {"phase": "Four-year full-time programme", "language": "",
             "details": "Eight semesters of full-time study on the Sethurapatti campus; the first-year cohort of 2026 reported on 20 and 21 August 2026."}
        ],
    }


PROGRAMMES = [programme(r) for r in ROWS]

UNIVERSITY = {
    "countrySlug": "india",
    "slug": SLUG,
    "name": NAME,
    "city": "Tiruchirappalli",
    "type": "Public",
    "establishedYear": 2013,
    "officialWebsite": SITE,
    "mediaAttribution": {},
    "summary": (
        "IIIT Tiruchirappalli is a not-for-profit public-private-partnership institute at Sethurapatti in Tamil Nadu, started in 2013 and "
        "an Institute of National Importance under the IIIT (Public-Private Partnership) Act, 2017. It offers B.Tech. programmes in computing "
        "and electronics, M.Tech. programmes and doctoral research."
    ),
    "campusLifestyle": (
        "The institute has worked from its permanent Sethurapatti campus on the Trichy-Madurai highway since June 2021. Its hostel page lists "
        "a residence hall, a mess hall and a gym. Before that it ran from temporary premises at NIT Tiruchirappalli from 2016 and at "
        "Oxford Engineering College from 2020, so older references to those addresses are out of date."
    ),
    "cityProfile": (
        "The permanent campus is at Sethurapatti on the Tiruchirappalli-Madurai highway, Tamil Nadu 620012. The institute's 2026 reporting guide "
        "puts it about 20 km from Tiruchirappalli Junction and the Central bus stand, with buses to most of Tamil Nadu, southern Karnataka and Kerala."
    ),
    "practicalExposure": (
        "IIIT Tiruchirappalli describes an agreement with SVNIT Surat covering joint research, academic activities and innovation, with internship "
        "opportunities for B.Tech. and M.Tech. students among its stated scope. These are opportunities within the collaboration, not a guarantee "
        "of an internship or placement. Industry partners named by the institute are TCS, Cognizant, Infosys, Ramco Systems, ELCOT and Navitas."
    ),
    "hostelOverview": (
        "First-semester hostel payments for 2026-27 are INR 45,600: hostel admission fee INR 1,200, establishment charges INR 7,200, licence, "
        "electricity and water INR 13,200 and a mess advance of INR 24,000. A refundable hostel deposit of INR 4,800 is charged once. "
        "Rooms are allotted by the warden, and residents sign in and out; the 2024-25 rules prohibit cooking and heaters, kettles and air conditioners in rooms."
    ),
    "dietarySupport": (
        "The mess serves breakfast 7:00 to 9:00 am, lunch noon to 2:00 pm, snacks 4:45 to 6:00 pm and dinner 7:00 to 9:00 pm, under the 2024-25 "
        "hostel rules, which allow no relaxation of timings. Complaints go to the warden. The institute publishes no menu or provision for "
        "specific regional, religious or medical diets."
    ),
    "safetyOverview": (
        "The hostel rules treat ragging as a cognizable offence and encourage residents to report it immediately; admitted students also "
        "file an anti-ragging declaration. Boys' hostel residents must be back by 10:00 pm, visitors sign the book at the entrance, and emergency "
        "contact numbers are given at room allotment."
    ),
    "studentSupport": (
        "The admissions pages give reporting instructions, a hostel accommodation form and a cancellation form, and link to the National Scholarship "
        "Portal notice for 2026-27. Admission does not guarantee a scholarship. Students Traffic counselling can help you compare routes and prepare "
        "documents."
    ),
    "whyChoose": [
        "A focused B.Tech. portfolio in computer science, AI and data science, and electronics with VLSI, taught at a statutory Institute of National Importance.",
        "DASA seats are set aside for foreign nationals, OCI/PIO candidates, NRIs and CIWG children, with published tuition by category.",
        "A permanent campus about 20 km from Tiruchirappalli Junction, with hostel and mess charges published.",
    ],
    "thingsToConsider": [
        "DASA admission needs a valid JEE (Main) score, 75 per cent in Class 12 and, for Indian nationals and OCI/PIO(I), two years of schooling abroad.",
        "The DASA matrix offers only 6 to 9 Non-CIWG and 2 to 5 CIWG seats per branch, so places are few.",
        "Published fees are for the first semester only and exclude a further INR 92,000 of other charges, so they are not annual tuition.",
    ],
    "bestFitFor": [
        "NRIs, OCI/PIO candidates and foreign nationals with a JEE (Main) score who want a computing or electronics B.Tech. in Tamil Nadu.",
        "Children of Indian workers in the Gulf who qualify for CIWG seats and can document a parent's employment.",
        "Students comfortable with a residential campus outside the city centre.",
    ],
    "industryPartners": ["Tata Consultancy Services", "Cognizant Technology Solutions", "Infosys", "Ramco Systems", "ELCOT", "Navitas (TAKE Solutions)"],
    "recognitionBadges": [
        "Government of India - Institute of National Importance (IIIT Public-Private Partnership Act, 2017)",
    ],
    "recognitionLinks": [
        {"label": "Indian Institutes of Information Technology (Public-Private Partnership) Act, 2017 (India Code)", "url": ACT},
    ],
    "faq": [
        {"question": "Is IIIT Tiruchirappalli a government institute?",
         "answer": "It is a not-for-profit public-private-partnership institute funded by the Government of India, the Tamil Nadu government and industry partners in a 50:35:15 ratio. The IIIT (Public-Private Partnership) Act, 2017 lists it in its Schedule and declares it an institution of national importance."},
        {"question": "Where is the IIIT Tiruchirappalli campus?",
         "answer": "At Sethurapatti on the Trichy-Madurai highway, Tiruchirappalli, Tamil Nadu 620012, about 20 km from Tiruchirappalli Junction. The institute moved there in June 2021 from earlier temporary premises."},
        {"question": "Which B.Tech. programmes does IIIT Tiruchirappalli offer?",
         "answer": "Four, each of four years: Computer Science and Engineering; CSE (Artificial Intelligence and Data Science); Electronics and Communication Engineering; and ECE (VLSI Design). All four have DASA 2026 seats."},
        {"question": "Can international students join IIIT Tiruchirappalli?",
         "answer": "Foreign nationals, OCI/PIO candidates and NRIs can enter the B.Tech. through DASA with a valid JEE (Main) score and 75 per cent in Class 12. Indian nationals and OCI/PIO(I) candidates also need two years of schooling abroad."},
        {"question": "How many DASA seats does IIIT Tiruchirappalli have?",
         "answer": "The 2026 matrix lists 9 Non-CIWG and 5 CIWG seats each in CSE and CSE (AI and DS), and 6 Non-CIWG seats each in ECE and ECE (VLSI Design), with 3 and 2 CIWG seats respectively. Seat numbers change each cycle."},
        {"question": "What are the DASA tuition fees at IIIT Tiruchirappalli?",
         "answer": "For the 2026-27 first semester, tuition was USD 4,000 for Non-SAARC and USD 2,000 for SAARC students, and INR 1,15,200 for CIWG students. A further INR 92,000 covered one-time, institute, hostel and mess charges."},
        {"question": "Are the published B.Tech. fees annual?",
         "answer": "No. The fee sheet is for the first, odd semester of 2026-27 and includes refundable deposits, so it should not be doubled to estimate a year."},
        {"question": "What documents are needed to report for the DASA B.Tech.?",
         "answer": "Class 10, 11 and 12 mark sheets, the DASA school certificate, passport, JEE (Main) cards, the DASA admission letter, a medical certificate and, for NRI or OCI/PIO(I) candidates, proof of two years of schooling abroad. CIWG candidates add parent employment documents."},
        {"question": "Does IIIT Tiruchirappalli have hostels?",
         "answer": "Yes, a residence hall and mess hall are listed. First-semester hostel charges for 2026-27 were INR 45,600 including a INR 24,000 mess advance, plus a refundable INR 4,800 deposit. Room allotment is by the warden."},
        {"question": "Is the teaching language confirmed?",
         "answer": "The programme pages checked do not state it. Ask the department about lectures, assessment and any language requirement before accepting an offer."},
    ],
    "researchSources": [
        {"label": "IIIT Tiruchirappalli - About", "url": ABOUT, "kind": "official-university", "checkedAt": D},
        {"label": "IIIT Tiruchirappalli - Hostel", "url": HOSTEL, "kind": "official-university", "checkedAt": D},
        {"label": "IIIT Tiruchirappalli - Undergraduate admission", "url": UG, "kind": "official-program", "checkedAt": D},
        {"label": "IIIT Tiruchirappalli - Undergraduate admission data", "url": UGJSON, "kind": "official-program", "checkedAt": D},
        {"label": "IIIT Tiruchirappalli - Programmes", "url": PROGS, "kind": "official-program", "checkedAt": D},
        {"label": "DASA 2026 information brochure", "url": BROCHURE, "kind": "government", "checkedAt": D},
        {"label": "DASA 2026 seat matrix (revised)", "url": MATRIX, "kind": "government", "checkedAt": D},
        {"label": "IIIT Tiruchirappalli - DASA fee structure 2026-27", "url": DASA_FEE, "kind": "official-fee", "checkedAt": D},
        {"label": "IIIT Tiruchirappalli - DASA reporting details 2026-27", "url": REPORTING, "kind": "official-program", "checkedAt": D},
        {"label": "IIIT Tiruchirappalli - Hostel rules 2024-25", "url": HOSTEL_RULES, "kind": "official-university", "checkedAt": D},
        {"label": "Lok Sabha unstarred question 1873 (28 Nov 2016), IIIT list", "url": LOK, "kind": "government", "checkedAt": D},
        {"label": "Indian Institutes of Information Technology (Public-Private Partnership) Act, 2017 (India Code)", "url": ACT, "kind": "government", "checkedAt": D},
    ],
    "admissionsContent": {
        "contentState": "research_ready",
        "scope": "This record covers four B.Tech. programmes on the DASA route. Domestic B.Tech. counselling, M.Tech. and doctoral programmes are outside this record.",
        "sectionStates": {
            "decisionSummary": "published", "eligibility": "published", "fees": "published", "admissions": "published",
            "academics": "research_ready", "recognition": "published", "studentLiving": "published",
            "scholarships": "absent", "funding": "absent", "placements": "absent",
        },
        "ctas": [
            {"trigger": "eligibility", "label": "Check my DASA eligibility for IIIT Tiruchirappalli",
             "capture": ["nationality and OCI/PIO status", "years of schooling abroad", "JEE (Main) rank", "Class 12 aggregate"]},
            {"trigger": "application", "label": "Plan my DASA choices", "capture": ["preferred branches", "CIWG eligibility", "document readiness"]},
        ],
    },
    "programmes": PROGRAMMES,
}


def ev(entity, field, claim, label, url, grade="A", status="verified", pslug=None, notes=None):
    e = {"entity": entity, "universitySlug": SLUG}
    if pslug:
        e["programmeSlug"] = pslug
    e.update({"publicField": field, "claimText": claim, "status": status, "sourceLabel": label, "sourceUrl": url,
              "sourceGrade": grade, "checkedAt": D, "reviewBy": REVIEW})
    if notes:
        e["internalNotes"] = notes
    return e


EVIDENCE = [
    ev("university", "identity", "Institute at Sethurapatti, Trichy-Madurai Highway, Tiruchirappalli 620012; described as an Institute of National Importance and one of the IIITs set up in non-profit public-private-partnership mode; funded by Government of India, Government of Tamil Nadu and industry in a 50:35:15 ratio.", "IIIT Tiruchirappalli - About", ABOUT),
    ev("university", "establishedYear", "Lok Sabha answer lists IIIT Tiruchirappalli among the IIITs approved 30.10.2012 with first academic year 2013-14; the Union Cabinet approved the 20-IIIT PPP scheme on 7.12.2010.", "Lok Sabha unstarred question 1873 (28 Nov 2016), IIIT list", LOK),
    ev("university", "recognition", "Indian Institutes of Information Technology (Public-Private Partnership) Act, 2017 (No. 23 of 2017, assent 9 Aug 2017): s.2 declares each Institute in the Schedule an institution of national importance; the Schedule lists Tamil Nadu - Indian Institute of Information Technology, Tiruchirapalli, a society registered under the Societies Registration Act, 1860. DASA fee sheet header also states 'An Institute of National Importance under MoE, Govt. of India'.", "Indian Institutes of Information Technology (Public-Private Partnership) Act, 2017 (India Code)", ACT,
       notes="India Code is not reachable by the fetch tool (earlier host refused the connection); the Act text was read from a copy of the same Act hosted by IIIT Bhopal and extracted to research/india-source-bundles/indian-institute-of-information-technology-tiruchirappalli/iiit-ppp-act-2017-extract.txt."),
    ev("university", "summary", "About page: PPP-mode IIIT, Institute of National Importance, 50:35:15 funding; Lok Sabha answer: first academic year 2013-14; admission pages list four B.Tech. programmes and M.Tech./doctoral programmes.", "IIIT Tiruchirappalli - About", ABOUT, notes="Programmes: " + PROGS),
    ev("university", "campusLifestyle", "Permanent Sethurapatti campus operating as of 14 June 2021; temporary campus at Oxford Engineering College from mid-July 2020 and on NIT Tiruchirappalli premises from March 2016; hostel page lists Residence Hall, Mess Hall and Gym.", "IIIT Tiruchirappalli - About", ABOUT, notes="Hostel page labels: " + HOSTEL),
    ev("university", "cityProfile", "Reporting guide: campus about 20 km from Tiruchirappalli Junction/Central Bus stand on the Tiruchirappalli-Madurai Highway; buses to most of Tamil Nadu, southern Karnataka and Kerala.", "IIIT Tiruchirappalli - DASA reporting details 2026-27", REPORTING),
    ev("university", "practicalExposure", "About page: MoU with SVNIT Surat for research and academic collaboration; industry partners TCS, Cognizant, Infosys, Ramco Systems, ELCOT, Navitas (TAKE Solutions).", "IIIT Tiruchirappalli - About", ABOUT, notes="Internship scope as summarised in the research packet from the SVNIT MoU; no placement figures published."),
    ev("university", "hostelOverview", "DASA fee sheet 2026-27 hostel fees and mess advance: admission 1,200; establishment charges 7,200; licence, electricity and water 13,200; mess advance 24,000 (total 45,600); hostel deposit (refundable) 4,800 in one-time fees. Hostel rules 2024-25: warden allots rooms; heaters, kettles, air conditioners, cooking prohibited; entry/exit register.", "IIIT Tiruchirappalli - DASA fee structure 2026-27", DASA_FEE, notes="Rules: " + HOSTEL_RULES + " (2024-25 vintage)."),
    ev("university", "dietarySupport", "Hostel rules 2024-25: breakfast 7:00-9:00, lunch 12:00-14:00, snacks 16:45-18:00, dinner 19:00-21:00; no relaxation of timings; mess complaints to Warden.", "IIIT Tiruchirappalli - Hostel rules 2024-25", HOSTEL_RULES, grade="B"),
    ev("university", "safetyOverview", "Hostel rules 2024-25: ragging prohibited and cognizable; report immediately; boys' hostel return by 10:00 pm; visitors sign visitor book; emergency contact numbers provided at room allotment. Reporting guide requires an anti-ragging declaration.", "IIIT Tiruchirappalli - Hostel rules 2024-25", HOSTEL_RULES, grade="B", notes="Anti-ragging declaration: " + REPORTING),
    ev("university", "studentSupport", "Undergraduate admission data lists reporting process, hostel accommodation form, admission cancellation form and the National Scholarship Portal notice for 2026-27.", "IIIT Tiruchirappalli - Undergraduate admission data", UGJSON),
    ev("university", "whyChoose", "Four B.Tech. branches in the admission data; DASA matrix lists all four; DASA fee categories.", "DASA 2026 seat matrix (revised)", MATRIX),
    ev("university", "thingsToConsider", "DASA eligibility from the 2026 brochure; seat matrix numbers (Non-CIWG 9/9/6/6, CIWG 5/5/3/2); fee sheet is first-semester only with INR 92,000 additional.", "DASA 2026 information brochure", BROCHURE, notes="Matrix: " + MATRIX),
    ev("university", "bestFitFor", "DASA categories and CIWG documentation per the brochure and reporting guide.", "DASA 2026 information brochure", BROCHURE),
    ev("university", "industryPartners", "About page names TCS, Cognizant, Infosys, Ramco Systems, ELCOT and Navitas (TAKE Solutions) as industry partners.", "IIIT Tiruchirappalli - About", ABOUT),
    ev("university", "faq", "Fee sheet categories and amounts; seat matrix; reporting guide documents and dates; hostel charges.", "IIIT Tiruchirappalli - DASA fee structure 2026-27", DASA_FEE, notes="Matrix: " + MATRIX),
]

for row in ROWS:
    ps = f"iiitt-{row[0]}"
    EVIDENCE += [
        ev("programme", "identity", f"{row[2]}, four years, listed on the undergraduate admission data and the DASA 2026 seat matrix (institute code 314).", "IIIT Tiruchirappalli - Undergraduate admission data", UGJSON, pslug=ps, notes="Matrix: " + MATRIX),
        ev("programme", "eligibility", "DASA 2026: foreign nationals, OCI/PIO, NRI; valid JEE (Main) 2026 Paper 1; Class 12 Maths, Physics and one of Chemistry/Biotechnology/Computer Science/Biology with 75% (CGPA 7.5) across five subjects; born on or after 1 Oct 2001; Indian nationals and OCI/PIO(I) need two years of education including Classes 11-12 abroad in the last eight years.", "DASA 2026 information brochure", BROCHURE, pslug=ps),
        ev("programme", "admissions", "DASA portal csab.nic.in registration, document upload, choice filling and locking, seat allotment, payment by NEFT/UPI and physical reporting 20-21 August 2026; classes from 24 August 2026; document checklist including CIWG additions.", "IIIT Tiruchirappalli - DASA reporting details 2026-27", REPORTING, pslug=ps, notes="Brochure: " + BROCHURE),
        ev("programme", "audienceEligibility", "DASA route: seats for foreign nationals, OCI/PIO, NRIs; one-third of DASA seats are CIWG; category tags DASA SAARC and Non-SAARC decide tuition.", "DASA 2026 information brochure", BROCHURE, pslug=ps),
        ev("programme", "fee", "DASA fee sheet 2026-27 first semester: tuition CIWG INR 1,15,200 / Non-SAARC USD 4,000 / SAARC USD 2,000; one-time INR 32,400; additional institute INR 14,000; hostel and mess advance INR 45,600; grand total INR 92,000 plus applicable tuition. Not annual.", "IIIT Tiruchirappalli - DASA fee structure 2026-27", DASA_FEE, pslug=ps),
        ev("programme", "reportedFeeQuote", "First-semester tuition USD 2,000 (SAARC) to USD 4,000 (Non-SAARC) for DASA 2026-27; CIWG INR 1,15,200 noted in the basis.", "IIIT Tiruchirappalli DASA fee structure 2026-27 (first semester)", DASA_FEE, pslug=ps),
        ev("programme", "medium", "Reviewed programme and admission sources do not state the language of instruction; no English is inferred from the DASA brochure or location. Field omitted.", "IIIT Tiruchirappalli - Undergraduate admission", UG, status="omit", pslug=ps),
        ev("programme", "intake", "2026 cohort reported 20-21 August 2026 and began classes 24 August 2026, but no recurring intake month is published; none asserted.", "IIIT Tiruchirappalli - DASA reporting details 2026-27", REPORTING, status="omit", pslug=ps),
        ev("programme", "teachingPhases", "Four-year B.Tech. on the Sethurapatti campus; first-year reporting 20-21 August 2026.", "IIIT Tiruchirappalli - DASA reporting details 2026-27", REPORTING, pslug=ps),
    ]


def latest_course(slug):
    best = None
    for f in sorted(glob.glob(os.path.join(ROOT, "content-migrations", "*", "payload.json"))):
        if MIG in f:
            continue
        try:
            p = json.load(open(f))
        except Exception:
            continue
        for c in p.get("courses", []):
            if c["slug"] == slug:
                best = c
    if best is None:
        raise SystemExit(f"no course record for {slug}")
    return best


canon = []
for pr in PROGRAMMES:
    if pr["canonicalCourseSlug"] not in canon:
        canon.append(pr["canonicalCourseSlug"])

payload = {"courses": [latest_course(s) for s in canon], "universities": [UNIVERSITY], "evidence": EVIDENCE}
with open(OUT, "w") as fh:
    json.dump(payload, fh, indent=2, ensure_ascii=False)
    fh.write("\n")
print(OUT, len(PROGRAMMES), "programmes", len(EVIDENCE), "evidence")

manifest = {
    "version": 1,
    "id": MIG,
    "description": "Publish Indian Institute of Information Technology Tiruchirappalli (Institute of National Importance under the IIIT PPP Act, 2017) with four B.Tech. programmes on the DASA 2026 route.",
    "createdAt": D,
    "payload": "payload.json",
}
with open(os.path.join(ROOT, "content-migrations", MIG, "manifest.json"), "w") as fh:
    json.dump(manifest, fh, indent=2)
    fh.write("\n")

cols = ["university_slug", "programme_official_title", "level", "discipline", "duration", "campus", "delivery_mode",
        "intl_status", "intl_evidence_url", "official_source_url", "other_sources", "already_on_site",
        "existing_offering_slug", "canonical_course_match", "notes"]
rows = []
for pr in PROGRAMMES:
    rows.append([SLUG, pr["officialTitle"], "UG", "Engineering", "4 years", "Sethurapatti, Tiruchirappalli", "on_campus", "open_to_international",
                 BROCHURE, UG, f"{MATRIX}; {DASA_FEE}", "no", "", pr["canonicalCourseSlug"],
                 "PACKAGED (availability=restricted: DASA route only; 2026 cycle complete)."])
for t, lvl, canon_m, note in (
        ("M.Tech. Computer Science and Engineering", "PG", "me-mtech-computer-science-engineering", "HELD: international eligibility unverified; self-support/CCMT routes not re-verified; duration and documents incomplete"),
        ("M.Tech. VLSI Systems", "PG", "me-mtech-electronics-communication-engineering", "HELD: international eligibility unverified; self-support/CCMT routes not re-verified"),
        ("Ph.D. Computer Science and Engineering", "Doctoral", "phd-computer-science", "HELD: standard duration, current call and international eligibility unverified"),
        ("Ph.D. Electronics and Communication Engineering", "Doctoral", "phd-engineering", "HELD: as above"),
        ("Ph.D. Mechanical Engineering", "Doctoral", "phd-engineering", "HELD: as above"),
        ("Ph.D. Physics", "Doctoral", "phd-natural-sciences", "HELD: as above"),
        ("Ph.D. Mathematics", "Doctoral", "GAP:phd-mathematics", "HELD: taxonomy gap and unverified eligibility"),
        ("Ph.D. Economics", "Doctoral", "GAP:phd-economics", "HELD: taxonomy gap and unverified eligibility"),
        ("Ph.D. English", "Doctoral", "phd-arts-humanities", "HELD: as above")):
    rows.append([SLUG, t, lvl, "", "", "Sethurapatti, Tiruchirappalli", "on_campus", "unknown", "", PROGS, "", "no", "", canon_m, note])
os.makedirs(os.path.join(ROOT, "research", "india-programme-inventory"), exist_ok=True)
with open(os.path.join(ROOT, "research", "india-programme-inventory", f"{SLUG}.csv"), "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(cols)
    w.writerows(rows)
