import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL);

// Fetch Indian portraits from randomuser.me (nat=in gives Indian-looking photos)
console.log("Fetching Indian portraits from randomuser.me...");
const res = await fetch(
  "https://randomuser.me/api/?nat=in&results=60&inc=name,picture,gender&seed=studentstraffic2026"
);
const { results: randUsers } = await res.json();

// Separate into men/women pools
const menPhotos = randUsers.filter(u => u.gender === "male").map(u => u.picture.large);
const womenPhotos = randUsers.filter(u => u.gender === "female").map(u => u.picture.large);
console.log(`Got ${menPhotos.length} male photos, ${womenPhotos.length} female photos`);

// Fetch existing students to update their photos too
const existing = await sql`SELECT id, contact_phone FROM student_peers`;
const existingPhones = new Set(existing.map(p => p.contact_phone));

// Fetch university IDs
const universities = await sql`SELECT id, name, slug FROM universities ORDER BY name`;
const bySlug = Object.fromEntries(universities.map(u => [u.slug, u.id]));

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "6th Year", "Intern", "Graduated"];

// Indian student data — Indian names, spread across universities
const students = [
  // Vietnam universities
  { slug: "hanoi-medical-university",            name: "Aarav Sharma",        gender: "m", year: "2nd Year",  phone: "+919800600101" },
  { slug: "hanoi-medical-university",            name: "Ishita Verma",        gender: "f", year: "4th Year",  phone: "+919800600102" },
  { slug: "hanoi-medical-university",            name: "Rohan Kapoor",        gender: "m", year: "1st Year",  phone: "+919800600103" },
  { slug: "ump-ho-chi-minh-city",                name: "Kavya Nair",          gender: "f", year: "3rd Year",  phone: "+919800600104" },
  { slug: "ump-ho-chi-minh-city",                name: "Devansh Patel",       gender: "m", year: "5th Year",  phone: "+919800600105" },
  { slug: "ump-ho-chi-minh-city",                name: "Shreya Menon",        gender: "f", year: "Intern",    phone: "+919800600106" },
  { slug: "pham-ngoc-thach-university-medicine", name: "Aryan Malhotra",      gender: "m", year: "2nd Year",  phone: "+919800600107" },
  { slug: "pham-ngoc-thach-university-medicine", name: "Tanvi Joshi",         gender: "f", year: "6th Year",  phone: "+919800600108" },
  { slug: "pham-ngoc-thach-university-medicine", name: "Nikhil Reddy",        gender: "m", year: "3rd Year",  phone: "+919800600109" },
  { slug: "hue-university-medicine-pharmacy",    name: "Pranjal Agarwal",     gender: "m", year: "4th Year",  phone: "+919800600110" },
  { slug: "hue-university-medicine-pharmacy",    name: "Aishwarya Singh",     gender: "f", year: "1st Year",  phone: "+919800600111" },
  { slug: "duy-tan-university-faculty-of-medicine", name: "Siddharth Rao",   gender: "m", year: "5th Year",  phone: "+919800600112" },
  { slug: "duy-tan-university-faculty-of-medicine", name: "Pooja Pillai",    gender: "f", year: "2nd Year",  phone: "+919800600113" },
  { slug: "can-tho-university-medicine-pharmacy",   name: "Karthik Iyer",    gender: "m", year: "3rd Year",  phone: "+919800600114" },
  { slug: "can-tho-university-medicine-pharmacy",   name: "Riya Bhat",       gender: "f", year: "Graduated", phone: "+919800600115" },
  { slug: "thai-nguyen-university-medicine-pharmacy", name: "Manish Kumar",  gender: "m", year: "4th Year",  phone: "+919800600116" },
  { slug: "thai-nguyen-university-medicine-pharmacy", name: "Neha Chowdhury",gender: "f", year: "1st Year",  phone: "+919800600117" },
  { slug: "thai-binh-university-medicine-pharmacy",   name: "Aakash Yadav",  gender: "m", year: "2nd Year",  phone: "+919800600118" },
  { slug: "thai-binh-university-medicine-pharmacy",   name: "Simran Gill",   gender: "f", year: "5th Year",  phone: "+919800600119" },
  { slug: "vinuniversity-college-health-sciences",    name: "Tarun Mehta",   gender: "m", year: "3rd Year",  phone: "+919800600120" },
  { slug: "vinuniversity-college-health-sciences",    name: "Aditi Dubey",   gender: "f", year: "Intern",    phone: "+919800600121" },
  { slug: "phenikaa-university-faculty-of-medicine",  name: "Varun Nambiar", gender: "m", year: "4th Year",  phone: "+919800600122" },
  { slug: "phenikaa-university-faculty-of-medicine",  name: "Pallavi Shetty",gender: "f", year: "2nd Year",  phone: "+919800600123" },
  { slug: "dong-a-university-college-of-medicine",    name: "Mihir Desai",   gender: "m", year: "1st Year",  phone: "+919800600124" },
  { slug: "dong-a-university-college-of-medicine",    name: "Anushka Goswami",gender:"f", year: "6th Year",  phone: "+919800600125" },
  { slug: "da-nang-university-medical-technology-pharmacy", name: "Rishabh Tiwari", gender: "m", year: "3rd Year", phone: "+919800600126" },
  { slug: "da-nang-university-medical-technology-pharmacy", name: "Bhavna Sharma",  gender: "f", year: "4th Year", phone: "+919800600127" },
  { slug: "dai-nam-university-faculty-of-medicine",   name: "Pranav Mishra", gender: "m", year: "5th Year",  phone: "+919800600128" },
  { slug: "hai-phong-university-medicine-pharmacy",   name: "Swati Rajan",   gender: "f", year: "2nd Year",  phone: "+919800600129" },
  { slug: "hai-phong-university-medicine-pharmacy",   name: "Akshay Pandey", gender: "m", year: "Intern",    phone: "+919800600130" },
  { slug: "nam-can-tho-university-faculty-of-medicine", name: "Priya Krishnamurthy", gender: "f", year: "3rd Year", phone: "+919800600131" },
  { slug: "nam-can-tho-university-faculty-of-medicine", name: "Vivek Chauhan", gender: "m", year: "1st Year", phone: "+919800600132" },
  { slug: "tra-vinh-university-medicine-pharmacy",    name: "Nandini Kulkarni",gender:"f", year: "4th Year",  phone: "+919800600133" },
  { slug: "tay-nguyen-university-medicine-pharmacy",  name: "Harsh Bansal",  gender: "m", year: "2nd Year",  phone: "+919800600134" },
  { slug: "tan-tao-university-school-of-medicine",    name: "Sakshi Jain",   gender: "f", year: "5th Year",  phone: "+919800600135" },
  { slug: "tan-tao-university-school-of-medicine",    name: "Abhishek Varma",gender: "m", year: "6th Year",  phone: "+919800600136" },
  { slug: "phan-chau-trinh-university",               name: "Divya Suresh",  gender: "f", year: "Intern",    phone: "+919800600137" },
  { slug: "buon-ma-thuot-medical-university",         name: "Gaurav Thakur", gender: "m", year: "3rd Year",  phone: "+919800600138" },
  { slug: "buon-ma-thuot-medical-university",         name: "Meghna Bose",   gender: "f", year: "2nd Year",  phone: "+919800600139" },
  { slug: "nguyen-tat-thanh-university-medicine",     name: "Yash Awasthi",  gender: "m", year: "1st Year",  phone: "+919800600140" },
  // Russia/Georgia/Kyrgyzstan universities
  { slug: "kazan-state-medical-university",           name: "Roshni Nair",   gender: "f", year: "4th Year",  phone: "+919800600141" },
  { slug: "kazan-state-medical-university",           name: "Sameer Ahuja",  gender: "m", year: "3rd Year",  phone: "+919800600142" },
  { slug: "altai-state-medical-university",           name: "Kritika Saxena",gender: "f", year: "2nd Year",  phone: "+919800600143" },
  { slug: "altai-state-medical-university",           name: "Shubham Gupta", gender: "m", year: "5th Year",  phone: "+919800600144" },
  { slug: "bashkir-state-medical-university",         name: "Amrita Choudhary",gender:"f",year: "1st Year",  phone: "+919800600145" },
  { slug: "bashkir-state-medical-university",         name: "Rohit Sharma",  gender: "m", year: "Intern",    phone: "+919800600146" },
  { slug: "astrakhan-state-medical-university",       name: "Anjali Tripathi",gender:"f", year: "4th Year",  phone: "+919800600147" },
  { slug: "astrakhan-state-medical-university",       name: "Kunal Batra",   gender: "m", year: "3rd Year",  phone: "+919800600148" },
  { slug: "privolzhsky-research-medical-university",  name: "Snehal Patil",  gender: "f", year: "6th Year",  phone: "+919800600149" },
  { slug: "privolzhsky-research-medical-university",  name: "Ankush Singh",  gender: "m", year: "2nd Year",  phone: "+919800600150" },
  { slug: "georgian-national-university-seu",         name: "Deepika Rao",   gender: "f", year: "5th Year",  phone: "+919800600151" },
  { slug: "georgian-national-university-seu",         name: "Chirag Patel",  gender: "m", year: "4th Year",  phone: "+919800600152" },
  { slug: "east-european-university",                 name: "Richa Verma",   gender: "f", year: "1st Year",  phone: "+919800600153" },
  { slug: "east-european-university",                 name: "Parth Joshi",   gender: "m", year: "3rd Year",  phone: "+919800600154" },
  { slug: "asian-medical-institute",                  name: "Preeti Rawat",  gender: "f", year: "2nd Year",  phone: "+919800600155" },
  { slug: "asian-medical-institute",                  name: "Aman Khanna",   gender: "m", year: "Graduated", phone: "+919800600156" },
  { slug: "international-school-of-medicine",         name: "Jyoti Reddy",   gender: "f", year: "4th Year",  phone: "+919800600157" },
  { slug: "international-school-of-medicine",         name: "Tushar Negi",   gender: "m", year: "5th Year",  phone: "+919800600158" },
  // Georgia & Uzbekistan
  { slug: "alte-university",                          name: "Heena Mathur",  gender: "f", year: "3rd Year",  phone: "+919800600159" },
  { slug: "alte-university",                          name: "Kshitij Arora", gender: "m", year: "Intern",    phone: "+919800600160" },
  { slug: "caucasus-international-university",        name: "Vandana Mishra",gender: "f", year: "2nd Year",  phone: "+919800600161" },
  { slug: "caucasus-international-university",        name: "Aditya Bhatt",  gender: "m", year: "1st Year",  phone: "+919800600162" },
  { slug: "bau-international-university-batumi",      name: "Shalini Kaur",  gender: "f", year: "5th Year",  phone: "+919800600163" },
  { slug: "bau-international-university-batumi",      name: "Nihal Srivastava",gender:"m",year: "4th Year",  phone: "+919800600164" },
  { slug: "adam-university",                          name: "Rekha Pillai",  gender: "f", year: "3rd Year",  phone: "+919800600165" },
  { slug: "adam-university",                          name: "Sumit Bisht",   gender: "m", year: "6th Year",  phone: "+919800600166" },
  { slug: "andijan-state-medical-institute",          name: "Prerna Dixit",  gender: "f", year: "2nd Year",  phone: "+919800600167" },
  { slug: "andijan-state-medical-institute",          name: "Sahil Mehra",   gender: "m", year: "1st Year",  phone: "+919800600168" },
  { slug: "bukhara-state-medical-institute-abu-ali-ibn-sino", name: "Disha Tomar", gender: "f", year: "4th Year", phone: "+919800600169" },
  { slug: "bukhara-state-medical-institute-abu-ali-ibn-sino", name: "Arun Nair",   gender: "m", year: "3rd Year", phone: "+919800600170" },
  { slug: "central-asian-university-medical-school",  name: "Shweta Deshmukh",gender:"f",year: "5th Year",  phone: "+919800600171" },
  { slug: "central-asian-university-medical-school",  name: "Vikas Choudhury",gender:"m",year: "2nd Year",  phone: "+919800600172" },
  { slug: "international-higher-school-of-medicine",  name: "Rashmi Kothari",gender: "f", year: "Intern",    phone: "+919800600173" },
  { slug: "international-higher-school-of-medicine",  name: "Hemant Saini",  gender: "m", year: "4th Year",  phone: "+919800600174" },
  { slug: "osh-state-university",                     name: "Archana Bhosale",gender:"f", year: "3rd Year",  phone: "+919800600175" },
  { slug: "osh-state-university",                     name: "Lakshay Goel",  gender: "m", year: "1st Year",  phone: "+919800600176" },
];

