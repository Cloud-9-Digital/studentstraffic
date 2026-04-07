export type CityEditorial = {
  name: string;
  countrySlug: string;
  countryName: string;
  summary: string;
  whyStudentsChooseIt: string;
  indianCommunity: string;
  monthlyCostRange: string;
  climateContext: string;
  safetyContext: string;
  keyFacts: Array<{ label: string; value: string }>;
  faq: Array<{ question: string; answer: string }>;
};

const cityEditorialMap: Record<string, CityEditorial> = {
  tbilisi: {
    name: "Tbilisi",
    countrySlug: "georgia",
    countryName: "Georgia",
    summary:
      "Tbilisi is the capital of Georgia and the single largest hub for Indian MBBS students in the South Caucasus. With over 30 private medical universities operating English-medium programs, it offers more choice per square kilometre than almost any comparable city. Students live in a European-style capital with a walkable old town, reliable public transport, and a growing international community.",
    whyStudentsChooseIt:
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
    faq: [
      {
        question: "Are Tbilisi MBBS degrees recognised by NMC?",
        answer:
          "NMC recognition is granted to individual institutions, not to the city or country as a whole. A number of Tbilisi universities hold NMC recognition, but you must verify the current status of the specific institution you are applying to on the NMC website directly, since the recognised institution list is updated periodically.",
      },
      {
        question: "How much does it cost to live in Tbilisi as a medical student?",
        answer:
          "Excluding tuition and hostel (which most universities bundle), students typically spend USD 250–450 per month on food, transport, SIM cards, and personal expenses. Indian messes near university campuses charge around GEL 400–600/month for three meals. Budget for a one-time visa fee and initial settlement costs of around USD 300–500.",
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
      "Bishkek is the capital of Kyrgyzstan and the dominant hub for Indian medical students in Central Asia, home to more than 20 medical universities. It is a post-Soviet city with tree-lined boulevards, affordable living costs, and a large established Indian student population that has grown steadily over the past decade. Clinical training is conducted in Russian-medium hospitals, giving students practical exposure to a second language alongside their English coursework.",
    whyStudentsChooseIt:
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
    whyStudentsChooseIt:
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
    whyStudentsChooseIt:
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
    whyStudentsChooseIt:
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
    whyStudentsChooseIt:
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
    whyStudentsChooseIt:
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
    whyStudentsChooseIt:
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
    whyStudentsChooseIt:
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
    whyStudentsChooseIt:
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
    whyStudentsChooseIt:
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
    whyStudentsChooseIt:
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
    whyStudentsChooseIt:
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
    whyStudentsChooseIt:
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
    whyStudentsChooseIt:
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
    whyStudentsChooseIt:
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
    faq: [
      {
        question: "Is there a meaningful difference between Andijan and Fergana for MBBS?",
        answer:
          "Both are in the Fergana Valley with similar cost levels and climate. The main differences are which universities and specific programs are available in each city. Compare the specific institutions you are targeting rather than the cities themselves.",
      },
    ],
  },
};

export function getCityEditorial(slug: string): CityEditorial | null {
  return cityEditorialMap[slug] ?? null;
}
