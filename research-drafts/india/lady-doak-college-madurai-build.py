"""Builds content-migrations/0403-india-lady-doak-college-madurai from the TN fresh-10 research packet.

Inputs (copied from the packet): research/india-source-bundles/lady-doak-college-madurai/
  packet-fragments-input.DO-NOT-PUBLISH.json is used ONLY as the source of the 26 UG programme fragments and
  their evidence; the specimen itself is never published. Only the 26 UG programmes verified against the
  live courses page and the 2026-27 handbook are packaged; the other 49 inventory rows stay held.
"""
import json, glob, csv, re, copy
from pathlib import Path

R = Path('/Users/bharat/Documents/studentstraffic')
SRC = R / 'research/india-source-bundles/lady-doak-college-madurai'
MIG = R / 'content-migrations/0403-india-lady-doak-college-madurai'
DAY = '2026-10-27'
REVIEW = '2027-01-27'
SL = 'lady-doak-college-madurai'
HB = 'https://www.ladydoakcollege.edu.in/website/hand_book/Handbook%202026-2027.pdf'
COURSES = 'https://www.ladydoakcollege.edu.in/courses_offered.html'
ADM = 'https://www.ladydoakcollege.edu.in/admission/index.html'
UGC = 'https://www.ugc.gov.in/colleges/Autonomous_Colleges_list'
MKU = 'https://mkuniversity.ac.in/new/acollege/aac'

spec = json.load(open(SRC / 'packet-fragments-input.DO-NOT-PUBLISH.json'))
su = spec['universities'][0]
progs = copy.deepcopy(su['programmes'])
assert len(progs) == 26

# --- canonical courses: latest existing record, byte-identical -------------------------------
def latest_course(slug):
    found = None
    for f in sorted(glob.glob(str(R / 'content-migrations/*/payload.json'))):
        if '/0403-' in f:
            continue
        for c in json.load(open(f)).get('courses', []):
            if c['slug'] == slug:
                found = c
    if found is None:
        raise SystemExit('missing canonical course ' + slug)
    return found

# The packet mapped both B.A. Economics routes to language/literature courses; Economics has its own canonical course.
for p in progs:
    if 'economics' in p['slug']:
        p['canonicalCourseSlug'] = 'bachelor-economics'

order = []
for p in progs:
    if p['canonicalCourseSlug'] not in order:
        order.append(p['canonicalCourseSlug'])
courses = [latest_course(s) for s in order]

# --- programmes ------------------------------------------------------------------------------
def stream(p):
    return 'Aided' if p['slug'].endswith('-aided') else 'Self-financed'

NEXT = ('The 2026–27 undergraduate application page is no longer online, so these criteria are those published for the 2026–27 cycle; '
        'confirm the criteria and dates for the next intake with the college before applying.')
RESTR = ['Women applicants only; Lady Doak College is a women’s college.']
for p in progs:
    ac = p['admissionsContent']
    first = ac['eligibility']['items'][0].rstrip('.')
    first = first[0].lower() + first[1:] if not first.startswith(('B.', 'M.')) else first
    title = p['officialTitle']
    ov = (f"{title} is a three-year, campus-based degree for women at Lady Doak College, Madurai. Entry requires a {first.replace('Higher Secondary ', 'Higher Secondary (Plus Two) ', 1) if first.startswith('higher secondary') else first}. "
          f"Applicants apply online and are admitted through the college’s counselling process.")
    ov = ov.replace('a higher', 'a Higher') if ' a higher' in ov else ov
    ac['overview'] = ov[:420] if len(ov) <= 420 else ov.split('. Applicants')[0][:417].rsplit(' ', 1)[0] + '.'
    assert len(ac['overview']) <= 420, (p['slug'], len(ac['overview']))
    ac['deadlinesNote'] = NEXT
    ac.pop('researchStatus', None)
    ac.pop('applicationUrl', None)
    p['audienceEligibility'] = {
        'availability': 'restricted',
        'eligibleAudiences': ['Women applicants with a qualifying Higher Secondary (Plus Two) or accepted equivalent certificate'],
        'restrictions': RESTR + ['Applicants with qualifications not listed in the college’s criteria, including overseas qualifications, must first obtain a provisional eligibility certificate from Madurai Kamaraj University.'],
        'notes': 'Foreign students must provide a valid visa and passport copy with their documents. The college lists no separate international-applicant quota or fee category.',
        'verifiedAt': DAY,
        'sourceUrl': ADM,
    }
    p['mediumNote'] = p['mediumNote'].replace('A programme-specific teaching language has not been verified; no language filter is assigned.',
                                                'The college does not publish a teaching language for this programme.')

