"""Build content-migrations/0402-india-annai-mira-college-of-engineering-and-technology/payload.json.

Owner claude-tn-amcet-20261027. Checked 2026-10-27. Run from repo root:
    python3 -I research-drafts/india/annai-mira-college-build.py
Source copies: research/india-source-bundles/annai-mira-college-of-engineering-and-technology/
"""
import csv
import glob
import json
import os

ROOT = os.getcwd()
MIG = "0402-india-annai-mira-college-of-engineering-and-technology"
OUT = os.path.join(ROOT, "content-migrations", MIG, "payload.json")
D = "2026-10-27"
REVIEW = "2027-04-27"
SLUG = "annai-mira-college-of-engineering-and-technology"
NAME = "Annai Mira College of Engineering and Technology"
N = "Annai Mira College of Engineering and Technology (AMCET)"

SITE = "https://amcet.in/"
ADM = "https://amcet.in/admissions/"
MD_PAGE = "https://amcet.in/about-amcet/mandatory-disclosures/"
MD = "https://amcet.in/wp-content/uploads/2026/03/mandatory-disclosure-2026.pdf"
EOA = "https://amcet.in/wp-content/uploads/2026/06/EOA-Report-26-27.pdf"
AICTE_DASH = "https://facilities.aicte-india.org/dashboard/pages/angulardashboard.php#!/approved"
AU_DIST = "https://www.annauniv.edu/cai/District%20wise/district/Ranipet.php"
TNEA_IAC = "https://static.tneaonline.org/docs/Information_about_colleges_2026.pdf"
TNEA_BR = "https://static.tneaonline.org/docs/2_Information_Brochure_2026.pdf"
TNEA_SCHED = "https://static.tneaonline.org/docs/TNEA_Tentative_Schedule_2026.pdf"
MBA_BOOKLET = "https://static.tn-mbamca.com/docs/TNMBAMCA-ENGINEERING-COLLEGES-BOOKLET-2026.pdf"
MBA_INSTR = "https://static.tn-mbamca.com/docs/MBA_Instructions.pdf?t=1781654400022"
MCA_INSTR = "https://static.tn-mbamca.com/docs/MCA_Instructions.pdf"
AU_CAL = "https://cac.annauniv.edu/Annoucement/Calender%20-%20Affi/Jul-Nov%202026/UG%20%26%20MBAMCA%20Calendar%20I%20Sem.pdf"
AU_REG_UG = "https://cac.annauniv.edu/aidetails/reg/R2025/ACADEMIC%20REGULATIONS%202025).pdf"
LIB = "https://amcet.in/infrastructure/central-library/"
HOSTEL = "https://amcet.in/infrastructure/hostel/"
LABS = "https://amcet.in/infrastructure/laboratories/"
ABOUT = "https://amcet.in/about-amcet/"
COURSES = "https://amcet.in/academics/courses-offered/"

FEE_NOTE = (
    f"{N} publishes no tuition figure (checked 27 October 2026): its admissions page says only that a management-quota "
    "seat is confirmed by paying 50 per cent of the fee prescribed by AICTE and Anna University, and the TNEA 2026 college "
    "booklet prints no college-wise tuition, so tuition is on request from the college. Tamil Nadu's fee committee fixes "
    "tuition for self-financing engineering colleges. TNEA 2026 lists AMCET's other charges: admission fee INR 1,500, "
    "caution deposit INR 5,000, hostel room rent and mess together about INR 1.08 lakh a year, hostel electricity INR 2,000 "
    "a year and college transport INR 16,000 to 30,000 a year."
)
FEE_NOTE_PG = (
    f"{N} publishes no tuition figure for its postgraduate programmes (checked 27 October 2026); the 2026-27 Tamil Nadu "
    "MBA/MCA booklet states that tuition is collected as per Government norms without printing an amount, so tuition is on "
    "request. The same booklet lists an admission fee of INR 1,500, a caution deposit of INR 5,000, hostel room rent and "
    "mess together about INR 1.08 lakh a year and hostel electricity of INR 2,000 a year."
)

# suffix, canonical, title, TNEA code, intake 2026-27 (AICTE EoA), start year, dept label, curriculum detail
UG = [
    ("be-civil-engineering", "be-btech-civil-engineering", "B.E. Civil Engineering", "CE", 30, 2012, "Civil Engineering",
     "Anna University's Civil Engineering curriculum covering structural analysis, surveying, soil mechanics, concrete technology and transportation engineering."),
    ("be-computer-science-engineering", "be-btech-computer-science-engineering", "B.E. Computer Science and Engineering", "CS", 120, 2012, "Computer Science and Engineering",
     "Anna University's Computer Science and Engineering curriculum covering programming, data structures, operating systems, database management, computer networks and software engineering."),
    ("be-computer-science-engineering-ai-ml", "be-btech-artificial-intelligence-machine-learning", "B.E. Computer Science and Engineering (Artificial Intelligence and Machine Learning)", "AM", 60, 2026, "Artificial Intelligence and Machine Learning",
     "Anna University's curriculum in computer science with artificial intelligence and machine learning, covering Python, data structures, machine learning, deep learning and data analytics."),
    ("be-electrical-electronics-engineering", "be-btech-electrical-electronics-engineering", "B.E. Electrical and Electronics Engineering", "EE", 30, 2012, "Electrical and Electronics Engineering",
     "Anna University's Electrical and Electronics Engineering curriculum covering circuits, electrical machines, power systems, power electronics and control systems."),
    ("be-electronics-communication-engineering", "be-btech-electronics-communication-engineering", "B.E. Electronics and Communication Engineering", "EC", 60, 2012, "Electronics and Communication Engineering",
     "Anna University's Electronics and Communication Engineering curriculum covering circuits, signals and systems, digital electronics, communication systems and VLSI."),
    ("be-mechanical-engineering", "be-btech-mechanical-engineering", "B.E. Mechanical Engineering", "ME", 60, 2012, "Mechanical Engineering",
     "Anna University's Mechanical Engineering curriculum covering thermodynamics, fluid mechanics, manufacturing processes, machine design and CAD/CAM."),
    ("btech-artificial-intelligence-data-science", "be-btech-data-science", "B.Tech. Artificial Intelligence and Data Science", "AD", 120, 2021, "Artificial Intelligence and Data Science",
     "Anna University's Artificial Intelligence and Data Science curriculum covering programming, statistics, machine learning, big data analytics and deep learning."),
    ("btech-information-technology", "be-btech-information-technology", "B.Tech. Information Technology", "IT", 60, 2023, "Information Technology",
     "Anna University's Information Technology curriculum covering programming, data structures, database systems, web technologies, networks and cloud computing."),
]

