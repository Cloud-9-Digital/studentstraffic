
import { v2 as cloudinary } from "cloudinary";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import readingTime from 'reading-time';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Required for neon serverless in node environment
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const blogsExtra = JSON.parse(fs.readFileSync('/tmp/blogs_enriched.json', 'utf8'));

const posts = [
  {
    slug: 'mbbs-in-uzbekistan-2026-complete-guide',
    title: 'MBBS in Uzbekistan 2026: The Definitive Guide for Indian Students',
    category: 'MBBS Abroad',
    excerpt: 'Is Uzbekistan the new Russia? An exhaustive analysis of fees, NMC compliance, and the Silicon Valley-style modernization of Uzbek medical education.',
    meta_title: 'MBBS in Uzbekistan 2026: Fees, NMC Rules & Expert Guide',
    meta_description: 'Considering MBBS in Uzbekistan? Get the definitive guide on 2026 fees, admission process, and reality checks for Indian students.',
    cover_image: 'studentstraffic/blog/mbbs-uzbekistan-2026',
    local_image: '/Users/bharat/.gemini/antigravity/brain/576f9bd3-16af-43aa-9821-24bb2ad2f05c/mbbs_uzbekistan_2026_hero_1774978199820.png',
    content: blogsExtra.uzbekistan
  },
  {
    slug: 'mbbs-in-russia-2026-complete-guide',
    title: 'MBBS in Russia 2026: A Reality Check on Banking, Safety, and Top Universities',
    category: 'MBBS Abroad',
    excerpt: 'The ultimate guide to studying medicine in Russia. From navigating international sanctions to securing a top-tier clinical education in Moscow.',
    meta_title: 'MBBS in Russia 2026: Ranking, Fees & Banking Solutions Guide',
    meta_description: 'Study MBBS in Russia in 2026. Detailed research on top Moscow universities, itemized living costs, and modern banking solutions for Indian families.',
    cover_image: 'studentstraffic/blog/mbbs-russia-2026',
    local_image: '/Users/bharat/.gemini/antigravity/brain/576f9bd3-16af-43aa-9821-24bb2ad2f05c/mbbs_russia_2026_hero_1774978241286.png',
    content: blogsExtra.russia
  },
  {
    slug: 'mbbs-in-georgia-2026-complete-guide',
    title: 'MBBS in Georgia 2026: Your European Gateway to Global Medicine',
    category: 'MBBS Abroad',
    excerpt: 'Why Georgia is becoming the premium choice for Indian students. A deep-dive into ECTS credits, Tbilisi lifestyle, and Western standards.',
    meta_title: 'MBBS in Georgia 2026: Fees, ECTS & European Standards Guide',
    meta_description: 'The complete guide to MBBS in Georgia. Strategic advice on Tbilisi State, 2026 admission cycles, and clinical rotations for FMGs.',
    cover_image: 'studentstraffic/blog/mbbs-georgia-2026',
    local_image: '/Users/bharat/.gemini/antigravity/brain/576f9bd3-16af-43aa-9821-24bb2ad2f05c/mbbs_georgia_2026_hero_1774978670811.png',
    content: blogsExtra.georgia
  },
  {
    slug: 'mbbs-in-kyrgyzstan-2026-complete-guide',
    title: 'MBBS in Kyrgyzstan 2026: High Volume Clinical Training Under ₹25 Lakhs',
    category: 'MBBS Abroad',
    excerpt: 'The most honest breakdown of MBBS in Kyrgyzstan. How to secure high patient inflow on a budget and why Osh State is the gold standard.',
    meta_title: 'MBBS in Kyrgyzstan 2026: Fees, Budget & Clinical Guide',
    meta_description: 'Can you finish MBBS under 25L? Our guide explores Kyrgyzstan as a high-volume clinical hub with 2026 fee updates for Indian students.',
    cover_image: 'studentstraffic/blog/mbbs-kyrgyzstan-2026',
    local_image: '/Users/bharat/.gemini/antigravity/brain/576f9bd3-16af-43aa-9821-24bb2ad2f05c/mbbs_kyrgyzstan_2026_hero_1774978699114.png',
    content: blogsExtra.kyrgyzstan
  },
  {
    slug: 'next-vs-fmge-2026-complete-guide',
    title: 'NEXT Exam vs FMGE 2026: The Definitive Technical Guide for FMGs',
    category: 'Exam Guidance',
    excerpt: 'Stop fearing the transition. A technical comparison of Step-1/Step-2 vs FMGE, with a year-by-year 2026 preparation strategy.',
    meta_title: 'NEXT Exam vs FMGE 2026: Exam Pattern & FMG Strategy Guide',
    meta_description: 'Navigating the 2026 licensing shift. A technical comparison of NExT vs FMGE with clinical competency breakdowns and preparation roadmaps.',
    cover_image: 'studentstraffic/blog/next-vs-fmge-2026',
    local_image: '/Users/bharat/.gemini/antigravity/brain/576f9bd3-16af-43aa-9821-24bb2ad2f05c/next_vs_fmge_hero_1774978727153.png',
    content: blogsExtra.next
  }
];

async function seed() {
  console.log('=== Blog Seeder: Batch 5 (Standalone Enriched via JSON) ===\n');
  const client = await pool.connect();

  try {
    for (const post of posts) {
      console.log(`Post: ${post.slug}`);

      let finalCoverUrl = '';
      try {
        const uploadResponse = await cloudinary.uploader.upload(post.local_image, {
          public_id: post.cover_image,
          use_filename: true,
          unique_filename: false,
          overwrite: false
        });
        finalCoverUrl = uploadResponse.secure_url;
        console.log(`  [ok] ${finalCoverUrl}`);
      } catch (uploadError) {
        finalCoverUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${post.cover_image}.jpg`;
        console.log(`  [skip/fallback] ${finalCoverUrl}`);
      }

      const stats = readingTime(post.content);
      const minutes = Math.ceil(stats.minutes);

      const query = `
        INSERT INTO blog_posts (
          slug, title, excerpt, content, cover_url, category, 
          meta_title, meta_description, status, reading_time_minutes, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          cover_url = EXCLUDED.cover_url,
          category = EXCLUDED.category,
          meta_title = EXCLUDED.meta_title,
          meta_description = EXCLUDED.meta_description,
          reading_time_minutes = EXCLUDED.reading_time_minutes,
          updated_at = NOW();
      `;

      const values = [
        post.slug, post.title, post.excerpt, post.content, finalCoverUrl, post.category,
        post.meta_title, post.meta_description, 'published', minutes
      ];

      await client.query(query, values);
      console.log(`  ✓ Upserted: ${post.slug} (${minutes} min read, ${post.content.split(' ').length} words)`);
    }
  } catch (error) {
    console.error('Fatal error during seeding:', error);
  } finally {
    client.release();
    await pool.end();
  }

  console.log('\n✅ Batch 5 Final done!');
  process.exit(0);
}

seed();
