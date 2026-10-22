import { siteConfig } from "@/lib/constants";
import { catalogReviewedAt } from "@/lib/content-governance";
import type {
  CountryRegulatoryAdvisory,
  UniversityRegulatoryAdvisory,
} from "@/lib/data/regulatory-advisories";
import type {
  Country,
  FinderProgram,
  ResearchSource,
  University,
} from "@/lib/data/types";
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
  formatProgramDuration,
  formatProgramMedium,
  hasOfficialFeeAmount,
  hasPublishedUsdAmount,
} from "@/lib/utils";

/**
 * Markdown views of university and programme pages for AI agents and answer
 * engines (`/university/{slug}.md`, `/{programme}.md`). They carry the same
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

function counsellingSection() {
  return section("Free counselling", [
    `${siteConfig.name} offers free admission counselling for this university and its programmes.`,
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
  reviewedAt: string;
}) {
  return [
    `# ${clean(input.title)}`,
    "",
    ...(clean(input.summary) ? [`> ${clean(input.summary)}`, ""] : []),
    `- Canonical page: ${absoluteUrl(input.canonicalPath)}`,
    `- Last reviewed: ${input.reviewedAt.slice(0, 10)}`,
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
  const fee = formatProgramAnnualFee(offering);
  const official = formatOfficialAnnualFee(program);
  const qualifiers = [
    offering.feeStatus === "indicative" ? "indicative" : null,
    official && official !== fee ? `official: ${official}` : null,
    offering.feeAcademicYear ? clean(offering.feeAcademicYear) : null,
  ].filter(Boolean);
  return qualifiers.length ? `${fee} (${qualifiers.join("; ")})` : fee;
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
            "| Programme | Course | Duration | Medium | Annual tuition |",
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
        `Annual tuition: ${formatAnnualFeeLine(program)}`,
        hasPublishedUsdAmount(offering.totalTuitionUsd)
          ? `Total tuition: ${formatCurrencyUsd(offering.totalTuitionUsd)}`
          : null,
        hasPublishedUsdAmount(offering.livingUsd)
          ? `Estimated living cost: ${formatCurrencyUsd(offering.livingUsd)} per year`
          : null,
        offering.feeVerifiedAt ? `Fee verified: ${offering.feeVerifiedAt.slice(0, 10)}` : null,
        offering.intakeMonths.length ? `Intake: ${offering.intakeMonths.join(", ")}` : null,
        offering.professionalExamSupport.length
          ? `Licensing exam support: ${offering.professionalExamSupport.join(", ")}`
          : null,
        offering.officialProgramUrl ? `Official programme page: ${offering.officialProgramUrl}` : null,
      ]),
    ]),
    ...paragraph(offering.feeNotes ? `Fee notes: ${offering.feeNotes}` : null),
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

export function markdownResponse(body: string, canonicalPath: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // The HTML page is the indexable original; this view points back to it.
      Link: `<${absoluteUrl(canonicalPath)}>; rel="canonical"`,
      Vary: "Accept",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

export function markdownNotFound() {
  return new Response("# Not found\n", {
    status: 404,
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
