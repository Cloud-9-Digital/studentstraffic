"""Build content-migrations/0406-india-thiagarajar-college-of-engineering/payload.json.

Owner claude-tn-tce-20261027. Checked 2026-10-27. Run from repo root:
    python3 -I research-drafts/india/tce-madurai-build.py
Source copies: research/india-source-bundles/thiagarajar-college-of-engineering/
Starting point: PR #3 research packet (tn-fresh10-20261027/thiagarajar-college-of-engineering) structurally-complete subset;
every fact below was re-checked on 2026-10-27 against the AICTE EoA 2026-27 letter, the UGC autonomous list, the TNEA 2026 brochure
and college booklet, and tce.edu.
"""
import csv
import glob
import json
import os

ROOT = os.getcwd()
MIG = "0406-india-thiagarajar-college-of-engineering"
OUT = os.path.join(ROOT, "content-migrations", MIG, "payload.json")
D = "2026-10-27"
REVIEW = "2027-04-27"
SLUG = "thiagarajar-college-of-engineering"
NAME = "Thiagarajar College of Engineering"
SITE = "https://www.tce.edu/"
PROGS = "https://www.tce.edu/admission/programmes-offered"
ADM_BE = "https://www.tce.edu/admission/be-btech"
ADM_2627 = "https://www.tce.edu/admissions-2026-27"
ABOUT = "https://www.tce.edu/about/about-the-college"
APPROVALS = "https://www.tce.edu/about/approvals-affiliations"
EOA = "https://www.tce.edu/sites/default/files/PDF/AICTE-2026-27.pdf"
MD = "https://www.tce.edu/sites/default/files/PDF/Mandatory-Disclosure-2025-26-05th-august.pdf"
UGC = "https://www.ugc.gov.in/colleges/Autonomous_Colleges_list"
AICTE_DASH = "https://facilities.aicte-india.org/dashboard/pages/angulardashboard.php#!/approved"
TNEA_IAC = "https://static.tneaonline.org/docs/Information_about_colleges_2026.pdf"
TNEA_BR = "https://static.tneaonline.org/docs/2_Information_Brochure_2026.pdf"
TNEA_SCHED = "https://static.tneaonline.org/docs/TNEA_Tentative_Schedule_2026.pdf"
MEN_H = "https://www.tce.edu/campuslife/hostel/menshostel"
WOMEN_H = "https://www.tce.edu/campuslife/hostel/womenshostel"
COUNSEL = "https://www.tce.edu/campuslife/counselling-division"
BUNDLE = "research/india-source-bundles/thiagarajar-college-of-engineering/"

FEE_NOTE = (
    "Thiagarajar College of Engineering publishes no programme-wise tuition on its admissions pages (checked 27 October 2026), "
    "and the TNEA 2026 college booklet prints no tuition figure, so tuition is on request from the college. TNEA 2026 lists TCE's "
    "other charges as an admission fee of INR 4,000, establishment charges of INR 29,000, a caution deposit of INR 7,500, hostel room rent "
    "of INR 3,750 (boys) or INR 3,250 (girls) a year, mess INR 3,200 a year, hostel electricity INR 500 a year and college transport of "
    "INR 33,000 to 46,900 a year. Third-party fee ranges are not used."
)

# suffix, canonical, official title, AICTE course label, 2026-27 intake, new for 2026-27 (AICTE approved new course)
UG = [
    ("b-e-civil-engineering", "be-btech-civil-engineering", "B.E. Civil Engineering", "Civil Engineering", 120, False),
    ("b-e-computer-science-and-engineering", "be-btech-computer-science-engineering", "B.E. Computer Science and Engineering", "Computer Science & Engineering", 180, False),
    ("b-e-computer-science-and-engineering-ai-ml", "be-btech-artificial-intelligence-machine-learning", "B.E. Computer Science and Engineering (Artificial Intelligence and Machine Learning)", "Computer Science and Engineering (Artificial Intelligence and Machine Learning)", 60, False),
    ("b-e-electrical-and-electronics-engineering", "be-btech-electrical-electronics-engineering", "B.E. Electrical and Electronics Engineering", "Electrical and Electronics Engineering", 120, False),
    ("b-e-electronics-and-communication-engineering", "be-btech-electronics-communication-engineering", "B.E. Electronics and Communication Engineering", "Electronics & Communication Engg", 180, False),
    ("b-e-mechanical-engineering", "be-btech-mechanical-engineering", "B.E. Mechanical Engineering", "Mechanical Engineering", 120, False),
    ("b-e-mechatronics", "be-btech-mechatronics-engineering", "B.E. Mechatronics", "Mechatronics", 60, False),
    ("b-tech-computer-science-and-business-systems", "be-btech-computer-science-engineering", "B.Tech. Computer Science and Business Systems", "Computer Science and Business System", 120, False),
    ("b-tech-information-technology", "be-btech-information-technology", "B.Tech. Information Technology", "Information Technology", 240, False),
    ("b-e-electrical-and-computer-engineering", "be-btech-electrical-computer-engineering", "B.E. Electrical and Computer Engineering", "Electrical and Computer Engineering", 60, True),
    ("b-tech-fashion-technology", "be-btech-fashion-technology", "B.Tech. Fashion Technology", "Fashion Technology", 30, True),
    ("b-tech-electronics-engineering-vlsi", "be-btech-electronics-communication-engineering", "B.Tech. Electronics Engineering (VLSI Design & Technology)", "Electronics Engineering (VLSI Design and Technology)", 60, True),
]


