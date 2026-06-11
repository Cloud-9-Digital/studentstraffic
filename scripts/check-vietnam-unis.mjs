import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";
dotenv.config();
neonConfig.webSocketConstructor = WebSocket;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();
try {
  const { rows: countries } = await client.query(`SELECT id, name FROM countries WHERE LOWER(name) = 'vietnam'`);
  console.log("Vietnam country:", countries);
  const { rows: unis } = await client.query(`
    SELECT u.id, u.slug, u.name, u.published
    FROM universities u
    WHERE u.country_id = $1
    ORDER BY u.name
  `, [countries[0]?.id]);
  console.log(`\nVietnam universities (${unis.length}):`);
  unis.forEach(u => console.log(`  [${u.published ? 'pub' : '---'}] ${u.slug}`));
  const { rows: courses } = await client.query(`SELECT id, slug, name FROM courses WHERE name ILIKE '%medicine%' OR slug LIKE '%medic%' LIMIT 5`);
  console.log("\nCourses:", courses);
} finally {
  client.release();
  await pool.end();
}