MEDIUM_NOTE = "Anna University's Academic Regulations 2025 for affiliated colleges set English as the medium of instruction for all B.E./B.Tech programmes, and AMCET is a non-autonomous affiliated college."


def audience(kind, code, intake, start):
    if kind == "ug":
        return {
            "availability": "restricted",
            "eligibleAudiences": [
                "Indian nationals meeting TNEA 2026 nativity or Tamil Nadu schooling rules (government-quota seats)",
                "Indian nationals applying to the college for management-quota seats",
                "OCI/PIO card holders who are natives of Tamil Nadu (TNEA open competition)",
            ],
            "restrictions": [
                "AICTE's 2026-27 approval shows NRI and international-student approval as No for every AMCET course, so foreign nationals cannot be admitted on a student visa.",
                "TNEA government-quota seats are open only to Indian nationals; OCI/PIO card holders qualify only if natives of Tamil Nadu and not born abroad after 4 March 2021.",
                "Other-state Indian candidates qualify for TNEA only if they studied Classes 8 to 12 in Tamil Nadu or meet another TNEA nativity category.",
            ],
            "notes": f"The college admits men and women. Indian applicants enter through TNEA 2026 (college code 1137, branch code {code}) or the management quota. AICTE approves an intake of {intake} for 2026-27; the course started in {start}; TNEA 2026 lists it as not NBA accredited.",
            "verifiedAt": D,
            "sourceUrl": EOA,
        }
    return {
        "availability": "restricted",
        "eligibleAudiences": [
            f"Indian graduates who meet the Tamil Nadu {kind.upper()} 2026-27 counselling rules and took TANCET 2026 ({kind.upper()})",
            "OCI/PIO card holders who are natives of Tamil Nadu (open category in state MBA/MCA counselling)",
            "Indian graduates applying to the college for management-quota seats",
        ],
        "restrictions": [
            f"AICTE's 2026-27 approval shows NRI and international-student approval as No for the {kind.upper()}, so foreign nationals cannot be admitted on a student visa.",
            f"State counselling seats need a TANCET 2026 ({kind.upper()}) mark sheet; OCI/PIO card holders qualify only if natives of Tamil Nadu and not born abroad after 4 March 2021.",
            "Communal reservation applies only to Tamil Nadu native candidates.",
        ],
        "notes": f"AICTE approves an intake of {intake} for 2026-27 and the Tamil Nadu MBA/MCA 2026-27 booklet lists AMCET (college code 1137) with {kind.upper()} started in {start}.",
        "verifiedAt": D,
        "sourceUrl": EOA,
    }


def ug_programme(row):
    suffix, canon, title, code, intake, start, label, phase = row
    new = start == 2026
    return {
        "slug": f"amcet-{suffix}",
        "canonicalCourseSlug": canon,
        "officialTitle": f"{title}, {NAME}",
        "durationYears": 4,
        "fee": {"status": "on_request", "verifiedAt": D, "notes": FEE_NOTE},
        "officialProgramUrl": COURSES,
        "audienceEligibility": audience("ug", code, intake, start),
        "admissionsContent": {
            "overview": f"The {title} at {N} is a four-year, eight-semester English-medium degree at Arappakkam near Vellore, awarded by Anna University. TNEA counselling on Class 12 marks fills 65 per cent of seats and the management quota 35 per cent; there is no entrance test." + (" 2026 is its first intake." if new else ""),
            "eligibility": {
                "intro": "AMCET's admissions page and the TNEA 2026 brochure set these conditions for B.E./B.Tech admission.",
                "items": [
                    "Pass in HSC (academic or vocational stream) or an equivalent exam recognised by Anna University, with Mathematics, Physics and Chemistry",
                    "Minimum marks: 45 per cent for the OC category and 40 per cent for BC, BCM, MBC/DNC, SC/SCA and ST",
                    "TNEA nativity rules apply to government-quota seats: Tamil Nadu schooling for Classes 8 to 12, a Tamil Nadu nativity certificate, or another listed category",
                    "Tamil Nadu State Board diploma holders in engineering or technology may apply for direct second-year (lateral entry) admission",
                ],
            },
            "applicationSteps": [
                "Register and apply online at tneaonline.org (registration fee INR 500, or INR 250 for SC/SCA/ST); TNEA 2026 registration ran 3 May to 5 June 2026",
                "Upload Class 10, 11 and 12 mark sheets, transfer certificate and any community, nativity, income or first-graduate certificates for verification",
                "Check the TNEA rank, computed from Mathematics (100), Physics (50) and Chemistry (50), on the published rank list",
                f"Fill choices online in your counselling round, entering college code 1137 with branch {code}, then confirm the tentative allotment",
                "Download the allotment order, report to AMCET within 5 days and pay the fees to complete admission",
                "For a management-quota seat, submit the admission form and documents to the AMCET admission cell (hotline +91 99523 87017); seats go first come, first served after an eligibility check, and 50 per cent of the prescribed fee confirms the seat",
            ],
            "documentsRequired": {
                "academic": ["Class 10 mark sheet", "Class 11 (HSC first year) mark sheet", "Class 12 (HSC second year) or equivalent mark sheet", "Transfer certificate"],
                "application": ["Permanent community certificate where claiming reservation", "Nativity e-certificate where applicable", "Income certificate and first-graduate e-certificate where claiming concessions", "Aadhaar details"],
            },
            "deadlinesNote": "For 2026 entry, TNEA registration closed on 5 June 2026 and general counselling ran 20 July to 30 August 2026. Anna University's calendar for non-autonomous affiliated colleges starts first-semester classes on 2 September 2026, with end-semester exams from 22 December 2026.",
        },
        "medium": "English",
        "mediumNote": MEDIUM_NOTE,
        "instructionLanguages": ["english"],
        "intakeMonths": ["September"],
        "intakeCodes": ["september"],
        "feeVerifiedAt": D,
        "feeNotes": FEE_NOTE,
        "teachingPhases": [{"phase": "Years 1-4 (8 semesters)", "language": "English",
                            "details": phase + " Anna University sets the syllabus and end-semester exams; the college runs internal assessment and internship is mandatory."}],
    }


