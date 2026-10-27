"""Build content-migrations/0404-india-great-lakes-institute-of-management-chennai/payload.json.

Owner claude-tn-glim-20261027. Checked 2026-10-27. Run from repo root:
    python3 -I research-drafts/india/great-lakes-institute-of-management-chennai-build.py
Base data: research/india-source-bundles/great-lakes-institute-of-management-chennai/packet-subset.json
(the strict-schema subset of the TN fresh10 research packet), re-verified against the live pages and the
AICTE EoA 2026-27 letter (see reverification-2026-10-27.md). Only PGPM and PGDM are packaged.
"""
import copy
import csv
import json
import os

ROOT = os.getcwd()
MIG = "0404-india-great-lakes-institute-of-management-chennai"
OUT = os.path.join(ROOT, "content-migrations", MIG, "payload.json")
BUNDLE = os.path.join(ROOT, "research", "india-source-bundles", "great-lakes-institute-of-management-chennai")
D = "2026-10-27"
REVIEW = "2027-01-25"
SLUG = "great-lakes-institute-of-management-chennai"

EOA = "https://www.greatlakes.edu.in/chennai/assets/greatlakes/pdf/EOA_Report_2026-2027.pdf"
AICTE_DASH = "https://facilities.aicte-india.org/dashboard/pages/angulardashboard.php#!/approved"
AACSB = "https://www.aacsb.edu/accredited/g/great-lakes-institute-of-management-chennai"
PGPM_FAQ = "https://www.greatlakes.edu.in/chennai/pgpm/faq"
PGDM_FAQ = "https://www.greatlakes.edu.in/chennai/pgdm/faqs"
PGPM_ADM = "https://www.greatlakes.edu.in/chennai/pgpm/admissions"
PGDM_ADM = "https://www.greatlakes.edu.in/chennai/pgdm/admissions"
PGPM_FEES = "https://www.greatlakes.edu.in/chennai/pgpm/fees"
PGDM_FEES = "https://www.greatlakes.edu.in/chennai/pgdm/fees"

OLD_PGPM = "post-graduate-program-in-management-pgpm-award-post-graduate-certificate-in-management"
OLD_PGDM = "post-graduate-diploma-in-management-pgdm"
NEW_PGPM = "great-lakes-chennai-pgpm"
NEW_PGDM = "great-lakes-chennai-pgdm"
SLUGMAP = {OLD_PGPM: NEW_PGPM, OLD_PGDM: NEW_PGDM}

base = json.load(open(os.path.join(BUNDLE, "packet-subset.json")))
u = copy.deepcopy(base["universities"][0])
courses = copy.deepcopy(base["courses"])
evidence = copy.deepcopy(base["evidence"])