def pslug(suffix):
    return f"tce-{suffix}"


def audience(label, intake, new):
    return {
        "availability": "restricted",
        "eligibleAudiences": [
            "Indian nationals who meet the TNEA 2026 nativity or Tamil Nadu schooling rules",
            "OCI/PIO card holders who are natives of Tamil Nadu (TNEA open category)",
            "Sri Lankan Tamil refugees who studied in Tamil Nadu and hold the required certificate",
        ],
        "restrictions": [
            "AICTE's 2026-27 approval shows NRI and international-student approval as No for every TCE course, so foreign nationals cannot be admitted on a student visa.",
            "OCI/PIO card holders qualify only if natives of Tamil Nadu and not born in a foreign country after 4 March 2021.",
            "Other-state Indian candidates qualify for TNEA only if they studied Classes 8 to 12 in Tamil Nadu or fall in another listed nativity category.",
        ],
        "notes": f"AICTE's 2026-27 Extension of Approval lists {label} with an intake of {intake}" + (" as an approved new course." if new else ".") + " Admission is through TNEA counselling under TCE's college code 5008.",
        "verifiedAt": D,
        "sourceUrl": EOA,
    }


def programme(row):
    suffix, canon, title, label, intake, new = row
    return {
        "slug": pslug(suffix),
        "canonicalCourseSlug": canon,
        "officialTitle": f"{title}, {NAME}",
        "durationYears": 4,
        "fee": {"status": "on_request", "verifiedAt": D, "notes": FEE_NOTE},
        "officialProgramUrl": PROGS,
        "audienceEligibility": audience(label, intake, new),
        "admissionsContent": {
            "overview": f"The {title} at TCE is a four-year full-time degree on the Thiruparankundram campus, Madurai. Seats are filled through Tamil Nadu's TNEA single-window counselling on Class 12 marks; there is no separate TCE entrance test." + (" 2026-27 is its first AICTE-approved intake." if new else ""),
            "eligibility": {
                "intro": "TNEA 2026 sets these conditions for the academic stream; the separate vocational stream has its own subject rules.",
                "items": [
                    "A pass in both higher-secondary years (Class 11 and 12) or an equivalent examination",
                    "General category: at least 45 per cent average in Mathematics, Physics and Chemistry at Class 12",
                    "BC/BCM, MBC/DNC and SC/SCA/ST: at least 40 per cent average in those three subjects",
                    "TNEA nativity: Tamil Nadu schooling for Classes 8 to 12, a Tamil Nadu nativity certificate or another listed category",
                    "Tamil Nadu-native OCI/PIO card holders may apply, except those born in a foreign country after 4 March 2021",
                ],
            },
            "applicationSteps": [
                "Register one online application on the TNEA portal and enter academic, school, identity and category details",
                "Upload Class 10 to 12 certificates and any community, nativity or other category documents for verification",
                "Fill and lock choices in your counselling round, entering TCE's college code 5008 with the branch code, then accept the allotment",
                "Report to TCE with the allotment order and pay the fees notified for your seat category",
            ],
            "documentsRequired": {
                "academic": ["Class 10 and Class 12 mark sheets", "School-study details for Classes 6 to 12", "Transfer or school-study certificate where claiming a reservation"],
                "application": ["Aadhaar or identity details required by the TNEA portal", "Community and nativity (or parent-employer) certificate for the category claimed", "OCI/PIO or Sri Lankan Tamil refugee certificate where applicable", "Income and first-graduate certificates only if claiming those concessions"],
            },
            "deadlinesNote": "For 2026 entry, TNEA registration ran 3 May to 5 June 2026 and general counselling 20 July to 30 August 2026. Dates for the next cycle are not yet published; check the TNEA portal.",
        },
        "medium": "",
        "instructionLanguages": [],
        "intakeMonths": [],
        "intakeCodes": [],
        "feeVerifiedAt": D,
        "feeNotes": FEE_NOTE,
        "teachingPhases": [{
            "phase": "Years 1-4",
            "language": "",
            "details": "Four-year full-time degree on the Thiruparankundram campus, run on a semester pattern with end-semester examinations. TCE is autonomous and affiliated to Anna University, Chennai." + (" AICTE approved this course as new for 2026-27." if new else ""),
        }],
    }