def mba_programme():
    return {
        "slug": "amcet-mba",
        "canonicalCourseSlug": "mba",
        "officialTitle": f"Master of Business Administration (MBA), {NAME}",
        "durationYears": 2,
        "fee": {"status": "on_request", "verifiedAt": D, "notes": FEE_NOTE_PG},
        "officialProgramUrl": "https://amcet.in/academics/courses-offered/mba/",
        "audienceEligibility": audience("mba", "MBA", 60, 2023),
        "admissionsContent": {
            "overview": f"The MBA at {N} is a two-year, four-semester English-medium degree at Arappakkam near Vellore, awarded by Anna University. Seats are filled through Tamil Nadu's MBA counselling on TANCET scores and by the college.",
            "eligibility": {
                "intro": "The Tamil Nadu MBA 2026-27 counselling instructions set these conditions for state-quota seats at AMCET.",
                "items": [
                    "A recognised bachelor's degree of at least three years",
                    "At least 50 per cent in the qualifying degree (45 per cent for Tamil Nadu BC, BCM, MBC/DNC, SC, SCA and ST candidates)",
                    "10+2+3/4/5, 10 + 3-year diploma + degree, lateral-entry diploma + degree and AMIE with two years' experience are accepted patterns",
                    "TANCET 2026 (MBA) mark sheet issued by Anna University",
                    "Degrees taken by distance or weekend B.E./B.Tech study, or without Class 10 and 12 or a diploma, are not eligible",
                ],
            },
            "applicationSteps": [
                "Take TANCET 2026 (MBA), conducted by Anna University, and download the mark sheet",
                "Register online for Tamil Nadu MBA 2026-27 counselling and upload degree, school and community documents",
                "Choose college code 1137 (AMCET) in counselling and confirm the allotment",
                "Report to the college with the allotment order and pay the fees; for a management-quota seat, apply to the college directly through its online PG application",
            ],
            "documentsRequired": {
                "academic": ["Bachelor's degree certificate and mark sheets for all semesters", "Class 10 and Class 12 (or diploma) mark sheets", "Transfer certificate"],
                "application": ["TANCET 2026 (MBA) mark sheet", "Community certificate where claiming reservation", "Nativity certificate where applicable"],
            },
            "deadlinesNote": "Anna University's calendar for affiliated colleges starts first-semester MBA classes on 2 September 2026, with end-semester exams from 22 December 2026.",
        },
        "medium": "English",
        "mediumNote": "AMCET is an affiliated college; Anna University's MBA curriculum is taught in English.",
        "instructionLanguages": ["english"],
        "intakeMonths": ["September"],
        "intakeCodes": ["september"],
        "feeVerifiedAt": D,
        "feeNotes": FEE_NOTE_PG,
        "teachingPhases": [{"phase": "Years 1-2 (4 semesters)", "language": "English",
                            "details": "AMCET's MBA runs Anna University's four-semester curriculum: statistics, managerial economics, accounting, financial and human resource management, marketing, business analytics and strategic management, with professional electives, a summer internship and a project in the final semester."}],
    }


def mca_programme():
    return {
        "slug": "amcet-mca",
        "canonicalCourseSlug": "mca",
        "officialTitle": f"Master of Computer Applications (MCA), {NAME}",
        "durationYears": 2,
        "fee": {"status": "on_request", "verifiedAt": D, "notes": FEE_NOTE_PG},
        "officialProgramUrl": "https://amcet.in/academics/courses-offered/mca-master-of-computer-applications/",
        "audienceEligibility": audience("mca", "MCA", 60, 2026),
        "admissionsContent": {
            "overview": f"The MCA at {N} is a two-year, four-semester English-medium degree at Arappakkam near Vellore, awarded by Anna University. 2026 is its first intake. Seats are filled through Tamil Nadu's MCA counselling on TANCET scores and by the college.",
            "eligibility": {
                "intro": "The Tamil Nadu MCA 2026-27 counselling instructions set these conditions for state-quota seats at AMCET.",
                "items": [
                    "A pass in B.C.A., B.Sc. (Computer Science), B.Sc. (IT), B.E. (CSE), B.Tech. (IT) or an equivalent degree, or any graduation degree with Mathematics at Class 12 or degree level",
                    "At least 50 per cent in the qualifying degree (45 per cent for Tamil Nadu BC, BCM, MBC/DNC, SC, SCA and ST candidates)",
                    "10+2+3/4/5, 10 + 3-year diploma + degree, lateral-entry diploma + degree and AMIE with two years' experience are accepted patterns",
                    "TANCET 2026 (MCA) mark sheet issued by Anna University",
                    "Degrees taken by distance or weekend B.E./B.Tech study, or without Class 10 and 12 or a diploma, are not eligible",
                ],
            },
            "applicationSteps": [
                "Take TANCET 2026 (MCA), conducted by Anna University, and download the mark sheet",
                "Register online for Tamil Nadu MCA 2026-27 counselling and upload degree, school and community documents",
                "Choose college code 1137 (AMCET) in counselling and confirm the allotment",
                "Report to the college with the allotment order and pay the fees; for a management-quota seat, apply to the college directly through its online PG application",
            ],
            "documentsRequired": {
                "academic": ["Bachelor's degree certificate and mark sheets for all semesters", "Class 10 and Class 12 (or diploma) mark sheets", "Transfer certificate"],
                "application": ["TANCET 2026 (MCA) mark sheet", "Community certificate where claiming reservation", "Nativity certificate where applicable"],
            },
            "deadlinesNote": "Tamil Nadu's 2026-27 MCA counselling and Anna University's first-semester start of 2 September 2026 have passed; later seats depend on the college's own admission cell.",
        },
        "medium": "English",
        "mediumNote": "AMCET is an affiliated college; Anna University's MCA curriculum is taught in English.",
        "instructionLanguages": ["english"],
        "intakeMonths": ["September"],
        "intakeCodes": ["september"],
        "feeVerifiedAt": D,
        "feeNotes": FEE_NOTE_PG,
        "teachingPhases": [{"phase": "Years 1-2 (4 semesters)", "language": "English",
                            "details": "AMCET's MCA runs Anna University's four-semester curriculum: advanced data structures, object-oriented software engineering, Python, full-stack web development, advanced databases, machine learning, IoT, cloud computing and cyber security, with a summer internship and a project."}],
    }


