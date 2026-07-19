import fs from 'node:fs';

const path = 'research/catalog-payloads/purdue-university.json';
const payload = JSON.parse(fs.readFileSync(path, 'utf8'));
const university = payload.universities.find((u) => u.slug === 'purdue-university');
if (!university) throw new Error('Purdue university payload not found');

const undergraduate = (overview, eligibility, steps, academic, application, deadline, extra = []) => ({
  overview, eligibility: { intro: eligibility, items: ['High-school diploma or recognized equivalent is required.', 'Purdue expects four years of math, four years of English and three years of lab science; programme-specific preparation is noted below.', 'International applicants whose native language is not English must provide Purdue-accepted English evidence.'] },
  applicationSteps: steps, documentsRequired: { academic, application }, deadlinesNote: deadline,
  visaConsiderations: ['After admission, international students should follow Purdue International Students and Scholars instructions for the I-20 and U.S. student-visa process.', ...extra],
});
const graduate = (overview, eligibility, steps, academic, application, deadline, visa = 'After admission, international students should follow Purdue ISS instructions for financial certification, I-20 issuance and the U.S. student visa.') => ({
  overview, eligibility: { intro: eligibility, items: ['A completed or expected bachelor’s degree and academic record are required for graduate review.', 'International applicants must follow Purdue Graduate School English-proficiency rules and any official waiver conditions.', 'Programme-specific prerequisites, tests and selection criteria are controlled by the current official programme page.'] },
  applicationSteps: steps, documentsRequired: { academic, application }, deadlinesNote: deadline, visaConsiderations: [visa],
});

