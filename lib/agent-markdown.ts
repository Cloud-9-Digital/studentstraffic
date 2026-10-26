import { siteConfig } from "@/lib/constants";
import { getIntakeMonthLabels } from "@/lib/catalogue-facets";
import { catalogReviewedAt } from "@/lib/content-governance";
import type {
  CountryRegulatoryAdvisory,
  UniversityRegulatoryAdvisory,
} from "@/lib/data/regulatory-advisories";
import type {
  Country,
  Faq,
  FinderProgram,
  LandingPage,
  ResearchSource,
  University,
} from "@/lib/data/types";
import type { CountryProgramDirectoryRow } from "@/lib/data/catalog";
import type { StudyAbroadGuidePageProps } from "@/components/site/study-abroad-guide-page";
import { absoluteUrl } from "@/lib/metadata";
import {
  getCountryHref,
  getCourseHref,
  getUniversityHref,
  getUniversityProgramHref,
} from "@/lib/routes";
import {
  formatCurrencyAmount,
  formatCurrencyUsd,
  formatProgramAnnualFee,
  formatProgramFee,
  formatProgramFeeSummary,
  getDisplayedReportedFeeQuote,
  formatProgramDuration,
  formatProgramMedium,
  hasOfficialFeeAmount,
  hasPublishedUsdAmount,
} from "@/lib/utils";

/**
 * Markdown views of the catalogue for AI agents and answer engines: university,
 * programme, country, landing-page and guide pages (`/university/{slug}.md`,
 * `/{slug}.md`, `/countries/{slug}.md`, or `Accept: text/markdown` on the HTML
 * URL; routing in lib/agent-discovery.ts). They carry the same
 * published facts as the HTML page, without layout, scripts or streaming, so
 * an agent that does not run JavaScript reads the whole record in one request.
 * Only published catalogue fields are rendered; empty fields are omitted.
 */

export function getUniversityMarkdownHref(universitySlug: string) {
  return `${getUniversityHref(universitySlug)}.md`;
}

export function getProgramMarkdownHref(programSlug: string) {
  return `${getUniversityProgramHref(programSlug)}.md`;
}

function clean(value: string | undefined | null) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

// Keeps a value on one table row: pipes would split the cell.
function cell(value: string) {
  return clean(value).replace(/\|/g, "/");
}

function link(label: string, path: string) {
  return `[${clean(label)}](${absoluteUrl(path)})`;
}

function bullets(items: Array<string | undefined | null | false>) {
  return items
    .map((item) => (item ? clean(item) : ""))
    .filter(Boolean)
    .map((item) => `- ${item}`);
}

function section(title: string, body: string[]) {
  return body.some((line) => clean(line)) ? [`## ${title}`, "", ...body, ""] : [];
}

function paragraph(value: string | undefined | null) {
  const text = clean(value);
  return text ? [text, ""] : [];
}

function sourcesSection(sources: ResearchSource[]) {
  return section(
    "Sources",
    sources
      .filter((source) => source.url)
      .map(
        (source) =>
          `- [${clean(source.label) || source.url}](${source.url})${
            source.checkedAt ? ` (checked ${source.checkedAt.slice(0, 10)})` : ""
          }`,
      ),
  );
}

function advisorySection(
  countryAdvisory: CountryRegulatoryAdvisory | null,
  universityAdvisory: UniversityRegulatoryAdvisory | null,
) {
  if (!countryAdvisory) return [];
  return section(`${countryAdvisory.label}: ${countryAdvisory.title}`, [
    ...paragraph(countryAdvisory.summary),
    ...(universityAdvisory
      ? paragraph(`${universityAdvisory.title}. ${universityAdvisory.body}`)
      : []),
    ...bullets(countryAdvisory.keyPoints),
    ...(countryAdvisory.sources.length
      ? [
          "",
          ...countryAdvisory.sources.map((source) =>
            source.url ? `- Source: [${source.label}](${source.url})` : `- Source: ${source.label}`,
          ),
        ]
      : []),
  ]);
}

function counsellingSection(subject = "this university and its programmes") {
  return section("Free counselling", [
    `${siteConfig.name} offers free admission counselling for ${subject}.`,
    "",
    `- Contact: ${absoluteUrl("/contact")}`,
    `- WhatsApp: https://wa.me/${siteConfig.whatsappNumber}`,
    `- Phone: ${siteConfig.phone}`,
    `- Email: ${siteConfig.email}`,
  ]);
}

