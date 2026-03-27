import type { Faq, University } from "@/lib/data/types";

type UniversityContentOverride = Partial<
  Pick<
    University,
    | "summary"
    | "campusLifestyle"
    | "cityProfile"
    | "clinicalExposure"
    | "studentSupport"
    | "safetyOverview"
    | "whyChoose"
    | "thingsToConsider"
    | "bestFitFor"
  >
>;

const topicFilterPattern = /\b(hostel|hostels|hostel-backed|mess|food)\b/i;

const hostelFallback =
  "Campus logistics and accommodation planning should be confirmed directly with the university during the admission cycle.";

const settlingFallback =
  "Students should verify day-to-day settling-in support, local language adaptation, and arrival guidance directly with the university.";

function sanitizeSentence(text: string) {
  return text
    .replace(/\bhostel-backed\b/gi, "campus-supported")
    .replace(/\bhostels?\b/gi, "campus logistics")
    .replace(/\bmess\b/gi, "meal arrangements")
    .replace(/\bIndian food\b/gi, "day-to-day support")
    .replace(/\bfood\b/gi, "daily living");
}

function sanitizeFaqItems(items: Faq[]) {
  return items.map((item) => ({
    question: sanitizeSentence(item.question),
    answer: sanitizeSentence(item.answer),
  }));
}

function buildFallbackList(university: University, variant: "why" | "consider" | "fit") {
  if (variant === "why") {
    return [
      `Recognizable ${university.type.toLowerCase()} medical training option in ${university.city}.`,
      "Useful for students comparing academic environment, city fit, and teaching style together.",
      "Shortlist-worthy when institutional profile matters more than promotional claims.",
    ];
  }

  if (variant === "consider") {
    return [
      "Confirm the current language pathway and the clinical transition in later years.",
      "Evaluate hospital exposure, faculty depth, and assessment style in the current cycle.",
      "Compare total cost and city fit against at least two alternatives before committing.",
    ];
  }

  return [
    `Students prioritizing a clearer academic fit in ${university.city}.`,
    "Families who want to compare curriculum style and city environment, not just tuition.",
    "Applicants prepared to verify recognition, language pathway, and clinical exposure carefully.",
  ];
}

function sanitizeList(
  university: University,
  items: string[],
  variant: "why" | "consider" | "fit"
) {
  const filtered = items
    .map((item) => sanitizeSentence(item))
    .filter((item) => !topicFilterPattern.test(item));

  const fallback = buildFallbackList(university, variant);
  const merged = [...filtered];

  for (const item of fallback) {
    if (merged.length >= 3) {
      break;
    }

    if (!merged.includes(item)) {
      merged.push(item);
    }
  }

  return merged.slice(0, 3);
}

