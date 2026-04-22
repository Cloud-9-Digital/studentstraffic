import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);
const leadId = process.argv[2];

if (!leadId) {
  console.error('❌ Usage: node scripts/manual-sync-lead.mjs <lead_id>');
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
  interestedCountry: lead.interested_country,
  budgetRange: lead.budget_range,
  needsFmgeSession: lead.needs_fmge_session,
  documentUrl: lead.document_url,
  documentType: lead.document_type,
  userState: lead.user_state,
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

if (!crmUrl || !crmSecret) {
  console.error('❌ CRM_LEAD_INTAKE_URL or CRM_LEAD_INTAKE_SECRET not configured');
  process.exit(1);
}

console.log(`\n🚀 Sending to CRM: ${crmUrl}`);

try {
  const response = await fetch(crmUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-lead-intake-secret': crmSecret,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error(`❌ CRM sync failed: ${result.error || 'Unknown error'}`);

    // Update lead with error
    await sql`
      UPDATE leads
      SET
        crm_sync_status = 'failed',
        crm_sync_error = ${result.error || 'Unknown error'}
      WHERE id = ${leadId}
    `;

    process.exit(1);
  }

  console.log('\n✅ CRM sync successful!');
  console.log(`   Created: ${result.created}`);
  console.log(`   Updated: ${result.updated}`);
  console.log(`   CRM Lead ID: ${result.leadId}`);

  // Update lead with success
  await sql`
    UPDATE leads
    SET
      crm_sync_status = 'synced',
      crm_synced_at = NOW(),
      crm_external_id = ${result.leadId?.toString()}
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
