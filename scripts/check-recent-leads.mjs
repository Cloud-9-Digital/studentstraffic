import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

console.log('🔍 Checking recent leads from website database...\n');

const leads = await sql`
  SELECT
    id,
    full_name,
    phone,
    seminar_event,
    interested_country,
    needs_fmge_session,
    document_url,
    crm_sync_status,
    crm_sync_error,
    crm_external_id,
    created_at
  FROM leads
  ORDER BY created_at DESC
  LIMIT 5
`;

if (leads.length === 0) {
  console.log('❌ No leads found in database');
} else {
  console.log(`✅ Found ${leads.length} recent leads:\n`);

  leads.forEach((lead, index) => {
    console.log(`Lead #${index + 1}:`);
    console.log(`  ID: ${lead.id}`);
    console.log(`  Name: ${lead.full_name}`);
    console.log(`  Phone: ${lead.phone}`);
    console.log(`  Seminar Event: ${lead.seminar_event || 'N/A'}`);
    console.log(`  Country: ${lead.interested_country || 'N/A'}`);
    console.log(`  Needs FMGE Session: ${lead.needs_fmge_session ? 'Yes' : 'No'}`);
    console.log(`  Document: ${lead.document_url ? 'Yes' : 'No'}`);
    console.log(`  CRM Sync Status: ${lead.crm_sync_status}`);
    console.log(`  CRM External ID: ${lead.crm_external_id || 'N/A'}`);
    console.log(`  CRM Sync Error: ${lead.crm_sync_error || 'N/A'}`);
    console.log(`  Created: ${lead.created_at}`);
    console.log('');
  });
}