function header(input: {
  title: string;
  summary: string;
  canonicalPath: string;
  reviewedAt?: string;
  updatedLabel?: string;
}) {
  return [
    `# ${clean(input.title)}`,
    "",
    ...(clean(input.summary) ? [`> ${clean(input.summary)}`, ""] : []),
    `- Canonical page: ${absoluteUrl(input.canonicalPath)}`,
    ...(input.reviewedAt ? [`- Last reviewed: ${input.reviewedAt.slice(0, 10)}`] : []),
    ...(clean(input.updatedLabel) ? [`- Updated: ${clean(input.updatedLabel)}`] : []),
    `- Publisher: ${siteConfig.name} (${absoluteUrl("/")})`,
    "",
  ];
}

function formatOfficialAnnualFee(program: FinderProgram) {
  const { offering } = program;
  if (
    !hasOfficialFeeAmount(
      offering.officialAnnualTuitionAmount,
      offering.officialFeeCurrency,
      offering.feeStatus,
    ) ||
    !offering.officialFeeCurrency
  ) {
    return null;
  }
  return formatCurrencyAmount(
    offering.officialAnnualTuitionAmount,
    offering.officialFeeCurrency,
  );
}

function formatAnnualFeeLine(program: FinderProgram) {
  const { offering } = program;
  if (getDisplayedReportedFeeQuote(offering)) return formatProgramFee(offering);
  const fee = formatProgramAnnualFee(offering);
  const official = formatOfficialAnnualFee(program);
  const qualifiers = [
    offering.feeStatus === "indicative" ? "indicative" : null,
    official && official !== fee ? `official: ${official}` : null,
    offering.feeAcademicYear ? clean(offering.feeAcademicYear) : null,
  ].filter(Boolean);
  // Name who each fee is for, so an NRI-only fee isn't read as the Indian-student fee.
  const amounts = offering.feeAudience || offering.additionalFees?.length
    ? formatProgramFeeSummary(offering, program.country.slug)
    : fee;
  return qualifiers.length ? `${amounts} (${qualifiers.join("; ")})` : amounts;
}

export function renderUniversityMarkdown(input: {
  university: University;
  country: Country;
  programs: FinderProgram[];
}) {
  const { university, country, programs } = input;
  const path = getUniversityHref(university.slug);
  const reviewedAt = university.lastVerifiedAt || catalogReviewedAt;
  const admissions = university.admissionsContent;

  const lines = [
    ...header({
      title: university.name,
      summary: university.summary,
      canonicalPath: path,
      reviewedAt,
    }),
    ...section("Key facts", [
      ...bullets([
        `Location: ${university.city}, ${link(country.name, getCountryHref(country.slug))}`,
        `Type: ${university.type}`,
        university.establishedYear ? `Established: ${university.establishedYear}` : null,
        university.officialWebsite ? `Official website: ${university.officialWebsite}` : null,
        programs.length ? `Published programmes on ${siteConfig.name}: ${programs.length}` : null,
      ]),
    ]),
    ...section(
      "Recognition and approvals",
      [
        ...bullets(university.recognitionBadges),
        ...university.recognitionLinks.map(
          (item) => `- Verify: [${clean(item.label)}](${item.url})`,
        ),
      ],
    ),
    ...section(
      "Programmes",
      programs.length
        ? [
            programs.some((program) => getDisplayedReportedFeeQuote(program.offering))
              ? "| Programme | Course | Duration | Medium | Fees |"
              : "| Programme | Course | Duration | Medium | Tuition per year |",
            "| --- | --- | --- | --- | --- |",
            ...programs.map(
              (program) =>
                `| ${link(cell(program.offering.title), getUniversityProgramHref(program.offering.slug))} | ${cell(program.course.shortName)} | ${formatProgramDuration(program.offering.durationYears)} | ${cell(formatProgramMedium(program.offering.medium, country.slug) ?? "")} | ${cell(formatAnnualFeeLine(program))} |`,
            ),
          ]
        : [],
    ),
    ...section("Admissions", [
      ...paragraph(admissions?.overview),
      ...(admissions?.eligibility
        ? [
            ...paragraph(admissions.eligibility.intro),
            ...bullets(admissions.eligibility.items),
            "",
          ]
        : []),
      ...(admissions?.admissionSteps?.length
        ? [
            "Steps:",
            "",
            ...admissions.admissionSteps.map(
              (step, index) => `${index + 1}. ${clean(step)}`,
            ),
            "",
          ]
        : []),
      ...(admissions?.documentsRequired
        ? bullets([
            ...admissions.documentsRequired.educational.map((item) => `Document: ${item}`),
            ...admissions.documentsRequired.visa.map((item) => `Visa document: ${item}`),
          ])
        : []),
      ...paragraph(admissions?.deadlinesNote),
      ...paragraph(admissions?.scholarshipInfo),
      ...bullets(admissions?.licensingPathway ?? []),
    ]),
    ...section("Why students choose it", bullets(university.whyChoose)),
    ...section("Things to consider", bullets(university.thingsToConsider)),
    ...section("Best fit for", bullets(university.bestFitFor)),
    ...section("Campus and city", [
      ...paragraph(university.campusLifestyle),
      ...paragraph(university.cityProfile),
      ...paragraph(university.practicalExposure),
    ]),
    ...section("Hostel, food and safety", [
      ...paragraph(university.hostelOverview),
      ...paragraph(university.dietarySupport),
      ...paragraph(university.safetyOverview),
      ...paragraph(university.studentSupport),
    ]),
    ...section(
      "Frequently asked questions",
      university.faq.flatMap((item) => [
        `### ${clean(item.question)}`,
        "",
        clean(item.answer),
        "",
      ]),
    ),
    ...sourcesSection(university.researchSources),
    ...counsellingSection(),
  ];

  return `${lines.join("\n").trim()}\n`;
}