PROGRAMMES = [programme(r) for r in UG]

UNIVERSITY = {
    "countrySlug": "india",
    "slug": SLUG,
    "name": NAME,
    "city": "Madurai",
    "type": "Private",
    "establishedYear": 1957,
    "officialWebsite": SITE,
    "mediaAttribution": {},
    "summary": (
        "Thiagarajar College of Engineering (TCE) is a government-aided autonomous engineering college founded in 1957 at Thiruparankundram, "
        "Madurai, Tamil Nadu, and affiliated to Anna University, Chennai. AICTE's 2026-27 approval covers twelve B.E. and B.Tech programmes. "
        "Indian applicants enter through TNEA counselling; AICTE records no NRI or international-student approval."
    ),
    "campusLifestyle": (
        "TCE is at Thiruparankundram, Madurai 625015, about 8 km from Madurai railway station. Its mandatory disclosure lists classrooms, "
        "laboratories, a computer centre, library, seminar halls, a cafeteria, indoor and outdoor sports, a gymnasium and facilities for disabled "
        "students. Research units include the T S Srinivasan Centre for Automotive Research, set up with TVS Motors, and the Thiagarajar Advanced "
        "Research Centre. Student bodies run cultural, sports, literary and technical activities."
    ),
    "cityProfile": (
        "Thiagarajar College of Engineering stands at Thiruparankundram, Madurai, Tamil Nadu, postal code 625015. TNEA 2026 gives Madurai as the nearest "
        "railway station, 8 km away, and the district headquarters 12 km away. It is a different institution from Thiagarajar College, the arts and science "
        "college at Madurai, so use tce.edu and TNEA college code 5008 when you search admissions and fees. Plan housing and daily travel around "
        "this campus; college transport is listed with annual charges of INR 33,000 to 46,900."
    ),
    "practicalExposure": (
        "TCE has used the CDIO framework, Conceive, Design, Implement and Operate, for curriculum design, teaching and assessment since 2018. TVS Motors "
        "subject experts helped shape the Mechanical and Electrical Engineering curricula, and the college runs the T S Srinivasan Centre for Automotive "
        "Research with TVS Motors. As an autonomous college it designs its own curriculum and examinations while remaining affiliated to Anna University, "
        "Chennai. AICTE makes an internship mandatory for every admitted student. TNEA 2026 prints a placement figure of 89 per cent for TCE without a "
        "year or method, so treat it as indicative; no placement is guaranteed."
    ),
    "hostelOverview": (
        "TCE has permanent men's and women's hostels, each with a warden and deputy wardens; the women's hostel admits subject to availability. "
        "TNEA 2026 lists room rent of INR 3,750 a year for boys and INR 3,250 for girls, mess INR 3,200 a year, electricity INR 500 a year and a "
        "caution deposit of INR 7,500. Hostel pages publish general, maintenance, discipline and mess documents. Confirm the current charges and "
        "your allocation with the hostel office before relying on a room."
    ),
    "dietarySupport": (
        "TNEA 2026 lists the TCE hostel mess as vegetarian for both boys and girls, with a printed mess bill of INR 3,200 a year. Menus, "
        "special-diet provision and allergy handling are not published, so ask the hostel warden about individual requirements before joining."
    ),
    "safetyOverview": (
        "TCE runs a grievance redressal committee for students, staff and faculty chaired by the Principal, and its AICTE mandatory disclosure lists "
        "medical facilities and student insurance. TNEA 2026 publishes an anti-ragging helpline for the college (+91 94426 17770). Confirm hostel entry "
        "rules and night-time emergency arrangements with the warden."
    ),
    "studentSupport": (
        "The counselling division works from the campus health centre with a tutor-ward system and tele-counselling, and trains counsellors with the "
        "Chella Muthu Trust Research Foundation. The college also lists career counselling. Students Traffic counselling can help you plan TNEA choices for TCE."
    ),
    "whyChoose": [
        "UGC's autonomous-colleges list shows TCE as autonomous since 1987-88, with the current autonomy period running 2022-23 to 2031-32.",
        "AICTE's 2026-27 approval covers twelve B.E. and B.Tech programmes, including Mechatronics, Fashion Technology and Information Technology with an approved intake of 240.",
        "TCE works with TVS Motors on curricula and automotive research, and runs the CDIO framework across its programmes.",
    ],
    "thingsToConsider": [
        "TCE is not the same as Thiagarajar College, the arts and science college at Madurai; use tce.edu and TNEA code 5008.",
        "TCE publishes no programme-wise tuition, so confirm your fee with the college for your seat category before relying on any figure from a comparison site.",
        "AICTE shows no NRI or international-student approval, so foreign nationals cannot join on a student visa; only specified Tamil Nadu-native OCI/PIO and refugee applicants enter through TNEA.",
        "Electrical and Computer Engineering, Fashion Technology and VLSI Design and Technology are new for 2026-27 and have no graduating batch yet.",
    ],
    "bestFitFor": [
        "Tamil Nadu TNEA applicants from Madurai and southern districts who want an autonomous engineering college close to home.",
        "Students interested in computing and electronics: Computer Science, IT, AI and Machine Learning, Electronics and Communication and VLSI make up most of the approved intake.",
        "Applicants drawn to automotive, mechatronics or fashion technology programmes within an engineering college.",
    ],
    "industryPartners": ["TVS Motors"],
    "recognitionBadges": [
        "UGC autonomous college: 2022-23 to 2031-32",
        "AICTE - Approved institution, Permanent ID 1-429823423 (Govt aided); Extension of Approval 2026-27",
    ],
    "recognitionLinks": [
        {"label": "UGC - Autonomous colleges list", "url": UGC},
        {"label": "AICTE - Approved institutes dashboard", "url": AICTE_DASH},
    ],
    "faq": [
        {"question": "Is Thiagarajar College of Engineering the same as Thiagarajar College, Madurai?",
         "answer": "No. Thiagarajar College of Engineering (tce.edu) is the engineering, architecture and planning college at Thiruparankundram. Thiagarajar College (tcarts.in) is a separate arts and science college, so do not reuse that college's admissions or fees."},
        {"question": "Is Thiagarajar College of Engineering autonomous?",
         "answer": "Yes. UGC's autonomous-colleges list shows Thiagarajar College of Engg., Madurai, affiliated to Anna University, Chennai, autonomous since 1987-88 with the current period running 2022-23 to 2031-32. TNEA 2026 also lists its autonomous status as Yes."},
        {"question": "Is Thiagarajar College of Engineering a government or private college?",
         "answer": "It is government-aided and privately managed. AICTE records it as Govt aided, run by the Kalaithanthai Karumuttu Thiagaraja Chettiar Memorial Charitable Trust. Aid does not make it a government-owned college."},
        {"question": "Is Thiagarajar College of Engineering AICTE approved?",
         "answer": "Yes. AICTE's Extension of Approval for 2026-27, dated 11 May 2026 under permanent ID 1-429823423, covers twelve B.E./B.Tech programmes at TCE. Electrical and Computer Engineering, Fashion Technology and VLSI Design and Technology are approved as new courses."},
        {"question": "How do I get admission to B.E. or B.Tech at Thiagarajar College of Engineering?",
         "answer": "Admission is through Tamil Nadu's TNEA counselling: register on the TNEA portal, get a rank from Class 12 Mathematics, Physics and Chemistry marks, and choose TCE's college code 5008 with a branch code. TCE reports a single-window route and no separate entrance test."},
        {"question": "What marks do I need to apply to Thiagarajar College of Engineering?",
         "answer": "TNEA 2026 asks for a pass in both higher-secondary years with an average of at least 45 per cent in Mathematics, Physics and Chemistry for the general category, or 40 per cent for BC, BCM, MBC/DNC, SC, SCA and ST. The vocational stream has separate subject rules."},
        {"question": "Can international or NRI students join Thiagarajar College of Engineering?",
         "answer": "AICTE's 2026-27 approval marks NRI and international-student approval as No for every course. TNEA permits only Tamil Nadu-native OCI/PIO card holders, excluding those born abroad after 4 March 2021, and eligible Sri Lankan Tamil refugees who studied in Tamil Nadu."},
        {"question": "What is the fee at Thiagarajar College of Engineering?",
         "answer": "TCE does not publish programme-wise tuition and TNEA 2026 prints none, so tuition is on request. TNEA 2026 lists an admission fee of INR 4,000, establishment charges of INR 29,000 and a caution deposit of INR 7,500. Confirm the fee for your seat category with the college."},
        {"question": "Which programmes does Thiagarajar College of Engineering offer through TNEA?",
         "answer": "AICTE approves Civil, Computer Science and Engineering, Computer Science and Business Systems, AI and Machine Learning, Electrical and Computer, Electrical and Electronics, Electronics and Communication, VLSI Design and Technology, Mechanical, Mechatronics, Information Technology and Fashion Technology for 2026-27."},
        {"question": "Does Thiagarajar College of Engineering have hostels?",
         "answer": "Yes. TCE has permanent men's and women's hostels with a vegetarian mess. TNEA 2026 lists room rent of INR 3,750 a year for boys and INR 3,250 for girls, mess INR 3,200 a year and a INR 7,500 caution deposit. The women's hostel admits subject to availability."},
        {"question": "Does Thiagarajar College of Engineering offer postgraduate and design programmes?",
         "answer": "Yes, its programme directory also lists B.Arch., B.Des. Interior Design, an integrated M.Sc. Data Science, five M.E. routes, MCA and M.Plan. This page covers the twelve B.E./B.Tech programmes; ask Students Traffic about the others."},
    ],
    "researchSources": [
        {"label": "TCE - Programmes offered", "url": PROGS, "kind": "official-program", "checkedAt": D},
        {"label": "TCE - B.E./B.Tech admission", "url": ADM_BE, "kind": "official-university", "checkedAt": D},
        {"label": "TCE - Admissions 2026-27", "url": ADM_2627, "kind": "official-university", "checkedAt": D},
        {"label": "TCE - About the college", "url": ABOUT, "kind": "official-university", "checkedAt": D},
        {"label": "AICTE - Extension of Approval 2026-27 (TCE)", "url": EOA, "kind": "government", "checkedAt": D},
        {"label": "TCE - Mandatory Disclosure 2025-26", "url": MD, "kind": "official-university", "checkedAt": D},
        {"label": "UGC - Autonomous colleges list", "url": UGC, "kind": "recognition", "checkedAt": D},
        {"label": "DoTE Tamil Nadu - TNEA 2026 Information about colleges", "url": TNEA_IAC, "kind": "government", "checkedAt": D},
        {"label": "DoTE Tamil Nadu - TNEA 2026 Information Brochure", "url": TNEA_BR, "kind": "government", "checkedAt": D},
        {"label": "DoTE Tamil Nadu - TNEA 2026 Tentative Schedule", "url": TNEA_SCHED, "kind": "government", "checkedAt": D},
        {"label": "TCE - Men's hostel", "url": MEN_H, "kind": "official-university", "checkedAt": D},
        {"label": "TCE - Women's hostel", "url": WOMEN_H, "kind": "official-university", "checkedAt": D},
        {"label": "TCE - Counselling division", "url": COUNSEL, "kind": "official-university", "checkedAt": D},
    ],
    "admissionsContent": {
        "contentState": "research_ready",
        "scope": "This record covers Thiagarajar College of Engineering at Thiruparankundram, Madurai only. Thiagarajar College (arts and science) is a separate institution.",
        "sectionStates": {
            "decisionSummary": "published", "eligibility": "published", "fees": "research_ready", "admissions": "published",
            "academics": "research_ready", "recognition": "published", "studentLiving": "published",
            "scholarships": "absent", "funding": "absent", "placements": "absent",
        },
        "ctas": [
            {"trigger": "eligibility", "label": "Check my TCE eligibility", "capture": ["nationality and Tamil Nadu nativity or schooling", "Class 12 board and MPC marks", "community category", "intended branch"]},
            {"trigger": "fees", "label": "Get the TCE fee for my branch", "capture": ["intended branch", "seat category", "hostel and transport needs", "concession eligibility"]},
            {"trigger": "application", "label": "Plan my TNEA choices for TCE", "capture": ["TNEA rank or expected cut-off", "preferred branches", "document readiness"]},
        ],
    },
    "programmes": PROGRAMMES,
}