const universityContentOverrides: Record<string, UniversityContentOverride> = {
  "kazan-state-medical-university": {
    summary:
      "A long-established public medical university in Kazan with deep roots in Russian medical education and a stronger brand profile than many regional alternatives.",
    campusLifestyle:
      "Kazan offers a large-city student environment with major transit, a broad academic ecosystem, and a visible international student presence.",
    cityProfile:
      "As one of Russia's major academic cities, Kazan gives students a more connected urban setting and a wider institutional ecosystem than smaller Russian destinations.",
    clinicalExposure:
      "Clinical training sits inside a mature public-university model, so the main academic consideration is how students adapt to Russian-speaking hospital settings over time.",
    studentSupport:
      "This profile suits families looking for a public university with stronger historical standing and a city environment that feels more established for international study.",
  },
  "altai-state-medical-university": {
    summary:
      "A long-running public medical university in Barnaul that appeals to students comparing lower-cost Russian state institutions.",
    campusLifestyle:
      "The campus experience is more regional and quieter than Kazan or Moscow-oriented options, which can work well for students who prefer a simpler daily routine.",
    cityProfile:
      "Barnaul is a smaller Siberian city, so students trade big-city convenience for a calmer and usually more cost-aware academic environment.",
    clinicalExposure:
      "The value case here depends on public-university structure and regional hospital exposure rather than on a premium metropolitan clinical brand.",
    studentSupport:
      "It fits applicants who want a Russian public-university pathway with a steadier cost profile and fewer distractions than larger city campuses.",
  },
  "nam-can-tho-university-faculty-of-medicine": {
    summary:
      "A newer private medical faculty in Can Tho that combines a guided admissions setup with a hospital-backed campus model in the Mekong Delta.",
    campusLifestyle:
      "The environment feels structured and campus-centered, with medicine presented as a flagship track rather than one department inside a loose private-university mix.",
    cityProfile:
      "Can Tho gives students a southern regional hub with a calmer pace than Ho Chi Minh City and enough scale to avoid the isolation of a small provincial town.",
    clinicalExposure:
      "The main academic question is how consistently Nam Can Tho University Hospital and partner sites support bedside learning once students move beyond the early pre-clinical phase.",
    studentSupport:
      "This profile is strongest for families who want a private-university process with closer handholding and a city that feels easier to navigate than the major metros.",
    whyChoose: [
      "Private medical setup with a clearer international-admissions orientation than many public schools in the delta.",
      "Can Tho location gives a balanced city environment without Hanoi or Ho Chi Minh City intensity.",
      "Works best when families value guided onboarding and are comfortable comparing newer programs carefully.",
    ],
    thingsToConsider: [
      "Verify the current recognition position and the exact English-medium pathway before committing.",
      "Ask how clinical rotations are distributed between the university hospital and outside partner hospitals.",
      "Compare program maturity against longer-established public options such as Can Tho or Hue.",
    ],
    bestFitFor: [
      "Students who want a private-campus experience in southern Vietnam.",
      "Families prioritizing support and a calmer city over legacy public-school prestige.",
      "Applicants ready to confirm hospital exposure and long-term licensing fit in detail.",
    ],
  },
  "phan-chau-trinh-university": {
    summary:
      "A focused private medical university in Da Nang built around a digital-medical-university vision, owned clinical assets, and an unusually medicine-led institutional identity.",
    campusLifestyle:
      "The campus feels more medical-school-first than broad private-university lifestyle brand, with simulation, museum, and hospital-linked facilities shaping the student experience.",
    cityProfile:
      "Da Nang gives PCTU a strong lifestyle advantage: a modern coastal city with better mobility and day-to-day comfort than many provincial medical-school locations.",
    clinicalExposure:
      "Its strongest differentiator is the integrated hospital model, so the real comparison point is how early skills training and owned-hospital exposure translate into sustained clinical depth.",
    studentSupport:
      "This is a strong shortlist for students who want a tightly focused private medical environment rather than a large multidisciplinary campus.",
    whyChoose: [
      "Distinctive medical-only identity with simulation-driven training and a more specialized academic story than most private competitors.",
      "Da Nang combines city comfort, connectivity, and a calmer rhythm than Hanoi or Ho Chi Minh City.",
      "Smaller intake positioning can appeal to families who want a more controlled learning environment.",
    ],
    thingsToConsider: [
      "Fees and overall cost usually sit above bare-bones public options, so compare value against recognition and training depth.",
      "Confirm the current international intake size and the exact language pathway for clinical years.",
      "Make sure the owned-hospital model is a better fit for you than a traditional large public teaching-hospital system.",
    ],
    bestFitFor: [
      "Students who want a distinctive private medical campus in Da Nang.",
      "Families comparing Vietnamese private schools on clinical infrastructure, not just tuition.",
      "Applicants who like smaller cohorts and a more tightly curated academic environment.",
    ],
  },
  "georgian-national-university-seu": {
    summary:
      "A private Tbilisi university offering an English-medium medical route inside a broader urban and internationally oriented campus.",
    campusLifestyle:
      "The campus experience feels city-based and modern rather than residential, which appeals to students who want an accessible urban setting.",
    cityProfile:
      "Tbilisi gives students a more cosmopolitan day-to-day environment, broader housing choices, and easier international connectivity than smaller Georgian cities.",
    clinicalExposure:
      "Students should compare how the English-medium model transitions into hospital learning and how consistently partner-clinic exposure develops in later years.",
    studentSupport:
      "It suits applicants who value Tbilisi city life, English-medium delivery, and a private-university experience that feels relatively accessible for first-time families.",
  },
  "east-european-university": {
    summary:
      "A private Tbilisi medical option that is usually evaluated for English-medium study and a comparatively approachable urban student experience.",
    campusLifestyle:
      "The university sits within a modern city-campus setting rather than a classic standalone medical-school environment.",
    cityProfile:
      "Tbilisi remains the main draw here, offering mobility, services, and a city rhythm that many international students find easier to settle into than smaller destinations.",
    clinicalExposure:
      "The key question is how the program converts classroom delivery into hospital-based learning and how students prepare for later clinical communication demands.",
    studentSupport:
      "This profile works best for students who want an English-medium path in Tbilisi and are willing to compare institutional depth carefully.",
  },
  "international-school-of-medicine": {
    summary:
      "A long-running Kyrgyz medical school with a strong international student profile and a recognizable place in Bishkek shortlists.",
    campusLifestyle:
      "The environment is more internationally mixed than many regional campuses, which shapes both classroom culture and peer networks.",
    cityProfile:
      "Bishkek offers a relatively manageable capital-city environment, with more services and institutional activity than smaller Kyrgyz destinations.",
    clinicalExposure:
      "Students should pay attention to the balance between campus teaching, simulation, and partner-hospital training as they move into clinical years.",
    studentSupport:
      "It suits applicants looking for a longer-established Kyrgyz option with visible foreign student enrollment and a more familiar shortlist profile.",
  },
  "asian-medical-institute": {
    summary:
      "A lower-cost private medical institute in Kyrgyzstan that frequently appears in affordability-driven shortlists for international students.",
    campusLifestyle:
      "The student experience is shaped more by cost efficiency and peer community than by a large standalone university ecosystem.",
    cityProfile:
      "Its value appeal comes from a simpler daily environment and lower-cost planning rather than from metropolitan infrastructure or prestige-city advantages.",
    clinicalExposure:
      "Students should compare how the low-fee model translates into faculty availability, skills training, and later-stage clinical exposure.",
    studentSupport:
      "This profile fits applicants whose first filter is affordability but who still want a program with a visible international intake pattern.",
  },
  "buon-ma-thuot-medical-university": {
    summary:
      "A Central Highlands medical university that stands out more for its regional-healthcare role and university hospital development than for big-city branding.",
    campusLifestyle:
      "The environment is academically focused and regionally grounded, with medicine tied closely to local healthcare needs in the highlands.",
    cityProfile:
      "Buon Ma Thuot offers a quieter inland city with a very different feel from coastal Da Nang or the larger metros, which can either sharpen focus or feel too remote depending on the student.",
    clinicalExposure:
      "The appeal here is the combination of campus hospital access and regional clinical relevance, but students should still compare how broad the later-year exposure becomes.",
    studentSupport:
      "It suits students who are comfortable with a smaller-city routine and want a medical setting that feels more community-oriented than commercially packaged.",
    whyChoose: [
      "Regional medical university with a clearer healthcare-service role in the Central Highlands.",
      "Calmer city environment can work well for students who prefer fewer distractions.",
      "Worth comparing if you want a different clinical catchment area from the usual Hanoi, Hue, or Ho Chi Minh City options.",
    ],
    thingsToConsider: [
      "International-program maturity is newer than at the best-known Vietnam schools.",
      "Buon Ma Thuot is more remote, so city convenience and peer-network depth are lower than in the major hubs.",
      "Ask how the university hospital and affiliate network support the full clinical journey.",
    ],
    bestFitFor: [
      "Students open to a quieter regional-city experience.",
      "Families who care about hospital access but do not need metro-city infrastructure.",
      "Applicants willing to trade city brand for a more localized academic setting.",
    ],
  },
  "can-tho-university-medicine-pharmacy": {
    summary:
      "One of the strongest public medical universities in southern Vietnam, with a long-standing faculty, deep Mekong Delta role, and a more proven public-school profile than most private alternatives.",
    campusLifestyle:
      "The academic culture feels clearly medical and professionally focused, with less lifestyle packaging than private campuses and a stronger sense of institutional continuity.",
    cityProfile:
      "Can Tho is large enough to feel connected and practical, but calmer and easier to manage than Ho Chi Minh City or Hanoi.",
    clinicalExposure:
      "CTUMP's strength is its long-established regional hospital ecosystem, so the key comparison is not access alone but how that public-hospital exposure aligns with your training style.",
    studentSupport:
      "This profile works especially well for students who want a public specialist institution in the south without paying for a premium private-city brand.",
    whyChoose: [
      "Established public faculty with a long regional role in Mekong Delta medical training.",
      "More proven institutional depth than many newer private entrants in Vietnam.",
      "Can Tho city balance is attractive for students who want a sizable but less overwhelming urban base.",
    ],
    thingsToConsider: [
      "Clinical years still depend on local-language communication, so the Vietnamese transition matters.",
      "As a public system, the environment can feel less polished and more self-driven than private admissions-led campuses.",
      "Compare total cost and recognition stack against Hue, Thai Nguyen, and Hanoi rather than only against private schools.",
    ],
    bestFitFor: [
      "Students who want a public medical school with a stronger track record in southern Vietnam.",
      "Families prioritizing training depth and regional hospital relevance over campus styling.",
      "Applicants who want a calmer city than Ho Chi Minh City but still want a meaningful urban center.",
    ],
  },
  "da-nang-university-medical-technology-pharmacy": {
    summary:
      "A public health-sciences institution in Da Nang that is growing in scope, but remains more clearly domestic and multidisciplinary than internationally marketed MBBS destinations.",
    campusLifestyle:
      "The campus feels practical and professionally oriented, with medicine sitting alongside other health disciplines rather than dominating the university identity.",
    cityProfile:
      "Da Nang is a major advantage here because students get one of Vietnam's most comfortable city environments even though the institution itself is not built around international medicine branding.",
    clinicalExposure:
      "Students need to verify how the medical program currently uses Da Nang's hospital network and how mature the international-facing pathway really is.",
    studentSupport:
      "This option is more about city and public-health-sciences environment than about a polished international medical-admissions pipeline.",
    whyChoose: [
      "Public health-sciences setting in one of Vietnam's most livable cities.",
      "Broader applied-health environment may appeal to students who like an interprofessional campus.",
      "Worth reviewing if you prefer a public institution in central Vietnam.",
    ],
    thingsToConsider: [
      "International MBBS delivery and English-medium details are not as clearly established as at the better-known Vietnam options.",
      "Medicine is one part of a broader health-sciences school, so brand visibility is lower than at legacy medical universities.",
      "Confirm current hospital affiliations, admissions process, and recognition position directly.",
    ],
    bestFitFor: [
      "Students who specifically want Da Nang and prefer public institutions.",
      "Families comfortable investigating a less marketed option in detail.",
      "Applicants comparing central-Vietnam public schools beyond the headline names.",
    ],
  },
  "dai-nam-university-faculty-of-medicine": {
    summary:
      "A fast-rising private Hanoi faculty that combines a cost-conscious tuition structure with capital-city access and active hospital partnerships.",
    campusLifestyle:
      "The setting is distinctly private-university and modern, with medicine placed inside a newer Hanoi campus rather than a legacy public teaching-school atmosphere.",
    cityProfile:
      "Hanoi is the strategic draw: students sit inside Vietnam's deepest northern hospital ecosystem and a much larger academic network than most provincial options can offer.",
    clinicalExposure:
      "Its academic case depends on how well the faculty converts partner-hospital access and its Hanoi relationships into a consistent six-year clinical pathway.",
    studentSupport:
      "This profile suits students who want the capital-city advantage at a lower entry price than many premium private schools, while accepting that the faculty itself is still newer.",
    whyChoose: [
      "Hanoi location gives access to a dense hospital and specialist network.",
      "Private-university structure can feel more guided than older public institutions.",
      "Often attractive to cost-aware families comparing private options in the capital.",
    ],
    thingsToConsider: [
      "The faculty is newer than Hanoi Medical University or Hue, so long-run graduate depth is still building.",
      "The three-semester rhythm can feel more intensive than a conventional academic calendar.",
      "Compare how much of the clinical story depends on external hospital partners rather than internal legacy.",
    ],
    bestFitFor: [
      "Students who want a private Hanoi option without premium-tier pricing.",
      "Families comparing newer private faculties against older public brands in the capital.",
      "Applicants willing to trade legacy prestige for value and city access.",
    ],
  },
  "dong-a-university-college-of-medicine": {
    summary:
      "A newer private medicine program in Da Nang that leans on modern campus presentation, international-facing admissions, and the city's strong livability.",
    campusLifestyle:
      "The environment feels multidisciplinary and contemporary, so medicine benefits from a polished private-campus experience rather than a traditional medical-school culture.",
    cityProfile:
      "Da Nang is a major part of the appeal, giving students a cleaner, more navigable city than the two biggest metros while still offering real urban convenience.",
    clinicalExposure:
      "The critical question is how effectively the program turns simulation, faculty mix, and hospital partnerships into robust bedside training later on.",
    studentSupport:
      "This profile works best for students who want a modern private campus in Da Nang and do not mind evaluating a newer medicine setup carefully.",
    whyChoose: [
      "Modern private-campus environment in one of Vietnam's easiest cities to settle into.",
      "International-facing medicine admissions story is clearer than at many domestic-first universities.",
      "Good shortlist option for students who want Da Nang without committing to a higher-priced brand.",
    ],
    thingsToConsider: [
      "Verify the current recognition position and hospital network instead of relying on marketing alone.",
      "As a newer medicine pathway, it needs closer comparison with Duy Tan, PCTU, and public central-Vietnam schools.",
      "Make sure the broader private-campus culture is what you want, rather than a pure medical-school environment.",
    ],
    bestFitFor: [
      "Students who want a private Da Nang campus with a modern feel.",
      "Families prioritizing city comfort and onboarding experience.",
      "Applicants willing to compare newer programs on substance, not just presentation.",
    ],
  },
  "duy-tan-university-faculty-of-medicine": {
    summary:
      "A large private university in Da Nang with a stronger national and international brand than most private Vietnam medical options, plus a broad multidisciplinary ecosystem.",
    campusLifestyle:
      "The campus feels bigger and more institutionally varied than most private medical entrants, so medicine benefits from scale, facilities, and a visible research-oriented brand.",
    cityProfile:
      "Da Nang gives Duy Tan a meaningful lifestyle edge, combining coastal livability with much easier daily movement than Hanoi or Ho Chi Minh City.",
    clinicalExposure:
      "Duy Tan is strongest when families value brand, infrastructure, and city together, but the real evaluation still rests on the depth and continuity of hospital-based training.",
    studentSupport:
      "This profile fits applicants who want a well-known private university rather than a narrow medical-only campus and are comfortable paying for that broader brand.",
    whyChoose: [
      "Larger private-university scale and visibility than most comparable Vietnam medicine programs.",
      "Da Nang city quality makes the overall student experience easier than in the biggest metros.",
      "Often shortlisted by families who want brand, infrastructure, and livability together.",
    ],
    thingsToConsider: [
      "Private-university pricing is higher than many public alternatives.",
      "Medicine sits inside a large multidisciplinary institution, so compare the faculty itself, not only the university brand.",
      "Confirm how the hospital pathway and clinical supervision compare with top public schools.",
    ],
    bestFitFor: [
      "Students who want a major private-university brand in central Vietnam.",
      "Families balancing academic image, city quality, and clinical access.",
      "Applicants comfortable with a higher-fee private route in exchange for broader institutional scale.",
    ],
  },
  "hai-phong-university-medicine-pharmacy": {
    summary:
      "A public northern medical university with a practical regional-healthcare role and easier cost-city balance than Hanoi.",
    campusLifestyle:
      "The campus feels straightforward and professional rather than heavily marketed, with medicine training tied closely to regional public-service needs.",
    cityProfile:
      "Hai Phong offers a working coastal city with better urban infrastructure than a small provincial town but less pressure and cost than the capital.",
    clinicalExposure:
      "Its value comes from a large regional hospital network and steady public-university clinical exposure rather than from a national-elite prestige story.",
    studentSupport:
      "This option suits students who want northern Vietnam outside Hanoi and prefer a public institution with a clear regional role.",
    whyChoose: [
      "Public medical university in a large northern city without Hanoi-level intensity.",
      "Regional hospital base gives a practical clinical setting.",
      "Often a sensible shortlist for students who prefer public systems over private marketing-led campuses.",
    ],
    thingsToConsider: [
      "Its international-facing profile is lighter than the best-known Vietnam schools.",
      "Recognition and current admissions pathway should be rechecked for the present cycle.",
      "Hai Phong is more industrial and pragmatic in feel than Hanoi, Hue, or Da Nang.",
    ],
    bestFitFor: [
      "Students who want a northern public-school route outside the capital.",
      "Families seeking lower city pressure with meaningful clinical infrastructure.",
      "Applicants comfortable with a less internationally polished campus environment.",
    ],
  },
  "hanoi-medical-university": {
    summary:
      "Vietnam's benchmark public medical university, defined by legacy, national-level hospital ties, and the strongest prestige signal in the country's medical-education landscape.",
    campusLifestyle:
      "The environment is academically serious and classically medical, with far less lifestyle packaging than private schools and a much stronger professional identity.",
    cityProfile:
      "Hanoi adds another layer of advantage by placing students near national hospitals, ministries, research institutes, and a dense academic ecosystem.",
    clinicalExposure:
      "This is the most compelling part of the HMU story: students are comparing national-level clinical training depth, not just city access or brand alone.",
    studentSupport:
      "It is best suited to students who want a top public medical brand and are ready for a more demanding, less hand-held university culture.",
    whyChoose: [
      "Top prestige position in Vietnam medical education.",
      "Deepest national-hospital ecosystem among Vietnam university options.",
      "Strong fit for students who care more about institutional weight than campus marketing.",
    ],
    thingsToConsider: [
      "International-track seats can be limited and expectations are high.",
      "Vietnamese matters significantly once students move deeper into patient-facing training.",
      "The environment is demanding and traditional, so it is not the easiest fit for every applicant.",
    ],
    bestFitFor: [
      "Academically strong students chasing the most established medical brand in Vietnam.",
      "Families prioritizing clinical depth and national-hospital exposure above all else.",
      "Applicants comfortable with a legacy public-school environment in Hanoi.",
    ],
  },
  "hong-bang-international-university-medicine": {
    summary:
      "A premium private medicine option in Ho Chi Minh City built around health-sciences investment, city access, and a visibly broad hospital-partner network.",
    campusLifestyle:
      "The campus experience feels urban, polished, and health-sciences-forward, with medicine positioned as a flagship private-sector offering rather than a small add-on department.",
    cityProfile:
      "Ho Chi Minh City is the biggest everyday advantage: students get the country's largest metropolitan healthcare and services ecosystem.",
    clinicalExposure:
      "HIU is most attractive when families want a private-city program with multiple hospital touchpoints, but they should still compare how structured and continuous the rotations are across the years.",
    studentSupport:
      "This profile works best for students who want an urban private-campus model in the south and are comfortable with a higher-fee bracket.",
    whyChoose: [
      "Strong private-university investment in health sciences and facilities.",
      "Ho Chi Minh City provides unmatched metro access and hospital density in southern Vietnam.",
      "Hospital-partner network is broader than at many newer private entrants.",
    ],
    thingsToConsider: [
      "Overall cost is higher than most public options and many regional private choices.",
      "A large city and private-campus model can feel busier and more commercial than quieter public-school settings.",
      "Compare clinical continuity carefully instead of assuming all hospital affiliations translate into equal training value.",
    ],
    bestFitFor: [
      "Students who want a premium private route in Ho Chi Minh City.",
      "Families willing to pay more for city access, facilities, and hospital partnerships.",
      "Applicants who prefer a modern urban campus over a traditional public-school atmosphere.",
    ],
  },
  "hue-university-medicine-pharmacy": {
    summary:
      "A respected public medical university in central Vietnam that combines long academic history, university-hospital depth, and a calmer study environment than the major metros.",
    campusLifestyle:
      "Hue's medical setting feels serious and academically grounded, with medicine and pharmacy clearly at the center of the institution rather than sharing attention with a large private-university brand.",
    cityProfile:
      "Hue offers a smaller and quieter urban rhythm, which often suits students who want focus, culture, and affordability more than big-city pace.",
    clinicalExposure:
      "Its clinical appeal comes from strong central-region hospital relevance and a university-hospital model that feels more established than most private competitors.",
    studentSupport:
      "This profile is strongest for students who want a respected public school with real academic substance but do not need Hanoi or Ho Chi Minh City scale.",
    whyChoose: [
      "Long-standing public medical university with a strong academic identity.",
      "Quieter city can improve focus while still giving access to a meaningful regional hospital ecosystem.",
      "Often attractive on value because it combines reputation, public-school depth, and a manageable city.",
    ],
    thingsToConsider: [
      "City life is calmer and smaller than Da Nang or the major metros, which not every student enjoys.",
      "Language transition still matters in clinical training.",
      "The public-school environment is more traditional and self-driven than a heavily supported private-admissions model.",
    ],
    bestFitFor: [
      "Students who want a serious public medical school in central Vietnam.",
      "Families comparing academic depth and value rather than city glamour.",
      "Applicants who prefer a calmer study environment with strong hospital relevance.",
    ],
  },
  "nguyen-tat-thanh-university-medicine": {
    summary:
      "A large private university in Ho Chi Minh City where medicine benefits from the scale of a major multidisciplinary campus and the city's broader healthcare ecosystem.",
    campusLifestyle:
      "The campus experience is more broad-university and city-facing than pure medical-school, which can appeal to students who want a wider institutional environment.",
    cityProfile:
      "Ho Chi Minh City gives the program its main strategic advantage: the largest labor market, hospital density, and international exposure in the country.",
    clinicalExposure:
      "Students should judge the medicine pathway on current hospital integration and academic maturity rather than assuming the larger university brand answers those questions.",
    studentSupport:
      "This profile works better for city-first applicants who want a private university in Ho Chi Minh City and are prepared to verify program specifics carefully.",
    whyChoose: [
      "Large private-university platform in Vietnam's biggest city.",
      "Broader campus ecosystem than many stand-alone medical schools or single-faculty programs.",
      "City access can be attractive for students who want maximum urban convenience.",
    ],
    thingsToConsider: [
      "International medicine details, recognition status, and English-pathway specifics need close verification.",
      "The university's overall size does not automatically mean the medical faculty is equally mature.",
      "Ho Chi Minh City costs and pace are materially higher than in regional cities.",
    ],
    bestFitFor: [
      "Students who are committed to Ho Chi Minh City first and university brand second.",
      "Families comfortable doing deeper due diligence on a newer private medicine pathway.",
      "Applicants who prefer a big-city private-campus atmosphere.",
    ],
  },
  "phenikaa-university-faculty-of-medicine": {
    summary:
      "A newer Hanoi medical faculty inside a research-led private university that stands out for modern infrastructure, technology orientation, and rapid institutional growth.",
    campusLifestyle:
      "Phenikaa feels newer and more planned than legacy public schools, with a cleaner research-university identity and a more contemporary campus experience.",
    cityProfile:
      "Hanoi gives the faculty access to the strongest northern hospital and academic ecosystem, which is crucial when evaluating a newer private medical program.",
    clinicalExposure:
      "The key question is how effectively Phenikaa turns modern labs, research culture, and external partnerships into mature bedside training over time.",
    studentSupport:
      "This profile suits students who like a technology-forward university environment and want to compare a new-generation Hanoi private faculty against older public names.",
    whyChoose: [
      "Research-oriented private university with a more modern academic feel than older medical schools.",
      "Hanoi location keeps the program close to the country's deepest northern clinical ecosystem.",
      "Good shortlist choice for students who want a newer campus and innovation-oriented brand.",
    ],
    thingsToConsider: [
      "As a younger medical faculty, long-run clinical track record is still being built.",
      "Recognition and current international-track details should be checked carefully each cycle.",
      "Compare the faculty's hospital pathway against Dai Nam and Hanoi Medical University, not just against marketing copy.",
    ],
    bestFitFor: [
      "Students who want a modern private university in Hanoi.",
      "Families interested in technology and research branding, not only legacy prestige.",
      "Applicants comfortable evaluating a newer faculty on actual execution.",
    ],
  },
  "tan-tao-university-school-of-medicine": {
    summary:
      "A private not-for-profit school with a medicine program that feels more American-style and campus-contained than the typical Vietnam public-school model.",
    campusLifestyle:
      "The student experience is centered on a self-contained private campus and associated hospital environment, not on a dense city-university district.",
    cityProfile:
      "Its location near the Ho Chi Minh City corridor offers access to the south without requiring students to study inside the congestion and cost of the metro core.",
    clinicalExposure:
      "The program is most compelling for students who value its MD-style positioning and hospital tie-ins, but they should test that fit against India-return licensing plans and long-term clinical depth.",
    studentSupport:
      "This option works best for students who actively want a private-campus model and a different academic flavor from the standard Vietnamese public route.",
    whyChoose: [
      "Private not-for-profit identity feels different from most Vietnam medicine options.",
      "More self-contained campus-and-hospital setup than city-scattered university models.",
      "Interesting choice for students who prefer an MD-style narrative and a quieter campus base.",
    ],
    thingsToConsider: [
      "Make sure the program aligns with your licensing destination, especially if your plan is strongly India-focused.",
      "The campus is less city-integrated than Hanoi, Da Nang, or Ho Chi Minh City schools.",
      "Compare current clinical breadth and recognition fit carefully before treating it as a premium alternative.",
    ],
    bestFitFor: [
      "Students who prefer a contained private-campus environment.",
      "Families comparing international-style private models rather than classic public medical universities.",
      "Applicants open to a less conventional Vietnam medicine route.",
    ],
  },
  "tay-nguyen-university-medicine-pharmacy": {
    summary:
      "A long-running public highlands university where medicine sits inside a broader regional institution serving Central Highlands healthcare needs.",
    campusLifestyle:
      "The environment is practical and regionally grounded, with a domestic public-university character rather than a heavily international-facing brand.",
    cityProfile:
      "Buon Ma Thuot offers a quieter inland setting and lower daily intensity than coastal or metro options, which some students value and others may find limiting.",
    clinicalExposure:
      "Its academic case rests on regional public-health relevance, the university hospital, and a straightforward state-university pathway rather than on prestige-city hospital branding.",
    studentSupport:
      "This option is best for students comfortable with a more local academic environment and willing to confirm international-pathway details directly.",
    whyChoose: [
      "Long-established public route in the Central Highlands.",
      "Regional university hospital gives the program a service-oriented clinical base.",
      "Can suit students who want a quieter city and a less commercial campus experience.",
    ],
    thingsToConsider: [
      "International-facing medicine infrastructure is lighter than at the better-known Vietnam names.",
      "Recognition and English-pathway specifics should be verified carefully.",
      "The highlands setting is more remote and less connected than Hanoi, Da Nang, or Ho Chi Minh City.",
    ],
    bestFitFor: [
      "Students open to a regional public-school experience.",
      "Families prioritizing low-distraction study environments over city brand.",
      "Applicants willing to do extra verification on international fit.",
    ],
  },
  "thai-binh-university-medicine-pharmacy": {
    summary:
      "A dedicated public medical university in northern Vietnam that is often attractive on value, focus, and lower city cost rather than on metropolitan branding.",
    campusLifestyle:
      "The campus culture is straightforward, professionally oriented, and more study-led than lifestyle-led, which can be a real advantage for disciplined students.",
    cityProfile:
      "Thai Binh is a quieter provincial city, so the daily environment is simpler and cheaper but far less dynamic than Hanoi or Hai Phong.",
    clinicalExposure:
      "Its appeal is the classic public medical-school model and provincial clinical training base, not premium facilities or a large-city hospital halo.",
    studentSupport:
      "This profile works well for students who want a focused public institution and are comfortable with a quieter north-Vietnam setting.",
    whyChoose: [
      "Dedicated public medical university with a clear professional identity.",
      "Often compares well on total cost against bigger-city options.",
      "Good fit for students who want a simple, study-first environment.",
    ],
    thingsToConsider: [
      "Provincial city life can feel limited if you want a bigger urban experience.",
      "Clinical prestige profile is not the same as Hanoi's national-hospital system.",
      "Language transition still matters in later clinical years.",
    ],
    bestFitFor: [
      "Cost-aware students comparing northern public universities.",
      "Families that prefer a focused study environment over city lifestyle.",
      "Applicants who are comfortable away from the major metros.",
    ],
  },
  "thai-nguyen-university-medicine-pharmacy": {
    summary:
      "An established public medical university in northern Vietnam with a broader international footprint than many regional schools and a more connected city base than small provincial towns.",
    campusLifestyle:
      "The environment feels like a serious public university with enough scale, postgraduate depth, and international activity to stand apart from smaller regional options.",
    cityProfile:
      "Thai Nguyen gives students a workable middle ground: closer and calmer than Hanoi, but more connected and industrial-academic than many provincial cities.",
    clinicalExposure:
      "The key attraction is an established public-school structure with quality-assurance activity and a regional hospital network that feels more mature than many newer entrants.",
    studentSupport:
      "This profile suits students who want northern Vietnam outside Hanoi but still want a university with visible scale and some international engagement.",
    whyChoose: [
      "Established northern public medical university with international admissions visibility.",
      "More connected city setting than smaller provincial alternatives.",
      "Good option for families who want public-school substance without capital-city costs.",
    ],
    thingsToConsider: [
      "It does not have Hanoi Medical University's prestige or hospital density.",
      "Students should compare current clinical network details with Hai Phong and Thai Binh rather than assume they are interchangeable.",
      "Later clinical training still requires serious attention to local-language adaptation.",
    ],
    bestFitFor: [
      "Students who want a northern public option with more scale than a small-city school.",
      "Families balancing cost, structure, and city practicality.",
      "Applicants who prefer a middle-ground city rather than a mega-city or very quiet town.",
    ],
  },
  "tra-vinh-university-medicine-pharmacy": {
    summary:
      "A growing public medicine school in the Mekong Delta that is building a fuller health-sciences identity around hands-on training and its university hospital.",
    campusLifestyle:
      "The environment feels newer and service-oriented, with medicine expanding inside a broader public university rather than operating as a century-old standalone medical school.",
    cityProfile:
      "Tra Vinh is a smaller delta city, so the lifestyle is quieter and more localized than Can Tho or Ho Chi Minh City.",
    clinicalExposure:
      "Its strongest case is the practice-based learning model and university-hospital link, but students should still compare the maturity of the medicine school with older public options.",
    studentSupport:
      "This profile suits applicants who are open to a newer regional public school and want to evaluate growth potential rather than only legacy reputation.",
    whyChoose: [
      "Growing health-sciences school with an explicit practice-based training story.",
      "University-hospital link gives it a clearer clinical backbone than a purely classroom-based newer program.",
      "Mekong Delta location can appeal to students who want a smaller-city public-campus environment.",
    ],
    thingsToConsider: [
      "The school structure is still comparatively new, so long-run track record is shorter than at Can Tho or Hue.",
      "Tra Vinh is a quieter city with fewer big-city conveniences.",
      "Confirm the current international pathway, recognition fit, and clinical depth before deciding.",
    ],
    bestFitFor: [
      "Students open to a newer public medicine school in southern Vietnam.",
      "Families who care about hands-on training and do not need a major-city brand.",
      "Applicants willing to back a growing regional institution after proper verification.",
    ],
  },
  "pham-ngoc-thach-university-medicine": {
    summary:
      "A public Ho Chi Minh City medical university with a strong city-clinical identity and a more direct medical-school feel than many private southern competitors.",
    campusLifestyle:
      "The environment is focused, city-based, and professionally oriented, with less lifestyle packaging than the large private universities in Ho Chi Minh City.",
    cityProfile:
      "Ho Chi Minh City gives students the country's deepest southern hospital ecosystem, but also a faster pace and higher day-to-day cost than smaller cities.",
    clinicalExposure:
      "Its appeal is closely tied to the intensity and breadth of Ho Chi Minh City clinical exposure, so students should assess whether they want that pace rather than a quieter public-school path.",
    studentSupport:
      "This profile works best for students who want a public medical university in the south and value hospital immersion more than campus styling.",
    whyChoose: [
      "Public medical-school identity in Vietnam's largest city.",
      "Strong fit for students who want dense southern clinical exposure.",
      "More directly medicine-focused than many broader private universities in Ho Chi Minh City.",
    ],
    thingsToConsider: [
      "Ho Chi Minh City costs and pace are higher than in regional cities.",
      "Clinical training depends on adapting to a busy urban hospital environment.",
      "Compare it carefully with Hanoi Medical University, Can Tho, and Hong Bang based on your preferred balance of public vs private and city vs campus.",
    ],
    bestFitFor: [
      "Students who want a public southern city medical school.",
      "Families prioritizing clinically intense urban exposure.",
      "Applicants comfortable with a fast-moving Ho Chi Minh City environment.",
    ],
  },
};

export function applyUniversityContentOverride(university: University): University {
  const override = universityContentOverrides[university.slug] ?? {};
  const merged: University = {
    ...university,
    ...override,
  };

  return {
    ...merged,
    hostelOverview: hostelFallback,
    indianFoodSupport: settlingFallback,
    recognitionBadges: merged.recognitionBadges.filter(
      (badge) => !topicFilterPattern.test(badge)
    ),
    whyChoose: sanitizeList(merged, merged.whyChoose, "why"),
    thingsToConsider: sanitizeList(merged, merged.thingsToConsider, "consider"),
    bestFitFor: sanitizeList(merged, merged.bestFitFor, "fit"),
    faq: sanitizeFaqItems(merged.faq),
  };
}
