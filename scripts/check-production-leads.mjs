import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

console.log('🔍 Checking recent production leads...\n');

const leads = await sql`
  SELECT
    id,
    full_name,
    phone,
    seminar_event,
    interested_country,
    needs_fmge_session,
    source_path,
    crm_sync_status,
    crm_sync_error,
    crm_external_id,
    created_at
  FROM leads
  WHERE created_at > NOW() - INTERVAL '2 hours'
  ORDER BY created_at DESC
  LIMIT 10
`;

if (leads.length === 0) {
  console.log('❌ No leads created in the last 2 hours');
  process.exit(0);
}

console.log(`✅ Found ${leads.length} recent lead(s):\n`);

leads.forEach((lead, index) => {
  console.log(`Lead #${index + 1}:`);
  console.log(`  ID: ${lead.id}`);
  console.log(`  Name: ${lead.full_name}`);
  console.log(`  Phone: ${lead.phone}`);
  console.log(`  Source Path: ${lead.source_path}`);
  console.log(`  Seminar Event: ${lead.seminar_event || 'N/A'}`);
  console.log(`  Country: ${lead.interested_country || 'N/A'}`);
  console.log(`  Needs FMGE: ${lead.needs_fmge_session ? 'Yes' : 'No'}`);
  console.log(`  CRM Sync: ${lead.crm_sync_status}`);

  if (lead.crm_sync_status === 'failed') {
    console.log(`  ❌ Sync Error: ${lead.crm_sync_error}`);
  } else if (lead.crm_sync_status === 'synced') {
    console.log(`  ✅ CRM Lead ID: ${lead.crm_external_id}`);
  } else if (lead.crm_sync_status === 'skipped') {
    console.log(`  ⚠️  Sync was skipped - check CRM configuration`);
  } else if (lead.crm_sync_status === 'pending') {
    console.log(`  ⏳ Sync is pending`);
  }

  console.log(`  Created: ${lead.created_at}`);
  console.log('');
});

// Check environment configuration
console.log('\n📋 Environment Configuration:');
console.log(`  CRM_LEAD_INTAKE_URL: ${process.env.CRM_LEAD_INTAKE_URL || '❌ NOT SET'}`);
console.log(`  CRM_LEAD_INTAKE_SECRET: ${process.env.CRM_LEAD_INTAKE_SECRET ? '✅ SET' : '❌ NOT SET'}`);

if (!process.env.CRM_LEAD_INTAKE_URL || !process.env.CRM_LEAD_INTAKE_SECRET) {
  console.log('\n⚠️  CRM sync is disabled because environment variables are not configured');
}