const content = {
  'bs-aeronautical-astronautical-engineering-purdue': undergraduate(
    'Purdue’s Aeronautical and Astronautical Engineering BS is a first-year undergraduate engineering route at West Lafayette. Applicants are reviewed through Purdue Undergraduate Admissions and must meet the university’s academic, testing and English requirements.',
    'Applicants need a recognized secondary-school qualification and the preparation Purdue expects for engineering study.',
    ['Review the AAE undergraduate page and Purdue freshman criteria.', 'Apply through the Common Application and select the Purdue engineering route.', 'Submit the required academic record, testing information, essay responses and English evidence.', 'Complete the application by the applicable Purdue deadline and monitor the applicant portal.'],
    ['Secondary-school transcript and proof of graduation', 'SAT or ACT results when available or required by the application review', 'English-proficiency score report for applicable international applicants'],
    ['Common Application with Purdue questions and essay', 'Passport or identity information and any country-specific documents requested', 'Application fee and all checklist items shown in the Purdue portal'],
    'Purdue lists November 1 as the Early Action and engineering priority deadline and January 15 for Regular Decision; confirm the live dates for the intended entry year.'
  ),
  'bs-computer-science-purdue': undergraduate(
    'Purdue’s Bachelor of Science in Computer Science is an undergraduate Computer Science department offering. Admission uses Purdue’s freshman route, with competitive review of academic preparation, intended-major readiness, testing, essay responses and English evidence.',
    'Applicants need a recognized secondary qualification and strong preparation for Purdue computer-science study.',
    ['Review Purdue CS degree information and freshman admission criteria.', 'Submit the Common Application and select Computer Science.', 'Provide the academic record, SAT or ACT information, Purdue essays and English evidence.', 'Submit by the CS priority deadline and track the Purdue application checklist.'],
    ['Secondary-school transcript and graduation evidence', 'SAT or ACT score information if submitted or requested', 'English-proficiency results for applicable international applicants'],
    ['Common Application and Purdue-specific questions', 'Passport or identity information and country-specific academic documents if requested', 'Application fee and completed online checklist'],
    'Purdue lists November 1 as the Computer Science priority/Early Action deadline and January 15 for Regular Decision; verify the current entry-year dates and closed-program status.'
  ),
  'bs-mechanical-engineering-purdue': undergraduate(
    'Purdue’s Bachelor of Science in Mechanical Engineering is a first-year College of Engineering route at West Lafayette. Applicants use Purdue Undergraduate Admissions and are evaluated against university and engineering academic preparation requirements.',
    'Applicants need a recognized secondary qualification and the mathematics and science preparation Purdue expects for engineering.',
    ['Review the Mechanical Engineering page and Purdue freshman criteria.', 'Apply through the Common Application and select the Purdue engineering pathway.', 'Submit transcripts, testing information, Purdue essays and English evidence where required.', 'Complete the application by the relevant deadline and monitor the Purdue portal.'],
    ['Secondary-school transcript and graduation evidence', 'SAT or ACT information when supplied or required', 'English-proficiency score report for applicable international applicants'],
    ['Common Application and Purdue-specific essay responses', 'Passport or identity details and any country-specific academic documents', 'Application fee and all portal checklist items'],
    'Purdue lists November 1 as the Engineering West Lafayette priority/Early Action deadline and January 15 for Regular Decision; verify the intended entry-year dates.'
  ),
  'bs-accounting-purdue': undergraduate(
    'Purdue’s Bachelor of Science in Accounting is a Daniels School undergraduate offering. First-year applicants apply through Purdue Undergraduate Admissions; later upper-division progression has separate Daniels requirements that should not be confused with freshman admission.',
    'Applicants need a recognized secondary qualification and Purdue’s general academic and English requirements.',
    ['Review the Accounting degree and Purdue freshman criteria.', 'Submit the Common Application with Purdue questions and the intended accounting interest.', 'Upload the required academic, testing, identity and English materials.', 'Monitor the portal and, after enrollment, review Daniels upper-division requirements before progressing.'],
    ['Secondary-school transcript and graduation evidence', 'SAT or ACT information when submitted or requested', 'English-proficiency score report where applicable'],
    ['Common Application and Purdue essay responses', 'Passport or identity details and any country-specific documents requested', 'Application fee and completed applicant-portal checklist'],
    'Purdue lists November 1 for Early Action and scholarship consideration and January 15 for Regular Decision; confirm current entry-year dates.'
  ),
  'bs-biological-sciences-purdue': undergraduate(
    'Purdue’s Bachelor of Science in Biological Sciences is a College of Science undergraduate offering. Applicants use the Purdue freshman route and should present the mathematics and laboratory-science preparation expected for science study.',
    'Applicants need a recognized secondary qualification and Purdue’s general admission and English requirements.',
    ['Review the Biological Sciences major and Purdue freshman criteria.', 'Apply through the Common Application and select the intended College of Science major.', 'Submit the academic record, testing information, Purdue essays and English evidence where required.', 'Complete the checklist by the applicable deadline and monitor Purdue’s portal.'],
    ['Secondary-school transcript and graduation evidence', 'SAT or ACT information when submitted or requested', 'English-proficiency score report for applicable international applicants'],
    ['Common Application and Purdue-specific questions', 'Passport or identity information and any requested country-specific documents', 'Application fee and all portal checklist items'],
    'Purdue lists November 1 for Early Action and January 15 for Regular Decision; confirm whether the intended entry term or programme has different availability.'
  ),
  'bs-nursing-purdue': undergraduate(
    'Purdue’s Bachelor of Science in Nursing is a School of Nursing undergraduate route with programme-specific progression and clinical requirements. Applicants first use Purdue Undergraduate Admissions, then follow School of Nursing instructions for the intended cohort.',
    'Applicants need a recognized secondary qualification plus the science preparation and later clinical conditions stated by Purdue Nursing.',
    ['Review Purdue Nursing’s undergraduate page and the freshman admission criteria.', 'Submit the Common Application by the nursing priority deadline.', 'Provide transcripts, testing information, Purdue essays and English evidence where required.', 'After admission, complete the School of Nursing’s progression, health and clinical-clearance requirements.'],
    ['Secondary-school transcript and graduation evidence', 'Biology and chemistry preparation shown on the academic record', 'English-proficiency evidence for applicable international applicants'],
    ['Common Application and Purdue-specific questions', 'Passport or identity details and country-specific documents if requested', 'Any School of Nursing health or clinical documents requested after admission'],
    'Purdue lists November 1 as the Nursing priority/Early Action deadline and January 15 for Regular Decision; verify the current cohort’s nursing availability and checklist.',
    ['International applicants should separately confirm clinical-placement and health-document rules with Nursing.']
  ),
  'ms-computer-science-purdue': graduate(
    'Purdue’s Computer Science MS is a graduate programme administered through the Computer Science department and Purdue Graduate School. The department publishes a common MS/PhD route, with admissions based on academic preparation, department materials, English evidence and application timing.',
    'Applicants must meet Purdue Graduate School rules and demonstrate preparation for graduate computer-science study.',
    ['Review the CS MS requirements, FAQ and application steps.', 'Create the Purdue Graduate School online application and select the MS route.', 'Upload transcripts, short answers, resume and requested programme materials; arrange official English scores.', 'Submit all materials by the cohort deadline and monitor the application for committee decisions.'],
    ['Transcripts from every post-secondary institution attended', 'Evidence of bachelor’s degree or expected completion', 'English score report meeting the current CS departmental minimum where applicable'],
    ['Purdue Graduate School online application and short-answer responses', 'Current resume and programme-specific materials requested', 'Application fee and identity details'],
    'Purdue CS publishes October 1 for spring MS applications and December 1 for fall MS applications; confirm the live cycle before applying.',
    'After admission, international students must complete Purdue ISS financial and immigration steps for the I-20 and U.S. student visa.'
  ),
  'ms-business-analytics-information-management-purdue': graduate(
    'Purdue Daniels’ MS in Business Analytics and Information Management is a specialised graduate programme. Its official checklist requires a Purdue Graduate School application, official transcripts, recommendations, resume, two essays and any test or English evidence required on the live admissions page.',
    'Applicants should demonstrate prior academic preparation and quantitative, professional or leadership evidence relevant to business analytics.',
    ['Review the MSBAIM admissions page and application checklist.', 'Open the Purdue Graduate School online application and select MSBAIM.', 'Arrange official transcripts, two recommendations, resume and the two required essays.', 'Submit tests or English evidence if required, pay the fee and monitor application status.'],
    ['Official transcripts from each institution attended, with certified English translations when needed', 'Bachelor’s degree or expected-completion evidence', 'Current quantitative and academic preparation shown in the transcript'],
    ['Purdue Graduate School online application', 'Two recommendations, current resume and two essays of up to 500 words each', 'Test scores or English evidence where required and application fee'],
    'The official checklist directs applicants to the MSBAIM Application Requirements page for the programme deadline; the current cycle date must be checked there before submission.'
  ),
  'ms-finance-purdue': graduate(
    'Purdue Daniels’ residential MS in Finance is a 10-month, 36-credit STEM-designated graduate programme. Applicants use the Purdue Graduate School application and are assessed on academic preparation, quantitative readiness, application materials and English evidence where applicable.',
    'Applicants should hold a bachelor’s degree with preparation suited to graduate finance and analytics study.',
    ['Review the MS Finance programme page and current application requirements.', 'Complete the Purdue Graduate School online application for the residential MSF.', 'Upload transcripts, resume, recommendations, essays and any required GMAT/GRE or English evidence.', 'Submit before the live programme deadline, pay the fee and track the application status.'],
    ['Official transcripts from every post-secondary institution attended', 'Bachelor’s degree or expected-completion evidence', 'Evidence of quantitative preparation required by the current MSF page'],
    ['Purdue Graduate School online application', 'Resume, recommendations and programme essays', 'Test scores and English-proficiency evidence where required'],
    'Purdue Daniels publishes the current MS Finance deadline on its live application page; no fixed date is inferred here because the cycle-specific page controls the deadline.',
    'The residential STEM format requires international students to follow Purdue ISS financial, I-20 and F-1 visa instructions after admission.'
  ),
  'mba-purdue': graduate(
    'Purdue’s MBA offering is format-dependent: Daniels publishes distinct MBA options, including a STEM-designated One-Year MBA page and other formats. Applicants must choose an open format and follow that format’s current admissions, experience, test, fee and intake rules.',
    'Eligibility cannot be collapsed across Purdue MBA formats; the selected format’s official page controls the requirements.',
    ['Compare the currently open Daniels MBA formats and select the intended study mode.', 'Review that format’s eligibility, essays, resume, test and interview requirements.', 'Submit through the route named by Daniels and upload the required evidence.', 'Complete any interview or follow-up request and then follow Purdue’s offer, financial and immigration instructions.'],
    ['Bachelor’s degree evidence and transcripts from all required institutions', 'English-proficiency evidence where required', 'GMAT/GRE or other test evidence only where the selected format requires or accepts it'],
    ['Format-specific online MBA application', 'Resume, essays, recommendations and identity documents requested by Daniels', 'Application fee and any interview or supplemental materials'],
    'The One-Year MBA page reviewed states it was not accepting an August 2025 start; applicants must verify which MBA format is open and its current deadline before applying.'
  ),
  'phd-computer-science-purdue': graduate(
    'Purdue’s Computer Science PhD is a research graduate programme administered by the CS department and Graduate School. Applicants are evaluated for doctoral preparation, research fit, English evidence and the department’s application requirements; funding is not assumed from admission alone.',
    'Applicants need strong prior academic preparation and a credible fit with doctoral computer-science research.',
    ['Review the Purdue CS PhD page, requirements, FAQ and research areas.', 'Complete the Purdue Graduate School online application and select the PhD route.', 'Submit transcripts, short answers, resume and requested research materials; arrange English scores.', 'Submit by the cohort deadline and monitor department and Graduate School correspondence.'],
    ['Transcripts from every post-secondary institution attended', 'Degree or expected-completion evidence', 'English score report meeting the current CS departmental minimum where applicable'],
    ['Purdue Graduate School application and short-answer responses', 'Current resume and research-focused materials requested by CS', 'Application fee and identity details'],
    'Purdue CS publishes October 1 for spring PhD applications and December 1 for fall PhD applications; verify the live cycle and funding information with CS.',
    'Admitted international doctoral students must complete Purdue ISS financial and I-20 steps before applying for the U.S. student visa.'
  ),
  'phd-engineering-purdue': graduate(
    'Purdue’s Engineering PhD category covers department-specific doctoral routes within the College of Engineering. Applicants apply to the selected engineering department and must verify its research fit, prerequisites, deadlines, English rules and funding terms.',
    'Eligibility is department-specific and cannot be inferred from the broad College of Engineering label.',
    ['Choose the exact Purdue engineering department and doctoral field.', 'Read that department’s graduate admissions page and Purdue Graduate School requirements.', 'Submit the Graduate School application with transcripts, statements, resume, recommendations and English evidence as required.', 'Complete any department follow-up and confirm funding terms separately from the admission decision.'],
    ['Transcripts and degree evidence from all post-secondary institutions', 'Academic preparation relevant to the selected engineering department', 'English-proficiency report where required, with translations for non-English records'],
    ['Purdue Graduate School online application', 'Academic statement or personal history statement, resume and recommendations as required', 'Research interests, faculty-fit material and application fee'],
    'Purdue Engineering departments publish their own deadlines; the selected department’s current page controls, and applicants should not substitute a deadline from another engineering field.'
  ),
};

