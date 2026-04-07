export type CityGuide = {
  name: string;
  countrySlug: string;
  countryName: string;
  summary: string;
  whyStudentsChoose: string;
  indianCommunity: string;
  monthlyCostRange: string;
  climateContext: string;
  safetyContext: string;
  keyFacts: Array<{ label: string; value: string }>;
  costBreakdown: Array<{ label: string; amount: string; notes?: string }>;
  admissionSteps: Array<{ title: string; detail: string }>;
  clinicalTraining: string;
  faq: Array<{ question: string; answer: string }>;
};

const cityGuideMap: Record<string, CityGuide> = {
  tbilisi: {
    name: "Tbilisi",
    countrySlug: "georgia",
    countryName: "Georgia",
    summary:
      "Tbilisi is the capital of Georgia and the single largest hub for Indian MBBS students in the South Caucasus. With over 30 private medical universities operating English-medium programs, it offers more choice per square kilometre than almost any comparable city. Students live in a European-style capital with a walkable old town, reliable public transport, and a growing international community.",
    whyStudentsChoose:
      "The combination of relatively low tuition (many programs start around USD 4,000–6,000 per year at private universities), a fully English-medium curriculum, NMC-listed institutions, and straightforward student visa access makes Tbilisi a practical first choice. Unlike Central Asian options, Georgia is a stable liberal democracy with open movement rules for Indian passport holders, and Tbilisi's infrastructure is noticeably more developed than most comparable fee-range cities.",
    indianCommunity:
      "Tbilisi has one of the largest concentrations of Indian medical students outside India itself. Purpose-built Indian messes, Hindi-speaking grocery stores near university zones, and active student associations exist across the city. WhatsApp groups for each university batch are well established, and peer mentoring from senior students is the norm. Students report feeling socially supported from day one.",
    monthlyCostRange: "$250–$450/month",
    climateContext:
      "Tbilisi has a humid subtropical climate with warm, often humid summers (July highs around 32°C) and cold but not extreme winters (January lows around 0°C to -3°C). Snowfall in the city is occasional rather than heavy. Spring and autumn are mild and very pleasant. Students from South India tend to find the winter manageable, while those from North India find it familiar.",
    safetyContext:
      "Tbilisi is consistently rated among the safer capitals in the former Soviet sphere. Petty crime exists as in any large city, but violent crime toward foreigners is rare. Most universities are located in central or well-connected neighbourhoods, and the city is walkable at night in most areas. Female students report generally feeling safe, though standard urban precautions apply.",
    keyFacts: [
      { label: "Country", value: "Georgia" },
      { label: "Region", value: "South Caucasus" },
      { label: "Time zone", value: "UTC+4 (GET, no DST)" },
      { label: "Population", value: "~1.2 million (metro)" },
      { label: "Language", value: "Georgian (English widely understood near universities)" },
      { label: "Currency", value: "Georgian Lari (GEL)" },
      { label: "Admission window", value: "August–October for September intake" },
      { label: "Distance from India", value: "~5–6 hours flight via Dubai or Istanbul" },
    ],
    costBreakdown: [
      {
        label: "Annual tuition",
        amount: "$4,000–$7,000",
        notes: "Varies by university. Includes all private institutions. Payable in USD or GEL equivalent.",
      },
      {
        label: "University hostel",
        amount: "$100–$200/month",
        notes: "Most universities include hostel in a bundled package. Verify what is covered before signing.",
      },
      {
        label: "Indian mess / food",
        amount: "$80–$130/month",
        notes: "Indian messes near campus charge GEL 400–600/month for three meals. Grocery self-cooking is cheaper.",
      },
      {
        label: "Personal expenses",
        amount: "$80–$150/month",
        notes: "Covers local transport, SIM, internet, personal care, and occasional outings.",
      },
      {
        label: "Visa & one-time arrival",
        amount: "$500–$800",
        notes: "Includes return airfare contribution, Georgia e-visa or visa on arrival fee, winter clothing if needed, and initial setup. One-time cost.",
      },
      {
        label: "Estimated 6-year total",
        amount: "$38,000–$65,000",
        notes: "All-in estimate including tuition, accommodation, food, and personal costs. Does not include FMGE/NExT coaching fees.",
      },
    ],
    admissionSteps: [
      {
        title: "Verify NMC recognition",
        detail: "Check your target university on the live NMC-approved list at nmc.org.in — not the brochure or agent printout, which can be outdated. NMC recognition is granted per institution and is updated periodically.",
      },
      {
        title: "Submit your application",
        detail: "Apply directly to the university's international admissions office with Class 12 marksheets, NEET scorecard, and passport copy. Most universities accept applications year-round with September and February intakes.",
      },
      {
        title: "Receive acceptance letter",
        detail: "Universities issue a conditional or unconditional offer within 2–4 weeks for qualified applicants. This letter is required for visa and travel planning.",
      },
      {
        title: "Arrange your student visa",
        detail: "Indian passport holders can enter Georgia visa-free for up to 360 days and convert to a student residence permit after enrollment. Confirm the current process with the Georgian embassy before travel, as procedures can change.",
      },
      {
        title: "Complete university enrollment",
        detail: "On arrival, complete university enrollment, hostel check-in, and the mandatory medical check. Universities guide students through all steps during the first week.",
      },
      {
        title: "Residence registration",
        detail: "Students must complete residence registration with the Georgian Public Service Hall within 10 days of arrival. Universities facilitate this for most admitted students — confirm with your university before arriving.",
      },
    ],
    clinicalTraining:
      "Clinical rotations in Tbilisi begin from Year 4 in Georgian public and teaching hospitals. Patient interaction is primarily in Georgian, so functional medical Georgian is useful — most programs include Georgian language classes in Years 1 and 2. Tbilisi's teaching hospitals handle a broad range of cases across general medicine, surgery, obstetrics, and paediatrics. The city has several active FMGE and NExT coaching academies that schedule sessions around clinical rotations, which is a practical advantage compared to smaller cities where students rely entirely on online coaching.",
    faq: [
      {
        question: "Are Tbilisi MBBS degrees recognised by NMC?",
        answer:
          "NMC recognition is granted to individual institutions, not to the city or country as a whole. A number of Tbilisi universities hold NMC recognition, but you must verify the current status of the specific institution you are applying to on the NMC website directly, since the recognised institution list is updated periodically.",
      },
      {
        question: "How much does it cost to live in Tbilisi as a medical student?",
        answer:
          "Excluding tuition and hostel (which most universities bundle), students typically spend USD 250–450 per month on food, transport, SIM cards, and personal expenses. Indian messes near university campuses charge around GEL 400–600/month for three meals. Budget for a one-time visa fee and initial settlement costs of around USD 500–800.",
      },
      {
        question: "Can I get Indian food in Tbilisi?",
        answer:
          "Yes. Most universities with significant Indian student cohorts have partnered Indian mess operators on or near campus. Standalone Indian restaurants also operate in central Tbilisi. Grocery stores near student areas stock Indian staples including dal, rice, spices, and pressure cookers.",
      },
      {
        question: "Is English sufficient or do I need to learn Georgian?",
        answer:
          "All medical programs marketed to Indian students are taught in English for the first three years (pre-clinical). In clinical years, some degree of Georgian or Russian may be useful for patient interaction, though many hospitals have English-speaking staff in student-facing roles. Georgian language classes are offered by most universities as part of onboarding.",
      },
      {
        question: "Which is better — Tbilisi or Batumi for MBBS in Georgia?",
        answer:
          "Tbilisi has far more universities to compare, stronger established student communities, and more FMGE coaching infrastructure. Batumi offers a more relaxed coastal lifestyle and slightly lower living costs but fewer options. If peer support, coaching access, and university choice diversity are priorities, Tbilisi is the stronger base.",
      },
    ],
  },

  bishkek: {
    name: "Bishkek",
    countrySlug: "kyrgyzstan",
    countryName: "Kyrgyzstan",
    summary:
      "Bishkek is the capital of Kyrgyzstan and the dominant hub for Indian medical students in Central Asia, home to more than 20 medical universities. It is a post-Soviet city with tree-lined boulevards, affordable living costs, and a large established Indian student population that has grown steadily over the past decade.",
    whyStudentsChoose:
      "Bishkek offers some of the most affordable MBBS programs available to Indian students with NMC-listed options, with annual tuition at many institutions falling between USD 2,500 and USD 5,000. Multiple FMGE and NExT coaching academies operate in the city, established specifically for Indian students preparing to return to India. The low cost of living and well-worn support infrastructure make it a pragmatic choice for middle-income families.",
    indianCommunity:
      "Bishkek has one of the largest and most established Indian student communities in the world outside India. Dedicated Indian messes, Indian grocery stores, Hindi film screenings, and cultural associations are embedded across the city's student zones. Senior students actively guide juniors through university enrollment, accommodation, and local administration. The community is large enough that Indian students rarely feel isolated.",
    monthlyCostRange: "$200–$350/month",
    climateContext:
      "Bishkek has a sharp continental climate. Winters are cold with temperatures dropping to -15°C to -20°C in January, and snow cover lasts from November through February. Summers are dry and warm (30–35°C in July). Students from warmer Indian states find winters a significant adjustment and invest in proper winter clothing during the first year.",
    safetyContext:
      "Bishkek is generally safe for students within the university zones and central areas. Occasional petty theft and pickpocketing occur in crowded markets. The Indian student community's self-support network is effective at orienting newcomers to safe routes and reliable services. Reported incidents of serious crime targeting Indian students are rare.",
    keyFacts: [
      { label: "Country", value: "Kyrgyzstan" },
      { label: "Region", value: "Central Asia" },
      { label: "Time zone", value: "UTC+6 (KGT, no DST)" },
      { label: "Population", value: "~1.1 million" },
      { label: "Language", value: "Kyrgyz and Russian (English near universities)" },
      { label: "Currency", value: "Kyrgyzstani Som (KGS)" },
      { label: "Admission window", value: "July–September" },
      { label: "Distance from India", value: "~4–5 hours flight" },
    ],
    costBreakdown: [
      {
        label: "Annual tuition",
        amount: "$2,500–$5,000",
        notes: "One of the lowest tuition ranges for NMC-listed programs globally. Payable in USD.",
      },
      {
        label: "University hostel",
        amount: "$50–$120/month",
        notes: "University hostels are basic but functional and centrally heated. Private accommodation near campus costs more.",
      },
      {
        label: "Indian mess / food",
        amount: "$70–$100/month",
        notes: "Indian messes near major universities offer three meals for KGS 5,000–8,000/month. Local canteen food is cheaper.",
      },
      {
        label: "Personal expenses",
        amount: "$60–$120/month",
        notes: "Local transport is cheap. Budget separately for winter clothing (USD 150–200 one-time investment in Year 1).",
      },
      {
        label: "Visa & one-time arrival",
        amount: "$350–$700",
        notes: "Includes Kyrgyz student visa fee, air ticket contribution, winter gear, and initial setup. One-time cost.",
      },
      {
        label: "Estimated 6-year total",
        amount: "$25,000–$48,000",
        notes: "All-in estimate including tuition, accommodation, food, and personal costs. FMGE/NExT coaching fees are additional.",
      },
    ],
    admissionSteps: [
      {
        title: "Verify NMC recognition",
        detail: "Confirm your target university appears on the current NMC-approved list at nmc.org.in. This is non-negotiable — an unlisted university means you cannot sit NExT and practice in India. Do not rely on agent brochures.",
      },
      {
        title: "Apply to the university",
        detail: "Submit your application with Class 12 marksheets, NEET scorecard, and passport copy. Most Bishkek universities accept applications from June through August for a September intake.",
      },
      {
        title: "Receive your invitation letter",
        detail: "The university issues an invitation letter once your application is accepted. This letter is required for student visa processing at the Kyrgyz embassy.",
      },
      {
        title: "Apply for your Kyrgyz student visa",
        detail: "Apply at the Kyrgyz embassy in New Delhi or Mumbai with your invitation letter, NEET scorecard, Class 12 certificate, medical certificate, and passport. Processing takes 5–10 working days.",
      },
      {
        title: "Register on arrival (OVIR)",
        detail: "You must register with the State Registration Service (OVIR) within 5 days of arriving in Kyrgyzstan. Your university will guide you through this — do not miss this deadline as overstay without registration is a legal issue.",
      },
      {
        title: "Complete university orientation",
        detail: "Most universities run a 1–2 week orientation covering hostel rules, local banking (bring USD cash initially), SIM card setup, and emergency contact procedures. Attend fully — this is where you learn what earlier students learned the hard way.",
      },
    ],
    clinicalTraining:
      "Clinical training in Bishkek begins from Year 4 in Kyrgyz public and teaching hospitals. Patient communication is primarily in Kyrgyz or Russian — students who invest in basic medical Russian during Years 1–3 report significantly better clinical experiences. Bishkek has the most developed NExT and FMGE coaching infrastructure of any city outside India for Indian medical students: multiple dedicated coaching academies run weekend and holiday-period batches starting from Year 3. This coaching access is one of Bishkek's practical advantages over smaller Kyrgyz cities.",
    faq: [
      {
        question: "Are Bishkek medical universities NMC recognised?",
        answer:
          "Several Bishkek universities appear in the NMC-approved directory, but the list changes. Always check the current NMC website for your specific target university before paying any fees. NMC recognition is a prerequisite for sitting the NExT exam and practising in India after returning.",
      },
      {
        question: "How cold does it get in Bishkek in winter?",
        answer:
          "January temperatures typically range from -10°C to -20°C, with occasional colder spells. Hostels and university buildings are centrally heated. Students should budget USD 150–200 for quality winter gear (coat, thermal layers, boots) before their first winter.",
      },
      {
        question: "Is FMGE/NExT coaching available in Bishkek?",
        answer:
          "Yes. Bishkek has the most developed FMGE and NExT coaching ecosystem of any city outside India for Indian medical students abroad. Multiple coaching academies — both local and India-based franchises — operate in the city, offering weekend and holiday-session classes.",
      },
      {
        question: "Do I need to learn Russian for MBBS in Bishkek?",
        answer:
          "Pre-clinical years (Year 1–3) are generally in English at universities catering to Indian students. During clinical rotations (Year 4–6), patient interaction happens in Russian or Kyrgyz. A working knowledge of medical Russian improves clinical training quality. Most universities offer Russian language instruction in Years 1 and 2.",
      },
    ],
  },

  tashkent: {
    name: "Tashkent",
    countrySlug: "uzbekistan",
    countryName: "Uzbekistan",
    summary:
      "Tashkent is the capital of Uzbekistan and its most developed city, with broad modernised avenues, a functional metro system, and the highest concentration of medical universities in the country. Over the past five years, Uzbekistan has emerged as a growing destination for Indian MBBS students, and Tashkent leads that growth with over 14 published medical programs.",
    whyStudentsChoose:
      "Tashkent's universities offer competitive annual tuition in the USD 3,000–6,000 range, and the city's infrastructure is more developed than other Uzbek study destinations. NMC-listed institutions are present, and the Uzbek government has actively sought to attract international medical students. Improving airline connectivity from major Indian cities makes logistics increasingly practical.",
    indianCommunity:
      "The Indian student community in Tashkent is growing but less established than Bishkek or Tbilisi. Indian messes and community support exist, particularly at universities with larger Indian cohorts, but the city has fewer dedicated Indian student services than the two larger hubs.",
    monthlyCostRange: "$250–$400/month",
    climateContext:
      "Tashkent has a continental climate with hot, dry summers (July highs 36–40°C) and cold winters (January lows -5°C to -10°C). Spring is pleasant but brief, and autumn is dry and mild. Students from Rajasthan or Gujarat find the summer heat familiar; those from South India may find winters colder than expected.",
    safetyContext:
      "Tashkent is generally considered safe. Uzbekistan runs a tightly administered internal security system, and violent crime is rare. Petty theft can occur in markets and crowded public areas. Student zones are safe day and night for the most part.",
    keyFacts: [
      { label: "Country", value: "Uzbekistan" },
      { label: "Region", value: "Central Asia" },
      { label: "Time zone", value: "UTC+5 (UZT, no DST)" },
      { label: "Population", value: "~3 million" },
      { label: "Language", value: "Uzbek and Russian (English increasing near universities)" },
      { label: "Currency", value: "Uzbekistani Som (UZS)" },
      { label: "Admission window", value: "August–October" },
      { label: "Distance from India", value: "~3–5 hours flight" },
    ],
    costBreakdown: [
      {
        label: "Annual tuition",
        amount: "$3,000–$6,000",
        notes: "Range across published Tashkent programs. Uzbek government universities tend toward the lower end.",
      },
      {
        label: "University hostel",
        amount: "$70–$150/month",
        notes: "University dormitories are centrally heated and typically adequate. Private rentals near campus are available at higher cost.",
      },
      {
        label: "Food",
        amount: "$80–$120/month",
        notes: "Indian messes operate near most large universities. Local Uzbek cuisine is inexpensive and filling.",
      },
      {
        label: "Personal expenses",
        amount: "$80–$130/month",
        notes: "Metro and bus transport is affordable. Tashkent has modern shopping and service infrastructure.",
      },
      {
        label: "Visa & one-time arrival",
        amount: "$400–$700",
        notes: "Uzbek student visa fee, air ticket, initial setup costs. One-time.",
      },
      {
        label: "Estimated 6-year total",
        amount: "$29,000–$57,000",
        notes: "All-in estimate. Uzbekistan remains one of the more affordable destinations with comparable NMC-listed options.",
      },
    ],
    admissionSteps: [
      {
        title: "Verify NMC recognition",
        detail: "Uzbekistan has multiple NMC-listed institutions but also non-listed ones that actively recruit Indian students. Verify your specific target university on nmc.org.in before applying anywhere.",
      },
      {
        title: "Submit your application",
        detail: "Apply with Class 12 marksheets, NEET scorecard, and passport copy. Application windows open July–September for the September/October intake.",
      },
      {
        title: "Receive your invitation letter",
        detail: "The university issues an invitation letter needed for student visa processing. This typically arrives within 2–3 weeks of application acceptance.",
      },
      {
        title: "Apply for your Uzbek student visa",
        detail: "Apply at the Uzbek embassy in India with invitation letter, academic documents, medical certificate, and financial proof. Processing takes 7–15 working days.",
      },
      {
        title: "Complete OVIR registration on arrival",
        detail: "Register with the local migration authority (OVIR) within 3 days of arriving in Uzbekistan. Your university manages this for admitted students — do not skip it.",
      },
      {
        title: "Set up banking and money transfer",
        detail: "Tashkent has reasonable banking infrastructure. Discuss the tuition payment channel with the university before arriving — USD cash or specific bank transfer routes are typically used.",
      },
    ],
    clinicalTraining:
      "Clinical rotations in Tashkent are conducted in Uzbek state and teaching hospitals from Year 4. The teaching language in clinical settings is primarily Uzbek or Russian — students in English-medium programs must build functional communication in at least one of these languages for patient interaction. Tashkent's hospitals are the best equipped in Uzbekistan, offering broader case exposure than smaller Uzbek cities. NExT coaching is limited locally; most students join online programs run from India starting from Year 3.",
    faq: [
      {
        question: "Are Tashkent medical universities NMC approved?",
        answer:
          "Some Tashkent universities hold NMC recognition, but this changes. Always verify the current NMC-approved list directly on the NMC India website before making any payment. An outdated brochure or agent claim is not sufficient verification.",
      },
      {
        question: "How is Tashkent's infrastructure compared to other Uzbek cities?",
        answer:
          "Tashkent is significantly more developed than Bukhara, Andijan, or Samarkand. The metro is efficient and affordable, internet connectivity is good, international banking facilities exist, and airport connections are better. Students who want a more urban lifestyle within Uzbekistan typically prefer Tashkent.",
      },
      {
        question: "What language is used in clinical training in Tashkent?",
        answer:
          "Uzbek and Russian are the primary hospital languages. English-medium programs handle pre-clinical years in English, but clinical rotations involve interaction with patients in Uzbek or Russian. Students who invest in basic medical vocabulary in both languages report better clinical outcomes.",
      },
    ],
  },

  batumi: {
    name: "Batumi",
    countrySlug: "georgia",
    countryName: "Georgia",
    summary:
      "Batumi is Georgia's second-largest city on the Black Sea coast in the Adjara region. Three medical universities operate English-medium programs here, attracting Indian students who want a Georgian qualification with a calmer resort-city environment rather than the bustle of Tbilisi. The city is compact, walkable, and visually distinctive with its mix of modern seafront towers and Ottoman-influenced architecture.",
    whyStudentsChoose:
      "Batumi offers slightly lower living costs than Tbilisi and a more relaxed pace of life. The same Georgian legal framework applies — Georgian student visas, Georgian university degrees, NMC-listed institutions subject to individual verification. For students who find Tbilisi overwhelming, Batumi provides a quieter alternative within Georgia.",
    indianCommunity:
      "The Indian student community in Batumi is smaller but established. Indian messes and peer support exist at the larger universities. Those who prefer a tighter-knit community often appreciate this, while students wanting a large social network may find Tbilisi a better fit.",
    monthlyCostRange: "$220–$380/month",
    climateContext:
      "Batumi has a humid subtropical climate — one of the wettest cities in the region. Summers are warm and humid (28–32°C), winters are mild and rainy (5–10°C, rarely below freezing). The Black Sea moderates temperatures, making winters noticeably milder than Tbilisi. Students from coastal Indian cities often adapt quickly.",
    safetyContext:
      "Batumi is safe for students. The city has significant tourist infrastructure and is well-policed. The student zones are central and walkable. Female students report high comfort levels overall.",
    keyFacts: [
      { label: "Country", value: "Georgia" },
      { label: "Region", value: "Adjara, Black Sea coast" },
      { label: "Time zone", value: "UTC+4 (GET, no DST)" },
      { label: "Population", value: "~170,000" },
      { label: "Language", value: "Georgian (Russian and Turkish also spoken)" },
      { label: "Currency", value: "Georgian Lari (GEL)" },
      { label: "Climate type", value: "Humid subtropical — mild winters, warm wet summers" },
      { label: "Distance from Tbilisi", value: "~5.5 hours by road or rail" },
    ],
    costBreakdown: [
      {
        label: "Annual tuition",
        amount: "$4,000–$6,500",
        notes: "Comparable to lower-mid range Tbilisi programs. Verify current fee schedules directly with each university.",
      },
      {
        label: "University hostel",
        amount: "$90–$180/month",
        notes: "Slightly cheaper than Tbilisi on average. Most universities include hostel in a package price.",
      },
      {
        label: "Food",
        amount: "$75–$120/month",
        notes: "Indian messes operate near the main student areas. Local market food is affordable.",
      },
      {
        label: "Personal expenses",
        amount: "$70–$130/month",
        notes: "Batumi is more walkable than Tbilisi — transport costs are lower. Budget more for social activities.",
      },
      {
        label: "Visa & one-time arrival",
        amount: "$500–$800",
        notes: "Same Georgia entry conditions as Tbilisi — visa-free for Indian passport holders. Includes air ticket contribution and setup costs.",
      },
      {
        label: "Estimated 6-year total",
        amount: "$35,000–$58,000",
        notes: "Marginally cheaper than Tbilisi on living costs, similar tuition range.",
      },
    ],
    admissionSteps: [
      {
        title: "Verify NMC recognition",
        detail: "Batumi has fewer universities than Tbilisi — ensure your specific target institution appears on the current NMC-approved list at nmc.org.in before proceeding.",
      },
      {
        title: "Submit your application",
        detail: "Apply with Class 12 marksheets, NEET scorecard, and passport copy. Batumi universities typically accept applications for September intake from June onward.",
      },
      {
        title: "Receive acceptance letter",
        detail: "Most universities respond within 2–3 weeks. The acceptance letter is required for any visa or travel documentation.",
      },
      {
        title: "Arrange Georgia entry",
        detail: "Indian passport holders can enter Georgia visa-free for up to 360 days. Student residence status is formalised after university enrollment.",
      },
      {
        title: "Complete enrollment and registration",
        detail: "On arrival, complete university enrollment, hostel check-in, and medical check. Then complete residence registration at the Public Service Hall within 10 days.",
      },
      {
        title: "Plan for FMGE coaching",
        detail: "Batumi has limited local FMGE/NExT coaching. Plan to join an online program from Year 3, or budget for periodic travel to Tbilisi for coaching access during holiday periods.",
      },
    ],
    clinicalTraining:
      "Clinical rotations in Batumi take place at Adjara regional hospitals from Year 4. Patient language is Georgian throughout. Students should reach functional medical Georgian by Year 3 — universities provide Georgian language classes in Years 1 and 2. FMGE and NExT coaching infrastructure in Batumi is limited compared to Tbilisi; students relying on local coaching should factor in the additional cost of travel or online programs. The smaller hospital environment means a different case mix than in Tbilisi, with less specialist coverage.",
    faq: [
      {
        question: "Is Batumi a good alternative to Tbilisi for MBBS?",
        answer:
          "Batumi has fewer university choices (3 vs 36+ in Tbilisi) but comparable Georgian degree credentials and a calmer lifestyle. If the specific universities here meet your NMC and fee requirements, it is a legitimate choice. The smaller Indian community and fewer coaching options are the main trade-offs.",
      },
      {
        question: "Does Batumi get very cold in winter?",
        answer:
          "No. Batumi winters are mild and rainy rather than cold. January averages around 7–9°C, and snowfall is rare at sea level. This is one of Batumi's practical advantages over Tbilisi and Central Asian cities.",
      },
    ],
  },

  osh: {
    name: "Osh",
    countrySlug: "kyrgyzstan",
    countryName: "Kyrgyzstan",
    summary:
      "Osh is Kyrgyzstan's second-largest city and the main urban centre of the Fergana Valley in the south of the country. Three medical universities offering MBBS to Indian students operate here. Osh is smaller, warmer in summer, and cheaper to live in than Bishkek, with a growing but smaller Indian student community.",
    whyStudentsChoose:
      "Lower tuition and living costs compared to Bishkek, combined with the same Kyrgyz legal framework and NMC availability at qualifying institutions, make Osh an option for cost-sensitive families. The city's proximity to Uzbekistan's Fergana Valley gives it a culturally mixed character different from the more Russified capital.",
    indianCommunity:
      "Smaller than Bishkek's community but growing. Basic Indian mess and community support exists at the main universities. FMGE coaching is available locally but on a smaller scale than in Bishkek.",
    monthlyCostRange: "$180–$300/month",
    climateContext:
      "Osh has a continental climate with warmer summers than Bishkek (up to 38°C in July) and cold winters (-5°C to -15°C in January). The city sits at a lower altitude than Bishkek, which moderates winter severity slightly.",
    safetyContext:
      "Osh experienced ethnic unrest in 2010 but has been stable since. The student zones around universities are generally safe for Indian students in day-to-day life.",
    keyFacts: [
      { label: "Country", value: "Kyrgyzstan" },
      { label: "Region", value: "Southern Kyrgyzstan, Fergana Valley" },
      { label: "Time zone", value: "UTC+6 (KGT)" },
      { label: "Population", value: "~300,000" },
      { label: "Language", value: "Kyrgyz, Uzbek, Russian" },
      { label: "Currency", value: "Kyrgyzstani Som (KGS)" },
      { label: "Distance from Bishkek", value: "~700 km (~1.5 hr flight or 11 hr road)" },
    ],
    costBreakdown: [
      {
        label: "Annual tuition",
        amount: "$2,000–$4,000",
        notes: "Generally lower than Bishkek programs. Verify current fee schedules with each university.",
      },
      {
        label: "University hostel",
        amount: "$40–$100/month",
        notes: "Hostel costs in Osh are among the lowest in the Kyrgyz system.",
      },
      {
        label: "Food",
        amount: "$60–$90/month",
        notes: "Indian messes exist near main universities. Local food is very affordable.",
      },
      {
        label: "Personal expenses",
        amount: "$60–$100/month",
        notes: "Osh is a smaller, walkable city. Transport costs are minimal.",
      },
      {
        label: "Visa & one-time arrival",
        amount: "$350–$600",
        notes: "Same Kyrgyz visa process as Bishkek. Osh has a domestic airport for connections via Bishkek.",
      },
      {
        label: "Estimated 6-year total",
        amount: "$20,000–$38,000",
        notes: "One of the most affordable MBBS routes available. Lower costs come with a smaller peer network and limited local coaching.",
      },
    ],
    admissionSteps: [
      {
        title: "Verify NMC recognition",
        detail: "Check the specific Osh university on nmc.org.in. Not all universities in Osh are NMC-listed.",
      },
      {
        title: "Apply to the university",
        detail: "Submit application with Class 12 results, NEET scorecard, and passport. Application windows open June–August.",
      },
      {
        title: "Receive invitation letter",
        detail: "Required for Kyrgyz student visa processing.",
      },
      {
        title: "Apply for Kyrgyz student visa",
        detail: "Apply at Kyrgyz embassy in India with invitation letter, academic certificates, medical certificate, and passport.",
      },
      {
        title: "Register on arrival (OVIR)",
        detail: "Register with OVIR within 5 days. Your university will guide this process.",
      },
      {
        title: "Plan for coaching access",
        detail: "FMGE/NExT coaching in Osh is limited. Plan online coaching from Year 3, or budget for travel to Bishkek during holidays for in-person sessions.",
      },
    ],
    clinicalTraining:
      "Clinical training in Osh uses regional hospitals in southern Kyrgyzstan from Year 4. Patient communication is primarily in Kyrgyz (with Uzbek also spoken in this region), so building basic clinical Kyrgyz vocabulary is important. Case volumes are lower than in Bishkek's teaching hospitals. FMGE coaching is limited locally — students typically join online programs or travel to Bishkek during semester breaks for intensive coaching access.",
    faq: [
      {
        question: "Is Osh or Bishkek better for MBBS in Kyrgyzstan?",
        answer:
          "Bishkek has more universities, a larger Indian community, and more developed FMGE coaching. Osh is cheaper and warmer in summer. If cost is the primary driver and your target university is in Osh, it is a valid choice. If you have flexibility, Bishkek's peer support and coaching infrastructure usually tip the balance.",
      },
    ],
  },

  bukhara: {
    name: "Bukhara",
    countrySlug: "uzbekistan",
    countryName: "Uzbekistan",
    summary:
      "Bukhara is one of Central Asia's most historically significant cities — a UNESCO World Heritage site famous for its ancient Islamic architecture and Silk Road heritage. Four medical universities operate here, making it a mid-sized study hub within Uzbekistan. The city is substantially smaller and quieter than Tashkent, with a distinct historical character that many students appreciate.",
    whyStudentsChoose:
      "Lower living costs than Tashkent, a quieter study environment, and lower annual tuition at some institutions attract students who prioritise cost and focused academics over urban amenities. Bukhara's cultural distinctiveness is also a draw for students who enjoy living in a historically rich setting.",
    indianCommunity:
      "Indian student community is present but smaller than in Tashkent or Bishkek. Basic community support and Indian food options exist near universities, but the ecosystem is more informal and student-led.",
    monthlyCostRange: "$200–$340/month",
    climateContext:
      "Bukhara has a desert continental climate — one of the hottest and driest in Central Asia. Summers are extreme (42–45°C in July), winters are cold (-8°C to -15°C in January), and annual rainfall is very low. Students must plan for extreme summer heat, particularly during initial arrival in August/September.",
    safetyContext:
      "Bukhara is generally safe and one of the most tourist-visited cities in Uzbekistan. The main safety consideration for students is extreme summer heat and ensuring adequate hydration during outdoor activities.",
    keyFacts: [
      { label: "Country", value: "Uzbekistan" },
      { label: "Region", value: "Central Uzbekistan" },
      { label: "Time zone", value: "UTC+5 (UZT)" },
      { label: "Population", value: "~280,000" },
      { label: "Language", value: "Uzbek (Russian secondary)" },
      { label: "Currency", value: "Uzbekistani Som (UZS)" },
      { label: "UNESCO status", value: "Historic Centre of Bukhara — World Heritage Site" },
    ],
    costBreakdown: [
      {
        label: "Annual tuition",
        amount: "$2,500–$5,000",
        notes: "Lower than Tashkent at most institutions. Verify current fees directly with the university.",
      },
      {
        label: "University hostel",
        amount: "$50–$120/month",
        notes: "Air conditioning is essential in summer — confirm hostel facilities include cooling before enrolling.",
      },
      {
        label: "Food",
        amount: "$70–$110/month",
        notes: "Local food is affordable. Indian mess options exist near main universities but are more informal than in Tashkent.",
      },
      {
        label: "Personal expenses",
        amount: "$70–$110/month",
        notes: "Smaller city means fewer expensive entertainment options. Budget for air cooling costs in summer.",
      },
      {
        label: "Visa & one-time arrival",
        amount: "$350–$600",
        notes: "Bukhara has a domestic airport with Tashkent connections. Same Uzbek student visa process applies.",
      },
      {
        label: "Estimated 6-year total",
        amount: "$23,000–$48,000",
        notes: "Among the more affordable Uzbek options. Bukhara's lower living costs partly offset the smaller peer and coaching network.",
      },
    ],
    admissionSteps: [
      {
        title: "Verify NMC recognition",
        detail: "Check each Bukhara university on nmc.org.in individually. Do not assume recognition based on the country — it is institution-specific.",
      },
      {
        title: "Apply to the university",
        detail: "Submit application documents July–September. Bukhara universities typically have smaller international cohorts and process applications quickly.",
      },
      {
        title: "Receive invitation letter",
        detail: "Required for Uzbek student visa.",
      },
      {
        title: "Apply for Uzbek student visa",
        detail: "At Uzbek embassy in India. Processing takes 7–15 working days.",
      },
      {
        title: "Register on arrival",
        detail: "Register with OVIR within 3 days of arriving. Your university manages this.",
      },
      {
        title: "Prepare for summer heat",
        detail: "If arriving in August or September, plan for 38–45°C temperatures. Pack light cotton clothing and confirm hostel air conditioning is functional before committing to a room.",
      },
    ],
    clinicalTraining:
      "Clinical rotations in Bukhara use regional hospitals from Year 4. Uzbek is the primary patient language — Russian is less dominant here than in Tashkent. Students should invest in basic Uzbek medical vocabulary by Year 3. Bukhara's hospitals handle standard general medicine and surgery cases, with specialist coverage available primarily in Tashkent for complex referrals. NExT coaching is limited locally — online programs are the primary coaching route for Bukhara-based students.",
    faq: [
      {
        question: "Is the heat in Bukhara manageable for students from India?",
        answer:
          "Summer in Bukhara (June–August) can reach 42–45°C, which is more extreme than most of India. Students from Rajasthan or Gujarat will find it more familiar. University buildings and hostels are typically air-conditioned. Outdoor movement during peak daytime hours in summer should be minimised.",
      },
    ],
  },

  "da-nang": {
    name: "Da Nang",
    countrySlug: "vietnam",
    countryName: "Vietnam",
    summary:
      "Da Nang is Vietnam's third-largest city on the central coast, midway between Hanoi and Ho Chi Minh City. Five medical programs operate here, making it an emerging option for Indian students looking at Vietnam who prefer a smaller, coastal city over Hanoi's megacity scale. The city has developed rapidly with modern airport infrastructure and growing international connectivity.",
    whyStudentsChoose:
      "Da Nang offers a modern, liveable coastal environment with lower living costs than Hanoi or Ho Chi Minh City, and some universities here have competitive fee structures within Vietnam's range. The city's improving flight connections and lower urban density appeal to students who want a more manageable environment.",
    indianCommunity:
      "The Indian student community in Da Nang is smaller than in Hanoi. Community support and Indian food options are more limited. Students here typically build smaller, tighter peer groups.",
    monthlyCostRange: "$350–$550/month",
    climateContext:
      "Da Nang has a tropical monsoon climate with a rain season from October to January (often including typhoon-related weather), and dry hot summers from February to September. Students arriving in October should be prepared for heavy rainfall and occasional storm advisories.",
    safetyContext:
      "Da Nang is one of Vietnam's safer cities with significant tourist infrastructure. Traffic safety (motorcycles) is the primary day-to-day hazard for new arrivals, as in all Vietnamese cities. Violent crime toward foreigners is rare.",
    keyFacts: [
      { label: "Country", value: "Vietnam" },
      { label: "Region", value: "Central Vietnam, South China Sea coast" },
      { label: "Time zone", value: "UTC+7 (ICT)" },
      { label: "Population", value: "~1.2 million" },
      { label: "Language", value: "Vietnamese (English near universities and tourist areas)" },
      { label: "Currency", value: "Vietnamese Dong (VND)" },
      { label: "Nearest cities", value: "Hue (~100 km north), Hoi An (~30 km south)" },
    ],
    costBreakdown: [
      {
        label: "Annual tuition",
        amount: "$3,500–$6,000",
        notes: "Da Nang programs are modestly priced compared to Hanoi. Verify current fee structures directly with each university.",
      },
      {
        label: "University hostel",
        amount: "$120–$200/month",
        notes: "University accommodation or nearby apartments. Da Nang is cheaper than Hanoi on accommodation.",
      },
      {
        label: "Food",
        amount: "$100–$150/month",
        notes: "Local Vietnamese food is very affordable. Indian food options are limited — students often self-cook.",
      },
      {
        label: "Personal expenses",
        amount: "$100–$150/month",
        notes: "Motorbike rental (~$30–50/month) is common for local transport. Budget for a helmet and rain gear.",
      },
      {
        label: "Visa & one-time arrival",
        amount: "$400–$700",
        notes: "Vietnamese e-visa or visa on arrival for Indians. Includes setup costs.",
      },
      {
        label: "Estimated 6-year total",
        amount: "$33,000–$57,000",
        notes: "Mid-range for Vietnam. Da Nang's lower living costs partly offset Hanoi's broader program options.",
      },
    ],
    admissionSteps: [
      {
        title: "Verify NMC recognition",
        detail: "Vietnam has NMC-listed institutions but not all universities qualify. Verify your specific target institution on nmc.org.in before applying.",
      },
      {
        title: "Apply to the university",
        detail: "Submit application with Class 12 certificates, NEET scorecard, and passport copy.",
      },
      {
        title: "Receive acceptance documentation",
        detail: "The university issues an acceptance letter required for visa processing.",
      },
      {
        title: "Apply for Vietnamese student visa",
        detail: "Apply at the Vietnamese embassy in India with acceptance letter, health certificate, financial proof, and passport. E-visa options may be available — confirm current policy.",
      },
      {
        title: "Complete arrival registration",
        detail: "Register with local immigration within 3 days of arrival. University assistance is available.",
      },
      {
        title: "Begin Vietnamese language training",
        detail: "Clinical rotations require functional Vietnamese. Start language classes seriously from Day 1 — the sooner you build this, the better your clinical years will be.",
      },
    ],
    clinicalTraining:
      "Clinical training in Da Nang uses city hospitals from Year 4. Patient interaction is in Vietnamese throughout — this is the single most important preparation for any student choosing Vietnam. Universities provide Vietnamese language training from Year 1, but students who treat it as optional struggle in clinical years. Da Nang's hospitals are well-equipped by Vietnamese standards. NExT coaching is online-only for Vietnam-based students; plan to join an India-linked online program from Year 3.",
    faq: [
      {
        question: "Are Vietnamese MBBS degrees recognised by NMC?",
        answer:
          "Some Vietnamese universities are listed in the NMC-approved institution directory. Students must verify the current NMC status of their specific target institution before enrolling, and should research the NExT exam pathway for Vietnam graduates independently.",
      },
    ],
  },

  hanoi: {
    name: "Hanoi",
    countrySlug: "vietnam",
    countryName: "Vietnam",
    summary:
      "Hanoi is the capital of Vietnam and the country's largest hub for medical education, with seven medical programs available across its universities. It is a dense, rapidly modernising city with distinct French colonial heritage visible in its architecture, tree-lined boulevards, and café culture. Hanoi offers more university choice within Vietnam than any other city.",
    whyStudentsChoose:
      "Hanoi's medical universities include some of Vietnam's most established institutions. The city has the broadest range of programs within the country, and growing direct flight connectivity from India makes it increasingly practical. Students interested in Vietnam as a destination typically look at Hanoi first for its range of options.",
    indianCommunity:
      "The Indian student community in Hanoi is smaller than in Georgia or Kyrgyzstan equivalents. Indian restaurants and grocery options exist due to Hanoi's large expat population, but peer support infrastructure specific to Indian medical students is less formalised than in Tbilisi or Bishkek.",
    monthlyCostRange: "$400–$600/month",
    climateContext:
      "Hanoi has a humid subtropical climate with four relatively distinct seasons. Winters (December–February) are cool and misty (12–17°C), summers are hot and humid (35–38°C), and the rainy season runs May–October. The 'drizzle season' in winter (often persistent low cloud and light rain for days at a time) surprises new arrivals.",
    safetyContext:
      "Hanoi is generally safe, though traffic — predominantly motorbikes — is the main hazard for new arrivals. Air quality can be poor during winter thermal inversions. Petty theft and scams targeting obvious newcomers occur; students learn to navigate these within the first few weeks.",
    keyFacts: [
      { label: "Country", value: "Vietnam" },
      { label: "Region", value: "Northern Vietnam" },
      { label: "Time zone", value: "UTC+7 (ICT)" },
      { label: "Population", value: "~8 million (metro)" },
      { label: "Language", value: "Vietnamese (English near universities)" },
      { label: "Currency", value: "Vietnamese Dong (VND)" },
    ],
    costBreakdown: [
      {
        label: "Annual tuition",
        amount: "$3,500–$7,000",
        notes: "Hanoi programs span a wider range than smaller Vietnamese cities. Top-ranked institutions charge toward the higher end.",
      },
      {
        label: "University hostel / apartment",
        amount: "$150–$250/month",
        notes: "Hanoi rents are higher than Da Nang. University hostels are the most affordable option.",
      },
      {
        label: "Food",
        amount: "$120–$180/month",
        notes: "Vietnamese food is very affordable locally. Indian food options exist due to Hanoi's expat community but cost more.",
      },
      {
        label: "Personal expenses",
        amount: "$120–$180/month",
        notes: "Grab taxi and motorbike rental are the main transport options. Air quality masks (~$5–10/month) are a practical necessity.",
      },
      {
        label: "Visa & one-time arrival",
        amount: "$400–$700",
        notes: "Vietnamese e-visa or embassy visa for Indians. Includes setup and first-month costs.",
      },
      {
        label: "Estimated 6-year total",
        amount: "$35,000–$65,000",
        notes: "Higher living costs than Central Asia, offset by university quality and program breadth. Vietnam is a mid-cost destination overall.",
      },
    ],
    admissionSteps: [
      {
        title: "Verify NMC recognition",
        detail: "Check your specific target institution on nmc.org.in. Hanoi has multiple universities and not all are NMC-listed.",
      },
      {
        title: "Apply to the university",
        detail: "Submit Class 12 marksheets, NEET scorecard, and passport. Application cycles vary by university.",
      },
      {
        title: "Receive acceptance letter",
        detail: "Required for visa processing. Universities typically respond within 2–4 weeks.",
      },
      {
        title: "Apply for Vietnamese student visa",
        detail: "Apply at Vietnamese embassy in India with acceptance letter, health certificate, financial proof, and passport.",
      },
      {
        title: "Complete arrival registration",
        detail: "Register with local immigration within 3 days. University assistance is provided.",
      },
      {
        title: "Commit to Vietnamese language training",
        detail: "Clinical success in Hanoi depends heavily on your Vietnamese. Take language classes as seriously as your medical subjects from Year 1.",
      },
    ],
    clinicalTraining:
      "Hanoi offers the strongest clinical training environment within Vietnam, with access to national-level teaching hospitals including major institutions that serve as referral centres for the entire country. This broader case exposure is a genuine advantage over smaller Vietnamese cities. Clinical language is Vietnamese throughout — students must reach functional clinical Vietnamese by Year 4. Hanoi's hospital network provides exposure to a wide range of complex cases that students in smaller cities would not see. NExT coaching is online-only; India-linked programs are the standard route.",
    faq: [
      {
        question: "Is Vietnamese the medium of instruction in Hanoi medical schools?",
        answer:
          "Most programs taught to international students use English for the first two or three pre-clinical years, shifting to Vietnamese in clinical rotations. Students must either learn Vietnamese to a functional clinical level or will find clinical training quality limited. Verify the teaching language breakdown for your specific program before enrolling.",
      },
    ],
  },

  "ho-chi-minh-city": {
    name: "Ho Chi Minh City",
    countrySlug: "vietnam",
    countryName: "Vietnam",
    summary:
      "Ho Chi Minh City (formerly Saigon) is Vietnam's largest city and commercial capital. Several medical programs operate here, and the city's warmer year-round climate and Southern Vietnamese culture give it a distinct character from Hanoi. It has stronger direct flight connections from India than Hanoi on some routes.",
    whyStudentsChoose:
      "Ho Chi Minh City's tropical climate is more familiar to students from South India, and higher English proficiency in the business community makes daily life more accessible. Some programs have competitive fee structures within Vietnam's range.",
    indianCommunity:
      "The Indian business community in Ho Chi Minh City is substantial, meaning Indian food, temples, and community infrastructure exist beyond the student population alone. Indian medical student-specific support is less developed than in the major hubs.",
    monthlyCostRange: "$400–$650/month",
    climateContext:
      "Ho Chi Minh City has a tropical climate with dry (December–April) and wet (May–November) seasons. It is hot year-round (29–35°C). Students from South India typically find the climate the most familiar of any study abroad destination.",
    safetyContext:
      "Generally safe for students, though it is a large, dense city. Petty theft (particularly phone and bag snatching from motorbikes) is more common than in smaller Vietnamese cities. Awareness and basic precautions are sufficient.",
    keyFacts: [
      { label: "Country", value: "Vietnam" },
      { label: "Region", value: "Southern Vietnam" },
      { label: "Time zone", value: "UTC+7 (ICT)" },
      { label: "Population", value: "~9 million (official); ~13 million (metro)" },
      { label: "Language", value: "Vietnamese (English common in business areas)" },
      { label: "Currency", value: "Vietnamese Dong (VND)" },
    ],
    costBreakdown: [
      {
        label: "Annual tuition",
        amount: "$3,500–$7,000",
        notes: "Similar range to Hanoi. Verify current fees for your specific program.",
      },
      {
        label: "Accommodation",
        amount: "$150–$280/month",
        notes: "Ho Chi Minh City has higher rents than Da Nang. University hostels and nearby private accommodation both available.",
      },
      {
        label: "Food",
        amount: "$120–$200/month",
        notes: "Local food is affordable. Indian restaurants in the Indian business district are accessible but pricier.",
      },
      {
        label: "Personal expenses",
        amount: "$120–$200/month",
        notes: "Grab is the standard transport option. Higher cost of living than Da Nang or northern cities.",
      },
      {
        label: "Visa & one-time arrival",
        amount: "$400–$700",
        notes: "Vietnamese e-visa or embassy visa. Direct flights from several Indian cities available.",
      },
      {
        label: "Estimated 6-year total",
        amount: "$35,000–$68,000",
        notes: "Higher living costs are the main difference from Hanoi. Indian students from South India often prefer the climate trade-off.",
      },
    ],
    admissionSteps: [
      {
        title: "Verify NMC recognition",
        detail: "Check your specific target institution on nmc.org.in before applying.",
      },
      {
        title: "Apply to the university",
        detail: "Submit application documents. Ho Chi Minh City universities typically accept applications year-round.",
      },
      {
        title: "Receive acceptance letter",
        detail: "Required for Vietnamese student visa processing.",
      },
      {
        title: "Apply for Vietnamese student visa",
        detail: "At Vietnamese embassy in India or via e-visa if eligible. Confirm current requirements.",
      },
      {
        title: "Complete arrival registration",
        detail: "Register with local immigration within 3 days of arrival.",
      },
      {
        title: "Begin Vietnamese language training",
        detail: "Same as all Vietnam destinations — clinical success requires functional Vietnamese. Start seriously from Day 1.",
      },
    ],
    clinicalTraining:
      "Clinical rotations in Ho Chi Minh City use major southern Vietnamese teaching hospitals from Year 4. These hospitals handle high patient volumes and a broad case mix reflecting Southern Vietnam's disease profile. Patient language is Vietnamese (Southern dialect). The city's higher English proficiency in daily life does not extend significantly into hospital settings — clinical Vietnamese remains essential. NExT coaching is online-only.",
    faq: [
      {
        question: "Is Ho Chi Minh City or Hanoi better for MBBS in Vietnam?",
        answer:
          "Hanoi has more university options. Ho Chi Minh City has a warmer climate, stronger English proficiency in everyday life, and better Indian community infrastructure. The right choice depends on your specific university target, since NMC recognition and program quality vary by institution rather than by city.",
      },
    ],
  },

  moscow: {
    name: "Moscow",
    countrySlug: "russia",
    countryName: "Russia",
    summary:
      "Moscow is Russia's capital and home to several of the country's most historically prestigious medical universities. A Moscow degree carries institutional weight recognised across the former Soviet sphere. However, Moscow also has the highest living costs of any Russian city, and the post-2022 geopolitical context creates significant practical complications for Indian students regarding payments and transfers.",
    whyStudentsChoose:
      "The prestige of Moscow institutions — universities that have trained generations of doctors — is the primary draw. For students whose primary concern is institutional reputation and academic standing within Russia's medical hierarchy, Moscow remains at the top. Several Moscow universities have long histories of training Indian students.",
    indianCommunity:
      "Moscow has an established Indian student community with decades of history. Indian restaurants, grocery stores, and cultural associations operate across the city. However, the community faces the same practical complications as all Indian students in Russia under current payment and transfer restrictions.",
    monthlyCostRange: "$500–$900/month",
    climateContext:
      "Moscow has a humid continental climate with severe winters (-10°C to -20°C average in January) and mild summers (22–26°C). Snow cover typically lasts from November to March. Short daylight hours in January–February (around 8 hours) are an adjustment for students from India.",
    safetyContext:
      "Moscow is a safe city for students within university and residential zones with extensive security infrastructure. The main practical challenge for Indian students currently is administrative and financial — managing money transfers and visa renewals under sanctions-impacted conditions.",
    keyFacts: [
      { label: "Country", value: "Russia" },
      { label: "Region", value: "Central Russia" },
      { label: "Time zone", value: "UTC+3 (MSK)" },
      { label: "Population", value: "~12.5 million" },
      { label: "Language", value: "Russian" },
      { label: "Currency", value: "Russian Ruble (RUB)" },
      { label: "Important note", value: "Review current sanctions and payment restrictions before enrolling" },
    ],
    costBreakdown: [
      {
        label: "Annual tuition",
        amount: "$4,000–$8,000",
        notes: "Moscow tuition is higher than other Russian cities. Transfer of tuition fees from India is currently complicated by sanctions — verify payment channels before committing.",
      },
      {
        label: "University hostel",
        amount: "$150–$350/month",
        notes: "Moscow hostel costs are the highest in Russia. Quality ranges widely — inspect or get verified student reviews before agreeing.",
      },
      {
        label: "Food",
        amount: "$150–$250/month",
        notes: "Indian restaurants exist across Moscow. General food costs are higher than any other city in this comparison.",
      },
      {
        label: "Personal expenses",
        amount: "$150–$250/month",
        notes: "Moscow's metro is efficient. Entertainment and consumer costs are higher than provincial Russian cities.",
      },
      {
        label: "Visa & one-time arrival",
        amount: "$600–$1,000",
        notes: "Russian student visa costs plus significant winter clothing investment. One-time.",
      },
      {
        label: "Estimated 6-year total",
        amount: "$50,000–$90,000",
        notes: "Moscow is the most expensive MBBS destination in this comparison. The prestige premium is real but so is the financial complexity under current sanctions.",
      },
    ],
    admissionSteps: [
      {
        title: "Verify NMC recognition AND transfer feasibility",
        detail: "NMC recognition is only one consideration. Before applying, independently verify that tuition transfer from India to Russia is currently feasible via your bank. This is the most critical step in 2025–2026 and the one most students underestimate.",
      },
      {
        title: "Apply to the university",
        detail: "Submit application documents. Moscow universities process applications year-round for their September intake.",
      },
      {
        title: "Receive invitation letter",
        detail: "Required for Russian student visa application at the Russian consulate in India.",
      },
      {
        title: "Apply for Russian student visa",
        detail: "Apply at the Russian consulate in Chennai, Mumbai, or New Delhi. Processing takes 10–20 working days. Single-entry or multiple-entry options available.",
      },
      {
        title: "Complete migration registration on arrival",
        detail: "Register with the Russian migration authority within 7 days of arrival. Your university facilitates this.",
      },
      {
        title: "Establish your ongoing payment channel",
        detail: "This is the ongoing challenge for Russian university students. Work with the university and a financial advisor to establish a reliable, legal channel for tuition and living expense transfers for the full 6-year duration.",
      },
    ],
    clinicalTraining:
      "Moscow's teaching hospitals are among the most prestigious in Russia's medical system, including national-level specialist institutions. Students gain exposure to complex cases not available in smaller cities. Clinical training is conducted entirely in Russian — students must reach functional medical Russian by Year 3. Moscow's clinical training reputation is a genuine advantage for students who complete it, but it requires deep language investment. FMGE and NExT coaching is available from India-based online providers.",
    faq: [
      {
        question: "Can Indian students still enroll in Moscow universities?",
        answer:
          "Enrollment is technically possible, but Indian students and families must carefully investigate how to transfer tuition and living expenses to Russia under current sanctions, as SWIFT-based transfers are restricted. Consult recent (2025–2026) accounts from currently enrolled students before committing.",
      },
      {
        question: "Is a Moscow MBBS degree recognised by NMC?",
        answer:
          "Several Moscow universities appear on the NMC-approved list. Individual university recognition status must be verified on the NMC website, as it changes. A Moscow degree historically transfers well to the Indian licensing pathway for students who pass NExT.",
      },
    ],
  },

  "st-petersburg": {
    name: "St. Petersburg",
    countrySlug: "russia",
    countryName: "Russia",
    summary:
      "St. Petersburg is Russia's second-largest city and cultural capital, home to several established medical universities. The city is famous for its imperial architecture, the Hermitage, and its 'White Nights' summer phenomenon. Medical programs here carry the prestige of one of Russia's most internationally recognised cities, with the same practical cautions applying as to all Russian universities regarding current financial constraints.",
    whyStudentsChoose:
      "St. Petersburg medical universities have trained international students for decades and are among the most recognisable Russian institutions globally. The city's European character, cultural richness, and academic infrastructure draw students for whom institutional reputation and city quality of life are the key factors.",
    indianCommunity:
      "An established Indian student community exists in St. Petersburg, particularly around its major medical universities. Indian food options and cultural events are available.",
    monthlyCostRange: "$450–$800/month",
    climateContext:
      "St. Petersburg has a humid continental climate with cold winters (-8°C average January, frequent snow) and mild summers (22–25°C). Famous for 'White Nights' in June when it barely gets dark. Short daylight hours in December (5–6 hours) are an adjustment. Rain is frequent year-round.",
    safetyContext:
      "St. Petersburg is generally safe for students in university and central areas. The same practical considerations as Moscow apply regarding financial logistics under current Russia-related restrictions.",
    keyFacts: [
      { label: "Country", value: "Russia" },
      { label: "Region", value: "Northwestern Russia" },
      { label: "Time zone", value: "UTC+3 (MSK)" },
      { label: "Population", value: "~5.4 million" },
      { label: "Language", value: "Russian" },
      { label: "Currency", value: "Russian Ruble (RUB)" },
      { label: "Known for", value: "White Nights, Hermitage, Nevsky Prospekt" },
    ],
    costBreakdown: [
      {
        label: "Annual tuition",
        amount: "$3,500–$7,000",
        notes: "Slightly lower than Moscow on average. Same transfer complications apply — verify payment channels before committing.",
      },
      {
        label: "University hostel",
        amount: "$130–$280/month",
        notes: "Lower than Moscow on average. University hostels near campus are the standard choice.",
      },
      {
        label: "Food",
        amount: "$130–$200/month",
        notes: "Indian food and grocery options exist near university areas.",
      },
      {
        label: "Personal expenses",
        amount: "$130–$200/month",
        notes: "Metro and bus network is extensive. Budget for warm clothing — winters are long.",
      },
      {
        label: "Visa & one-time arrival",
        amount: "$600–$1,000",
        notes: "Russian student visa plus significant winter clothing investment. One-time.",
      },
      {
        label: "Estimated 6-year total",
        amount: "$44,000–$80,000",
        notes: "Less expensive than Moscow but still among the higher-cost destinations in this comparison. Financial transfer logistics are the primary risk factor.",
      },
    ],
    admissionSteps: [
      {
        title: "Verify NMC recognition AND transfer feasibility",
        detail: "Confirm the university is NMC-listed and that tuition transfer from India is currently possible. Both must be true before you proceed.",
      },
      {
        title: "Apply to the university",
        detail: "Submit application documents for the September intake.",
      },
      {
        title: "Receive invitation letter",
        detail: "Required for Russian student visa.",
      },
      {
        title: "Apply for Russian student visa",
        detail: "At Russian consulate in India. Processing takes 10–20 working days.",
      },
      {
        title: "Complete migration registration",
        detail: "Register within 7 days of arrival. University manages this process.",
      },
      {
        title: "Establish payment channel",
        detail: "Set up a reliable, legal transfer channel for tuition and living costs for the duration of your program. This is the most important ongoing administrative task for Russia-enrolled students.",
      },
    ],
    clinicalTraining:
      "Clinical training in St. Petersburg uses major teaching hospitals including those affiliated with historically significant Russian medical schools. Patient language is Russian throughout. Students must reach functional medical Russian by Year 3 for effective clinical participation. St. Petersburg's hospitals offer strong case variety. The 'White Nights' in summer affect student schedules in ways that new arrivals consistently underestimate — sleep patterns require adjustment in June.",
    faq: [
      {
        question: "What are the practical issues with studying in St. Petersburg currently?",
        answer:
          "The same financial transfer restrictions that affect all Russian universities apply here. Indian students must research current remittance channels for Russia before enrolling. Check updated accounts from current students (2025–2026) rather than relying on pre-2022 information.",
      },
    ],
  },

  kutaisi: {
    name: "Kutaisi",
    countrySlug: "georgia",
    countryName: "Georgia",
    summary:
      "Kutaisi is Georgia's third-largest city and seat of the country's parliament. Two medical universities operate English-medium programs here in a smaller, quieter city than Tbilisi. Kutaisi has a domestic airport with budget airline connections, and the city is known for the ancient UNESCO-listed Gelati Monastery complex.",
    whyStudentsChoose:
      "Lower living costs than Tbilisi and a quieter academic environment attract students who want a Georgian qualification without the larger-city costs. Kutaisi is well-connected to Tbilisi by fast road (3 hours) if students need the capital for medical appointments, consular services, or coaching.",
    indianCommunity:
      "Smaller than in Tbilisi. Basic peer support exists at the individual university level but there is no city-wide Indian student infrastructure comparable to Tbilisi.",
    monthlyCostRange: "$200–$350/month",
    climateContext:
      "Humid subtropical climate similar to Tbilisi but with more rainfall. Winters are cold (around -2°C to 5°C in January, occasional snow). Summers are warm (28–32°C).",
    safetyContext:
      "Kutaisi is a safe city. Georgia's overall safety record applies, and the smaller city scale means less urban anonymity.",
    keyFacts: [
      { label: "Country", value: "Georgia" },
      { label: "Region", value: "Imereti, Western Georgia" },
      { label: "Time zone", value: "UTC+4 (GET)" },
      { label: "Population", value: "~130,000" },
      { label: "Distance from Tbilisi", value: "~230 km (~3 hours by road)" },
      { label: "Language", value: "Georgian" },
    ],
    costBreakdown: [
      {
        label: "Annual tuition",
        amount: "$4,000–$6,500",
        notes: "Comparable to lower-mid Tbilisi programs. Georgian degree credentials are identical.",
      },
      {
        label: "University hostel",
        amount: "$80–$160/month",
        notes: "Cheaper than Tbilisi. Quality varies — verify with recent students before committing.",
      },
      {
        label: "Food",
        amount: "$70–$110/month",
        notes: "Indian food options are more limited than Tbilisi. Self-cooking is common.",
      },
      {
        label: "Personal expenses",
        amount: "$60–$110/month",
        notes: "Small city means lower transport costs. Budget for occasional Tbilisi trips (for coaching or consular needs).",
      },
      {
        label: "Visa & one-time arrival",
        amount: "$500–$800",
        notes: "Same Georgia entry conditions as Tbilisi.",
      },
      {
        label: "Estimated 6-year total",
        amount: "$32,000–$57,000",
        notes: "Modestly cheaper than Tbilisi on living costs. Same degree, smaller community.",
      },
    ],
    admissionSteps: [
      {
        title: "Verify NMC recognition",
        detail: "Check your specific Kutaisi university on nmc.org.in. Kutaisi has fewer institutions than Tbilisi.",
      },
      {
        title: "Apply to the university",
        detail: "Submit application documents for September intake. Small universities typically respond quickly.",
      },
      {
        title: "Arrange Georgia entry",
        detail: "Visa-free for Indian passport holders. Student residence permit formalised after enrollment.",
      },
      {
        title: "Complete enrollment and registration",
        detail: "On arrival, complete enrollment, hostel check-in, medical check, and residence registration within 10 days.",
      },
      {
        title: "Plan for coaching access",
        detail: "FMGE/NExT coaching is not available in Kutaisi. Join an online program from Year 3, or plan Tbilisi visits during holiday periods (3-hour road trip).",
      },
    ],
    clinicalTraining:
      "Clinical rotations in Kutaisi use regional Imereti hospitals from Year 4. Patient language is Georgian. The hospital case mix is smaller than Tbilisi's teaching hospitals, reflecting the regional city scale. Students who need NExT coaching should plan online programs from Year 3 — local coaching does not exist in Kutaisi.",
    faq: [
      {
        question: "Why would I choose Kutaisi over Tbilisi for MBBS?",
        answer:
          "If your specific target university is in Kutaisi and meets your NMC and fee requirements, the lower living cost and quieter environment are genuine advantages. If you have free choice of Georgian universities, Tbilisi's larger peer community and coaching infrastructure usually make it the stronger base.",
      },
    ],
  },

  samarkand: {
    name: "Samarkand",
    countrySlug: "uzbekistan",
    countryName: "Uzbekistan",
    summary:
      "Samarkand is one of the oldest continuously inhabited cities in Central Asia and a UNESCO World Heritage site famous for its Timurid-era architecture — the Registan, Shah-i-Zinda, and Bibi-Khanym Mosque. Two medical universities operate English-medium programs here. Improving high-speed rail connections to Tashkent (via the Afrosiyob train) make it the most atmospherically distinctive study destination in the Uzbek network.",
    whyStudentsChoose:
      "Lower costs than Tashkent, a uniquely historic environment, and reliable high-speed train access to the capital if needed. For students who value living in a city with genuine world heritage significance, Samarkand is the only option in the Uzbek network.",
    indianCommunity:
      "Small Indian student community. Basic support exists but is less formalised than in Tashkent.",
    monthlyCostRange: "$200–$340/month",
    climateContext:
      "Hot dry continental climate. Summers reach 38–42°C. Winters cold (-5°C to -12°C). Low annual rainfall.",
    safetyContext:
      "One of Uzbekistan's most tourist-visited cities and well-policed. Safe for students.",
    keyFacts: [
      { label: "Country", value: "Uzbekistan" },
      { label: "Region", value: "Central Uzbekistan" },
      { label: "Time zone", value: "UTC+5" },
      { label: "Population", value: "~580,000" },
      { label: "UNESCO Heritage", value: "Samarkand — Crossroads of Cultures" },
      { label: "Train to Tashkent", value: "~2 hours (Afrosiyob high-speed)" },
    ],
    costBreakdown: [
      {
        label: "Annual tuition",
        amount: "$2,500–$5,000",
        notes: "Typically lower than Tashkent programs.",
      },
      {
        label: "University hostel",
        amount: "$50–$120/month",
        notes: "Confirm air conditioning is functional — summers reach 42°C.",
      },
      {
        label: "Food",
        amount: "$70–$110/month",
        notes: "Local food is affordable. Indian mess options are informal.",
      },
      {
        label: "Personal expenses",
        amount: "$70–$110/month",
        notes: "Smaller city scale keeps costs low. Budget for high-speed train to Tashkent when needed (~$10 each way).",
      },
      {
        label: "Visa & one-time arrival",
        amount: "$350–$600",
        notes: "Same Uzbek visa process. Samarkand airport has limited direct connections.",
      },
      {
        label: "Estimated 6-year total",
        amount: "$23,000–$46,000",
        notes: "Affordable option with the added benefit of Tashkent proximity by fast train.",
      },
    ],
    admissionSteps: [
      {
        title: "Verify NMC recognition",
        detail: "Check your specific Samarkand university on nmc.org.in.",
      },
      {
        title: "Apply and receive invitation letter",
        detail: "Submit application documents July–September. Universities here have smaller international cohorts.",
      },
      {
        title: "Apply for Uzbek student visa",
        detail: "At Uzbek embassy in India. Note that Samarkand's airport may require connection via Tashkent.",
      },
      {
        title: "Complete OVIR registration",
        detail: "Register within 3 days of arrival. University manages this.",
      },
      {
        title: "Use Tashkent for consular and coaching needs",
        detail: "Two hours by high-speed train — plan regular Tashkent visits for any consular, coaching, or banking needs that Samarkand cannot provide.",
      },
    ],
    clinicalTraining:
      "Clinical rotations in Samarkand use regional Uzbek hospitals from Year 4. Patient language is Uzbek. The city's hospital infrastructure is adequate for general training but specialist coverage is in Tashkent. The 2-hour high-speed train connection means students can access Tashkent resources without overnight stays. NExT coaching is online-only.",
    faq: [
      {
        question: "Is studying in Samarkand isolating given its size?",
        answer:
          "Samarkand is well-connected to Tashkent by fast train, so students are not isolated from the capital's infrastructure. The city has adequate student services. The cultural richness of the environment offsets the smaller-city limitations for many students.",
      },
    ],
  },

  kazan: {
    name: "Kazan",
    countrySlug: "russia",
    countryName: "Russia",
    summary:
      "Kazan is the capital of Tatarstan Republic and one of Russia's most important regional cities — a bilingual Russian-Tatar city with a distinctive Kremlin, active cultural life, and two medical universities. It is often cited as one of the better mid-tier Russian MBBS destinations for its combination of established universities, lower living costs than Moscow, and more liveable city scale.",
    whyStudentsChoose:
      "Lower living costs than Moscow or St. Petersburg, established medical universities with long histories of training foreign students, and a city that is among Russia's most internationally oriented outside the two capitals. The same payment-transfer cautions as all Russian cities apply.",
    indianCommunity:
      "Small but established Indian student community around the medical universities. Indian food and peer support are available at a limited scale.",
    monthlyCostRange: "$350–$600/month",
    climateContext:
      "Humid continental climate. Winters cold (-10°C to -18°C in January) and snowy. Summers warm and pleasant (24–28°C).",
    safetyContext:
      "One of Russia's most liveable regional cities and generally safe for students. The same broad cautions about financial logistics under current Russia sanctions apply.",
    keyFacts: [
      { label: "Country", value: "Russia" },
      { label: "Region", value: "Tatarstan, Volga-Ural" },
      { label: "Time zone", value: "UTC+3 (MSK)" },
      { label: "Population", value: "~1.3 million" },
      { label: "Languages", value: "Russian and Tatar" },
      { label: "Distance from Moscow", value: "~800 km (~1 hr flight)" },
    ],
    costBreakdown: [
      {
        label: "Annual tuition",
        amount: "$3,000–$6,000",
        notes: "Lower than Moscow. Same sanctions-era payment complications apply.",
      },
      {
        label: "University hostel",
        amount: "$100–$220/month",
        notes: "More affordable than Moscow or St. Petersburg.",
      },
      {
        label: "Food",
        amount: "$120–$180/month",
        notes: "Lower costs than the two capitals. Indian food options exist at small scale.",
      },
      {
        label: "Personal expenses",
        amount: "$100–$180/month",
        notes: "Good public transport. Budget for heavy winter clothing.",
      },
      {
        label: "Visa & one-time arrival",
        amount: "$500–$900",
        notes: "Russian student visa plus winter gear. One-time.",
      },
      {
        label: "Estimated 6-year total",
        amount: "$35,000–$65,000",
        notes: "More affordable than Moscow or St. Petersburg while offering comparable Russian degree credentials.",
      },
    ],
    admissionSteps: [
      {
        title: "Verify NMC recognition AND transfer feasibility",
        detail: "As with all Russian universities: confirm NMC listing AND confirm you can transfer money from India before committing.",
      },
      {
        title: "Apply and receive invitation letter",
        detail: "Submit application for September intake. Kazan universities process applications through summer.",
      },
      {
        title: "Apply for Russian student visa",
        detail: "At Russian consulate in India with invitation letter.",
      },
      {
        title: "Complete migration registration",
        detail: "Within 7 days of arrival. University manages the process.",
      },
      {
        title: "Establish payment channel",
        detail: "Same critical ongoing requirement as all Russian universities — a legal, reliable transfer route for tuition and living costs for 6 years.",
      },
    ],
    clinicalTraining:
      "Clinical training in Kazan uses Tatarstan regional teaching hospitals from Year 4. Patient language is Russian (with some Tatar spoken). Students must reach functional medical Russian by Year 3. Kazan's medical universities have long histories of training international students and the clinical infrastructure is well-established. Moscow-level case complexity is not available, but breadth and quality are solid for a mid-tier Russian city.",
    faq: [
      {
        question: "Is Kazan better than Moscow for MBBS in Russia?",
        answer:
          "Kazan's lower living costs and more manageable city scale are advantages. Moscow institutions carry more prestige, but both carry the same real-world constraint: current financial transfer restrictions for India. In terms of quality of life, Kazan is often rated favourably over Moscow by enrolled students.",
      },
    ],
  },

  andijan: {
    name: "Andijan",
    countrySlug: "uzbekistan",
    countryName: "Uzbekistan",
    summary:
      "Andijan is the third-largest city in Uzbekistan and the major urban centre of the densely populated Fergana Valley. Three medical universities operate here. The Fergana Valley is one of Central Asia's most fertile and historically populated regions, giving Andijan a distinctly agricultural and traditional character compared to Tashkent.",
    whyStudentsChoose:
      "Lower tuition and living costs than Tashkent. Andijan attracts students who want the Uzbek framework at the most affordable price point within the country.",
    indianCommunity:
      "Indian student community is small but present at individual universities. Services are more limited than in Tashkent.",
    monthlyCostRange: "$180–$310/month",
    climateContext:
      "Continental climate with hot dry summers (up to 40°C) and cold winters (-5°C to -15°C). Valley humidity makes summers feel hotter than Tashkent or Bukhara.",
    safetyContext:
      "The city has been stable since 2005 unrest. Student life is reported as safe within campus and accommodation zones.",
    keyFacts: [
      { label: "Country", value: "Uzbekistan" },
      { label: "Region", value: "Fergana Valley, Eastern Uzbekistan" },
      { label: "Time zone", value: "UTC+5" },
      { label: "Population", value: "~450,000" },
      { label: "Language", value: "Uzbek (Fergana dialect)" },
    ],
    costBreakdown: [
      {
        label: "Annual tuition",
        amount: "$2,000–$4,500",
        notes: "Among the lowest in the Uzbek system. Verify NMC status before choosing on price alone.",
      },
      {
        label: "University hostel",
        amount: "$40–$100/month",
        notes: "Confirm cooling facilities — summer heat in Fergana Valley is significant.",
      },
      {
        label: "Food",
        amount: "$60–$100/month",
        notes: "Local food is very affordable. Indian food infrastructure is minimal.",
      },
      {
        label: "Personal expenses",
        amount: "$60–$100/month",
        notes: "Small city — minimal transport costs.",
      },
      {
        label: "Visa & one-time arrival",
        amount: "$350–$600",
        notes: "Fergana airport has limited connections. Students typically fly into Tashkent and travel overland.",
      },
      {
        label: "Estimated 6-year total",
        amount: "$19,000–$38,000",
        notes: "One of the lowest-cost MBBS routes in any country. Trade-offs include small peer network and limited local infrastructure.",
      },
    ],
    admissionSteps: [
      {
        title: "Verify NMC recognition",
        detail: "Critical — not all Andijan universities are NMC-listed. Check nmc.org.in for each institution.",
      },
      {
        title: "Apply and receive invitation letter",
        detail: "Submit documents July–September.",
      },
      {
        title: "Apply for Uzbek student visa",
        detail: "At Uzbek embassy in India. Plan to fly into Tashkent and connect.",
      },
      {
        title: "Complete OVIR registration",
        detail: "Within 3 days of arrival. University manages this.",
      },
      {
        title: "Plan for online coaching from Year 3",
        detail: "No local NExT/FMGE coaching infrastructure. Online programs are essential.",
      },
    ],
    clinicalTraining:
      "Clinical training uses Andijan regional hospitals from Year 4. Patient language is Uzbek (Fergana dialect). Hospital case exposure is adequate for general training. NExT coaching is entirely online for students based in Andijan.",
    faq: [
      {
        question: "How does Andijan compare to Tashkent for MBBS?",
        answer:
          "Andijan is cheaper but has less developed infrastructure, fewer direct flight connections from India, and a smaller Indian student community than Tashkent. Students prioritising cost over amenities often consider Andijan alongside Bukhara and Fergana.",
      },
    ],
  },

  fergana: {
    name: "Fergana",
    countrySlug: "uzbekistan",
    countryName: "Uzbekistan",
    summary:
      "Fergana city is the administrative centre of Fergana Region in eastern Uzbekistan's Fergana Valley. Three medical universities operate here. It is a planned Soviet-era city with slightly more urban character than Andijan while remaining much smaller and cheaper than Tashkent.",
    whyStudentsChoose:
      "Low living costs within the Uzbek system and availability of NMC-listed institutions (subject to verification) at lower tuition than capital-city alternatives.",
    indianCommunity:
      "Small. Basic peer support through individual university cohorts.",
    monthlyCostRange: "$180–$310/month",
    climateContext:
      "Hot dry continental climate similar to Andijan. Extremely hot summers (38–42°C) and cold winters (-5°C to -12°C).",
    safetyContext: "Generally safe for students within campus and accommodation zones.",
    keyFacts: [
      { label: "Country", value: "Uzbekistan" },
      { label: "Region", value: "Fergana Valley" },
      { label: "Time zone", value: "UTC+5" },
      { label: "Population", value: "~500,000" },
    ],
    costBreakdown: [
      {
        label: "Annual tuition",
        amount: "$2,000–$4,500",
        notes: "Low-cost option within the Uzbek system. Verify NMC status before choosing on cost alone.",
      },
      {
        label: "University hostel",
        amount: "$40–$100/month",
        notes: "Confirm air conditioning — summer heat is extreme.",
      },
      {
        label: "Food",
        amount: "$60–$100/month",
        notes: "Very affordable locally. Self-cooking common among Indian students.",
      },
      {
        label: "Personal expenses",
        amount: "$60–$100/month",
        notes: "Small city — low transport costs.",
      },
      {
        label: "Visa & one-time arrival",
        amount: "$350–$600",
        notes: "Fly into Tashkent, then connect to Fergana.",
      },
      {
        label: "Estimated 6-year total",
        amount: "$19,000–$38,000",
        notes: "Comparable to Andijan in cost profile.",
      },
    ],
    admissionSteps: [
      {
        title: "Verify NMC recognition",
        detail: "Check each Fergana university individually on nmc.org.in.",
      },
      {
        title: "Apply and receive invitation letter",
        detail: "Submit documents July–September.",
      },
      {
        title: "Apply for Uzbek student visa",
        detail: "At Uzbek embassy in India.",
      },
      {
        title: "Complete OVIR registration on arrival",
        detail: "Within 3 days. University managed.",
      },
      {
        title: "Plan online coaching from Year 3",
        detail: "No local FMGE/NExT coaching. Online programs are the only option.",
      },
    ],
    clinicalTraining:
      "Clinical rotations use Fergana regional hospitals from Year 4. Patient language is Uzbek. Similar to Andijan in terms of case exposure and infrastructure. NExT coaching is entirely online.",
    faq: [
      {
        question: "Is there a meaningful difference between Andijan and Fergana for MBBS?",
        answer:
          "Both are in the Fergana Valley with similar cost levels and climate. The main differences are which universities and specific programs are available in each city. Compare the specific institutions you are targeting rather than the cities themselves.",
      },
    ],
  },
};

export function getCityGuide(slug: string): CityGuide | null {
  return cityGuideMap[slug] ?? null;
}