PROGRAMMES = [ug_programme(r) for r in UG] + [mba_programme(), mca_programme()]

UNIVERSITY = {
    "countrySlug": "india",
    "slug": SLUG,
    "name": NAME,
    "city": "Arappakkam, Ranipet",
    "type": "Private",
    "establishedYear": 2012,
    "officialWebsite": SITE,
    "mediaAttribution": {},
    "summary": (
        "Annai Mira College of Engineering and Technology (AMCET) is a private, self-financing engineering college founded in 2012 "
        "at Arappakkam on the Chennai-Bengaluru highway near Vellore, Tamil Nadu, run by the R.T. Educational Trust. It is not a "
        "university: it is a non-autonomous college affiliated to Anna University, Chennai, which awards its degrees. AICTE approves "
        "eight B.E./B.Tech branches, an MBA and an MCA for 2026-27."
    ),
    "campusLifestyle": (
        "AMCET's campus covers about 25 acres at Arappakkam on NH-46, with three academic blocks and a 500-seat auditorium. "
        "Its central library covers 866 sq m with the Koha library system, DELNET, NPTEL and National Digital Library access, and "
        "subscribes to 89 national and 73 international journals. Laboratories are listed for ECE, EEE, Mechanical, CSE, AI and Data Science "
        "and Civil. Sports include an indoor stadium, a gym and outdoor cricket, football, volleyball and basketball."
    ),
    "cityProfile": (
        "AMCET is on NH-46, the Chennai-Bengaluru highway, at Arappakkam in Walaja taluk, Ranipet district, Tamil Nadu 632517. "
        "AICTE lists the address under Vellore district, from which Ranipet was carved out. DoTE's TNEA 2026 booklet gives Katpadi as the "
        "nearest railway station, 10 to 12 km away, and Ranipet as the district headquarters, 12 km away. Anna University's college code is 5135."
    ),
    "practicalExposure": (
        "AMCET is not autonomous, so it follows Anna University's curricula and regulations: the university sets the syllabus, conducts the "
        "end-semester exams and awards the degree, and the college runs internal assessment. AICTE makes an internship mandatory for every "
        "admitted student. The college's Centre for Training and Placement runs campus drives and records 27 recruiters on its 2024 placement "
        "table, among them HCL, Infosys, TCS and Sundaram Fasteners. Offer counts and packages are self-reported."
    ),
    "hostelOverview": (
        "AMCET has separate boys' and girls' hostels on campus with four-occupancy rooms, a mess serving vegetarian and non-vegetarian food, "
        "Wi-Fi, a common room and computer room, laundry, RO drinking water and a 24-hour security desk. DoTE's TNEA 2026 booklet lists "
        "room rent and mess together at about INR 1.08 lakh a year, electricity of INR 2,000 and a caution deposit of INR 5,000. Parents must "
        "accompany the student to the warden to take a room."
    ),
    "dietarySupport": (
        "AMCET's hostel messes serve vegetarian and non-vegetarian food. Fixed timings are breakfast 7:15 to 8:25 am, lunch 12:30 to 2:00 pm, "
        "tea and snacks 4:30 to 5:30 pm and dinner 7:30 to 8:30 pm, followed by a study hour from 8:30 to 10:00 pm. The college also runs a "
        "cafeteria. It publishes no menu or provision for specific regional or religious diets, so ask the warden before joining."
    ),
    "safetyOverview": (
        "AMCET's AICTE disclosure lists an anti-ragging committee and squad, an internal complaints committee for sexual-harassment complaints, "
        "a women grievance cell and an SC/ST committee. The hostels have a 24-hour security desk. TNEA 2026 publishes an anti-ragging phone "
        "number for the college (+91 94433 04963)."
    ),
    "studentSupport": (
        "AMCET runs a Centre for Training and Placement, a higher-education centre, a personality development centre and an entrepreneurship "
        "cell with a startup club and Institution's Innovation Council. Grievances go to a students grievance and redressal committee. The college "
        "gives annual Academic Excellence awards, branded Mira Merit Scholarship, to students with high Anna University results; amounts are not published."
    ),
    "whyChoose": [
        "AMCET is a TNEA-listed Anna University college (code 1137) on NH-46 that is 10 to 12 km from Katpadi railway station, so students from Vellore, Ranipet and Tiruvannamalai can reach it by road or bus.",
        "AICTE's 2026-27 approval covers eight B.E./B.Tech branches, an MBA and an MCA, including new AI and Machine Learning and MCA courses.",
        "AMCET has hostels for men and women on campus and runs college buses, with published TNEA charges for both.",
    ],
    "thingsToConsider": [
        "AMCET is an affiliated, non-autonomous college, not a university: Anna University sets its syllabus and exams and awards its degrees, and there are no seats for international students because AICTE shows no NRI or international approval.",
        "AMCET publishes no tuition fee and DoTE's TNEA 2026 booklet shows no NBA-accredited branch. The mandatory disclosure cites a NAAC B++ grade without a certificate or validity date, so ask the college for the certificate.",
        "The B.E. Civil, EEE and Mechanical branches have small intakes of 30, 30 and 60. AI and Machine Learning and the MCA are new for 2026-27 with no graduating batch.",
    ],
    "bestFitFor": [
        "Tamil Nadu TNEA applicants from Vellore, Ranipet and Tiruvannamalai who want an Anna University B.E. or B.Tech close to home.",
        "Students interested in computing: CSE, AI and Data Science, IT and AI and Machine Learning make up 360 of AMCET's 480 first-year B.E./B.Tech places.",
        "Graduates with a TANCET 2026 score who want an MBA or MCA near Vellore.",
    ],
    "industryPartners": [],
    "recognitionBadges": [
        "AICTE - Approved institution, Permanent ID 1-404537421 (Private-Self Financing); Extension of Approval 2026-27",
        "Anna University, Chennai - Affiliated non-autonomous college, college code 5135",
        "DoTE Tamil Nadu - TNEA 2026 participating college, counselling code 1137",
    ],
    "recognitionLinks": [
        {"label": "AICTE - Approved institutes dashboard", "url": AICTE_DASH},
        {"label": "Anna University CAI - Affiliated colleges, Ranipet district", "url": AU_DIST},
        {"label": "DoTE Tamil Nadu - TNEA 2026 Information about colleges", "url": TNEA_IAC},
    ],
    "faq": [
        {"question": "Is Annai Mira College of Engineering and Technology autonomous or affiliated to Anna University?",
         "answer": "Annai Mira College of Engineering and Technology (AMCET) is a non-autonomous college affiliated to Anna University, Chennai, which sets its syllabus and exams and awards its degrees. Anna University lists it in Ranipet district with college code 5135, and DoTE's TNEA 2026 booklet gives its autonomous status as No."},
        {"question": "What is the TNEA code for Annai Mira College of Engineering and Technology?",
         "answer": "The TNEA counselling code for Annai Mira College of Engineering and Technology (AMCET) is 1137. TNEA 2026 lists eight branches under it: Civil (CE), Computer Science (CS), AI and Machine Learning (AM), EEE (EE), ECE (EC), Mechanical (ME), AI and Data Science (AD) and Information Technology (IT)."},
        {"question": "Is Annai Mira College of Engineering and Technology AICTE approved?",
         "answer": "Yes, AMCET is AICTE approved as a private self-financing institution, permanent ID 1-404537421. Its Extension of Approval for 2026-27, dated 10 April 2026, covers eight B.E./B.Tech branches, an MBA and an MCA, all affiliated to Anna University, Chennai."},
        {"question": "Is Annai Mira College of Engineering and Technology in Vellore or Ranipet?",
         "answer": "AMCET is at Arappakkam on NH-46, in Walaja taluk. It was in Vellore district until Ranipet district was formed, so AICTE still prints Vellore while DoTE and the college itself print Ranipet. Katpadi railway station near Vellore is 10 to 12 km away."},
        {"question": "What is the B.E. fee at Annai Mira College of Engineering and Technology?",
         "answer": "AMCET does not publish its tuition; a management-quota seat is confirmed by paying 50 per cent of the fee prescribed by AICTE and Anna University, so ask the college. Tamil Nadu's fee committee fixes tuition for self-financing colleges. TNEA 2026 lists an admission fee of INR 1,500, a caution deposit of INR 5,000 and transport at INR 16,000 to 30,000 a year."},
        {"question": "Does Annai Mira College of Engineering and Technology admit international or NRI students?",
         "answer": "No, AMCET has no NRI or international-student approval: AICTE's 2026-27 approval marks both as No for every course. TNEA is for Indian nationals; OCI/PIO card holders who are natives of Tamil Nadu may apply unless born abroad after 4 March 2021."},
        {"question": "How do I get admission to Annai Mira College of Engineering and Technology?",
         "answer": "Most B.E./B.Tech seats are filled through TNEA: register at tneaonline.org, get a rank from Mathematics (100), Physics (50) and Chemistry (50), and choose code 1137. Management-quota seats (35 per cent) are filled directly by the college on a first-come basis. MBA and MCA seats use TANCET and Tamil Nadu MBA/MCA counselling."},
        {"question": "Does Annai Mira College of Engineering and Technology offer MBA and MCA?",
         "answer": "Yes. AICTE approves an MBA with 60 seats, started in 2023, and an MCA with 60 seats, approved as a new course for 2026-27. Admission needs a TANCET 2026 mark sheet and at least 50 per cent in the qualifying degree (45 per cent for Tamil Nadu reserved categories)."},
        {"question": "Does Annai Mira College of Engineering and Technology have hostels?",
         "answer": "Yes, AMCET has separate boys' and girls' hostels on campus with four-occupancy rooms and a mess serving vegetarian and non-vegetarian food. TNEA 2026 lists room rent and mess together at about INR 1.08 lakh a year, plus INR 2,000 electricity and a INR 5,000 caution deposit."},
        {"question": "Is Annai Mira College of Engineering and Technology NBA accredited?",
         "answer": "No branch is NBA accredited according to DoTE's TNEA 2026 booklet. The college's mandatory disclosure cites a NAAC B++ grade but gives no certificate or validity date, so ask the college for the NAAC certificate before relying on it."},
    ],
    "researchSources": [
        {"label": "AMCET - Mandatory Disclosure 2025-26", "url": MD, "kind": "official-university", "checkedAt": D},
        {"label": "AICTE - Extension of Approval 2026-27 (AMCET)", "url": EOA, "kind": "government", "checkedAt": D},
        {"label": "AICTE - Approved institutes dashboard", "url": AICTE_DASH, "kind": "recognition", "checkedAt": D},
        {"label": "Anna University CAI - Ranipet district affiliated colleges", "url": AU_DIST, "kind": "recognition", "checkedAt": D},
        {"label": "DoTE Tamil Nadu - TNEA 2026 Information about colleges", "url": TNEA_IAC, "kind": "government", "checkedAt": D},
        {"label": "DoTE Tamil Nadu - TNEA 2026 Information Brochure", "url": TNEA_BR, "kind": "government", "checkedAt": D},
        {"label": "DoTE Tamil Nadu - TNEA 2026 Tentative Schedule", "url": TNEA_SCHED, "kind": "government", "checkedAt": D},
        {"label": "DTE Tamil Nadu - TN MBA/MCA 2026-27 engineering colleges booklet", "url": MBA_BOOKLET, "kind": "government", "checkedAt": D},
        {"label": "DTE Tamil Nadu - MCA 2026-27 information and instructions", "url": MCA_INSTR, "kind": "government", "checkedAt": D},
        {"label": "DTE Tamil Nadu - MBA 2026-27 information and instructions", "url": MBA_INSTR, "kind": "government", "checkedAt": D},
        {"label": "Anna University - Affiliated colleges academic calendar Sep-Dec 2026", "url": AU_CAL, "kind": "official-university", "checkedAt": D},
        {"label": "Anna University - Academic Regulations 2025 (UG, affiliated)", "url": AU_REG_UG, "kind": "official-program", "checkedAt": "2026-10-22"},
        {"label": "AMCET - Admissions", "url": ADM, "kind": "official-university", "checkedAt": D},
        {"label": "AMCET - Courses offered", "url": COURSES, "kind": "official-program", "checkedAt": D},
        {"label": "AMCET - Hostel", "url": HOSTEL, "kind": "official-university", "checkedAt": D},
        {"label": "AMCET - Central library", "url": LIB, "kind": "official-university", "checkedAt": D},
        {"label": "AMCET - Official website", "url": SITE, "kind": "official-university", "checkedAt": D},
    ],
    "admissionsContent": {
        "contentState": "research_ready",
        "scope": "This record covers Annai Mira College of Engineering and Technology at Arappakkam only. The R.T. Educational Trust's other institutions are outside this record.",
        "sectionStates": {
            "decisionSummary": "published", "eligibility": "published", "fees": "research_ready", "admissions": "published",
            "academics": "research_ready", "recognition": "published", "studentLiving": "published",
            "scholarships": "absent", "funding": "absent", "placements": "absent",
        },
        "ctas": [
            {"trigger": "eligibility", "label": "Check my AMCET eligibility", "capture": ["nationality and Tamil Nadu nativity or schooling", "Class 12 board and MPC marks", "community category", "intended branch"]},
            {"trigger": "fees", "label": "Get the AMCET fee for my branch", "capture": ["intended branch", "TNEA or management quota", "hostel and transport needs", "concession eligibility"]},
            {"trigger": "application", "label": "Plan my TNEA choices for AMCET", "capture": ["TNEA rank or expected cut-off", "preferred branches", "document readiness"]},
        ],
    },
    "programmes": PROGRAMMES,
}