for (const programme of university.programmes) {
  const block = content[programme.slug];
  if (!block) throw new Error(`Missing admissions block for ${programme.slug}`);
  programme.admissionsContent = block;
}
for (const course of payload.courses) {
  if (course.slug === 'be-btech-aerospace-engineering') course.summary = 'An undergraduate aerospace-engineering category covering engineering science, vehicle systems, aerospace design and analytical work. The exact Purdue award and Aeronautics and Astronautics plan remain visible on the offering.';
  if (course.slug === 'be-btech-mechanical-engineering') course.summary = 'An undergraduate mechanical-engineering category covering mechanics, thermal systems, materials and design. The exact Purdue award and Mechanical Engineering plan remain visible on the offering.';
  if (course.slug === 'be-btech-aerospace-engineering') { course.metaTitle = 'B.E./B.Tech Aerospace | Universities & Fees'; course.metaDescription = 'Compare B.E./B.Tech Aerospace programs by curriculum, eligibility, tuition, deadlines and international admissions.'; }
  if (course.slug === 'be-btech-mechanical-engineering') { course.metaTitle = 'B.E./B.Tech Mechanical | Universities & Fees'; course.metaDescription = 'Compare B.E./B.Tech Mechanical programs by curriculum, eligibility, tuition, deadlines and international admissions.'; }
  if (course.slug === 'msc-engineering-management') { course.summary = 'A graduate engineering-management category combining technical understanding with management, decision-making and organisational study. The exact Purdue award and department route remain visible on the offering.'; course.metaTitle = 'M.Sc. Engineering Management | Universities & Fees'; course.metaDescription = 'Compare M.Sc. Engineering Management programs by curriculum, eligibility, tuition, deadlines and international admissions.'; }
}
fs.writeFileSync(path, JSON.stringify(payload, null, 2) + '\n');