// Assign photo URLs from the Indian portrait pools
let mIdx = 0, fIdx = 0;
const studentsWithPhotos = students.map(s => ({
  ...s,
  photo: s.gender === "m"
    ? (menPhotos[mIdx++ % menPhotos.length])
    : (womenPhotos[fIdx++ % womenPhotos.length]),
}));

// Update existing students with Indian photos
console.log("\nUpdating existing students with Indian photos...");
let updIdx = 0;
for (const row of existing) {
  const photo = updIdx % 2 === 0
    ? menPhotos[Math.floor(updIdx / 2) % menPhotos.length]
    : womenPhotos[Math.floor(updIdx / 2) % womenPhotos.length];
  await sql`UPDATE student_peers SET photo_url = ${photo} WHERE id = ${row.id}`;
  console.log(`  ✓ Updated existing id=${row.id}`);
  updIdx++;
}

// Insert new students
let inserted = 0, skipped = 0;
for (const s of studentsWithPhotos) {
  if (existingPhones.has(s.phone)) {
    console.log(`  ↷ Skip (duplicate phone): ${s.name}`);
    skipped++;
    continue;
  }
  const uniId = bySlug[s.slug];
  if (!uniId) {
    console.warn(`  ⚠ University not found: ${s.slug}`);
    skipped++;
    continue;
  }
  const email = `${s.name.toLowerCase().replace(/\s+/g, ".")}@example.com`;
  await sql`
    INSERT INTO student_peers
      (university_id, full_name, photo_url, course_name, current_year_or_batch,
       contact_phone, contact_email, status)
    VALUES
      (${uniId}, ${s.name}, ${s.photo}, 'MBBS', ${s.year},
       ${s.phone}, ${email}, 'active')
  `;
  console.log(`  ✓ ${s.name} → ${s.slug} (${s.year})`);
  inserted++;
}

console.log(`\nDone. Updated ${updIdx} existing, inserted ${inserted}, skipped ${skipped}.`);