# ---- university narrative: scope limited to the two packaged programmes ----
u["mediaAttribution"] = {}
u["establishedYear"] = 2004
u["summary"] = (
    "Great Lakes Institute of Management, Chennai is a private business school in Tamil Nadu, with a residential campus "
    "at Manamai on the East Coast Road in Chengalpattu district. It offers a one-year PGPM, awarding a Post Graduate "
    "Certificate in Management, and a two-year PGDM. Both are AICTE-approved, and the institution holds AACSB Business accreditation."
)
u["campusLifestyle"] = (
    "The residential campus is at Manamai on the East Coast Road in Chengalpattu district. It is separate from the Chennai "
    "city office and from Great Lakes Gurgaon. Both the PGPM and the PGDM are full-time residential programmes, so students "
    "live on campus for the whole course."
)
u["hostelOverview"] = (
    "PGPM and PGDM are residential, and hostel accommodation is mandatory. The 2027-28 PGPM fee schedule includes a single "
    "air-conditioned room at INR 3,96,000; a twin-sharing room with a part refund is allotted if no single room is free. "
    "The 2026-28 PGDM schedule includes a twin AC room at INR 6,32,000 for the whole course. Vegetarian meals are included; "
    "non-vegetarian meals cost extra."
)
u["dietarySupport"] = (
    "Vegetarian meals are included in the PGPM and PGDM accommodation charges and non-vegetarian meals are charged extra. "
    "Great Lakes publishes no allergy or medical-diet provision, so raise specific dietary needs with the admissions team "
    "before accepting an offer."
)
u["whyChoose"] = [
    "AACSB's own directory lists Great Lakes Chennai with Business accreditation, and AICTE's 2026-27 approval covers the PGDM and the PGCM.",
    "The PGPM is a one-year route for applicants with at least 24 months of work experience; the PGDM suits fresh graduates and those with under 36 months.",
    "Fee pages itemise tuition, programme fee, accommodation, deposit and alumni subscription for the whole course.",
]
u["thingsToConsider"] = [
    "The PGPM awards a Post Graduate Certificate in Management, not an MBA degree, and the PGDM is a diploma; neither is described by Great Lakes as an MBA.",
    "AICTE's 2026-27 approval marks international-student approval as No for both courses (NRI approval Yes), although the programme FAQs describe non-Indian applicants, so confirm eligibility before applying.",
    "Applications must be made by the applicant; Great Lakes does not authorise intermediaries to initiate them.",
    "The PGDM fee on record is the 2026-28 schedule for the whole course, not a confirmed 2027-29 tariff.",
]
u["bestFitFor"] = [
    "Graduates with at least 24 months of full-time work experience weighing a one-year residential certificate programme.",
    "Fresh graduates or applicants with under 36 months of experience who want a two-year residential PGDM.",
    "Applicants who can submit CAT, XAT, GMAT or, for the PGPM, NMAT scores within the stated validity windows.",
]
u["recognitionBadges"] = [
    "AICTE - Approved institution, Permanent ID 1-17358363 (Private-Self Financing); Extension of Approval 2026-27",
    "AACSB Business accreditation",
]
u["recognitionLinks"] = [
    {"label": "AICTE - Approved institutes dashboard", "url": AICTE_DASH},
    {"label": "AACSB accredited institution: Great Lakes Chennai", "url": AACSB},
]
u["industryPartners"] = []
u["cityProfile"] = (
    "The institution's residential campus is at Manamai on the East Coast Road in Chengalpattu district, Tamil Nadu "
    "(PIN 603102). Great Lakes lists a separate Chennai city office, and Great Lakes Gurgaon is a different institution. "
    "Use the Manamai address when planning residence and travel."
)
u["practicalExposure"] = (
    "AICTE makes an internship mandatory for every admitted student under its 2026-27 approval conditions. "
    "Great Lakes does not publish a guaranteed placement or internship outcome for the PGPM or PGDM, so treat practical "
    "exposure as an internship requirement rather than a promise of a specific employer, role or salary. Ask the admissions "
    "team how internships are arranged for each programme before accepting an offer."
)
u["safetyOverview"] = (
    "Great Lakes Chennai publishes an anti-ragging committee and a policy against sexual harassment in its mandatory "
    "disclosure. These are reporting mechanisms, not guarantees about incident prevention or response times."
)
u["studentSupport"] = (
    "Students can raise a service request through the CAMU learning platform's grievance helpdesk by choosing a problem "
    "category. PGPM applicants can ask the admissions team for a prior appointment before visiting the campus."
)
u["faq"] = [
    {"question": "Is this the Chennai or Gurgaon institution?",
     "answer": "This profile concerns Great Lakes Chennai, whose residential campus is at Manamai in Chengalpattu district, Tamil Nadu. Great Lakes Gurgaon is a separate institution with its own approvals."},
    {"question": "Is Great Lakes Institute of Management Chennai AICTE approved?",
     "answer": "Yes. AICTE's 2026-27 Extension of Approval, permanent ID 1-17358363, lists it as a private self-financing institution with a PGCM intake of 180 and a PGDM intake of 240. Both programme FAQs also state AICTE approval."},
    {"question": "Does the PGPM award an MBA?",
     "answer": "No. The PGPM FAQ says the awarded credential is a Post Graduate Certificate in Management (PGCM), as per AICTE norms. A comparison with a one-year MBA does not change the award title."},
    {"question": "Is the PGDM equivalent to an MBA?",
     "answer": "Great Lakes states the PGDM is AICTE approved but its FAQ makes no MBA-equivalence claim. If equivalence matters for further study or employment, ask the recipient institution or employer and check with the Association of Indian Universities."},
    {"question": "Who is the PGPM intended for?",
     "answer": "The 2027-28 admission criteria require at least 24 months of full-time post-graduation work experience by 30 April 2027, a recognised bachelor's degree and at least 50% in Class 10, Class 12 and the degree. Internships and part-time work do not count."},
    {"question": "Can fresh graduates apply for the PGDM?",
     "answer": "Yes. The 2027-29 PGDM route covers fresh graduates and applicants with fewer than 36 months of full-time work experience by 30 May 2027, with a recognised bachelor's degree and at least 50% in Class 10, Class 12 and the degree. Final-year students may apply with proof of graduation by 30 June."},
    {"question": "Which entrance tests are accepted?",
     "answer": "The PGDM accepts CAT, XAT or GMAT scores, and the PGPM accepts CAT, XAT, GMAT or NMAT, each within cycle-specific validity windows. Check the admissions page for the exact test years before applying."},
    {"question": "Can international applicants apply?",
     "answer": "Both programme FAQs say foreign and Indian applicants are evaluated on the same basis, with TOEFL or IELTS required only for non-Indian applicants whose undergraduate instruction was not primarily in English. AICTE's 2026-27 letter, however, shows international-student approval as No for both courses, so confirm eligibility with Great Lakes before applying."},
    {"question": "How much does the PGPM cost?",
     "answer": "The 2027-28 PGPM schedule for Indian students totals INR 23,50,000 for the one-year course, including tuition, programme fee, accommodation, a refundable INR 10,000 deposit and an INR 5,000 alumni subscription. A separate USD schedule totals USD 41,450 for international students."},
    {"question": "Are PGDM fees annual?",
     "answer": "No. The reviewed PGDM schedule is a single INR 22,50,000 total for the whole 2026-28 programme, including accommodation, deposit and alumni subscription. It is not an annual figure and not a confirmed 2027-29 tariff."},
    {"question": "Can StudentsTraffic submit the application for me?",
     "answer": "Great Lakes states it does not authorise third parties to initiate applications on an applicant's behalf. Counselling can help compare fit, but you must complete the official application yourself."},
    {"question": "What does AACSB accreditation confirm?",
     "answer": "AACSB's own directory lists Great Lakes Institute of Management Chennai with Business accreditation. It is an institution-level listing and does not state a separate accreditation for any individual programme."},
]
u["researchSources"] = [
    {"label": "AICTE - Extension of Approval 2026-27 (Great Lakes Chennai)", "url": EOA, "kind": "government", "checkedAt": D},
    {"label": "AICTE - Approved institutes dashboard", "url": AICTE_DASH, "kind": "recognition", "checkedAt": D},
    {"label": "AACSB - Accredited institutions directory", "url": AACSB, "kind": "recognition", "checkedAt": D},
    {"label": "Great Lakes Chennai - Contact", "url": "https://www.greatlakes.edu.in/chennai/contact", "kind": "official-university", "checkedAt": D},
    {"label": "Great Lakes Chennai - PGPM FAQ", "url": PGPM_FAQ, "kind": "official-university", "checkedAt": D},
    {"label": "Great Lakes Chennai - PGPM admissions", "url": PGPM_ADM, "kind": "official-university", "checkedAt": D},
    {"label": "Great Lakes Chennai - PGPM fees", "url": PGPM_FEES, "kind": "official-university", "checkedAt": D},
    {"label": "Great Lakes Chennai - PGDM FAQ", "url": PGDM_FAQ, "kind": "official-university", "checkedAt": D},
    {"label": "Great Lakes Chennai - PGDM admissions", "url": PGDM_ADM, "kind": "official-university", "checkedAt": D},
    {"label": "Great Lakes Chennai - PGDM fees", "url": PGDM_FEES, "kind": "official-university", "checkedAt": D},
    {"label": "Great Lakes Chennai - Mandatory disclosure", "url": "https://www.greatlakes.edu.in/chennai/about-us/mandatory-disclosure", "kind": "official-university", "checkedAt": D},
    {"label": "Great Lakes Chennai - Grievance redressal", "url": "https://www.greatlakes.edu.in/chennai/about-us/grievance-redressal-system", "kind": "official-university", "checkedAt": D},
]