# --- university ------------------------------------------------------------------------------
u = {k: v for k, v in su.items() if k != 'programmes'}
u['summary'] = ('Lady Doak College is an autonomous women’s college in Madurai, Tamil Nadu, founded in 1948 and affiliated to Madurai Kamaraj University. '
                'It offers aided and self-financed arts, science, commerce and management degrees, with postgraduate and research programmes.')
u['campusLifestyle'] = ('The Madurai campus has laboratories, two multimedia theatres, a recording studio, a library, an auditorium-cum-indoor stadium seating 3,500, '
                        'an athletic track and courts for basketball, badminton, kabaddi, kho-kho and handball. Seventeen on-campus centres cover areas such as entrepreneurship, '
                        'environmental studies and information technology. The campus is soft-drinks-free and runs composting and rainwater-harvesting units.')
u['cityProfile'] = ('Lady Doak College is in Madurai, Tamil Nadu, the oldest women’s college in the city. Residents live on campus; day scholars should plan the commute '
                    'against the department timetable. Students Traffic can help you compare Madurai colleges against your subject, fee budget and travel needs.')
u['practicalExposure'] = ('Students can take part in service-learning, educational tours, industrial visits and summer internships. The Career Guidance and Placement Centre '
                          'and the Centre for Life Frontier Engagement run career and skills activity. None of this is a placement guarantee, so ask your department which '
                          'fieldwork or project components belong to your award.')
u['hostelOverview'] = ('Thirteen residential halls house about 850 students, each overseen by a faculty supervisor. Rooms go only to current students, with preference '
                       'to those living outside Madurai. Hostel is a separate application made after the course application, and applying does not guarantee a room. '
                       'Hostel and mess charges are not part of the academic fee tables, so confirm them with the college.')
u['dietarySupport'] = ('A Main Canteen and a Mini Canteen with a fruit-juice corner serve food from 8 a.m. to 6.30 p.m. The college publishes no special-diet or allergy '
                       'arrangement, so residents with dietary needs should confirm mess arrangements before moving in.')
u['safetyOverview'] = ('A twelve-bedded clinic is run by a visiting doctor, a residential health officer and a trained nurse, with a yearly medical inspection for all students. '
                       'The college has an Internal Complaints Committee for sexual-harassment complaints and an Anti-Ragging Committee headed by the Principal.')
u['studentSupport'] = ('A Counselling Centre offers personal counselling, workshops, support groups and value-added courses. The Career Guidance and Placement Centre handles '
                       'career guidance. Students Traffic can walk you through programme choice, the online application and counselling steps, and documents.')
