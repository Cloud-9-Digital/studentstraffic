"""Build content-migrations/0405-india-indian-institute-of-management-tiruchirappalli/payload.json.

Owner claude-tn-iimt-20261027. Checked 2026-10-27. Run from repo root:
    python3 -I research-drafts/india/indian-institute-of-management-tiruchirappalli-build.py
Research packet: tn-fresh10-20261027 (PR #3), re-verified live against iimtrichy.ac.in on 2026-10-27.
Source copies: research/india-source-bundles/indian-institute-of-management-tiruchirappalli/
"""
import csv
import glob
import json
import os

ROOT = os.getcwd()
MIG = "0405-india-indian-institute-of-management-tiruchirappalli"
OUT = os.path.join(ROOT, "content-migrations", MIG, "payload.json")
D = "2026-10-27"
REVIEW = "2027-01-31"
SLUG = "indian-institute-of-management-tiruchirappalli"
NAME = "Indian Institute of Management Tiruchirappalli"

SITE = "https://www.iimtrichy.ac.in/"
PGPM = "https://www.iimtrichy.ac.in/en/pgpm"
PGPMHR = "https://www.iimtrichy.ac.in/en/pgpm-hr"
CRIT = "https://www.iimtrichy.ac.in/en/pgpm-admin-criteria"
CRIT_HR = "https://www.iimtrichy.ac.in/en/Admission%20Criteria-pgpm-hr"
OVS = "https://www.iimtrichy.ac.in/sites/default/files/upload/23Jan2026132141_AdmissionPolicy-Overseas-PGPM-2026-28_Final_23Jan2026.pdf"
OVS_HR = "https://www.iimtrichy.ac.in/sites/default/files/upload/23Jan2026132735_AdmissionPolicy-Overseas-PGPM-HR-2026-28_Final_23Jan2026.pdf"
ADM_STATUS = "https://admissions.iimtrichy.ac.in/index.php"
GENESIS = "https://www.iimtrichy.ac.in/en/genesis"
DIRECTORY = "https://www.iimtrichy.ac.in/en/acd_programmes"
HOSTELS = "https://www.iimtrichy.ac.in/en/hostels"
FACILITIES = "https://www.iimtrichy.ac.in/en/campus-facilities"
ANTIRAG = "https://www.iimtrichy.ac.in/en/anti_ragging"
COMMITTEES = "https://www.iimtrichy.ac.in/en/Internal_Committees"
PGPBM = "https://www.iimtrichy.ac.in/en/pgpbm-admission-criteria"
AMBA = "https://www.amba-bga.com/schools/indian-institute-of-management-tiruchirappalli"
ACT = "https://www.indiacode.nic.in/handle/123456789/2248?view_type=browse"

FEE_NOTE = (
    "Published 2026-28 programme fee for students admitted through CAT and the interview process: INR 19.5 lakh over six terms, made up of a "
    "INR 1,00,000 acceptance fee, INR 2,25,000 tuition in term I and INR 3,25,000 tuition in each of terms II to VI. It excludes a refundable "
    "INR 30,000 caution deposit and a mess advance of INR 24,000 a term. This is a whole-course charge, not annual tuition, so annual tuition is on request. "
    "Overseas-category students of the 2026-28 batch paid a combined USD 16,000 a year (USD 32,000 for two years) covering tuition, "
    "institutional services and hostel accommodation, plus boarding, caution deposit and any taxes."
)

OVERSEAS_AUDIENCE = "Indian and foreign nationals who lived, worked or studied outside India throughout 2025 (overseas category, GMAT route)"


def audience(src):
    return {
        "availability": "restricted",
        "eligibleAudiences": [
            "Applicants admitted through CAT 2025 and the JAP 2026 interview process (domestic route)",
            OVERSEAS_AUDIENCE,
        ],
        "restrictions": [
            "Overseas category only: applicants must have lived, worked or studied outside India from 1 January to 31 December 2025; foreign nationality alone does not qualify.",
            "Overseas category only: a candidate expected to be present or residing in India on the CAT 2025 date, 30 November 2025, was excluded from that category.",
            "Both routes belong to the 2026-28 batch, which is closed; no 2027-29 PGPM or PGPM-HR dates or rules were published on the admissions pages checked.",
        ],
        "notes": "Two routes exist: domestic selection by CAT percentile and interview, and the overseas route by GMAT and virtual interview. The institute's domestic pages state no nationality or minimum degree-mark rule, so none is asserted here.",
        "verifiedAt": D,
        "sourceUrl": src,
    }