# ---- programmes ----
AUD_ELIGIBLE = ["Indian applicants", "NRI applicants (AICTE NRI approval Yes)"]


def audience(src):
    return {
        "availability": "restricted",
        "eligibleAudiences": AUD_ELIGIBLE,
        "restrictions": [
            "AICTE's 2026-27 approval shows International Students Approval Status as No for this course; the programme FAQ nevertheless describes non-Indian applicants, so confirm international eligibility with Great Lakes before applying.",
            "Recognised degree, programme-specific academic thresholds, accepted test and work-experience conditions apply.",
            "TOEFL/IELTS is required for non-Indian applicants whose undergraduate primary instruction language was not English.",
        ],
        "notes": "No supernumerary or management quota is assumed. The programme FAQ and AICTE's EoA letter differ on international applicants; the restriction is stated as published.",
        "verifiedAt": D,
        "sourceUrl": src,
    }


progs = copy.deepcopy(u["programmes"])
for p in progs:
    p["slug"] = SLUGMAP[p["slug"]]
pgpm, pgdm = progs
pgpm["officialTitle"] = "Post Graduate Program in Management (PGPM; award: Post Graduate Certificate in Management)"
pgpm["audienceEligibility"] = audience(EOA)
pgdm["audienceEligibility"] = audience(EOA)
pgpm["admissionsContent"]["overview"] = (
    "The one-year residential PGPM awards a Post Graduate Certificate in Management and needs at least 24 months of "
    "full-time work experience. Apply directly to Great Lakes through its official online application."
)
pgdm["admissionsContent"]["overview"] = (
    "The two-year residential PGDM accepts fresh graduates and applicants with under 36 months of work experience. "
    "Apply directly to Great Lakes through its official online application."
)
pgpm["feeNotes"] = ("Reported total for Indian students for the one-year 2027-28 programme: INR 23,50,000 (tuition INR 12,43,000, programme fee "
                    "INR 6,96,000, single AC accommodation INR 3,96,000, refundable deposit INR 10,000, alumni subscription INR 5,000). "
                    "International students have a separate USD 41,450 schedule. Combined whole-course charge, not annual tuition.")
