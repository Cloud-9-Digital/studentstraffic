export type TamilNaduCityPage = {
  slug: string;
  city: string;
  regionLabel: string;
  metaTitle: string;
  metaDescription: string;
  heroSummary: string;
  localAngle: string;
  audience: string[];
  commonQuestions: string[];
  whyStudentsAskFromHere: string[];
  destinationFocus: Array<{
    country: string;
    slug: string;
    reason: string;
  }>;
  seminarProof: {
    eventCount: number;
    venues: string[];
    note: string;
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
};

const tamilNaduCityPages: TamilNaduCityPage[] = [
  {
    slug: "chennai",
    city: "Chennai",
    regionLabel: "North Tamil Nadu",
    metaTitle: "MBBS Abroad Counselling in Chennai",
    metaDescription:
      "MBBS abroad counselling for Chennai students and parents. Compare Russia, Georgia, Vietnam, Kyrgyzstan and more with fee clarity, NMC context, and seminar support.",
    heroSummary:
      "Students in Chennai usually come in with sharper shortlist questions: country fit, return-to-India pathway, total cost, and whether a university is actually a safe long-term choice. This page is designed to rank for that decision-stage intent without pretending to be a generic consultant directory.",
    localAngle:
      "Chennai is the strongest local intent market for the site right now because it combines parent research depth, early counselling demand, and seminar traction.",
    audience: [
      "Students comparing MBBS abroad with private MBBS in Tamil Nadu",
      "Parents validating NMC, WDOMS, and long-term career safety",
      "Families looking for an in-person seminar or a fast counselling callback",
    ],
    commonQuestions: [
      "Which country is best for my NEET score and budget?",
      "Will I be able to practise in India after graduation?",
      "How much does the full course cost including hostel and living?",
    ],
    whyStudentsAskFromHere: [
      "Families in Chennai often compare MBBS abroad directly against private-college fee pressure in South India.",
      "Students usually want structured country shortlists rather than broad study-abroad sales language.",
      "Parents tend to ask more detailed regulatory and long-term outcome questions before moving forward.",
    ],
    destinationFocus: [
      { country: "Russia", slug: "russia", reason: "strong public-university demand and established FMGE familiarity" },
      { country: "Georgia", slug: "georgia", reason: "high interest among families prioritising modern city life and English-medium branding" },
      { country: "Vietnam", slug: "vietnam", reason: "growing demand from students seeking a lower-distance Southeast Asia option" },
    ],
    seminarProof: {
      eventCount: 1,
      venues: ["Hotel Hilton"],
      note: "Chennai is the anchor city in the current Tamil Nadu seminar footprint and already has a confirmed seminar timing in the codebase.",
    },
    faq: [
      {
        question: "Do you have MBBS abroad counselling for students in Chennai?",
        answer:
          "Yes. Chennai is one of the primary local intent cities for Students Traffic. Students can book a free call, message on WhatsApp, or attend Tamil Nadu seminar events when available.",
      },
      {
        question: "Are you claiming to have multiple offices across Chennai?",
        answer:
          "No. This page is for Chennai-focused counselling demand and service coverage. It does not claim multiple staffed offices. The goal is to help Chennai families find accurate MBBS abroad guidance.",
      },
      {
        question: "What do Chennai parents usually ask first?",
        answer:
          "Most start with total budget, NMC recognition context, return-to-India licensing, and whether the shortlisted university is genuinely safe for a 6-year medical journey.",
      },
    ],
  },
  {
    slug: "coimbatore",
    city: "Coimbatore",
    regionLabel: "Western Tamil Nadu",
    metaTitle: "Study MBBS Abroad from Coimbatore | Counselling, Fees and Guidance",
    metaDescription:
      "MBBS abroad guidance for students in Coimbatore. Compare countries, fees, NMC context, and seminar support before choosing a medical university abroad.",
    heroSummary:
      "Coimbatore families often come in with a practical lens: which countries are budget-fit, which universities are stable, and how far the total cost sits from private MBBS options in India.",
    localAngle:
      "This is a strong budget-and-fit market, so the page leans into price clarity and conservative decision-making rather than hype.",
    audience: [
      "Students looking for budget-fit MBBS abroad options",
      "Parents comparing costs against self-financed Indian MBBS routes",
      "Families who want counselling first and seminars second",
    ],
    commonQuestions: [
      "Which countries are safest within my budget?",
      "What is the real yearly and total cost?",
      "Should I choose Russia, Georgia, or Vietnam from Coimbatore?",
    ],
    whyStudentsAskFromHere: [
      "Coimbatore demand tends to be cost-sensitive but quality-aware.",
      "Students often want a narrower shortlist quickly instead of exploring every country.",
      "Seminar-based credibility matters because many families prefer meeting someone before committing.",
    ],
    destinationFocus: [
      { country: "Russia", slug: "russia", reason: "frequent shortlisting for public university value" },
      { country: "Kyrgyzstan", slug: "kyrgyzstan", reason: "interest from families comparing lower-fee pathways" },
      { country: "Vietnam", slug: "vietnam", reason: "regional proximity and growing curiosity" },
    ],
    seminarProof: {
      eventCount: 1,
      venues: ["TBD"],
      note: "Coimbatore is already listed in the Tamil Nadu seminar schedule, which gives this page genuine local proof instead of generic consultant copy.",
    },
    faq: [
      {
        question: "Can students from Coimbatore get free MBBS abroad counselling?",
        answer:
          "Yes. Students from Coimbatore can book a counselling call, reach out on WhatsApp, and register for Tamil Nadu seminar updates where available.",
      },
      {
        question: "Why does this page focus so much on costs?",
        answer:
          "Because Coimbatore demand is often budget-led. Families usually want a realistic fee range, hidden-cost context, and a safer shortlist before anything else.",
      },
      {
        question: "Do I need to attend a seminar before applying?",
        answer:
          "No. A seminar can help, but it is not required. You can start with a free counselling call and move into country or university comparisons directly.",
      },
    ],
  },
  {
    slug: "madurai",
    city: "Madurai",
    regionLabel: "South Tamil Nadu",
    metaTitle: "MBBS Abroad Consultant in Madurai | Free Guidance",
    metaDescription:
      "MBBS abroad guidance for Madurai students and parents. Understand country options, NMC considerations, budget fit, and seminar availability before you apply.",
    heroSummary:
      "Madurai is one of the strongest southern demand centers in the current seminar footprint, and the questions here are usually outcome-focused: career safety, fees, and whether the chosen country will still make sense six years later.",
    localAngle:
      "The page is built around parental trust and long-term planning because that is the dominant search and conversion pattern here.",
    audience: [
      "Students from Madurai and nearby districts looking for medical options abroad",
      "Parents seeking reassurance on recognition and India return pathways",
      "Families who prefer meeting the team through seminars before committing",
    ],
    commonQuestions: [
      "Is MBBS abroad worth it for students from Madurai?",
      "How safe is the India return path after graduation?",
      "Which countries are most commonly chosen by South Tamil Nadu students?",
    ],
    whyStudentsAskFromHere: [
      "Madurai families often decide only after stronger trust-building and long-form explanation.",
      "Seminar presence matters because in-person credibility reduces hesitation.",
      "Students want practical clarity on hostel, food, and adaptation in addition to fees.",
    ],
    destinationFocus: [
      { country: "Russia", slug: "russia", reason: "commonly shortlisted for scale and public university options" },
      { country: "Georgia", slug: "georgia", reason: "strong interest from families focused on city environment and branding" },
      { country: "Uzbekistan", slug: "uzbekistan", reason: "seen as a budget-check destination by some families" },
    ],
    seminarProof: {
      eventCount: 2,
      venues: ["Royal Court"],
      note: "Madurai appears twice in the current seminar data, which makes it one of the clearest local intent pages to support.",
    },
    faq: [
      {
        question: "Why is Madurai a priority local page?",
        answer:
          "Because Madurai already has repeat seminar coverage in the site data, which shows real demand and gives this page a stronger local reason to exist.",
      },
      {
        question: "Can parents from Madurai join the counselling process?",
        answer:
          "Yes. Parent participation is encouraged, especially for recognition, budget, safety, and return-to-India questions.",
      },
      {
        question: "What usually matters most to families from Madurai?",
        answer:
          "Long-term career safety, transparent cost planning, and choosing a country or university that remains a sensible fit beyond the first admission conversation.",
      },
    ],
  },
  {
    slug: "trichy",
    city: "Trichy",
    regionLabel: "Central Tamil Nadu",
    metaTitle: "MBBS Abroad Guidance in Trichy | Counselling and Seminar Support",
    metaDescription:
      "MBBS abroad counselling for Trichy students. Compare countries, fees, NMC context, and seminar support with a Chennai-rooted Tamil Nadu MBBS platform.",
    heroSummary:
      "Trichy demand sits between budget-planning and parent-trust intent. Families want clarity without pressure, especially on whether the chosen route is genuinely right for the student.",
    localAngle:
      "This page is structured for informed comparison rather than a hard sell, which fits the kind of query intent Trichy users tend to show.",
    audience: [
      "Students researching MBBS abroad from Trichy and nearby districts",
      "Families validating country fit and total cost",
      "Searchers looking for seminar-backed guidance rather than generic consultants",
    ],
    commonQuestions: [
      "What is the best country for MBBS abroad from Trichy?",
      "Which option is better for my budget and NEET profile?",
      "Can I attend a Tamil Nadu seminar instead of deciding from ads alone?",
    ],
    whyStudentsAskFromHere: [
      "Trichy users often compare options longer before converting.",
      "Trust and clarity outperform aggressive lead-gen positioning in this market.",
      "Families like seeing direct next steps instead of broad study-abroad promises.",
    ],
    destinationFocus: [
      { country: "Russia", slug: "russia", reason: "frequently researched for structured public options" },
      { country: "Georgia", slug: "georgia", reason: "popular among students prioritising modern-city appeal" },
      { country: "Kyrgyzstan", slug: "kyrgyzstan", reason: "often checked for affordability comparisons" },
    ],
    seminarProof: {
      eventCount: 1,
      venues: ["Breeze Residency"],
      note: "Trichy has a scheduled seminar in the current event set, which lets the page answer real in-person demand.",
    },
    faq: [
      {
        question: "Is this page only for seminar leads in Trichy?",
        answer:
          "No. It serves both seminar intent and broader search intent around MBBS abroad counselling for students in Trichy.",
      },
      {
        question: "What should Trichy students compare first?",
        answer:
          "Start with country fit, budget range, return-to-India implications, and whether your shortlist is based on real university quality or just agent preference.",
      },
      {
        question: "Can I move forward without visiting Chennai?",
        answer:
          "Yes. You can begin entirely through phone or WhatsApp, and use seminars when they are relevant to your decision process.",
      },
    ],
  },
  {
    slug: "salem",
    city: "Salem",
    regionLabel: "Western Tamil Nadu",
    metaTitle: "Free MBBS Counselling in Salem | Compare Countries and Costs",
    metaDescription:
      "MBBS abroad guidance for students in Salem. Compare countries, costs, NMC context, and seminar-backed counselling before choosing a medical route abroad.",
    heroSummary:
      "Searchers from Salem tend to be highly cost-aware but still cautious about quality and safety. The page balances those two concerns so it can rank for consultant queries without sounding like a broker page.",
    localAngle:
      "This is a practical, comparison-led city page built to capture cost and counselling intent together.",
    audience: [
      "Students looking for an affordable but safe MBBS abroad path",
      "Parents comparing quality against lower-price options",
      "Families interested in seminar-led trust building",
    ],
    commonQuestions: [
      "Which countries are affordable without taking on too much risk?",
      "How much should we budget in full, not just tuition?",
      "Can we speak to someone before finalising the shortlist?",
    ],
    whyStudentsAskFromHere: [
      "Budget-led intent is stronger here than prestige-led intent.",
      "Families want transparent numbers before engaging further.",
      "Local seminar presence gives the page a real-world differentiator.",
    ],
    destinationFocus: [
      { country: "Kyrgyzstan", slug: "kyrgyzstan", reason: "frequently compared on affordability" },
      { country: "Russia", slug: "russia", reason: "checked when value and public-university depth matter" },
      { country: "Uzbekistan", slug: "uzbekistan", reason: "appears in lower-cost comparison research" },
    ],
    seminarProof: {
      eventCount: 1,
      venues: ["Shrie Shaanth Hotel"],
      note: "Salem already appears in the Tamil Nadu seminar schedule, which helps the page target local trust queries more credibly.",
    },
    faq: [
      {
        question: "Can Salem students get MBBS abroad counselling without travelling?",
        answer:
          "Yes. Most students can start through a call or WhatsApp. Seminar options are there to add trust and clarity, not to create friction.",
      },
      {
        question: "Will this page help me compare cheap options properly?",
        answer:
          "That is exactly the point. It is meant to guide Salem families toward budget-fit choices without ignoring recognition, quality, or future licensing implications.",
      },
      {
        question: "Is the counselling free?",
        answer:
          "Yes. The call is free and focused on helping you decide whether MBBS abroad is the right fit before moving deeper into country or university selection.",
      },
    ],
  },
  {
    slug: "tirunelveli",
    city: "Tirunelveli",
    regionLabel: "Far South Tamil Nadu",
    metaTitle: "MBBS Abroad Support in Tirunelveli | Fees, Countries and Counselling",
    metaDescription:
      "MBBS abroad guidance for students in Tirunelveli. Explore countries, fees, recognition context, and seminar-backed counselling before shortlisting universities.",
    heroSummary:
      "Students from Tirunelveli often want clarity on whether MBBS abroad is truly worth pursuing from their current options. The page is framed to answer that carefully and locally.",
    localAngle:
      "This page leans into decision reassurance, because the search intent here often starts with uncertainty rather than a finished shortlist.",
    audience: [
      "Students still deciding whether to pursue MBBS abroad",
      "Parents looking for a slower, more trust-led counselling process",
      "Families interested in South Tamil Nadu seminar access",
    ],
    commonQuestions: [
      "Should I study MBBS abroad or wait for another route?",
      "Which countries are realistic for my profile?",
      "Can I get guidance locally before making a decision?",
    ],
    whyStudentsAskFromHere: [
      "Users often start earlier in the decision cycle.",
      "There is stronger need for reassurance and structure, not just options.",
      "Local seminar access helps reduce uncertainty before major decisions.",
    ],
    destinationFocus: [
      { country: "Russia", slug: "russia", reason: "high awareness and broad comparison demand" },
      { country: "Georgia", slug: "georgia", reason: "strong perception-driven interest" },
      { country: "Vietnam", slug: "vietnam", reason: "growing curiosity among families exploring alternatives" },
    ],
    seminarProof: {
      eventCount: 1,
      venues: ["RR Inn Group's of Hotel"],
      note: "Tirunelveli is part of the current Tamil Nadu seminar route, which gives this page real local grounding.",
    },
    faq: [
      {
        question: "What makes the Tirunelveli page different from other city pages?",
        answer:
          "It is written for earlier-stage decision intent, where students and parents are often still deciding whether MBBS abroad is appropriate at all.",
      },
      {
        question: "Can I attend a nearby seminar from Tirunelveli?",
        answer:
          "Yes, when the seminar schedule includes Tirunelveli or another reachable South Tamil Nadu stop. The current site data already includes a Tirunelveli event.",
      },
      {
        question: "Do you only guide students after they decide on a country?",
        answer:
          "No. Many students start before country selection. The first goal is to help you decide whether the route itself makes sense.",
      },
    ],
  },
  {
    slug: "erode",
    city: "Erode",
    regionLabel: "Western Tamil Nadu",
    metaTitle: "MBBS Abroad Consultant in Erode | Counselling and Country Comparison",
    metaDescription:
      "MBBS abroad counselling for Erode students and parents. Compare countries, fees, recognition, and seminar support before choosing a medical university abroad.",
    heroSummary:
      "Erode queries tend to be shortlist-driven: families want quick clarity on which countries make sense and whether the expected cost or risk is acceptable.",
    localAngle:
      "This page is built to answer high-intent comparison queries with stronger trust and specificity than a generic consultant directory page.",
    audience: [
      "Students seeking shortlist support rather than broad study-abroad education",
      "Families comparing risk and fee tradeoffs quickly",
      "Users looking for local seminar-backed trust signals",
    ],
    commonQuestions: [
      "Which country is the best fit for my budget?",
      "How do I avoid a bad university decision?",
      "Is there any local seminar or city-specific support near Erode?",
    ],
    whyStudentsAskFromHere: [
      "Searchers often want a practical shortlist fast.",
      "Families still want proof and reassurance before acting.",
      "Seminar-based local validation helps consultant-style queries convert more honestly.",
    ],
    destinationFocus: [
      { country: "Russia", slug: "russia", reason: "commonly shortlisted for depth and familiarity" },
      { country: "Kyrgyzstan", slug: "kyrgyzstan", reason: "strong comparison interest on affordability" },
      { country: "Vietnam", slug: "vietnam", reason: "growing alternative-interest market" },
    ],
    seminarProof: {
      eventCount: 1,
      venues: ["Royal Embassy Hotel"],
      note: "Erode has a scheduled seminar event in the current data, which makes the page materially different from a thin location landing page.",
    },
    faq: [
      {
        question: "Can Erode students get both call-based and seminar-based support?",
        answer:
          "Yes. The site supports both. Students can begin with a call and use seminar events when that extra layer of trust is helpful.",
      },
      {
        question: "Does this page guarantee that one country is the best?",
        answer:
          "No. The goal is to help Erode families compare realistically, not push a one-country answer regardless of fit.",
      },
      {
        question: "What should I verify before choosing a university?",
        answer:
          "Verify fee transparency, program stability, recognition context, language reality, and what the return-to-India path will look like after graduation.",
      },
    ],
  },
  {
    slug: "thoothukudi",
    city: "Thoothukudi",
    regionLabel: "South-East Tamil Nadu",
    metaTitle: "MBBS Abroad Guidance in Thoothukudi | Seminar and Counselling Support",
    metaDescription:
      "MBBS abroad counselling for students in Thoothukudi. Explore country options, fee ranges, recognition context, and seminar-backed guidance for Indian students.",
    heroSummary:
      "Thoothukudi search demand is smaller but important because it reflects genuine underserved local intent. These users often want direct answers, local trust, and fewer assumptions.",
    localAngle:
      "The page is intentionally straightforward, built for clarity and confidence rather than volume alone.",
    audience: [
      "Students in Thoothukudi and nearby towns exploring MBBS abroad seriously",
      "Parents wanting a more local-feeling guidance path",
      "Families who may rely more heavily on seminar validation before moving ahead",
    ],
    commonQuestions: [
      "Is MBBS abroad a sensible route for us?",
      "Which countries are most realistic for our budget?",
      "Can we get local seminar access before deciding?",
    ],
    whyStudentsAskFromHere: [
      "Users often feel underserved by broad metro-centric study-abroad messaging.",
      "Local trust cues matter more because brand familiarity may be lower.",
      "Decision confidence rises when the path feels regionally relevant and specific.",
    ],
    destinationFocus: [
      { country: "Russia", slug: "russia", reason: "broadest awareness and comparison demand" },
      { country: "Georgia", slug: "georgia", reason: "high perceived quality among researching families" },
      { country: "Uzbekistan", slug: "uzbekistan", reason: "occasionally enters budget-first comparisons" },
    ],
    seminarProof: {
      eventCount: 1,
      venues: ["Hotel Raj"],
      note: "Thoothukudi is included in the current Tamil Nadu seminar calendar, giving this page a real regional foundation.",
    },
    faq: [
      {
        question: "Why build a page for Thoothukudi specifically?",
        answer:
          "Because the current seminar route already includes Thoothukudi, which means the page can serve real local demand instead of existing only for search capture.",
      },
      {
        question: "Can I start with WhatsApp instead of a full call?",
        answer:
          "Yes. Many families begin with WhatsApp to understand the process, fee range, and country shortlist before scheduling a longer call.",
      },
      {
        question: "Will this page keep getting updated?",
        answer:
          "That is the goal. Local pages are more useful when seminar status, search intent, and supporting content keep improving over time.",
      },
    ],
  },
  {
    slug: "vellore",
    city: "Vellore",
    regionLabel: "North-West Tamil Nadu",
    metaTitle: "MBBS Abroad Counselling in Vellore | Compare Countries and Costs",
    metaDescription:
      "MBBS abroad guidance for students in Vellore. Compare countries, costs, return-to-India context, and free counselling before choosing the right path.",
    heroSummary:
      "Vellore users are often highly education-aware and comparison-heavy. They tend to look past generic marketing and want a clearer picture of tradeoffs, safety, and long-term fit.",
    localAngle:
      "This page is designed for a more research-oriented searcher who wants substance, not a list of slogans.",
    audience: [
      "Students in Vellore looking for a research-heavy MBBS abroad decision process",
      "Parents asking harder questions on quality and outcome risk",
      "Families who may compare several countries before speaking to anyone",
    ],
    commonQuestions: [
      "Which MBBS abroad route is genuinely safe and sensible?",
      "How should I compare cost against long-term value?",
      "What happens after I return to India?",
    ],
    whyStudentsAskFromHere: [
      "Vellore intent tends to be more analytical.",
      "Users often want a stronger content experience before converting.",
      "Pages that explain tradeoffs clearly can outperform generic consultant positioning here.",
    ],
    destinationFocus: [
      { country: "Russia", slug: "russia", reason: "strong for structured comparison" },
      { country: "Georgia", slug: "georgia", reason: "high visibility in perception-led searches" },
      { country: "Vietnam", slug: "vietnam", reason: "interesting alternative for students exploring beyond common routes" },
    ],
    seminarProof: {
      eventCount: 0,
      venues: [],
      note: "Vellore does not currently have a listed seminar stop in the codebase, so the page explicitly leans on service coverage and counselling demand rather than inventing local offline presence.",
    },
    faq: [
      {
        question: "Why does the Vellore page exist without a seminar listing?",
        answer:
          "Because not every valid local-intent page needs an event. Vellore has strong research-led demand, and this page is meant to serve that with useful MBBS-abroad guidance.",
      },
      {
        question: "Does this page claim a Vellore office?",
        answer:
          "No. It is a Vellore-targeted guidance page, not an office-location claim. The content is built around local search intent and service coverage.",
      },
      {
        question: "What should Vellore students read next?",
        answer:
          "Usually the next step is a country comparison page, a fees guide, and the India-return or NExT guidance pages before moving into university-level shortlists.",
      },
    ],
  },
];

export function getTamilNaduCityPages() {
  return tamilNaduCityPages;
}

export function getTamilNaduCityPage(slug: string) {
  return tamilNaduCityPages.find((page) => page.slug === slug) ?? null;
}

export function getTamilNaduHubStats() {
  const seminarCities = tamilNaduCityPages.filter(
    (city) => city.seminarProof.eventCount > 0,
  ).length;
  const totalSeminars = tamilNaduCityPages.reduce(
    (sum, city) => sum + city.seminarProof.eventCount,
    0,
  );

  return {
    cityCount: tamilNaduCityPages.length,
    seminarCities,
    totalSeminars,
    destinationCount: 5,
  };
}
