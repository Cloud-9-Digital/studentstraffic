import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import capturePayloadModule from '../lib/crm-capture-payload.ts';

const { buildCrmCapturePayload } = capturePayloadModule;

const sql = neon(process.env.DATABASE_URL);
const leadId = process.argv[2];

if (!leadId) {
  console.error('❌ Usage: node --import tsx scripts/manual-sync-lead.mjs <lead_id>');
  process.exit(1);
}

console.log(`🔄 Syncing lead ID: ${leadId} to CRM...\n`);

// Get lead data
const [lead] = await sql`
  SELECT * FROM leads WHERE id = ${leadId}
`;

if (!lead) {
  console.error(`❌ Lead ${leadId} not found`);
  process.exit(1);
}

console.log(`📋 Lead: ${lead.full_name} (${lead.phone})`);

// Prepare payload
const payload = {
  websiteLeadId: lead.id,
  submittedAt: lead.created_at?.toISOString(),
  fullName: lead.full_name,
  phone: lead.phone,
  email: lead.email,
  fatherName: lead.father_name,
  alternatePhone: lead.alternate_phone,
  city: lead.city,
  seminarEvent: lead.seminar_event,
  seminarAttendeeCount: lead.seminar_attendee_count,
  interestedCountry: lead.interested_country,
  budgetRange: lead.budget_range,
  needsFmgeSession: lead.needs_fmge_session,
  documentUrl: lead.document_url,
  documentType: lead.document_type,
  userState: lead.user_state,
  neetScore: lead.neet_score,
  neetCategory: lead.neet_category,
  courseSlug: lead.course_slug,
  countrySlug: lead.country_slug,
  universitySlug: lead.university_slug,
  sourcePath: lead.source_path,
  sourceUrl: lead.source_url,
  sourceQuery: lead.source_query || {},
  pageTitle: lead.page_title,
  ctaVariant: lead.cta_variant,
  notes: lead.notes,
  documentReferrer: lead.document_referrer,
  utmSource: lead.utm_source,
  utmMedium: lead.utm_medium,
  utmCampaign: lead.utm_campaign,
  utmTerm: lead.utm_term,
  utmContent: lead.utm_content,
  referrer: lead.referrer,
  userAgent: lead.user_agent,
  ipAddress: lead.ip_address,
  acceptLanguage: lead.accept_language,
  clientContext: lead.client_context || {},
};

// Sync to CRM
const crmUrl = process.env.CRM_LEAD_INTAKE_URL;
const crmSecret = process.env.CRM_LEAD_INTAKE_SECRET;
const crmApiKey = process.env.CRM_API_KEY?.trim();

if (!crmApiKey && (!crmUrl || !crmSecret)) {
  console.error('❌ CRM_API_KEY or legacy CRM_LEAD_INTAKE_URL and CRM_LEAD_INTAKE_SECRET not configured');
  process.exit(1);
}

const endpoint = crmApiKey
  ? `${(process.env.CRM_API_URL || 'https://app.marro.si').replace(/\/+$/, '')}/api/v1/leads/capture`
  : crmUrl;
console.log(`\n🚀 Sending to CRM: ${endpoint}`);

try {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(crmApiKey
        ? { Authorization: `Bearer ${crmApiKey}`, 'Idempotency-Key': `studentstraffic:${lead.id}` }
        : { 'x-lead-intake-secret': crmSecret }),
    },
    body: JSON.stringify(crmApiKey ? buildCrmCapturePayload(payload) : payload),
  });

  const result = await response.json();
  const crmLeadId = crmApiKey ? result.lead?.id : result.leadId;

  if (!response.ok) {
    const reason = crmApiKey ? result.error?.message : result.error;
    const code = crmApiKey ? result.error?.code : result.code;
    const retryable = crmApiKey
      ? ![400, 401, 403, 404, 413, 422].includes(response.status)
      : result.retryable !== false;
    console.error(`❌ CRM sync failed: ${code ? `${code}: ` : ''}${reason || `HTTP ${response.status}`}`);

    // Update lead with error
    await sql`
      UPDATE leads
      SET
        crm_sync_status = ${retryable ? 'failed' : 'rejected'},
        crm_sync_error = ${`${code ? `${code}: ` : ''}${reason || `HTTP ${response.status}`}`.slice(0, 500)},
        crm_synced_at = NULL,
        crm_external_id = NULL
      WHERE id = ${leadId}
    `;

    process.exit(1);
  }

  if (!Number.isSafeInteger(crmLeadId) || crmLeadId < 1) {
    throw new Error('CRM response did not include a valid lead ID.');
  }

  console.log('\n✅ CRM sync successful!');
  console.log(`   Created: ${crmApiKey ? result.lead?.created : result.created}`);
  console.log(`   Updated: ${crmApiKey ? result.lead?.updated : result.updated}`);
  console.log(`   CRM Lead ID: ${crmLeadId}`);

  // Update lead with success
  await sql`
    UPDATE leads
    SET
      crm_sync_status = 'synced',
      crm_synced_at = NOW(),
      crm_external_id = ${crmLeadId.toString()},
      crm_sync_error = NULL
    WHERE id = ${leadId}
  `;

  console.log('\n✅ Website lead updated with sync status');

} catch (error) {
  console.error('❌ Sync error:', error.message);

  await sql`
    UPDATE leads
    SET
      crm_sync_status = 'failed',
      crm_sync_error = ${error.message}
    WHERE id = ${leadId}
  `;

  process.exit(1);
}
