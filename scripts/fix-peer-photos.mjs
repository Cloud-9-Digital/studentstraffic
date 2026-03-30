import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL);

// Fetch Indian portraits with correct gender via separate API calls
console.log("Fetching Indian male portraits...");
const mRes = await fetch("https://randomuser.me/api/?nat=in&gender=male&results=60&inc=picture");
const { results: mUsers } = await mRes.json();
const menPhotos = mUsers.map(u => u.picture.large);

console.log("Fetching Indian female portraits...");
const fRes = await fetch("https://randomuser.me/api/?nat=in&gender=female&results=60&inc=picture");
const { results: fUsers } = await fRes.json();
const womenPhotos = fUsers.map(u => u.picture.large);

console.log(`Got ${menPhotos.length} male photos, ${womenPhotos.length} female photos`);

// Common Indian first names → gender mapping
const femaleNames = new Set([
  "priya","sneha","ananya","divya","meera","ishita","kavya","shreya","tanvi","aishwarya",
  "pooja","riya","neha","simran","aditi","pallavi","bhavna","swati","nandini","sakshi",
  "disha","prerna","anjali","kritika","amrita","deepika","richa","preeti","jyoti","rashmi",
  "heena","vandana","shalini","rekha","archana","shweta","roshni","snehal","anushka","meghna",
  "bhavna","aarti","priyanka","sonal","sonali","manisha","nisha","poornima","sunita","geeta",
  "reena","seema","vinita","namita","shilpa","sweta","poonam","komal","monika","sapna",
]);

function isFemale(fullName) {
  const first = fullName.split(" ")[0].toLowerCase();
  return femaleNames.has(first);
}

// Fetch all students
const students = await sql`SELECT id, full_name FROM student_peers ORDER BY id`;
console.log(`\nUpdating ${students.length} students with gender-matched Indian photos...\n`);

let mIdx = 0, fIdx = 0;
for (const s of students) {
  const female = isFemale(s.full_name);
  const photo = female
    ? womenPhotos[fIdx++ % womenPhotos.length]
    : menPhotos[mIdx++ % menPhotos.length];
  await sql`UPDATE student_peers SET photo_url = ${photo} WHERE id = ${s.id}`;
  console.log(`  ✓ ${s.full_name} [${female ? "F" : "M"}] → ${photo}`);
}

console.log(`\nDone. Updated ${students.length} students (${mIdx} male, ${fIdx} female photos).`);
