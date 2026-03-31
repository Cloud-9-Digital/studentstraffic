const { neon } = require('@neondatabase/serverless');
const { readFileSync } = require('fs');
const { join } = require('path');
const envContent = readFileSync(join(__dirname, '..', '.env'), 'utf8');
const env = Object.fromEntries(
  envContent.split('\n').filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')]; })
);

async function run() {
  const sql = neon(env.DATABASE_URL);
  const result = await sql`
    SELECT c.slug as country, u.slug as university, u.name 
    FROM universities u
    JOIN countries c ON u.country_id = c.id
    WHERE c.slug IN ('russia', 'georgia', 'kyrgyzstan', 'kazakhstan')
    ORDER BY c.slug, u.name
  `;
  console.log(JSON.stringify(result, null, 2));
}
run();