pgpm["fee"]["notes"] = pgpm["feeNotes"]
pgdm["feeNotes"] = ("Reported total for the whole two-year 2026-28 programme: INR 22,50,000 (tuition INR 10,25,000, programme fee INR 5,78,000, "
                    "twin AC accommodation INR 6,32,000, refundable deposit INR 10,000, alumni subscription INR 5,000). Not annual tuition and not "
                    "a confirmed 2027-29 tariff; applicant category is not stated.")
pgdm["fee"]["notes"] = pgdm["feeNotes"]
pgpm["officialProgramUrl"] = PGPM_FAQ
pgdm["officialProgramUrl"] = PGDM_FAQ
u["programmes"] = progs
u["admissionsContent"] = {
    "cta": "Get help comparing programme fit, then submit your application directly to Great Lakes.",
    "thirdPartyRestriction": "Great Lakes does not authorise third parties to initiate applications on applicants' behalf; StudentsTraffic can help compare fit, but you submit the application yourself.",
}

# ---- evidence ----
for e in evidence:
    if "programmeSlug" in e:
        e["programmeSlug"] = SLUGMAP[e["programmeSlug"]]
    if e["publicField"] == "establishedYear":
        e["internalNotes"] = ("AACSB description states the school was founded in 2004. AICTE's EoA lists year of establishment 2010 "
                              "(likely the AICTE approval start); 2004 retained as the founding year.")
    if e["publicField"] in ("audienceEligibility",):
        e["claimText"] = ("Programme FAQ says foreign and Indian applicants are evaluated on the same basis with a conditional TOEFL/IELTS rule; "
                          "AICTE EoA 2026-27 shows NRI approval Yes and International Students Approval No. Restricted audience encoded.")
        e["sourceUrl"] = EOA if False else e["sourceUrl"]
        e["internalNotes"] = "Conflict between programme FAQ and AICTE international-student column recorded; international eligibility left to confirmation."
    e["reviewBy"] = REVIEW


def ev(entity, field, claim, label, url, grade="A", notes=None, pslug=None, status="verified"):
    x = {"entity": entity, "universitySlug": SLUG}
    if pslug:
        x["programmeSlug"] = pslug
    x.update({"publicField": field, "claimText": claim, "status": status, "sourceLabel": label, "sourceUrl": url,
              "sourceGrade": grade, "checkedAt": D, "reviewBy": REVIEW})
    if notes:
        x["internalNotes"] = notes
    return x


