import { getDb } from "./lib/db/server";
import { universities, countries } from "./lib/db/schema";
import { eq } from "drizzle-orm";

async function run() {
  const db = getDb();
  if(!db) { console.error("No db"); return; }
  const res = await db.select({ slug: universities.slug, name: universities.name })
      .from(universities)
      .innerJoin(countries, eq(universities.countryId, countries.id))
      .where(eq(countries.slug, "uzbekistan"));
  console.log("Universities in Uzbekistan:", res);
  process.exit(0);
}
run();