export function renderProgramMarkdown(input: {
  program: FinderProgram;
  countryAdvisory?: CountryRegulatoryAdvisory | null;
  universityAdvisory?: UniversityRegulatoryAdvisory | null;
}) {
  const { program } = input;
  const { offering, university, country, course } = program;
  const path = getUniversityProgramHref(offering.slug);
  const reviewedAt = university.lastVerifiedAt || catalogReviewedAt;
  const medium = formatProgramMedium(offering.medium, country.slug);
  const admissions = offering.admissionsContent;
  const eligibility = offering.audienceEligibility;

  const lines = [
    ...header({
      title: `${offering.title} at ${university.name}`,
      summary: `${offering.title} (${course.shortName}) at ${university.name}, ${university.city}, ${country.name}.`,
      canonicalPath: path,
      reviewedAt,
    }),
    ...section("Key facts", [
      ...bullets([
        `University: ${link(university.name, getUniversityHref(university.slug))} (${university.type}, ${university.city}, ${link(country.name, getCountryHref(country.slug))})`,
        `Course family: ${link(course.name, getCourseHref(course.slug))}`,
        `Duration: ${formatProgramDuration(offering.durationYears)}`,
        medium ? `Teaching language: ${medium}` : null,
        offering.mediumNote ? `Language note: ${offering.mediumNote}` : null,
        `${getDisplayedReportedFeeQuote(offering) ? "Fees" : "Tuition per year"}: ${formatAnnualFeeLine(program)}`,
        hasPublishedUsdAmount(offering.totalTuitionUsd)
          ? `Total tuition: ${formatCurrencyUsd(offering.totalTuitionUsd)}`
          : null,
        hasPublishedUsdAmount(offering.livingUsd)
          ? `Estimated living cost: ${formatCurrencyUsd(offering.livingUsd)} per year`
          : null,
        offering.feeVerifiedAt ? `Fee verified: ${offering.feeVerifiedAt.slice(0, 10)}` : null,
        offering.intakeCodes.length ? `Intake: ${getIntakeMonthLabels(offering.intakeCodes).join(", ")}` : null,
        offering.professionalExamSupport.length
          ? `Licensing exam support: ${offering.professionalExamSupport.join(", ")}`
          : null,
        offering.officialProgramUrl ? `Official programme page: ${offering.officialProgramUrl}` : null,
      ]),
    ]),
    ...paragraph(offering.feeNotes && !getDisplayedReportedFeeQuote(offering) ? `Fee notes: ${offering.feeNotes}` : null),
    ...section(
      "Year-wise cost (USD)",
      offering.yearlyCostBreakdown.length
        ? [
            "| Year | Tuition | Hostel | Living | Total |",
            "| --- | --- | --- | --- | --- |",
            ...offering.yearlyCostBreakdown.map(
              (row) =>
                `| ${cell(row.yearLabel)} | ${formatCurrencyUsd(row.tuitionUsd)} | ${formatCurrencyUsd(row.hostelUsd)} | ${formatCurrencyUsd(row.livingUsd)} | ${formatCurrencyUsd(row.totalUsd)} |`,
            ),
          ]
        : [],
    ),
    ...section(
      "Who can apply",
      eligibility
        ? [
            ...bullets([
              `Availability: ${eligibility.availability}`,
              ...eligibility.eligibleAudiences.map((item) => `Eligible: ${item}`),
              ...eligibility.restrictions.map((item) => `Restriction: ${item}`),
            ]),
            ...(eligibility.notes ? ["", clean(eligibility.notes)] : []),
          ]
        : [],
    ),
    ...section("Admissions", [
      ...paragraph(admissions?.overview),
      ...(admissions?.eligibility
        ? [
            ...paragraph(admissions.eligibility.intro),
            ...bullets(admissions.eligibility.items),
            "",
          ]
        : []),
      ...(admissions?.applicationSteps.length
        ? [
            "Steps:",
            "",
            ...admissions.applicationSteps.map(
              (step, index) => `${index + 1}. ${clean(step)}`,
            ),
            "",
          ]
        : []),
      ...(admissions
        ? bullets([
            ...admissions.documentsRequired.academic.map((item) => `Document: ${item}`),
            ...admissions.documentsRequired.application.map((item) => `Application document: ${item}`),
          ])
        : []),
      ...paragraph(admissions?.deadlinesNote),
      ...bullets(admissions?.visaConsiderations ?? []),
    ]),
    ...section(
      "Teaching phases",
      offering.teachingPhases.map(
        (phase) =>
          `- ${clean(phase.phase)} (${clean(phase.language)}): ${clean(phase.details)}`,
      ),
    ),
    ...advisorySection(input.countryAdvisory ?? null, input.universityAdvisory ?? null),
    ...section(
      "Sources",
      offering.sourceUrls.map((url) => `- ${url}`),
    ),
    `More about ${university.name}: ${absoluteUrl(getUniversityMarkdownHref(university.slug))}`,
    "",
    ...counsellingSection(),
  ];

  return `${lines.join("\n").trim()}\n`;
}

