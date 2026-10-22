import { footerPopularRoutes, navCourses, siteConfig } from "@/lib/constants";
import { absoluteUrl } from "@/lib/metadata";
import { logPublicRouteRequest } from "@/lib/route-observability";
import { getNavCountries } from "@/lib/data/nav-countries";
import { getAllPublishedBlogPostsMetadata } from "@/lib/data/catalog";

// Follows the llms.txt convention (https://llmstxt.org): an H1, a blockquote
// summary, then H2 sections of `- [Title](url): notes` links. The full
// catalogue index lives in /llms-full.txt.

function toLinkList(items: Array<{ label: string; href: string; note?: string }>) {
  return items.map(
    (item) =>
      `- [${item.label}](${absoluteUrl(item.href)})${item.note ? `: ${item.note}` : ""}`,
  );
}

// URL templates: absoluteUrl would percent-encode the {placeholders}.
function urlPattern(path: string) {
  return `${absoluteUrl("/").replace(/\/$/, "")}${path}`;
}

const NEWS_CATEGORIES = new Set(["Latest Updates"]);
const KEY_BLOG_GUIDES_COUNT = 8;

async function getKeyBlogGuides() {
  const posts = await getAllPublishedBlogPostsMetadata();
  // Prefer evergreen guides over dated news posts for a stable "best of" list.
  return posts
    .filter((post) => !post.category || !NEWS_CATEGORIES.has(post.category))
    .slice(0, KEY_BLOG_GUIDES_COUNT)
    .map((post) => ({ label: post.title, href: `/blog/${post.slug}` }));
}

export async function GET(request: Request) {
  logPublicRouteRequest({
    route: "llms.txt",
    request,
    sampleRate: 1,
  });

  const [navCountries, keyBlogGuides] = await Promise.all([
    getNavCountries(),
    getKeyBlogGuides(),
  ]);

  // Catalogue size is deliberately not published (no university, programme or
  // country counts); destinations are listed alphabetically.
  const destinations = navCountries
    .filter((country) => country.universityCount > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `${siteConfig.name} is a study-abroad and university catalogue for Indian and international students. It publishes university profiles and programme pages across study destinations, including India, with fees, duration, teaching language, admission route, recognition and approvals, and FAQs. Facts are researched from official university, regulator and government sources, and pages show their last review date. Free admission counselling is available on every page.`,
    "",
    "## Machine-readable access",
    `- [Full catalogue index](${absoluteUrl("/llms-full.txt")}): every published country, course, university and programme with fees, duration and language, plus blog posts`,
    `- University markdown: append \`.md\` to any university URL, e.g. [Jamia Millia Islamia](${absoluteUrl("/university/jamia-millia-islamia.md")}); \`Accept: text/markdown\` on /university/{slug} returns the same view`,
    `- Programme markdown: append \`.md\` to any programme URL, e.g. [B.Tech Computer Engineering at JMI](${absoluteUrl("/jmi-btech-computer-engineering.md")})`,
    `- [Sitemap index](${absoluteUrl("/sitemap.xml")}), [university sitemap](${absoluteUrl("/universities/sitemap/0.xml")}), [programme sitemap](${absoluteUrl("/programs/sitemap/0.xml")})`,
    "- Catalogue pages also carry schema.org JSON-LD (CollegeOrUniversity, Course, FAQPage, BreadcrumbList)",
    "",
    "## URL patterns",
    `- University: ${urlPattern("/university/{slug}")}, with sections -programs, -student-life, -hostel and -faq`,
    `- Programme at a university: ${urlPattern("/{programme-slug}")}, with sections -fees, -admissions, -eligibility and -recognition`,
    `- Country: ${urlPattern("/countries/{slug}")}`,
    `- Course family across universities: ${urlPattern("/courses/{slug}")}`,
    `- Comparison: ${urlPattern("/compare/{slug}")}; budget guide: ${urlPattern("/budget/{slug}")}; blog: ${urlPattern("/blog/{slug}")}`,
    "- /search and /thank-you are utility routes, not citable content",
    "",
    "## Catalogue",
    ...toLinkList([
      { label: "All universities", href: "/universities", note: "filter by country, programme, fees, intake and language" },
      { label: "Countries", href: "/countries" },
      { label: "Courses", href: "/courses" },
      { label: "Comparisons", href: "/compare" },
      { label: "Fees by budget", href: "/budget" },
      { label: "Guides", href: "/guides" },
      { label: "India MBBS colleges", href: "/india-mbbs-colleges", note: "government and private medical colleges by state" },
      { label: "NEET college predictor", href: "/neet-college-predictor" },
    ]),
    "",
    "## Destinations",
    ...toLinkList(
      destinations.map((country) => ({
        label: country.name,
        href: country.href,
      })),
    ),
    "",
    "## Key courses",
    ...toLinkList(
      navCourses.map((course) => ({
        label: course.name,
        href: course.href,
        note: course.description,
      })),
    ),
    "",
    "## Popular guides",
    ...toLinkList(footerPopularRoutes.map((route) => ({ ...route }))),
    "",
    "## Blog guides",
    ...toLinkList(keyBlogGuides),
    "",
    "## Editorial standards",
    ...toLinkList([
      { label: "Editorial policy", href: "/editorial-policy" },
      { label: "Methodology", href: "/methodology", note: "how fees, recognition and rankings are sourced and checked" },
      { label: "About", href: "/about" },
    ]),
    "",
    "## Free counselling",
    ...toLinkList([{ label: "Contact", href: "/contact" }]),
    `- WhatsApp: https://wa.me/${siteConfig.whatsappNumber}`,
    `- Phone: ${siteConfig.phone}`,
    `- Email: ${siteConfig.email}`,
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