def ev(entity, field, claim, label, url, grade="A", notes=None, ps=None, status="verified", checked=D):
    e = {"entity": entity, "universitySlug": SLUG}
    if ps:
        e["programmeSlug"] = ps
    e.update({"publicField": field, "claimText": claim, "status": status, "sourceLabel": label, "sourceUrl": url,
              "sourceGrade": grade, "checkedAt": checked, "reviewBy": REVIEW})
    if notes:
        e["internalNotes"] = notes
    return e


EOA_LABEL = "AICTE - Extension of Approval 2026-27 (TCE)"
EOA_NOTE = ("AICTE dashboard facilities.aicte-india.org not queried (JavaScript app); the 2026-27 EoA letter (F.No. Southern/1-46268251099/2026/EOA, 11-May-2026) "
            "is the primary AICTE record, saved at " + BUNDLE + "aicte-eoa-2026-27.pdf (scanned; read from rendered pages).")
UGC_CLAIM = "UGC autonomous colleges list row 1201: Tamil Nadu, Thiagarajar College of Engg., Madurai - 625 015, autonomous from 1987-1988, current period 2022-2023 to 2031-2032, affiliating university Anna University, Chennai."
EOA_CLAIM = ("AICTE EoA 2026-27: Thiagarajar College of Engineering, Tiruparankundram, Madurai 625015; permanent ID 1-429823423; trust Kalaithanthai Karumuttu Thiagaraja "
             "Chettiar Memorial Charitable Trust; institution type Govt aided; EoA year of establishment field reads 1995; NRI and international-student approval No for every course.")

