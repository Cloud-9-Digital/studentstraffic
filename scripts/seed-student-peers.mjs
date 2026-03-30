import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env") });

const sql = neon(process.env.DATABASE_URL);

// First fetch university IDs
const universities = await sql`
  SELECT id, name, slug
  FROM universities
  ORDER BY name
`;

console.log("Universities found:", universities.map(u => `[${u.id}] ${u.name}`).join("\n"));

// Pick a spread of universities
const bySlug = Object.fromEntries(universities.map(u => [u.slug, u.id]));

// Indian student seeds
// photo_url: randomuser.me portraits (allowed in next.config.ts)
const students = [
  {
    university_slug: universities[0]?.slug,
    full_name: "Arjun Mehta",
    course_name: "MBBS",
    current_year_or_batch: "3rd Year",
    contact_phone: "+919876500001",
    contact_email: "arjun.mehta@example.com",
    photo_url: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    university_slug: universities[1]?.slug,
    full_name: "Priya Sharma",
    course_name: "MBBS",
    current_year_or_batch: "2nd Year",
    contact_phone: "+919876500002",
    contact_email: "priya.sharma@example.com",
    photo_url: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    university_slug: universities[2]?.slug,
    full_name: "Rahul Gupta",
    course_name: "MBBS",
    current_year_or_batch: "4th Year",
    contact_phone: "+919876500003",
    contact_email: "rahul.gupta@example.com",
    photo_url: "https://randomuser.me/api/portraits/men/18.jpg",
  },
  {
    university_slug: universities[3]?.slug ?? universities[0]?.slug,
    full_name: "Sneha Patel",
    course_name: "MBBS",
    current_year_or_batch: "1st Year",
    contact_phone: "+919876500004",
    contact_email: "sneha.patel@example.com",
    photo_url: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    university_slug: universities[4]?.slug ?? universities[1]?.slug,
    full_name: "Karan Singh",
    course_name: "MBBS",
    current_year_or_batch: "5th Year",
    contact_phone: "+919876500005",
    contact_email: "karan.singh@example.com",
    photo_url: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    university_slug: universities[5]?.slug ?? universities[2]?.slug,
    full_name: "Ananya Nair",
    course_name: "MBBS",
    current_year_or_batch: "6th Year",
    contact_phone: "+919876500006",
    contact_email: "ananya.nair@example.com",
    photo_url: "https://randomuser.me/api/portraits/women/25.jpg",
  },
  {
    university_slug: universities[0]?.slug,
    full_name: "Vikram Reddy",
    course_name: "MBBS",
    current_year_or_batch: "Intern",
    contact_phone: "+919876500007",
    contact_email: "vikram.reddy@example.com",
    photo_url: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    university_slug: universities[1]?.slug,
    full_name: "Divya Krishnan",
    course_name: "MBBS",
    current_year_or_batch: "3rd Year",
    contact_phone: "+919876500008",
    contact_email: "divya.krishnan@example.com",
    photo_url: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    university_slug: universities[2]?.slug,
    full_name: "Aditya Joshi",
    course_name: "MD",
    current_year_or_batch: "2nd Year",
    contact_phone: "+919876500009",
    contact_email: "aditya.joshi@example.com",
    photo_url: "https://randomuser.me/api/portraits/men/62.jpg",
  },
  {
    university_slug: universities[3]?.slug ?? universities[0]?.slug,
    full_name: "Meera Iyer",
    course_name: "MBBS",
    current_year_or_batch: "Graduated",
    contact_phone: "+919876500010",
    contact_email: "meera.iyer@example.com",
    photo_url: "https://randomuser.me/api/portraits/women/37.jpg",
  },
];

let inserted = 0;
for (const s of students) {
  const uniId = bySlug[s.university_slug];
  if (!uniId) {
    console.warn(`  ⚠ University not found for slug: ${s.university_slug}`);
    continue;
  }

  await sql`
    INSERT INTO student_peers
      (university_id, full_name, photo_url, course_name, current_year_or_batch,
       contact_phone, contact_email, status)
    VALUES
      (${uniId}, ${s.full_name}, ${s.photo_url}, ${s.course_name},
       ${s.current_year_or_batch}, ${s.contact_phone}, ${s.contact_email}, 'active')
  `;
  console.log(`  ✓ Inserted ${s.full_name} → ${s.university_slug}`);
  inserted++;
}

console.log(`\nDone. Inserted ${inserted} student peers.`);