/**
 * Rough token count for the `x-markdown-tokens` header (Markdown for Agents).
 * About four characters per token for English text; agents use it only to
 * budget context, so an estimate is enough.
 */
export function estimateMarkdownTokens(body: string) {
  return Math.ceil(body.length / 4);
}

export function markdownResponse(body: string, canonicalPath: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // The HTML page is the indexable original; this view points back to it.
      Link: `<${absoluteUrl(canonicalPath)}>; rel="canonical"`,
      Vary: "Accept",
      "x-markdown-tokens": String(estimateMarkdownTokens(body)),
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

export function markdownNotFound() {
  return new Response("# Not found\n", {
    status: 404,
    headers: { "Content-Type": "text/markdown; charset=utf-8", Vary: "Accept" },
  });
}

function faqSection(faq: Faq[]) {
  return section(
    "Frequently asked questions",
    faq.flatMap((item) => [`### ${clean(item.question)}`, "", clean(item.answer), ""]),
  );
}

export function renderCountryMarkdown(input: {
  country: Country;
  programRows: CountryProgramDirectoryRow[];
  countryAdvisory?: CountryRegulatoryAdvisory | null;
}) {
  const { country, programRows } = input;
  const path = getCountryHref(country.slug);

  // One row per university, with the courses it offers here.
  const universities = new Map<
    string,
    { row: CountryProgramDirectoryRow["university"]; courses: Set<string> }
  >();
  for (const row of programRows) {
    const entry = universities.get(row.university.slug) ?? {
      row: row.university,
      courses: new Set<string>(),
    };
    entry.courses.add(clean(row.course.shortName));
    universities.set(row.university.slug, entry);
  }
  const universityRows = [...universities.values()].sort((a, b) =>
    a.row.name.localeCompare(b.row.name),
  );

  const lines = [
    ...header({
      title: `Study in ${country.name}`,
      summary: country.metaDescription || country.summary,
      canonicalPath: path,
      reviewedAt: country.updatedAt || catalogReviewedAt,
    }),
    ...section("Overview", [
      ...paragraph(country.summary),
      ...paragraph(country.whyStudentsChooseIt),
      ...(clean(country.climate) ? paragraph(`Climate: ${country.climate}`) : []),
    ]),
    ...advisorySection(input.countryAdvisory ?? null, null),
    ...section(
      "Universities",
      universityRows.length
        ? [
            "| University | City | Type | Courses | Markdown |",
            "| --- | --- | --- | --- | --- |",
            ...universityRows.map(
              ({ row, courses }) =>
                `| ${link(cell(row.name), getUniversityHref(row.slug))} | ${cell(row.city)} | ${cell(row.type)} | ${cell([...courses].join(", "))} | ${absoluteUrl(getUniversityMarkdownHref(row.slug))} |`,
            ),
          ]
        : [],
    ),
    ...counsellingSection(`studying in ${clean(country.name)}`),
  ];

  return `${lines.join("\n").trim()}\n`;
}

export function renderLandingPageMarkdown(input: {
  page: LandingPage;
  canonicalPath: string;
  country?: Pick<Country, "slug" | "name"> | null;
}) {
  const { page, country } = input;
  const lines = [
    ...header({
      title: page.title,
      summary: page.summary,
      canonicalPath: input.canonicalPath,
      reviewedAt: catalogReviewedAt,
    }),
    ...section("Highlights", bullets(page.heroHighlights)),
    ...section("Why students choose it", bullets(page.reasonsToChoose)),
    ...section(
      "At a glance",
      (page.atAGlance ?? []).length
        ? [
            "| Item | Detail |",
            "| --- | --- |",
            ...(page.atAGlance ?? []).map(
              (row) => `| ${cell(row.label)} | ${cell(row.value)} |`,
            ),
          ]
        : [],
    ),
    ...section("Eligibility", [
      ...paragraph(page.eligibility?.intro),
      ...bullets(page.eligibility?.items ?? []),
    ]),
    ...section(
      "Admission steps",
      (page.admissionSteps ?? []).map((step, index) => `${index + 1}. ${clean(step)}`),
    ),
    ...section("Hostel", paragraph(page.hostelInfo)),
    ...section("Scholarships", paragraph(page.scholarshipInfo)),
    ...section("Careers", bullets(page.careerOpportunities ?? [])),
    ...faqSection(page.faq),
    ...section(
      "Related pages",
      bullets([
        country ? link(`Universities in ${country.name}`, getCountryHref(country.slug)) : null,
        link("Course overview", getCourseHref(page.courseSlug)),
      ]),
    ),
    ...counsellingSection(country ? `studying in ${clean(country.name)}` : "this course"),
  ];

  return `${lines.join("\n").trim()}\n`;
}

export function renderGuideMarkdown(input: { guide: StudyAbroadGuidePageProps }) {
  const { guide } = input;
  const lines = [
    ...header({
      title: guide.title,
      summary: guide.summary,
      canonicalPath: guide.path,
      updatedLabel: guide.updatedOn,
    }),
    ...section("Key takeaways", bullets(guide.keyTakeaways)),
    ...guide.sections.flatMap((item) =>
      section(item.title, [
        ...(item.paragraphs ?? []).flatMap((text) => paragraph(text)),
        ...bullets(item.bullets ?? []),
        ...(item.bullets?.length ? [""] : []),
        ...(item.cards ?? []).flatMap((card) => [
          `### ${clean(card.title)}`,
          "",
          clean(card.body),
          "",
        ]),
        ...(item.table && item.table.headers.length
          ? [
              `| ${item.table.headers.map(cell).join(" | ")} |`,
              `| ${item.table.headers.map(() => "---").join(" | ")} |`,
              ...item.table.rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
              "",
              ...paragraph(item.table.note),
            ]
          : []),
      ]),
    ),
    ...paragraph(guide.notes),
    ...faqSection(guide.faqItems),
    ...counsellingSection("this destination and course"),
  ];

  return `${lines.join("\n").trim()}\n`;
}