def ev(entity, field, claim, label, url, grade="A", notes=None, pslug=None, status="verified", checked=D):
    e = {"entity": entity, "universitySlug": SLUG}
    if pslug:
        e["programmeSlug"] = pslug
    e.update({"publicField": field, "claimText": claim, "status": status, "sourceLabel": label, "sourceUrl": url,
              "sourceGrade": grade, "checkedAt": checked, "reviewBy": REVIEW})
    if notes:
        e["internalNotes"] = notes
    return e


AICTE_NOTE = "AICTE dashboard facilities.aicte-india.org not queried; the 2026-27 Extension of Approval letter (F.No. Southern/1-46216547477/2026/EOA, 10-Apr-2026, printed 1 June 2026) is the primary AICTE record, saved in research/india-source-bundles/annai-mira-college-of-engineering-and-technology/eoa-26-27.pdf."
EOA_CLAIM = ("AICTE EoA 2026-27: Annai Mira College of Engineering and Technology, Arappakkam Village, Arcot Road, Walaja Taluk, Vellore Dist., Tamil Nadu 632517; "
             "trust R.T. Educational Trust, 12/A R.T. Complex, Arni Road, Sankaranpalayam, Vellore; permanent ID 1-404537421; Private-Self Financing; established 2012; "
             "affiliating body Anna University, Chennai; NRI and international-student approval No for every course.")

