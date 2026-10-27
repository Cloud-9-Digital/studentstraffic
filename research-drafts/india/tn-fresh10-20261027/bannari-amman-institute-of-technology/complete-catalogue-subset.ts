import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { catalogPayloadSchema } from '../../../../scripts/lib/catalog-payload-schema';
import { readContentMigrations } from '../../../../scripts/lib/content-migrations';
import { getCanonicalProgramme } from '../../../../lib/data/program-taxonomy';

// Local research validation only. No publisher, database, queue or network imports.
const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, '../../../..');
const checkedAt = '2026-10-27';
const syntheticId = '9999-isolated-bit-research-subset';
const sha = (value: string) => createHash('sha256').update(value).digest('hex');
const write = async (name: string, value: unknown) => fs.writeFile(path.join(dir, name), JSON.stringify(value, null, 2) + '\n');

async function main() {
  const draft = JSON.parse(await fs.readFile(path.join(dir, 'content-draft.json'), 'utf8'));
  const sourceEvidence = JSON.parse(await fs.readFile(path.join(dir, 'evidence.json'), 'utf8'));
  const sources = JSON.parse(await fs.readFile(path.join(dir, 'sources.json'), 'utf8'));
  const programmes = structuredClone(draft.programmeDrafts.filter((p: any) => p.durationYears === 4 && p.admissionsContent && p.audienceEligibility));
  if (programmes.length !== 10) throw new Error('Expected the independently reconciled ten regular UG branches.');
  const included = new Set(programmes.map((p: any) => p.slug));
  const courseSlugs = new Set<string>(programmes.map((p: any) => p.canonicalCourseSlug));
  const courseReferences = new Map<string, { course: any; file: string }>();
  const migrationRoot = path.join(root, 'content-migrations');
  for (const entry of (await fs.readdir(migrationRoot, { withFileTypes: true })).filter(e => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const file = path.join(migrationRoot, entry.name, 'payload.json');
    let historical: any;
    try { historical = JSON.parse(await fs.readFile(file, 'utf8')); } catch { continue; }
    for (const course of historical.courses ?? []) if (courseSlugs.has(course.slug)) courseReferences.set(course.slug, { course, file: path.relative(root, file) });
  }
  const courses = [...courseSlugs].map(slug => {
    const existing = courseReferences.get(slug);
    const canonical = getCanonicalProgramme(slug);
    if (!existing || !canonical) throw new Error(`Missing existing canonical course ${slug}`);
    // Shared catalogue course definitions only; never borrow an institution's offerings or facts.
    return { ...structuredClone(existing.course), ...canonical, aliases: [...canonical.aliases] };
  });
  const evidence = sourceEvidence.filter((e: any) => e.entity === 'university' || (e.programmeSlug && included.has(e.programmeSlug)));
  const mandatoryUrl = 'https://www.bitsathy.ac.in/wp-content/uploads/aicte-mandatory-disclosure.pdf';
  for (const p of programmes) {
    p.fee = {
      status: 'on_request', verifiedAt: checkedAt,
      notes: 'The 2026–27 institutional fee table distinguishes entry quota and NBA status, but does not isolate annual tuition for this exact branch and category. A current fee and full-cost plan is required; no annual amount or currency conversion is inferred.'
    };
    p.feeVerifiedAt = checkedAt;
    p.feeNotes = 'Annual tuition remains on request. The published institutional table uses quota and accreditation categories without an explicit billing period or tuition-only breakdown. Hostel, mess and other compulsory charges are not included in an invented total.';
    p.teachingPhases = [{ phase: 'Regular four-year undergraduate programme', language: 'English', details: 'English is used for instruction and academic activities, except courses specifically approved in Tamil under Regulations 2026.' }];
    p.audienceEligibility.notes = 'This candidate records only the evidenced TNEA 2026 academic-stream government-quota route. It does not establish a foreign/NRI or management-quota route, or availability of seats after the 2026 counselling cycle.';
    p.audienceEligibility.restrictions = [
      'Only the documented regular first-year academic-stream government-quota route is represented; management, foreign/NRI and lateral entry are not assessed here.',
      'TNEA schooling, nativity, community and applicant-category conditions apply. These 2026 rules do not establish a future-cycle admission offer.'
    ];
    p.admissionsContent.deadlinesNote = 'The eligibility record is for TNEA 2026, not a declaration that applications are currently open. No future intake date or application deadline is asserted.';
    evidence.push({
      entity: 'programme', universitySlug: draft.university.slug, programmeSlug: p.slug,
      publicField: 'fee', status: 'verified', sourceGrade: 'A', sourceUrl: mandatoryUrl,
      sourceLabel: 'BIT mandatory disclosure, fee table on printed page 13', checkedAt, reviewBy: '2027-01-27',
      claimText: 'Annual tuition is on request because the 2026–27 institutional fee table does not establish a tuition-only annual amount for this exact branch and accreditation category.',
      internalNotes: 'This verifies the editorial on-request decision, NOT absence of published fees. Preserve raw quota/NBA figures in official-fee-table.json. No billing period, currency label, branch NBA status or total is inferred; screenshot retrieval failed. Conflicting secondary full-course amounts are not annualised.'
    });
    evidence.push({
      entity: 'programme', universitySlug: draft.university.slug, programmeSlug: p.slug,
      publicField: 'audienceEligibility', status: 'verified', sourceGrade: 'A',
      sourceUrl: 'https://static.tneaonline.org/docs/2_Information_Brochure_2026.pdf',
      sourceLabel: 'TNEA 2026 information brochure, eligibility and nativity sections', checkedAt, reviewBy: '2027-01-27',
      claimText: 'This candidate covers only the TNEA 2026 academic-stream government-quota applicant categories and qualifying-examination conditions; it does not establish general international availability.',
      internalNotes: 'The source includes detailed Indian-national, schooling/nativity, eligible OCI/PIO and Sri Lankan Tamil refugee provisions. Do not simplify it to all Indian applicants, all international applicants, or a Tamil Nadu domicile-only rule. Complete international-status assessment remains held.'
    });
    evidence.push({
      entity: 'programme', universitySlug: draft.university.slug, programmeSlug: p.slug,
      publicField: 'admissions', status: 'verified', sourceGrade: 'A',
      sourceUrl: 'https://static.tneaonline.org/docs/2_Information_Brochure_2026.pdf',
      sourceLabel: 'TNEA 2026 information brochure, application and counselling process', checkedAt, reviewBy: '2027-01-27',
      claimText: 'TNEA uses online application, document verification, ranking, college/branch choices and allotment for its documented 2026 route.',
      internalNotes: 'Supports the counselling steps only. The separate BIT admissions evidence supports college joining documents. This is not proof that a particular branch currently has seats or that a later cycle is open.'
    });
  }
  const university = structuredClone(draft.university);
  university.programmes = programmes;
  university.mediaAttribution = {}; // Deliberately no fake media or placeholder Cloudinary URL.
  university.researchSources = sources.filter((s: any) => s.accessStatus === 'read' && s.sourceGrade === 'A').map((s: any) => ({
    label: s.label, url: s.url, checkedAt: s.checkedAt, notes: s.notes,
    kind: s.id === 'anna-register' ? 'recognition' : s.id === 'tnea2026' ? 'government' : s.id === 'mandatory' ? 'official-fee' : s.id.includes('regulations') || ['programmes', 'cse', 'ece', 'mech'].includes(s.id) ? 'official-program' : 'official-university'
  }));
  const payload = { countries: [], courses, universities: [university], evidence };
  const raw = JSON.stringify(payload, null, 2) + '\n';
  await fs.writeFile(path.join(dir, 'catalogue-subset-candidate.json'), raw);
  const result = catalogPayloadSchema.safeParse(payload);
  await write('catalogue-subset-schema-validation.json', {
    checkedAt: new Date().toISOString(), validator: 'catalogPayloadSchema.safeParse', success: result.success,
    issueCount: result.success ? 0 : result.error.issues.length, issues: result.success ? [] : result.error.issues,
    payloadSha256: sha(raw), programmeCount: programmes.length, courseCount: courses.length,
    publicationReady: false, editorialApproval: false,
    note: 'Real strict schema check of a held research subset. Required approval, audience and media gates are not implied by schema success.'
  });
  let temporaryRoot: string | undefined;
  let reader: any;
  try {
    temporaryRoot = await fs.mkdtemp(path.join(dir, '.isolated-reader-'));
    const bundleDir = path.join(temporaryRoot, syntheticId);
    await fs.mkdir(bundleDir);
    await fs.writeFile(path.join(bundleDir, 'payload.json'), raw);
    await fs.writeFile(path.join(bundleDir, 'manifest.json'), JSON.stringify({ version: 1, id: syntheticId, description: 'Isolated held BIT research subset: actual catalogue reader test, not a migration reservation.', createdAt: checkedAt, payload: 'payload.json' }, null, 2) + '\n');
    const migrations = await readContentMigrations(temporaryRoot, { onlyId: syntheticId, now: new Date() });
    reader = { success: true, migrationCount: migrations.length, programmeCount: migrations.reduce((n, m) => n + m.payload.universities.reduce((s, u) => s + u.programmes.length, 0), 0), courseCount: migrations[0]?.payload.courses.length ?? 0, evidenceCount: migrations[0]?.payload.evidence.length ?? 0, expiredEvidence: migrations.flatMap(m => m.expiredEvidence), checksum: migrations[0]?.checksum };
  } catch (error: any) {
    reader = { success: false, error: error?.message ?? String(error), issues: error?.issues ?? [] };
  } finally {
    if (temporaryRoot) await fs.rm(temporaryRoot, { recursive: true, force: true });
  }
  await write('catalogue-reader-validation.json', {
    checkedAt: new Date().toISOString(), validator: 'scripts/lib/content-migrations.ts:readContentMigrations',
    mode: 'Actual isolated reader, temporary research-local manifest; no numbered content-migrations folder, reservation, queue or database operation.',
    syntheticTestId: syntheticId, temporaryFixtureRemoved: true, payloadFile: 'catalogue-subset-candidate.json', payloadSha256: sha(raw),
    ...reader, publicationReady: false, editorialApproval: false, migrationReserved: false,
    missingExternalGates: ['Current AICTE regulator-owned programme approval', 'Complete per-programme applicant-category/international assessment beyond the restricted TNEA 2026 route', 'Mandatory logo/cover rights, HTTP/image/visual validation and approved hosting', 'Fresh identity/ledger check before eventual controlled publication'],
    scope: 'Ten evidenced regular UG candidates only. Four current PG routes lack exact eligibility and stay outside this subset; all doctoral, conflicting, embedded and historical rows remain explicitly held or excluded in the complete inventory.'
  });
  await write('catalogue-subset-crosswalk.json', {
    checkedAt, includedProgrammeSlugs: [...included],
    includedProgrammeEvidence: programmes.map((p: any) => ({ slug: p.slug, officialTitle: p.officialTitle, evidence: evidence.filter((e: any) => e.programmeSlug === p.slug).map((e: any) => ({ publicField: e.publicField, status: e.status, sourceGrade: e.sourceGrade, sourceUrl: e.sourceUrl })) })),
    excludedCurrentTaught: draft.programmeDrafts.filter((p: any) => !included.has(p.slug)).map((p: any) => ({ slug: p.slug, officialTitle: p.officialTitle, missing: p.missing })),
    heldDoctoralResearchAreas: draft.doctoralResearchAreaDrafts,
    courseDefinitionReferences: [...courseSlugs].map(slug => ({ slug, source: courseReferences.get(slug)!.file, scope: 'Shared canonical course metadata only; no institution-specific facts copied.' })),
    inventoryFile: 'programme-inventory.csv', wholePortfolioCompleteForPublication: false
  });
  console.log(JSON.stringify({ schemaSuccess: result.success, reader, publicationReady: false }, null, 2));
  if (!result.success || !reader.success) process.exitCode = 1;
}
main().catch(error => { console.error(error); process.exitCode = 1; });