u['whyChoose'] = [
    'Autonomous women’s college with aided and self-financed streams in the same programme list.',
    'UGC autonomy since 1989–90 and a long-established campus with residential halls for about 850 students.',
    'Service-learning, counselling and career-guidance structures on campus.',
]
u['thingsToConsider'] = [
    'Women only: the college admits women applicants only.',
    'Aided-stream fee tables show a combined first-year total; annual tuition is not separated, so compare totals with that in mind.',
    'The 2026–27 undergraduate application page is offline, so confirm the next intake’s criteria and dates with the college.',
]
u['bestFitFor'] = [
    'Women choosing between arts, science, commerce and management degrees in Madurai.',
    'Applicants who want both an aided and a self-financed option in one college.',
    'Students who want a residential women’s campus with counselling and career support.',
]
u['recognitionBadges'] = ['UGC — Autonomous College, 2022–23 to 2026–27 (Madurai Kamaraj University)']
u['recognitionLinks'] = [
    {'label': 'UGC autonomous colleges list', 'url': UGC},
    {'label': 'Madurai Kamaraj University – autonomous colleges', 'url': MKU},
]
u['researchSources'] = [
    {'label': 'Official programme catalogue', 'url': COURSES, 'kind': 'official-program', 'checkedAt': DAY},
    {'label': 'Official 2026–27 handbook', 'url': HB, 'kind': 'official-fee', 'checkedAt': DAY},
    {'label': 'Official UG admission notice (captured; now returns 404)', 'url': ADM, 'kind': 'official-program', 'checkedAt': DAY},
    {'label': 'UGC autonomous colleges list', 'url': UGC, 'kind': 'recognition', 'checkedAt': DAY},
    {'label': 'Madurai Kamaraj University autonomous colleges', 'url': MKU, 'kind': 'recognition', 'checkedAt': DAY},
    {'label': 'College website', 'url': 'https://www.ladydoakcollege.edu.in/', 'kind': 'official-university', 'checkedAt': DAY},
]
u['mediaAttribution'] = {}
u['admissionsContent'] = {
    'contentState': 'research_ready',
    'scope': 'This record covers Lady Doak College, Madurai, and its 2026–27 undergraduate programmes only. Postgraduate, research and short-course awards are outside this record.',
    'sectionStates': {
        'decisionSummary': 'published', 'eligibility': 'published', 'fees': 'research_ready', 'admissions': 'published',
        'academics': 'research_ready', 'recognition': 'published', 'studentLiving': 'published',
        'scholarships': 'absent', 'funding': 'absent', 'placements': 'absent',
    },
    'ctas': [
        {'trigger': 'eligibility', 'label': 'Check my Lady Doak eligibility',
         'capture': ['Class 12 board and subject group', 'intended programme', 'aided or self-financed preference']},
        {'trigger': 'fees', 'label': 'Compare Lady Doak fees for my programme',
         'capture': ['intended programme', 'aided or self-financed stream', 'hostel need']},
        {'trigger': 'application', 'label': 'Plan my Lady Doak application',
         'capture': ['document readiness', 'qualification type', 'preferred programmes']},
    ],
}
f = u['faq'] = [
    {'question': 'Is Lady Doak College a university or an affiliated college?',
     'answer': 'It is an autonomous college affiliated to Madurai Kamaraj University. UGC lists its autonomous status for 2022–23 to 2026–27; autonomy lets it run its own syllabi and examinations, but it is not a separate university.'},
    {'question': 'Who can apply to Lady Doak College?',
     'answer': 'Only women. Each programme also needs a Higher Secondary (Plus Two) pass with the subjects listed for it. Applicants with other qualifications, including overseas ones, must first obtain a provisional eligibility certificate from Madurai Kamaraj University.'},
    {'question': 'What is the difference between aided and self-financed programmes?',
     'answer': 'The college lists aided and self-financed streams separately, each with its own fee table. Aided streams show government, Katie Wilcox Education Association, examination and deposit components; self-financed streams show a tuition column and a larger total.'},
    {'question': 'How much does a degree cost?',
     'answer': 'The 2026–27 first-year totals run from about INR 24,700 for aided B.A. programmes to about INR 83,400 for self-financed B.Sc. Biotechnology. Each total includes a INR 3,000 caution deposit. Hostel and mess charges are separate.'},
    {'question': 'Is annual tuition shown for every programme?',
     'answer': 'Self-financed programmes publish a tuition column. Aided programmes show only a combined first-year total, so annual tuition for those is on request from the college.'},
    {'question': 'How do I apply?',
     'answer': 'Register as a new applicant on the college’s online system, complete the form, pay the application charge, then take part in online counselling for seat selection. Provisional admission is confirmed at document verification. Students Traffic can guide you through each step.'},
    {'question': 'Does an admission offer include a hostel room?',
     'answer': 'No. Hostel is a separate application made after the course application, and a room is not guaranteed. Thirteen residential halls house about 850 students, with preference to those living outside Madurai.'},
    {'question': 'What language are the courses taught in?',
     'answer': 'The college names the medium only for its two B.A. Economics routes: one Tamil medium and one English medium. For other programmes it publishes no teaching language, so confirm it with the department.'},
    {'question': 'What documents are needed for verification?',
     'answer': 'Plus Two mark sheets, transfer and conduct certificates, community certificate, income certificate, medical and physical-fitness certificates and the downloaded provisional admission letter. Foreign students add a valid visa and passport copy.'},
    {'question': 'Can international students apply?',
     'answer': 'The college’s documents list says foreign students must provide a visa and passport copy, and it lists no separate international quota or fee. Overseas qualifications need a Madurai Kamaraj University eligibility certificate. Confirm the current rules before travelling.'},
    {'question': 'Are scholarships guaranteed?',
     'answer': 'No. Scholarship availability depends on the current scheme and your category, so do not deduct an unconfirmed award from the published charges.'},
]