EVIDENCE = [
    ev("university", "identity", EOA_CLAIM, "AICTE - Extension of Approval 2026-27 (AMCET)", EOA, notes=AICTE_NOTE),
    ev("university", "identity", "Anna University CAI Ranipet district list: Annai Mira College of Engineering and Technology, examination code 5135, TNEA code 1137.", "Anna University CAI - Ranipet district affiliated colleges", AU_DIST, notes="The listing's college PDF (AnnaiMiraCollegeofEng&Tech.pdf) returned 404 on 2026-10-27. Ledger alias check 2026-10-27: no row for AMCET, Annai Mira, Arappakkam or AICTE 1-404537421."),
    ev("university", "identity", "Not autonomous: TNEA 2026 booklet (1137) autonomous status No, minority status No; TN MBA/MCA 2026-27 booklet autonomous status No.", "DoTE Tamil Nadu - TNEA 2026 Information about colleges", TNEA_IAC, notes="Excerpt: research/india-source-bundles/annai-mira-college-of-engineering-and-technology/tnea-colleges-2026-excerpt-1137.txt"),
    ev("university", "establishedYear", "Year of establishment 2012 (AICTE EoA 2026-27; mandatory disclosure; TN MBA/MCA booklet; TNEA 2026 CE, EC, EE, CS, ME start year 2012).", "AICTE - Extension of Approval 2026-27 (AMCET)", EOA),
    ev("university", "recognitionBadges", "AICTE EoA 2026-27 intake: AI&DS 120, Civil 30, CSE 120, CSE (AI&ML) 60 (new course), EEE 30, ECE 60, IT 60, Mechanical 60, MBA 60, MCA 60 (new course); all under Anna University, Chennai; NRI No.", "AICTE - Extension of Approval 2026-27 (AMCET)", EOA, notes=AICTE_NOTE),
    ev("university", "recognitionBadges", "TNEA 2026 booklet p.30 college 1137: Annai Mira College of Engineering and Technology, Arcot Road, Arappakkam Village, Walaja Taluk, Ranipet District 632517; principal Dr T K Gopinathan; branches EC 60, EE 30, IT 60, CE 30, AD 120, CS 120, ME 60, AM 60 (2026); all NBA No.", "DoTE Tamil Nadu - TNEA 2026 Information about colleges", TNEA_IAC),
    ev("university", "summary", "Mandatory disclosure 2025-26: R.T. Educational Trust, self-financing, non-minority, established 2012, affiliated to Anna University; programmes B.E. Civil, CSE, EEE, ECE, Mechanical, B.Tech AI&DS, IT, MBA. Website about page: 25 acres, 3 academic blocks, 500-seat auditorium.", "AMCET - Mandatory Disclosure 2025-26", MD, notes="About page: " + ABOUT),
    ev("university", "campusLifestyle", "Library page: 866 sq m, Koha-based automation, DELNET, NPTEL and NDL memberships, 89 national and 73 international journals. Laboratory page lists labs for ECE, EEE, Mechanical, CSE, AI&DS and Civil. Sports page: indoor stadium, outdoor cricket, football, volleyball, basketball; Mira Advanced Gym.", "AMCET - Central library", LIB, grade="B", notes="Book totals on the library page do not reconcile with its department table and are not published. Labs: " + LABS + ". Acreage 25 comes from the About page " + ABOUT + "."),
    ev("university", "cityProfile", "TNEA 2026 booklet (1137): NH 46 Chennai Bengaluru National Highways, Arappakkam; taluk Walaja; district Ranipet; 12 km from district HQ; nearest railway station Katpadi, 10 km. TN MBA/MCA booklet gives 12 km to Katpadi.", "DoTE Tamil Nadu - TNEA 2026 Information about colleges", TNEA_IAC, notes="AICTE prints Vellore district; TNEA and the college print Ranipet."),
    ev("university", "practicalExposure", "Placement records page lists 27 recruiters in a 2024 table including HCL 48 offers, Infosys 25, Sundaram Fasteners 44; AICTE EoA instructions: internship mandatory.", "AMCET - Placement records", "https://amcet.in/placements/placement-records/", grade="B", notes="Self-reported; offer count and package units not independently verifiable and not published as figures. The site also claims about 80 per cent placement; not published."),
    ev("university", "hostelOverview", "Hostel page: separate boys' and girls' hostels, four-occupancy rooms, Wi-Fi, laundry, RO water, 24-hour security desk. TNEA 2026 booklet (1137): hostel boys and girls, permanent; mess 72,000 and room rent 36,000, electricity 2,000, caution deposit 5,000, admission fee 1,500, transport 16,000-30,000 per annum.", "DoTE Tamil Nadu - TNEA 2026 Information about colleges", TNEA_IAC, notes="TN MBA/MCA 2026-27 booklet prints room rent 72,000 and mess 36,000 (columns reversed against TNEA); the total of INR 1.08 lakh agrees, so only the combined figure is published. Hostel page: " + HOSTEL),
    ev("university", "dietarySupport", "Hostel page: mess serves vegetarian and non-vegetarian food; breakfast 7:15-8:25, lunch 12:30-2:00, tea 4:30-5:30, dinner 7:30-8:30, study hour 8:30-10:00. TNEA 2026: type of mess both.", "AMCET - Hostel", HOSTEL, grade="B"),
    ev("university", "safetyOverview", "Website lists anti-ragging committee and squad, women grievance, SC/ST and internal complaints committees; hostel page: 24-hour security desk; TNEA 2026 anti-ragging phone 9443304963.", "AMCET - Hostel", HOSTEL, grade="B", notes="Committees: " + MD),
    ev("university", "studentSupport", "Website about page: Centre for Training and Placement, higher education centre, personality development centre, entrepreneurship development cell (startup club, Institution's Innovation Council), students grievance and redressal committee; Mira Merit Scholarship page: annual Academic Excellence awards since 2016, amounts not stated.", "AMCET - About AMCET", ABOUT, grade="B", notes="Scholarship page: https://amcet.in/beyond-classroom/mira-merit-scholarship/"),
    ev("university", "whyChoose", "TNEA 2026 booklet: college 1137, Katpadi railway station 10 km; AICTE EoA 2026-27: eight B.E./B.Tech branches, MBA, MCA. Transport facility Yes (16,000-30,000).", "AICTE - Extension of Approval 2026-27 (AMCET)", EOA),
    ev("university", "thingsToConsider", "Mandatory disclosure 2025-26 states 'NAAC B++' without certificate, cycle or validity date; the NAAC page on amcet.in gives no grade; TNEA 2026 marks all AMCET branches NBA No. Fee: admissions page gives no tuition amount.", "AMCET - Mandatory Disclosure 2025-26", MD, notes="NAAC grade not verified on NAAC's list. Not published as a recognition badge."),
    ev("university", "thingsToConsider", "AICTE EoA 2026-27 intakes: Civil 30, EEE 30, Mechanical 60; CSE (AI&ML) and MCA marked as approved new courses (2025-26 intake 0).", "AICTE - Extension of Approval 2026-27 (AMCET)", EOA),
    ev("university", "bestFitFor", "AICTE EoA 2026-27 intakes: AI&DS 120, CSE 120, IT 60, CSE (AI&ML) 60 (total 360) of 480 B.E./B.Tech places (adding Civil 30, EEE 30, ECE 60, Mechanical 60).", "AICTE - Extension of Approval 2026-27 (AMCET)", EOA),
    ev("university", "faq", "TNEA 2026 schedule: registration 03.05.2026 to 05.06.2026; general counselling 20.07.2026 to 30.08.2026. Brochure: registration fee INR 500 (INR 250 SC/SCA/ST); report to college within 5 days; OCI/PIO natives of Tamil Nadu eligible except those born abroad after 04.03.2021.", "DoTE Tamil Nadu - TNEA 2026 Tentative Schedule", TNEA_SCHED, notes="Brochure: " + TNEA_BR),
    ev("university", "faq", "Anna University calendar for non-autonomous affiliated colleges, I semester Sep-Dec 2026 (B.E./B.Tech/B.Arch, MBA (FT), MCA): classes commence 2 September 2026; end-semester examinations begin 22 December 2026.", "Anna University - Affiliated colleges academic calendar Sep-Dec 2026", AU_CAL, notes="Read from the copy saved for bundle 0359 at research/india-source-bundles/tagore-engineering-college/au-cal.txt."),
    ev("university", "faq", "AMCET admissions page: government quota 65% (39 of 60 seats) through DOTE single-window counselling; management quota 35% direct admission, first-come first-served after eligibility check, 50% of the AICTE/Anna University prescribed fee confirms the seat; TNEA code 1137.", "AMCET - Admissions", ADM, grade="B", notes="The page states 60 seats for each branch, older than AICTE EoA 2026-27, which is used for intake."),
]

