export type CountryVisaStep = { title: string; body: string };
export type CountryVisaContent = {
  summary: string;
  steps: CountryVisaStep[];
  documents: string[];
  sourceUrls: string[];
  lastVerifiedAt: string;
};

const shared = (summary: string, steps: CountryVisaStep[], documents: string[], sourceUrls: string[]): CountryVisaContent => ({ summary, steps, documents, sourceUrls, lastVerifiedAt: "2026-07-11" });

const content: Record<string, CountryVisaContent> = {
  albania: shared("Students should use the Albanian e-Visa process or the responsible Albanian diplomatic mission, depending on nationality and length of stay.", [
    { title: "Confirm the route", body: "Check whether your nationality and course require an entry visa, a long-stay visa, or a residence permit for study." },
    { title: "Secure admission documents", body: "Keep the university admission or enrolment confirmation and any invitation or accommodation evidence requested for your case." },
    { title: "Submit the application", body: "Complete the official application, upload the requested documents, and attend the mission appointment if required." },
    { title: "Complete residence formalities", body: "After arrival, follow the Albanian authorities' and institution's instructions for residence registration or a permit." },
  ], ["Valid passport", "University admission or enrolment confirmation", "Proof of accommodation", "Proof of financial means", "Health insurance", "Photograph and any translated or legalised documents requested"], ["https://e-visa.al/", "https://punetejashtme.gov.al/en/visa-regime-for-foreigners/"]),
  canada: shared("Most international students need a Canadian study permit before travel. The application is submitted online to Immigration, Refugees and Citizenship Canada (IRCC).", [
    { title: "Accept a place at a DLI", body: "Obtain a letter of acceptance from a designated learning institution and check whether a provincial or territorial attestation letter is required." },
    { title: "Prepare the IRCC application", body: "Complete the online study permit application, upload the personalised checklist, and pay the applicable fees." },
    { title: "Complete checks", body: "Most applicants aged 14 to 79 need biometrics. IRCC may also request a medical examination or police certificate." },
    { title: "Travel and follow conditions", body: "If approved, carry the documents issued by IRCC. At the border, the officer issues or confirms the study permit and entry documents." },
  ], ["Letter of acceptance from a designated learning institution", "Provincial or territorial attestation letter, unless an exception applies", "Valid passport", "Proof of funds for tuition, living expenses and return travel", "Biometrics and any medical or police documents requested"], ["https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html", "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/apply.html"]),
  georgia: shared("The route for studying in Georgia depends on nationality and the planned duration of stay. Confirm entry requirements and the residence process for a longer stay.", [
    { title: "Check entry eligibility", body: "Use Georgia's official consular information to confirm whether you need a visa and which category applies to your course." },
    { title: "Get university confirmation", body: "Keep the admission, enrolment, or invitation documents issued by the Georgian institution." },
    { title: "Apply through the official channel", body: "Submit through the Georgian consular or electronic visa channel when eligible, with the required supporting documents." },
    { title: "Arrange lawful residence", body: "For a longer stay, follow the Public Service Development Agency or Public Service Hall process for a temporary residence permit." },
  ], ["Passport", "University admission or invitation letter", "Proof of accommodation", "Proof of sufficient funds", "Insurance where required", "Photograph and certified translations where requested"], ["https://geoconsul.gov.ge/en/visaInformation", "https://sda.gov.ge/?page_id=7371&lang=en"]),
  germany: shared("Students from outside the EU/EEA who need a visa generally apply for a German national visa for study before travelling, then complete local residence formalities.", [
    { title: "Obtain admission", body: "Have admission from a state-recognised higher education institution or the relevant preparatory course." },
    { title: "Show financial means", body: "Prove that living costs are covered through an accepted method such as a blocked account, scholarship, or declaration of commitment." },
    { title: "Apply for the national visa", body: "Use the competent German mission or Consular Services Portal and provide the admission, finance, language and identity documents required." },
    { title: "Register after arrival", body: "Complete local registration and apply to the foreigners authority for the study residence permit before the entry visa expires." },
  ], ["Passport", "Admission or preparatory-course confirmation", "Proof of financial means", "Language proof where required", "Health insurance", "Visa form and biometric photograph"], ["https://www.make-it-in-germany.com/en/visa-residence/types/studying", "https://www.make-it-in-germany.com/en/visa-residence/procedure/entry-process"]),
  italy: shared("Students who require a visa for higher education in Italy normally complete pre-enrolment through Universitaly and then apply to the Italian diplomatic mission responsible for their residence.", [
    { title: "Receive university approval", body: "Follow the institution's admissions process and obtain the documents needed for pre-enrolment." },
    { title: "Complete Universitaly pre-enrolment", body: "Visa-required applicants for eligible degree courses submit the pre-enrolment application through the official portal." },
    { title: "Apply for the study visa", body: "Submit to the competent Italian embassy or consulate with the documents requested for the course and applicant." },
    { title: "Complete arrival formalities", body: "After arrival, follow the instructions for the residence permit and university enrolment within the required timeframe." },
  ], ["Passport", "University admission or Universitaly documentation", "Proof of accommodation", "Proof of financial means", "Health insurance", "Academic and civil documents in the accepted format"], ["https://italiana.esteri.it/italiana/en/opportunity/studying-in-italy/", "https://www.universitaly.it/"]),
  kyrgyzstan: shared("The official Kyrgyz e-Visa information identifies the S category for study. Longer stays require the relevant local authorisation.", [
    { title: "Confirm the study category", body: "Ask the institution which visa or stay category applies and whether it must initiate an invitation or supporting request." },
    { title: "Apply through the official channel", body: "Use the Kyrgyz e-Visa portal where eligible, or submit through the responsible diplomatic mission." },
    { title: "Carry approved documents", body: "Travel with your passport, visa or approval, admission documents and accommodation details." },
    { title: "Complete arrival registration", body: "Follow the university's instructions for migration registration and any extension or residence process." },
  ], ["Passport", "University admission or study confirmation", "Visa form and photograph", "Accommodation details", "Funds and insurance where requested", "Invitation or supporting letter where required"], ["https://evisa.e-gov.kg/index.php?lng=en", "https://evisa.e-gov.kg/get_information.php?lng=en&n=1"]),
  lithuania: shared("Students admitted to Lithuania normally use the Migration Department's MIGRIS process for a study-based temporary residence permit or the applicable visa route.", [
    { title: "Confirm the permit route", body: "Check the Migration Department instructions for your nationality, course length and application location." },
    { title: "Submit in MIGRIS", body: "Complete the online application, upload the documents, and book an appointment when required." },
    { title: "Give biometrics and originals", body: "Attend with your passport and original supporting documents for identity and document checks." },
    { title: "Travel after approval", body: "Use the visa or residence document issued for your case and complete arrival formalities." },
  ], ["Passport", "Proof of admission to a Lithuanian higher education institution", "Proof of accommodation", "Proof of funds", "Health insurance", "Police clearance, translations or legalisation if requested"], ["https://migracija.lrv.lt/en/services/state-fees-for-services/residence-permits/", "https://www.migracija.lt/en/"]),
  malta: shared("Students who need to enter Malta for a longer course generally need the appropriate national long-stay visa before travel and a study residence permit after arrival.", [
    { title: "Confirm course eligibility", body: "Check that the institution and course meet the requirements for the study residence framework." },
    { title: "Apply for entry permission", body: "If required, apply for the education-purpose national D visa through the responsible Maltese mission before travel." },
    { title: "Enter with matching documents", body: "Carry the passport, admission, accommodation, funds and insurance documents used for the application." },
    { title: "Apply for residence", body: "After arrival, submit the study residence application and biometrics through Identità within the required period." },
  ], ["Passport", "Acceptance letter from a licensed institution", "Proof of accommodation", "Proof of funds", "Comprehensive health insurance", "English translations and legalised or apostilled documents where required"], ["https://identita.gov.mt/frequently-asked-questions/expatriates/non-eu-non-employment/study/", "https://identita.gov.mt/central-visa-student-visa-extension-of-stay/"]),
  russia: shared("Students entering Russia for study generally need a study visa supported by an invitation issued through the Russian authorities at the request of the host institution.", [
    { title: "Receive the university invitation", body: "The host institution arranges the official study invitation or visa support required for the application." },
    { title: "Complete the visa application", body: "Fill in the official visa form, print and sign it, and submit it to the responsible consular office or authorised centre." },
    { title: "Provide study documents", body: "Submit the passport, photograph, invitation, insurance and any study-specific medical certificate required." },
    { title: "Follow arrival registration", body: "Complete migration registration and any visa extension or university registration process within the required period." },
  ], ["Passport", "Official study invitation", "Completed visa form and photograph", "Medical insurance valid in Russia", "HIV test certificate where required", "University admission or enrolment confirmation"], ["https://toronto.kdmid.ru/en/consular-function/visa/study-visa/", "https://www.kdmid.ru/cons/visas/"]),
  uzbekistan: shared("Uzbekistan provides student visa categories issued on the request of the educational institution or another authorised organisation.", [
    { title: "Confirm the student category", body: "Ask the institution whether the STD temporary-study or A-1 study category applies to your programme and duration." },
    { title: "Obtain the institutional request", body: "The educational institution starts the required request or invitation process with the competent Uzbek authorities." },
    { title: "Apply for the visa", body: "Complete the official form and submit the passport and supporting documents through the Uzbek mission or applicable official channel." },
    { title: "Register after arrival", body: "Complete temporary registration and maintain visa validity through the institution's international office." },
  ], ["Passport", "University request, invitation or admission document", "Completed visa form", "Photograph", "Accommodation or registration details", "Supporting documents requested by the Uzbek mission"], ["https://gov.uz/en/mfa/activity_page/o-zbekiston-respublikasi-vizasi", "https://e-visa.gov.uz/what-you-need-to-know"]),
  vietnam: shared("Vietnam's entry permission depends on nationality, course and stay length. Use the official immigration portal or Vietnamese diplomatic mission for the route applicable to your study plan.", [
    { title: "Confirm the visa route", body: "Check the official immigration instructions and ask the institution whether it must provide an invitation or supporting document." },
    { title: "Prepare the application", body: "For eligible applicants, complete the official e-visa application with the passport bio page, photograph and requested travel details." },
    { title: "Pay and download the result", body: "Pay through the official portal, retain the application code, check the result and carry the approved visa when travelling." },
    { title: "Complete residence formalities", body: "After arrival, follow the institution's instructions for temporary residence declaration and any study-related extension process." },
  ], ["Passport", "Passport bio-page scan and photograph", "University admission or supporting letter where required", "Accommodation details", "Insurance or funds where requested", "Printed or electronic visa approval"], ["https://evisa.immigration.gov.vn/", "https://evisa.gov.vn/"]),
};

export function getCountryVisaContent(countrySlug: string): CountryVisaContent | null {
  return content[countrySlug] ?? null;
}