def programme(slug, canon, title, official_title, url, crit, ovs, hr):
    focus = (
        "a human-resources focus within a management degree; female candidates carry a 6 per cent gender-diversity weight in selection"
        if hr else "general management"
    )
    return {
        "slug": slug,
        "canonicalCourseSlug": canon,
        "officialTitle": official_title,
        "durationYears": 2,
        "fee": {"status": "on_request", "verifiedAt": D, "notes": FEE_NOTE},
        "officialProgramUrl": url,
        "audienceEligibility": audience(ovs),
        "admissionsContent": {
            "overview": f"The {title} is a two-year full-time residential MBA at Tiruchirappalli with {focus.split(';')[0]}. The 2026-28 batch was filled through CAT with an interview, or by an overseas route using GMAT; both are closed.",
            "eligibility": {
                "intro": "The 2026-28 domestic route shortlisted on CAT 2025 percentile; the overseas route set a degree and GMAT threshold.",
                "items": [
                    "Domestic route: CAT 2025 total percentile cut-offs of 95.25 (General), 89 (EWS), 88.5 (NC-OBC), 75 (SC), 44 (ST) and 30 (PwD) for shortlisting",
                    "Meeting the CAT cut-off was necessary but not sufficient; the interview, work experience and academic record also counted",
                    "Overseas route: bachelor's degree with at least 50 per cent or equivalent CGPA; foreign degrees need equivalence certified by the AIU",
                    "Overseas route: GMAT score of at least 640 out of 800, not older than two years on 30 April 2026",
                    "Final-year bachelor's students could apply and join provisionally, with all degree results due by 31 December 2026",
                ],
            },
            "applicationSteps": [
                "Domestic route: take CAT 2025 and register for the institute's JAP 2026 process; shortlisted candidates attended a personal interview at one of ten venues",
                "Overseas route: take the GMAT and send the prescribed form, score, records, passport pages, two recommendations and the USD 200 fee by bank draft by 30 April 2026",
                "Shortlisted overseas candidates were interviewed virtually in the first or second week of May 2026",
                "Final merit weighted CAT or GMAT 52 per cent, interview 20 per cent, work experience 10 per cent, and school, degree and diversity components",
            ],
            "documentsRequired": {
                "academic": [
                    "Class X and XII mark sheets and certificates",
                    "Graduation records, and postgraduate records where applicable",
                    "CAT scorecard (domestic) or GMAT score certificate (overseas)",
                ],
                "application": [
                    "Prescribed overseas application form with the USD 200 bank draft (overseas route only)",
                    "Passport pages with authorised entries and stamps (overseas route only)",
                    "Two recommendation letters under the policy's referee rules (overseas route only)",
                ],
            },
            "deadlinesNote": "The 2026-28 admissions portal is closed; the merit list was announced on 7 May 2026. No 2027-29 PGPM or PGPM-HR dates were published when checked on 27 October 2026.",
            "reportedFeeQuote": {
                "currency": "INR",
                "minAmount": 1950000,
                "status": "confirmed",
                "period": "full_course",
                "componentBasis": "Six-term programme fee made up of a INR 1,00,000 acceptance fee and tuition of INR 2,25,000 in term I and INR 3,25,000 in each of terms II to VI; excludes a refundable INR 30,000 caution deposit and a mess advance of INR 24,000 a term.",
                "audience": "domestic",
                "category": "Students admitted through CAT and the JAP interview process",
                "academicYear": "2026-28",
                "sourceUrl": crit,
                "sourceLabel": "IIM Tiruchirappalli PGPM admission criteria and fees 2026-28" if not hr else "IIM Tiruchirappalli PGPM-HR admission criteria and fees 2026-28",
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
            {
                "phase": "Two-year full-time residential programme",
                "language": "",
                "details": (
                    "Study is at the Tiruchirappalli campus. " + (
                        "The HR MBA is the institute's first domain-specific programme, launched in 2020, with case study, simulation and live-project teaching shared with the general MBA."
                        if hr else
                        "Teaching combines case discussions, group evaluation, computer-based simulations, live projects and guest lectures."
                    )
                ),
            }
        ],
    }


PROGRAMMES = [
    programme("iim-trichy-pgpm-mba", "mba", "Post Graduate Programme in Management (PGPM)",
              "Post Graduate Programme in Management (MBA)", PGPM, CRIT, OVS, False),
    programme("iim-trichy-pgpm-hr-mba", "mba-human-resource-management", "Post Graduate Programme in Management - Human Resources (PGPM-HR)",
              "Post Graduate Programme in Management - Human Resources (MBA-HR)", PGPMHR, CRIT_HR, OVS_HR, True),
]

UNIVERSITY = {
    "countrySlug": "india",
    "slug": SLUG,
    "name": NAME,
    "city": "Tiruchirappalli",
    "type": "Public",
    "establishedYear": 2011,
    "officialWebsite": SITE,
    "mediaAttribution": {},
    "summary": (
        "IIM Tiruchirappalli is a public management institute in Tiruchirappalli, Tamil Nadu, established in 2011 and an Institute of "
        "National Importance under the Indian Institutes of Management Act, 2017. It offers residential MBAs in general management and "
        "human resources, a weekend MBA in Chennai, and doctoral programmes."
    ),
    "campusLifestyle": (
        "Residential MBA students study at the Tiruchirappalli campus, whose listed facilities include a Learning Resource Centre, computing "
        "resources, a finance lab, a behavioural lab and sports facilities. The weekend MBA for working executives meets at the separate "
        "Chennai campus in K K Nagar and is non-residential, so it should not be confused with a residential place."
    ),
    "cityProfile": (
        "The main institute is on the Tiruchirappalli-Pudukkottai road in Tamil Nadu. Residential MBA students study there, while the "
        "21-month weekend MBA meets in person at the Chennai campus in K K Nagar. These are different study locations, so a Chennai weekend "
        "place should not be confused with a residential place in Tiruchirappalli."
    ),
    "practicalExposure": (
        "The general-management MBA uses the case method, group evaluations, computer-based simulations, live projects with company professionals "
        "and guest lectures. The HR MBA, launched in 2020, is the institute's first domain-specific programme. The institute lists these learning "
        "activities as curriculum features; they do not promise employment or a salary."
    ),
    "hostelOverview": (
        "Hostels have eight blocks: seven of three floors, and one of eight floors with 328 air-conditioned rooms. Rooms have desks, whiteboards "
        "and balconies over an artificial canal, Wi-Fi in every hostel and LAN in every room. Dedicated blocks house women, and ground-floor "
        "rooms with attached bathrooms suit students with disabilities. An 11-storey building with over 400 rooms is under construction. "
        "Hostel charges are not published as a separate figure."
    ),
    "dietarySupport": (
        "A mess and canteen block a short walk from the hostels includes a night canteen, a sandwich bar and departmental stores. "
        "Students pay a mess advance of INR 24,000 each term, and mess rates can be revised. The institute publishes no menu, meal timings "
        "or provision for specific dietary needs."
    ),
    "safetyOverview": (
        "The institute lists an anti-ragging committee and an Internal Complaints Committee as its formal channels for concerns. Their "
        "existence is not a guarantee against incidents, and the pages checked publish no campus security arrangements."
    ),
    "studentSupport": (
        "Students use the Learning Resource Centre and computing resources. The institute lists public grievance redressal, the Internal "
        "Complaints Committee and an SC/ST Cell among its committees, and the hostels reserve ground-floor rooms for residents with disabilities. "
        "Students Traffic counselling can help compare routes and prepare an application."
    ),
    "whyChoose": [
        "Choose between a general-management MBA and an MBA focused on human resources, the only IIM-offered HR-focused MBA according to the institute.",
        "AMBA lists the PGPM, PGPM-HR and the weekend PGPBM as accredited MBA programmes.",
        "IIM Tiruchirappalli is a statutory Institute of National Importance under the IIM Act, 2017, and the programmes are residential.",
    ],
    "thingsToConsider": [
        "The 2026-28 batch is closed and no 2027-29 PGPM or PGPM-HR dates are published, so check the admissions portal before planning around a deadline.",
        "The overseas category needs a precise residence history in 2025; a foreign passport alone did not qualify, and anyone in India on the CAT 2025 date was excluded.",
        "The INR 19.5 lakh programme fee covers six terms and excludes the caution deposit and a mess advance of INR 24,000 a term; it is not annual tuition.",
    ],
    "bestFitFor": [
        "Graduates comparing a full-time residential MBA in general management.",
        "Graduates who want a residential MBA focused on human resources.",
        "Applicants with a CAT score near the published cut-offs, or a GMAT score of 640 and a verifiable record of living abroad in 2025.",
    ],
    "industryPartners": [],
    "recognitionBadges": [
        "Government of India - Institute of National Importance (Indian Institutes of Management Act, 2017)",
        "AMBA - PGPM, PGPM-HR and PGPBM accredited",
    ],
    "recognitionLinks": [
        {"label": "Indian Institutes of Management Act, 2017 (India Code)", "url": ACT},
        {"label": "AMBA accredited school profile", "url": AMBA},
    ],
    "faq": [
        {"question": "Is IIM Tiruchirappalli a government institute?",
         "answer": "Yes. The Indian Institutes of Management Act, 2017 lists it in its Schedule and declares each listed institute an institution of national importance. It was established in 2011 and is registered as a society in Tamil Nadu."},
        {"question": "Which degree routes does IIM Tiruchirappalli offer?",
         "answer": "Three MBA routes: the residential PGPM and PGPM-HR at Tiruchirappalli and the weekend PGPBM for working executives in Chennai. It also runs full-time and executive doctoral programmes. This record covers the two residential MBAs."},
        {"question": "How were students admitted to the 2026-28 PGPM and PGPM-HR?",
         "answer": "Domestic candidates were shortlisted on CAT 2025 percentile and then interviewed. Final merit gave CAT 52 per cent, the interview 20 per cent and work experience 10 per cent, with small weights for school and degree marks and diversity."},
        {"question": "What are the CAT cut-offs for IIM Tiruchirappalli?",
         "answer": "For 2026-28 the total percentile cut-offs were 95.25 for General, 89 for EWS, 88.5 for NC-OBC, 75 for SC, 44 for ST and 30 for PwD candidates, with sectional cut-offs too. Meeting them was necessary but not sufficient for shortlisting."},
        {"question": "Who qualified for the overseas category?",
         "answer": "Indian and foreign nationals living, working or studying outside India from 1 January to 31 December 2025. A candidate expected to be in India on the CAT 2025 date, 30 November 2025, was excluded. They needed a 50 per cent bachelor's degree and a GMAT score of at least 640."},
        {"question": "What is the fee for the IIM Tiruchirappalli MBA?",
         "answer": "The 2026-28 programme fee for CAT-route students is INR 19.5 lakh over six terms, excluding a INR 30,000 refundable caution deposit and a INR 24,000 mess advance each term. Overseas-category students paid USD 32,000 for two years, including hostel accommodation."},
        {"question": "Are IIM Tiruchirappalli applications open now?",
         "answer": "No. The portal shows PGPM and PGPM-HR admissions for 2026-28 as closed, with the merit list announced on 7 May 2026. No 2027-29 dates were published when checked on 27 October 2026."},
        {"question": "How does the weekend MBA in Chennai differ?",
         "answer": "The PGPBM is a 21-month, non-residential programme taught in person at weekends at the Chennai campus. It has its own admissions route and requires work experience, so it is not covered by the residential MBA details here."},
        {"question": "What accommodation does IIM Tiruchirappalli have?",
         "answer": "Eight hostel blocks with air-conditioned rooms, Wi-Fi and LAN, dedicated blocks for women and accessible ground-floor rooms. The mess and canteen block has a night canteen and sandwich bar. A mess advance of INR 24,000 each term applies."},
        {"question": "Is IIM Tiruchirappalli AMBA accredited?",
         "answer": "AMBA's own school profile lists three accredited MBA programmes: PGPM, PGPM-HR and PGPBM. The profile shows no end date, and the accreditation is not presented as covering the doctoral programmes."},
    ],
    "researchSources": [
        {"label": "IIM Tiruchirappalli - PGPM programme", "url": PGPM, "kind": "official-program", "checkedAt": D},
        {"label": "IIM Tiruchirappalli - PGPM-HR programme", "url": PGPMHR, "kind": "official-program", "checkedAt": D},
        {"label": "IIM Tiruchirappalli - PGPM admission criteria and fees 2026-28", "url": CRIT, "kind": "official-fee", "checkedAt": D},
        {"label": "IIM Tiruchirappalli - PGPM-HR admission criteria and fees 2026-28", "url": CRIT_HR, "kind": "official-fee", "checkedAt": D},
        {"label": "IIM Tiruchirappalli - PGPM overseas admission policy 2026-28", "url": OVS, "kind": "official-program", "checkedAt": D},
        {"label": "IIM Tiruchirappalli - PGPM-HR overseas admission policy 2026-28", "url": OVS_HR, "kind": "official-program", "checkedAt": D},
        {"label": "IIM Tiruchirappalli - Admissions portal status", "url": ADM_STATUS, "kind": "official-program", "checkedAt": D},
        {"label": "IIM Tiruchirappalli - Genesis", "url": GENESIS, "kind": "official-university", "checkedAt": D},
        {"label": "IIM Tiruchirappalli - Programme directory", "url": DIRECTORY, "kind": "official-university", "checkedAt": D},
        {"label": "IIM Tiruchirappalli - Hostels", "url": HOSTELS, "kind": "official-university", "checkedAt": D},
        {"label": "IIM Tiruchirappalli - Campus facilities", "url": FACILITIES, "kind": "official-university", "checkedAt": D},
        {"label": "IIM Tiruchirappalli - Anti-ragging committee", "url": ANTIRAG, "kind": "official-university", "checkedAt": D},
        {"label": "IIM Tiruchirappalli - Internal committees", "url": COMMITTEES, "kind": "official-university", "checkedAt": D},
        {"label": "IIM Tiruchirappalli - PGPBM admissions", "url": PGPBM, "kind": "official-program", "checkedAt": D},
        {"label": "Indian Institutes of Management Act, 2017 (India Code)", "url": ACT, "kind": "government", "checkedAt": D},
        {"label": "AMBA accredited school profile", "url": AMBA, "kind": "recognition", "checkedAt": D},
    ],
    "admissionsContent": {
        "contentState": "research_ready",
        "scope": "This record covers the two residential MBAs at Tiruchirappalli. The weekend PGPBM in Chennai and the doctoral programmes are outside this record.",
        "sectionStates": {
            "decisionSummary": "published", "eligibility": "published", "fees": "published", "admissions": "published",
            "academics": "research_ready", "recognition": "published", "studentLiving": "published",
            "scholarships": "absent", "funding": "absent", "placements": "absent",
        },
        "ctas": [
            {"trigger": "eligibility", "label": "Check my IIM Tiruchirappalli route",
             "capture": ["CAT or GMAT score", "residence history in 2025", "graduation percentage", "work experience in months"]},
            {"trigger": "application", "label": "Plan my MBA application", "capture": ["target intake year", "CAT or GMAT status", "document readiness"]},
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
    ev("university", "identity", "Public management institute established in 2011 at Tiruchirappalli, Tamil Nadu; an Institute of National Importance governed by the IIM Act, 2017.", "IIM Tiruchirappalli - Genesis", GENESIS),
    ev("university", "establishedYear", "Established 2011.", "IIM Tiruchirappalli - Genesis", GENESIS),
    ev("university", "recognitionBadges", "Indian Institutes of Management Act, 2017 (No. 33 of 2017, assent 31 Dec 2017): s.2 declares each Institute in the Schedule an institution of national importance; the Schedule lists Tamil Nadu - Indian Institute of Management Tiruchirappalli, a society registered under the Tamil Nadu Societies Registration Act, 1975.", "Indian Institutes of Management Act, 2017 (India Code)", ACT,
       notes="India Code returned HTTP 403 to the fetch tool; the Act text (Gazette of India copy) was read from a PDF of the same Act and the extract is saved in research/india-source-bundles/indian-institute-of-management-tiruchirappalli/iim-act-2017-extract.txt."),
    ev("university", "recognitionBadges", "AMBA school profile lists IIM Tiruchirappalli as AMBA Accredited with 3 MBA programmes: PGPBM (part time), PGPM and PGPM-HR (full time). No end date shown.", "AMBA accredited school profile", AMBA),
    ev("university", "summary", "Institute portfolio of PGPM, PGPM-HR, PGPBM, full-time and executive doctoral programmes; PGPBM taught at the Chennai campus.", "IIM Tiruchirappalli - Programme directory", DIRECTORY),
    ev("university", "campusLifestyle", "Listed campus facilities: Learning Resource Centre, Computing Resources, Hostels, Sustainability, Finance Lab, Behavioural Lab, Sports Facility, Virtual Tour. PGPBM runs at the Chennai K K Nagar campus on weekends.", "IIM Tiruchirappalli - Campus facilities", FACILITIES,
       notes="Campus acreage omitted: sources differ (Genesis page states 175 acres; other pages differ)."),
    ev("university", "cityProfile", "Main institute at Tiruchirappalli; PGPBM is a 21-month in-person weekend programme at the Chennai K K Nagar campus.", "IIM Tiruchirappalli - PGPBM admissions", PGPBM),
    ev("university", "practicalExposure", "PGPM pedagogy: case method, group evaluations, computer-based simulations, live projects, guest lectures. PGPM-HR launched 2020 as the first domain-specific programme and the only IIM-offered HR-focused MBA (institute statement).", "IIM Tiruchirappalli - PGPM-HR programme", PGPMHR),
    ev("university", "hostelOverview", "Eight hostel blocks (seven of three floors, one of eight floors with 328 air-conditioned rooms); 11-storey 400+ room building under construction; desks, whiteboards, balconies; Wi-Fi in every hostel and LAN in every room; dedicated women's blocks; accessible ground-floor rooms with attached bathrooms.", "IIM Tiruchirappalli - Hostels", HOSTELS),
    ev("university", "dietarySupport", "Mess and Canteen Block with night canteen, sandwich bar and departmental stores. Mess advance INR 24,000 per term; mess rates may be revised (fee table). No menu, timings or dietary provision published.", "IIM Tiruchirappalli - Hostels", HOSTELS, notes="Mess advance from " + CRIT),
    ev("university", "safetyOverview", "Anti-ragging committee and Internal Complaints Committee listed; no campus security arrangements published on pages checked.", "IIM Tiruchirappalli - Anti-ragging committee", ANTIRAG, notes="Committees: " + COMMITTEES),
    ev("university", "studentSupport", "Committees listed include public grievances, Internal Complaints Committee and SC/ST Cell; hostels reserve accessible ground-floor rooms.", "IIM Tiruchirappalli - Internal committees", COMMITTEES),
    ev("university", "whyChoose", "PGPM-HR described as the only IIM-offered MBA focused on HRM (institute statement); AMBA lists three accredited programmes; IIM Act 2017 status.", "IIM Tiruchirappalli - PGPM-HR programme", PGPMHR),
    ev("university", "thingsToConsider", "Admissions portal shows MBA Batch 2026-2028 closed; merit list 7 May 2026; no 2027-29 PGPM/PGPM-HR rules on the pages checked. Overseas definition excludes anyone in India on 30 Nov 2025. Fee table excludes caution deposit and mess advance.", "IIM Tiruchirappalli - Admissions portal status", ADM_STATUS),
    ev("university", "bestFitFor", "CAT cut-offs and overseas GMAT 640 threshold from the 2026-28 criteria and policy.", "IIM Tiruchirappalli - PGPM admission criteria and fees 2026-28", CRIT),
    ev("university", "faq", "Admissions portal: PGPM and PGPM-HR 2026-28 closed; merit list 7 May 2026. PGPBM is a 21-month weekend programme in Chennai with prior work experience required; no formal placement assistance.", "IIM Tiruchirappalli - PGPBM admissions", PGPBM, notes="Status: " + ADM_STATUS),
]

for ps, crit, ovs, label in (("iim-trichy-pgpm-mba", CRIT, OVS, "PGPM"), ("iim-trichy-pgpm-hr-mba", CRIT_HR, OVS_HR, "PGPM-HR")):
    page = PGPM if label == "PGPM" else PGPMHR
    EVIDENCE += [
        ev("programme", "identity", f"Two-year full-time residential {label} (MBA) at IIM Tiruchirappalli.", f"IIM Tiruchirappalli - {label} programme", page, pslug=ps),
        ev("programme", "eligibility", "Domestic 2026-28: CAT 2025 total percentile cut-offs GEN 95.25, EWS 89, NC-OBC 88.5, SC 75, ST 44, DAP 30 for shortlisting (necessary, not sufficient). Overseas 2026-28: bachelor's 50% or equivalent CGPA, AIU equivalence for foreign degrees, GMAT 640/800 not older than 2 years on 30 April 2026.", f"IIM Tiruchirappalli - {label} admission criteria and fees 2026-28", crit, pslug=ps,
           notes="Domestic pages state no minimum degree marks or nationality rule; none published. Overseas details: " + ovs),
        ev("programme", "admissions", "Domestic: CAT 2025 then JAP 2026 interview (ten venues); weights CAT 52%, PI 20%, work experience 10%, 12th 3%, UG 5%, 10th 2%, academic diversity 2%, female gender diversity 6%. Overseas: GMAT, form by 30 April 2026 with records, passport pages, two recommendations, USD 200 bank draft; virtual interview in first or second week of May 2026.", f"IIM Tiruchirappalli - {label} admission criteria and fees 2026-28", crit, pslug=ps, notes="Overseas policy: " + ovs),
        ev("programme", "audienceEligibility", "Overseas category: Indian and foreign nationals living, working or studying outside India 1 Jan - 31 Dec 2025; a candidate expected in India on CAT 2025 (30 Nov 2025) is not eligible for that category. Separate CAT/JAP domestic route.", f"IIM Tiruchirappalli - {label} overseas admission policy 2026-28", ovs, pslug=ps),
        ev("programme", "fee", "Domestic 2026-28 programme fee INR 19.5 lakh (acceptance 1,00,000; tuition 2,25,000 term I and 3,25,000 terms II-VI) excluding caution deposit INR 30,000 and mess advance INR 24,000 per term. Overseas 2026-28: USD 16,000 per annum, USD 32,000 for two years, combined fee including hostel. Annual tuition alone not isolated.", f"IIM Tiruchirappalli - {label} admission criteria and fees 2026-28", crit, pslug=ps, notes="Overseas: " + ovs),
        ev("programme", "reportedFeeQuote", "INR 19.5 lakh whole-course programme fee for 2026-28 students admitted through CAT/JAP (acceptance fee plus tuition over six terms), excluding caution deposit and mess advance.", f"IIM Tiruchirappalli - {label} admission criteria and fees 2026-28" if label == "PGPM-HR" else "IIM Tiruchirappalli - PGPM admission criteria and fees 2026-28", crit, pslug=ps),
        ev("programme", "medium", "Programme and admissions pages checked do not state the language of instruction; the website's Hindi option concerns the site language only. Field omitted.", f"IIM Tiruchirappalli - {label} programme", page, status="omit", pslug=ps),
        ev("programme", "intake", "2026-28 admissions are closed and no next-cycle start month is published; none inferred.", "IIM Tiruchirappalli - Admissions portal status", ADM_STATUS, status="omit", pslug=ps),
        ev("programme", "teachingPhases", f"{label}: two-year full-time programme at Tiruchirappalli; case method, simulations, live projects and guest lectures described on the programme pages.", f"IIM Tiruchirappalli - {label} programme", page, pslug=ps),
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
    "description": "Publish Indian Institute of Management Tiruchirappalli (Institute of National Importance under the IIM Act, 2017; AMBA accredited) with its PGPM and PGPM-HR residential MBA programmes, 2026-28 domestic and overseas routes.",
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
    rows.append([SLUG, pr["officialTitle"], "PG", "Management", "2 years", "Tiruchirappalli", "on_campus", "open_to_international", OVS,
                 pr["officialProgramUrl"], f"{CRIT}; {ADM_STATUS}", "no", "", pr["canonicalCourseSlug"],
                 "PACKAGED (availability=restricted: overseas category rules; 2026-28 cycle closed)."])
for t, lvl, note in (("Post Graduate Programme in Business Management (PGPBM), Chennai weekend", "PG", "HELD: audience and 2027-29 route not verified in this pass"),
                     ("Doctoral Programme in Management (full-time DPM)", "Doctoral", "HELD: contradictory area limits and stale deadlines on admission pages"),
                     ("Doctoral Programme in Management (executive DPM)", "Doctoral", "HELD: window 11 Dec 2025 - 15 Feb 2026 closed; audience not verified")):
    rows.append([SLUG, t, lvl, "Management", "", "", "", "unknown", "", DIRECTORY, "", "no", "", "GAP:held", note])
os.makedirs(os.path.join(ROOT, "research", "india-programme-inventory"), exist_ok=True)
with open(os.path.join(ROOT, "research", "india-programme-inventory", f"{SLUG}.csv"), "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(cols)
    w.writerows(rows)