for row in UG:
    suffix, canon, title, code, intake, start, label, phase = row
    ps = f"amcet-{suffix}"
    EVIDENCE += [
        ev("programme", "intake", f"AICTE EoA 2026-27 approves {label} (Anna University, Chennai) with intake {intake} for 2026-27; TNEA 2026 college booklet, college 1137, branch {code}: year of starting {start}; NBA accredited No.", "AICTE - Extension of Approval 2026-27 (AMCET)", EOA, pslug=ps, notes=AICTE_NOTE + " TNEA: " + TNEA_IAC),
        ev("programme", "fee", "AMCET admissions page: management quota seat confirmed by paying 50% of the fee prescribed by AICTE and Anna University, no amount. TNEA 2026 booklet prints no tuition but lists admission fee 1,500, caution deposit 5,000, room rent 36,000, electricity 2,000, mess 72,000 and transport 16,000-30,000 per annum.", "DoTE Tamil Nadu - TNEA 2026 Information about colleges", TNEA_IAC, pslug=ps, notes="AMCET admissions page ("+ADM+") gives the 50% rule. Course pages quote a generic 'INR 50,000-1,50,000 yearly' with no basis (template copy) and aggregators quote conflicting totals; none used. No tuition on any DoTE or AICTE document."),
        ev("programme", "eligibility", "TNEA 2026 eligibility: HSC with Mathematics, Physics and Chemistry, minimum 45 per cent (OC) or 40 per cent (BC, BCM, MBC/DNC, SC/SCA/ST); nativity categories; Indian nationals and Tamil Nadu-native OCI/PIO card holders, excluding those born abroad after 04.03.2021.", "DoTE Tamil Nadu - TNEA 2026 Information Brochure", TNEA_BR, pslug=ps, notes="AMCET admissions page states the same 40/45 per cent minimums."),
        ev("programme", "admissions", "AMCET admissions page: 65% government quota through DOTE counselling, 35% management quota direct; lateral entry for State Board diploma holders. Admission hotline +91 99523 87017.", "AMCET - Admissions", ADM, grade="B", pslug=ps),
        ev("programme", "medium", "Anna University Academic Regulations 2025 (UG, affiliated colleges): medium of instruction English.", "Anna University - Academic Regulations 2025 (UG, affiliated)", AU_REG_UG, pslug=ps, checked="2026-10-22"),
        ev("programme", "teachingPhases", f"AMCET courses page lists {label} as a 4-year programme under Anna University, Chennai; labs and subjects per the department page.", "AMCET - Courses offered", COURSES, pslug=ps, grade="B"),
    ]