EVIDENCE = [
    ev("university", "identity", EOA_CLAIM, EOA_LABEL, EOA, notes=EOA_NOTE + " Mandatory disclosure 2025-26 also gives type Govt. Aided and the same trust."),
    ev("university", "identity", "TNEA 2026 college booklet p.382, college 5008: Thiagarajar College of Engineering (Autonomous), Tirupparankundram, Madurai 625015; principal Dr L Ashok Kumar; autonomous status Yes; minority status No; nearest railway station Madurai, 8 km; district HQ 12 km.", "DoTE Tamil Nadu - TNEA 2026 Information about colleges", TNEA_IAC, notes="Page image saved at " + BUNDLE + "tnea-colleges-2026-code-5008-page.png."),
    ev("university", "establishedYear", "The college About page states it was founded in 1957 by Karumuttu Thiagarajan Chettiar; TNEA 2026 lists branch start years from 1957 (Civil, Mechanical, Electrical).", "TCE - About the college", ABOUT, notes="The AICTE EoA 'Year of Establishment' field reads 1995 (rendered page 1); a regulatory data-entry field, not used for institutional history."),
    ev("university", "type", "AICTE EoA 2026-27 and mandatory disclosure 2025-26 classify the institution as Govt aided, run by a charitable trust; shown as Private in the binary type field with the aided, trust-managed status stated in public copy.", EOA_LABEL, EOA, status="indicative", notes="Integrator classification: aided does not mean government-owned."),
    ev("university", "recognition", UGC_CLAIM, "UGC - Autonomous colleges list", UGC, notes="Fetched by plain GET 2026-10-27; excerpt saved at " + BUNDLE + "ugc-autonomous-list-excerpt.txt."),
    ev("university", "recognitionBadges", "AICTE EoA 2026-27 approves twelve UG engineering/technology courses plus B.Des. Interior Design and seven PG courses, all under Anna University, Chennai.", EOA_LABEL, EOA, notes=EOA_NOTE),
    ev("university", "summary", "UGC list (autonomous, affiliated to Anna University); AICTE EoA 2026-27 (twelve B.E./B.Tech courses, NRI and international No); About page (founded 1957, Govt aided autonomous, affiliated to Anna University).", "TCE - About the college", ABOUT),
    ev("university", "campusLifestyle", "Mandatory disclosure 2025-26 section 14: classrooms, laboratories, computer centre, library, seminar halls, cafeteria, indoor and outdoor sports, gymnasium, facilities for disabled all Yes; section 18 student activity bodies for cultural, sports, literary and technical activities. About page: T S Srinivasan Centre for Automotive Research with TVS Motors; research-centre menu lists Thiagarajar Advanced Research Centre. TNEA 2026: nearest railway station Madurai 8 km.", "TCE - Mandatory Disclosure 2025-26", MD, notes="Text copy at " + BUNDLE + "tce-mandatory-disclosure-2025-26.txt. Centres: " + ABOUT + "."),
    ev("university", "cityProfile", "TNEA 2026 college 5008: address Thiruparankundram, Madurai, pincode 625015; nearest railway station Madurai 8 km; district headquarters 12 km; transport facility Yes, INR 33,000-46,900 per annum. Ledger: Thiagarajar College (tcarts.in) is a separate published institution.", "DoTE Tamil Nadu - TNEA 2026 Information about colleges", TNEA_IAC),
    ev("university", "practicalExposure", "About page: CDIO framework adopted in 2018; TVS Motors subject matter experts co-created Mechanical and Electrical Engineering curricula; T S Srinivasan Centre for Automotive Research with TVS Motors. UGC autonomous status. AICTE EoA 2026-27 instructions: internship mandatory for all admitted students. TNEA 2026 college page prints placement 89%.", "TCE - About the college", ABOUT, notes="The 89% placement figure is self-reported to DoTE with no year or definition; published only as indicative. EoA instruction 8: " + EOA),
    ev("university", "hostelOverview", "TNEA 2026 college 5008: hostel for boys and girls available for UG, permanent; room rent boys 3,750 and girls 3,250 per annum; electricity 500; caution deposit 7,500; mess bill 3,200 per annum. Hostel pages list warden and deputy wardens and general, maintenance, discipline and mess documents; the women's hostel page makes accommodation subject to availability.", "DoTE Tamil Nadu - TNEA 2026 Information about colleges", TNEA_IAC, notes="Hostel pages: " + MEN_H + " and " + WOMEN_H + ". Hostel PDFs not read."),
    ev("university", "dietarySupport", "TNEA 2026 college 5008: type of mess veg for boys and girls; mess bill 3,200 per annum. Hostel pages link a mess document but publish no menu.", "DoTE Tamil Nadu - TNEA 2026 Information about colleges", TNEA_IAC),
    ev("university", "safetyOverview", "Mandatory disclosure 2025-26: grievance redressal mechanism for faculty, staff and students chaired by the Principal; medical facilities Yes; student insurance Yes. TNEA 2026 college 5008: anti-ragging phone 9442617770.", "TCE - Mandatory Disclosure 2025-26", MD),
    ev("university", "studentSupport", "Counselling division page: counselling cell at the health centre, tutor-ward system, tele-counselling, orientation and training link with Chella Muthu Trust Research Foundation. Mandatory disclosure: career counselling Yes.", "TCE - Counselling division", COUNSEL),
    ev("university", "whyChoose", "UGC row 1201 (autonomy since 1987-88, period 2022-23 to 2031-32); AICTE EoA 2026-27 (twelve UG courses; IT intake 240); About page (TVS Motors curricula and research centre; CDIO).", EOA_LABEL, EOA),
    ev("university", "thingsToConsider", "AICTE EoA 2026-27: NRI and international-student approval No for every course; Electrical and Computer Engineering (60), Fashion Technology (30) and VLSI Design and Technology (60) marked approved new courses (2025-26 intake 0). No programme-wise tuition on tce.edu admission pages or TNEA 2026. Ledger: tcarts.in is a separate institution.", EOA_LABEL, EOA),
    ev("university", "bestFitFor", "AICTE EoA 2026-27 intakes: CSE 180, CSBS 120, AI&ML 60, IT 240, ECE 180, VLSI 60, Electrical and Computer 60 of 1,350 B.E./B.Tech places (Civil 120, EEE 120, Mechanical 120, Mechatronics 60, Fashion Technology 30).", EOA_LABEL, EOA),
    ev("university", "faq", "TNEA 2026 schedule: registration 03.05.2026 to 05.06.2026; general counselling 20.07.2026 to 30.08.2026. Brochure: eligibility 45 per cent general and 40 per cent BC/BCM/MBC/DNC/SC/SCA/ST average in Mathematics, Physics and Chemistry; OCI/PIO natives of Tamil Nadu eligible except those born abroad after 04.03.2021; Sri Lankan Tamil refugees who studied in Tamil Nadu considered under open competition.", "DoTE Tamil Nadu - TNEA 2026 Tentative Schedule", TNEA_SCHED, notes="Brochure excerpt: " + BUNDLE + "tnea-brochure-2026-eligibility-excerpt.txt (" + TNEA_BR + ")."),
    ev("university", "faq", "TCE programmes-offered page lists 22 taught awards: twelve B.E./B.Tech, B.Arch. (5 years), B.Des. Interior Design (4 years), integrated M.Sc. Data Science (5 years), five M.E. routes, MCA and M.Plan.", "TCE - Programmes offered", PROGS),
    ev("university", "faq", "TCE B.E./B.Tech admission page and Admissions 2026-27 page: first-year B.E./B.Tech/B.Des. admission through TNEA counselling; merit basis.", "TCE - Admissions 2026-27", ADM_2627, grade="B"),
]

