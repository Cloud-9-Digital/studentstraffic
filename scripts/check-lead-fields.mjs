import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

console.log('🔍 Checking recent lead fields...\n');

const leads = await sql`
  SELECT
    id,
    full_name,
    phone,
    city,
    seminar_event,
    notes,
    source_path,
    cta_variant,
    created_at
  FROM leads
  ORDER BY created_at DESC
  LIMIT 3
`;

if (leads.length === 0) {
  console.log('❌ No leads found');
} else {
  console.log(`✅ Found ${leads.length} recent leads:\n`);

  for (const lead of leads) {
    console.log(`Lead #${lead.id} - ${lead.full_name}`);
    console.log(`  Phone: ${lead.phone}`);
    console.log(`  City: ${lead.city || '(null)'}`);
    console.log(`  Seminar Event: ${lead.seminar_event || '(null)'}`);
    console.log(`  Source Path: ${lead.source_path}`);
    console.log(`  CTA Variant: ${lead.cta_variant}`);
    console.log(`  Notes: ${lead.notes ? lead.notes.substring(0, 100) + '...' : '(null)'}`);
    console.log(`  Created: ${lead.created_at}\n`);
  }
}