evidence += [
    ev("university", "identity",
       "AICTE EoA 2026-27: Great Lakes Institute of Management, East Coast Road, Manamai Village, Kanchipuram District, Tamil Nadu 603102; permanent ID 1-17358363; Private-Self Financing; PGCM intake 180 and PGDM intake 240 for 2026-27; NRI approval Yes, International Students Approval No.",
       "AICTE - Extension of Approval 2026-27 (Great Lakes Chennai)", EOA,
       notes="F.No. Southern/1-46215356731/2026/EOA, approval date 13-Apr-2026, printed 20 April 2026. Saved at research/india-source-bundles/great-lakes-institute-of-management-chennai/eoa-26-27.pdf. AICTE dashboard not queried."),
    ev("university", "recognitionBadges",
       "AICTE EoA 2026-27 lists Great Lakes Institute of Management (permanent ID 1-17358363) as approved to conduct PGCM (180) and PGDM (240) among other courses.",
       "AICTE - Extension of Approval 2026-27 (Great Lakes Chennai)", EOA, notes="Letter PDF hosted by the institution; it is AICTE's computer-generated approval letter."),
    ev("university", "recognitionBadges",
       "AACSB directory lists Great Lakes Institute of Management Chennai with Business accreditation.",
       "AACSB - Accredited institutions directory", AACSB),
    ev("university", "campusLifestyle", "Fee pages: PGPM and PGDM residential; hostel mandatory; AICTE EoA address Manamai Village.",
       "Great Lakes Chennai - PGPM fees", PGPM_FEES),
    ev("university", "whyChoose", "AICTE EoA 2026-27 PGCM and PGDM approval; AACSB Business accreditation; programme criteria (24 months PGPM, under 36 months PGDM).",
       "AICTE - Extension of Approval 2026-27 (Great Lakes Chennai)", EOA),
    ev("university", "thingsToConsider", "PGPM FAQ: award is PGCM; AICTE EoA: International Students Approval No, NRI Yes; PGDM schedule is 2026-28.",
       "Great Lakes Chennai - PGPM FAQ", PGPM_FAQ, notes="AICTE EoA: " + EOA),
    ev("university", "bestFitFor", "PGPM FAQ and admissions: 24 months experience; PGDM FAQ: under 36 months; tests CAT/XAT/GMAT/NMAT.",
       "Great Lakes Chennai - PGDM FAQ", PGDM_FAQ, notes="PGPM FAQ: " + PGPM_FAQ),
    ev("university", "faq", "AICTE approval, PGCM award, PGDM fresher route, tests, international applicant rule, fee totals for PGPM 2027-28 and PGDM 2026-28.",
       "Great Lakes Chennai - PGDM FAQ", PGDM_FAQ, notes="PGPM FAQ: " + PGPM_FAQ + "; fees: " + PGPM_FEES + " and " + PGDM_FEES + "; AICTE: " + EOA),
]
evidence = [e for e in evidence if not (e["entity"] == "university" and e["publicField"] == "recognition")]
evidence.append(ev("university", "recognition", "AACSB directory confirms Business accreditation for Great Lakes Institute of Management Chennai.",
                   "AACSB - Accredited institutions directory", AACSB))

payload = {"courses": courses, "universities": [u], "evidence": evidence}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w") as fh:
    json.dump(payload, fh, indent=2, ensure_ascii=False)
    fh.write("\n")
print(OUT, len(progs), "programmes", len(evidence), "evidence")

# ---- inventory: packet rows, first two packaged ----
src = list(csv.DictReader(open(os.path.join(BUNDLE, "packet-programme-inventory.csv"))))
cols = list(src[0].keys())
for i, r in enumerate(src):
    if i == 0:
        r["canonical_course_match"] = "pg-certificate-business-management"
        r["notes"] = "PACKAGED in 0404 (availability=restricted). Award is PGCM per PGPM FAQ and AICTE; not an MBA. AICTE international-student approval No; programme FAQ addresses non-Indian applicants."
    elif i == 1:
        r["notes"] = "PACKAGED in 0404 (availability=restricted). AICTE-approved PGDM; no MBA-equivalence claim. AICTE international-student approval No; programme FAQ addresses non-Indian applicants."
    else:
        r["notes"] = "HELD (not packaged in 0404): " + r["notes"]
    r["intl_status"] = "unknown" if i < 2 else r["intl_status"]
os.makedirs(os.path.join(ROOT, "research", "india-programme-inventory"), exist_ok=True)
with open(os.path.join(ROOT, "research", "india-programme-inventory", f"{SLUG}.csv"), "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=cols)
    w.writeheader()
    w.writerows(src)

man = {"version": 1, "id": MIG,
       "description": "Publish Great Lakes Institute of Management, Chennai (AICTE 1-17358363; AACSB Business accredited) with its PGPM (Post Graduate Certificate in Management) and two-year PGDM programmes.",
       "createdAt": D, "payload": "payload.json"}
with open(os.path.join(ROOT, "content-migrations", MIG, "manifest.json"), "w") as f:
    json.dump(man, f, indent=2, ensure_ascii=False)
    f.write("\n")