for row in UG:
    suffix, canon, title, label, intake, new = row
    ps = pslug(suffix)
    EVIDENCE += [
        ev("programme", "intake", f"Intake month not stated by TCE or TNEA for this programme; no intake month asserted. AICTE EoA 2026-27 approves {label} (Anna University, Chennai) with intake {intake}" + (" as a new course (2025-26 intake 0)." if new else "."), EOA_LABEL, EOA, status="omit", ps=ps, notes=EOA_NOTE),
        ev("programme", "medium", "Medium of instruction is not stated on tce.edu or in the TNEA documents; language facets are left empty rather than inferred.", "TCE - Programmes offered", PROGS, status="omit", ps=ps),
        ev("programme", "officialTitle", f"TCE programmes-offered page lists {title}, 4 years, Thiruparankundram campus.", "TCE - Programmes offered", PROGS, ps=ps),
        ev("programme", "durationYears", f"{title}: 4 years (programmes-offered page; AICTE EoA 2026-27 lists the course as undergraduate).", "TCE - Programmes offered", PROGS, ps=ps),
        ev("programme", "audienceEligibility", "TNEA 2026 permits Tamil Nadu-native OCI/PIO applicants (not those born abroad after 04.03.2021) and eligible Sri Lankan Tamil refugees; AICTE EoA 2026-27 shows NRI and international-student approval No.", "DoTE Tamil Nadu - TNEA 2026 Information Brochure", TNEA_BR, ps=ps, notes="EoA: " + EOA),
        ev("programme", "eligibility", "TNEA 2026 academic stream: pass in both HSC years with a minimum average of 45% (general) or 40% (BC/BCM/MBC/DNC/SC/SCA/ST) in Mathematics, Physics and Chemistry; nativity rules; OCI/PIO natives of Tamil Nadu except those born abroad after 04.03.2021.", "DoTE Tamil Nadu - TNEA 2026 Information Brochure", TNEA_BR, ps=ps, notes="Excerpt: " + BUNDLE + "tnea-brochure-2026-eligibility-excerpt.txt"),
        ev("programme", "admissions", "TNEA 2026: one online application, certificate verification, counselling choice filling and allotment; TCE admission pages route first-year B.E./B.Tech admission through TNEA counselling.", "DoTE Tamil Nadu - TNEA 2026 Information Brochure", TNEA_BR, ps=ps, notes="TCE page: " + ADM_2627),
        ev("programme", "teachingPhases", f"{title}: 4 years, full-time on-campus (programmes-offered page); mandatory disclosure 2025-26: semester pattern with end-semester examinations; affiliated to Anna University, Chennai.", "TCE - Programmes offered", PROGS, ps=ps, notes="Disclosure: " + MD),
        ev("programme", "fee", "TCE admission pages and the TNEA 2026 college booklet print no programme-wise tuition; TNEA 2026 lists admission fee 4,000, establishment charges 29,000, caution deposit 7,500, hostel and transport charges for college 5008. Tuition stays on request.", "DoTE Tamil Nadu - TNEA 2026 Information about colleges", TNEA_IAC, ps=ps, notes="Third-party (Shiksha) ranges rejected: aggregated across programmes, historical, or duration-conflicting; not used."),
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
with open(os.path.join(os.path.dirname(OUT), "manifest.json"), "w") as fh:
    json.dump({
        "version": 1,
        "id": MIG,
        "description": "Publish Thiagarajar College of Engineering, Madurai (government-aided autonomous college affiliated to Anna University; AICTE 1-429823423; TNEA code 5008) with its twelve AICTE 2026-27 approved B.E./B.Tech programmes.",
        "createdAt": D,
        "payload": "payload.json",
    }, fh, indent=2)
    fh.write("\n")
print(OUT, len(PROGRAMMES), "programmes", len(EVIDENCE), "evidence")

cols = ["university_slug", "programme_official_title", "level", "discipline", "duration", "campus", "delivery_mode",
        "intl_status", "intl_evidence_url", "official_source_url", "other_sources", "already_on_site",
        "existing_offering_slug", "canonical_course_match", "notes"]
CAMPUS = "Thiruparankundram, Madurai"
rows = []
for r in UG:
    suffix, canon_s, title, label, intake, new = r
    rows.append([SLUG, title, "UG", "engineering", "4 years", CAMPUS, "full-time on-campus", "not_open", EOA, PROGS, f"{TNEA_IAC}; {TNEA_BR}", "no", "", canon_s,
                 f"PACKAGED (availability=restricted). AICTE EoA 2026-27 intake {intake}" + (" (new course)" if new else "") + "; NRI/international No; only TN-native OCI/PIO and refugee categories via TNEA."])
held = [
    ("B.Arch. Architecture", "UG", "architecture", "5 years", "HELD: current eligibility (CoA/NATA) not verified; not in AICTE EoA"),
    ("B.Des. (Interior Design)", "UG", "design", "4 years", "HELD: qualifying subjects and admission scheme for current cycle not established"),
    ("M.Sc. (Data Science) 5 Years Integrated", "Integrated", "data-science", "5 years", "HELD: current minimum aggregate/eligibility not verified"),
    ("M.E. Structural Engineering", "PG", "engineering", "2 years", "HELD: current CEETA-PG qualification matrix not captured"),
    ("M.E. Construction Engineering and Management", "PG", "engineering", "2 years", "HELD: current CEETA-PG qualification matrix not captured"),
    ("M.E. Communication Systems", "PG", "engineering", "2 years", "HELD: current CEETA-PG qualification matrix not captured"),
    ("M.E. Computer Science and Engineering", "PG", "engineering", "2 years", "HELD: current CEETA-PG qualification matrix not captured"),
    ("M.E. Embedded System Technologies", "PG", "engineering", "2 years", "HELD: current CEETA-PG qualification matrix not captured"),
    ("MCA", "PG", "computer-applications", "2 years", "HELD: current eligibility/TANCET route facts not packaged in this pass"),
    ("M.Plan (Urban Planning)", "PG", "planning", "2 years", "HELD: current eligibility and exam not verified"),
    ("M.S. (By Research) / Ph.D.", "Research", "research", "variable", "HELD: standard duration, supervisor vacancies and current call unverified"),
]
for t, lv, disc, dur, note in held:
    rows.append([SLUG, t, lv, disc, dur, CAMPUS, "full-time on-campus", "unknown", "", PROGS, "", "no", "", "", note])
os.makedirs(os.path.join(ROOT, "research", "india-programme-inventory"), exist_ok=True)
with open(os.path.join(ROOT, "research", "india-programme-inventory", f"{SLUG}.csv"), "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(cols)
    w.writerows(rows)