for ps, kind, intake, start in (("amcet-mba", "MBA", 60, 2023), ("amcet-mca", "MCA", 60, 2026)):
    instr = MBA_INSTR if kind == "MBA" else MCA_INSTR
    EVIDENCE += [
        ev("programme", "intake", f"AICTE EoA 2026-27 approves {kind} (Anna University, Chennai) with intake {intake} for 2026-27; TN MBA/MCA 2026-27 booklet p.41, college 1137: {kind} approved intake 60, self-financing, started {start}, not accredited.", "AICTE - Extension of Approval 2026-27 (AMCET)", EOA, pslug=ps, notes=AICTE_NOTE + " Booklet excerpt: research/india-source-bundles/annai-mira-college-of-engineering-and-technology/tn-mbamca-booklet-2026-excerpt-1137.txt (" + MBA_BOOKLET + ")."),
        ev("programme", "fee", "TN MBA/MCA 2026-27 booklet p.41 college 1137: 'Tuition Fee to be collected as per Government Norms'; admission fees 1,500, deposit 5,000, room rent 72,000 and mess 36,000 (columns reversed against TNEA), electricity 2,000 per annum.", "DTE Tamil Nadu - TN MBA/MCA 2026-27 engineering colleges booklet", MBA_BOOKLET, pslug=ps, notes="No tuition amount on amcet.in; its course page quotes a generic 'INR 50,000-1,50,000 yearly' (template copy), not used."),
        ev("programme", "eligibility", f"Tamil Nadu {kind} 2026-27 instructions: qualifying degree of 3 years or more with 50 per cent (45 per cent Tamil Nadu BCM, BC, MBC/DNC, SC, SCA, ST); TANCET 2026 ({kind}) mark sheet; Indian nationals only; OCI/PIO natives of Tamil Nadu in open category except those born abroad after 04.03.2021." + (" MCA: B.C.A./B.Sc. CS/IT/B.E. CSE/B.Tech IT or equivalent, or any degree with Mathematics at Class 12 or degree level." if kind == "MCA" else ""), f"DTE Tamil Nadu - {kind} 2026-27 information and instructions", instr, pslug=ps, notes="MCA instructions read from the saved PDF text layer." if kind == "MCA" else "Same conditions as bundle 0356 (MIET MBA)."),
        ev("programme", "admissions", f"AMCET website: online application for UG and PG courses; {kind} seats via TN {kind} counselling (college code 1137) and the college's own admission cell. Counselling instructions require TANCET 2026 ({kind}).", "AMCET - Admissions", ADM, grade="B", pslug=ps),
        ev("programme", "medium", f"AMCET is an affiliated college; Anna University's {kind} curriculum and exams are in English (Anna University Regulations; AMCET course page).", "AMCET - Courses offered", COURSES, grade="B", pslug=ps),
        ev("programme", "teachingPhases", f"AMCET {kind} course page: 2 years, 4 semesters, Anna University curriculum with summer internship and project work.", "AMCET - Courses offered", COURSES, grade="B", pslug=ps),
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

# Inventory
cols = ["university_slug", "programme_official_title", "level", "discipline", "duration", "campus", "delivery_mode",
        "intl_status", "intl_evidence_url", "official_source_url", "other_sources", "already_on_site",
        "existing_offering_slug", "canonical_course_match", "notes"]
CAMPUS = "NH-46, Arappakkam, Walaja Taluk, Ranipet District"
rows = []
for pr in PROGRAMMES:
    pg = pr["canonicalCourseSlug"] in ("mba", "mca")
    rows.append([SLUG, pr["officialTitle"].split(",")[0], "PG" if pg else "UG", pr["officialTitle"].split(",")[0],
                 "2 years (4 semesters)" if pg else "4 years (8 semesters)", CAMPUS, "on_campus", "not_open", EOA,
                 pr["officialProgramUrl"], f"{TNEA_IAC}; {MBA_BOOKLET}; {AU_DIST}", "no", "", pr["canonicalCourseSlug"],
                 "PACKAGED (availability=restricted). AICTE EoA 2026-27 intake approved, NRI/international No."])
os.makedirs(os.path.join(ROOT, "research", "india-programme-inventory"), exist_ok=True)
with open(os.path.join(ROOT, "research", "india-programme-inventory", f"{SLUG}.csv"), "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(cols)
    w.writerows(rows)