# --- evidence: university + the 26 packaged programmes only -----------------------------------
slugs = {p['slug'] for p in progs}
ev = []
ufield = {'identity': u['summary'], 'campusLifestyle': u['campusLifestyle'], 'cityProfile': u['cityProfile'],
          'practicalExposure': u['practicalExposure'], 'hostelOverview': u['hostelOverview'],
          'dietarySupport': u['dietarySupport'], 'safetyOverview': u['safetyOverview'], 'studentSupport': u['studentSupport']}
for e in spec['evidence']:
    e = copy.deepcopy(e)
    if e['entity'] == 'university':
        pf = e['publicField']
        if pf in ufield:
            e['claimText'] = ufield[pf]
            if pf != 'identity':
                e['sourceUrl'] = HB
                e['sourceLabel'] = 'Official 2026–27 handbook'
        if pf == 'recognition':
            e['claimText'] = 'Lady Doak College, Madurai is on the UGC autonomous colleges list: autonomous since 1989–90, current period 2022–23 to 2026–27, affiliating university Madurai Kamaraj University, Madurai. Also listed as an aided autonomous college on the Madurai Kamaraj University list. NAAC grade not verified on NAAC records and not published as a badge.'
            e['internalNotes'] = 'Row 1327 of the UGC list, read directly on 2026-10-27.'
        if pf == 'audienceRestriction':
            e['claimText'] = 'Lady Doak College is a women’s college; every programme is restricted to women applicants.'
            e['sourceUrl'] = HB
            e['internalNotes'] = 'Handbook 2026-27: oldest women’s college in Madurai, exclusively for women.'
        ev.append(e)
    elif e['programmeSlug'] in slugs:
        if e['publicField'] in ('eligibility', 'admissions', 'documentsRequired', 'intake', 'audienceEligibility') and e['sourceUrl'] == ADM:
            e['internalNotes'] = (e.get('internalNotes', '') + ' The 2026-27 admission page was captured by the research packet; it returned HTTP 404 when re-checked on 2026-10-27 and the Wayback Machine holds only 2025 snapshots.').strip()
        ev.append(e)
# economics medium wording / canonical course unaffected; audience evidence text
for e in ev:
    if e['entity'] == 'programme' and e['publicField'] == 'audienceEligibility':
        e['claimText'] = 'Women applicants only; overseas or unlisted qualifications need a Madurai Kamaraj University provisional eligibility certificate; foreign students supply visa and passport copies.'
u['programmes'] = progs

payload = {'courses': courses, 'universities': [u], 'evidence': ev}
MIG.mkdir(parents=True, exist_ok=True)
json.dump(payload, open(MIG / 'payload.json', 'w'), ensure_ascii=False, indent=2)
open(MIG / 'payload.json', 'a').write('\n')
man = json.load(open(MIG / 'manifest.json'))
man['createdAt'] = DAY
man['payload'] = 'payload.json'
json.dump(man, open(MIG / 'manifest.json', 'w'), ensure_ascii=False, indent=2)
open(MIG / 'manifest.json', 'a').write('\n')

# --- programme inventory ---------------------------------------------------------------------
rows = list(csv.DictReader(open(SRC / 'programme-inventory.packet.csv')))
by_title = {p['officialTitle']: p for p in progs}
out = []
for r in rows:
    t = re.sub(r' — (Aided|Self-financed)$', r' (\1)', r['programme_official_title'])
    t = t.replace('(Tamil Medium) (Aided)', '(Tamil Medium) (Aided)')
    pk = by_title.get(t)
    if pk:
        r['canonical_course_match'] = pk['canonicalCourseSlug']
        if pk['canonicalCourseSlug'] == 'bachelor-economics':
            r['discipline'] = 'economics'
        r['notes'] = (r['notes'] + ' | ' if r['notes'] else '') + 'Packaged in 0403-india-lady-doak-college-madurai as ' + pk['slug'] + '.'
    else:
        r['notes'] = (r['notes'] + ' | ' if r['notes'] else '') + 'Held: outside the 26 verified 2026-27 UG programmes packaged in 0403.'
    out.append(r)
assert sum('Packaged in' in r['notes'] for r in out) == 26
w = csv.DictWriter(open(R / 'research/india-programme-inventory/lady-doak-college-madurai.csv', 'w', newline=''), fieldnames=list(rows[0].keys()))
w.writeheader(); w.writerows(out)
print('programmes', len(progs), 'evidence', len(ev), 'courses', len(courses))
