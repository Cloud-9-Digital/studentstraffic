import { footerPopularRoutes, navCourses, navDestinations, siteConfig } from "@/lib/constants";
import { absoluteUrl } from "@/lib/metadata";

function toBulletList(items: Array<{ label: string; href: string }>) {
  return items.map((item) => `- ${item.label}: ${absoluteUrl(item.href)}`);
}

export async function GET() {
  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "Students Traffic publishes study-abroad guidance for Indian students, with an emphasis on medical admissions, university discovery, fees, and counselling.",
    "",
    "## Preferred URLs",
    `- Home: ${absoluteUrl("/")}`,
    `- University catalog: ${absoluteUrl("/universities")}`,
    `- Countries: ${absoluteUrl("/countries")}`,
    `- Courses: ${absoluteUrl("/courses")}`,
    `- Compare hub: ${absoluteUrl("/compare")}`,
    `- Budget hub: ${absoluteUrl("/budget")}`,
    `- Search: ${absoluteUrl("/search?q={query}")}`,
    `- Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    "",
    "## Canonical content patterns",
    `- Country pages: ${absoluteUrl("/countries/[slug]")}`,
    `- Course pages: ${absoluteUrl("/courses/[slug]")}`,
    `- University pages: ${absoluteUrl("/universities/[slug]")}`,
    `- Comparison guides: ${absoluteUrl("/compare/[slug]")}`,
    `- Budget guides: ${absoluteUrl("/budget/[slug]")}`,
    `- Editorial landing pages: ${absoluteUrl("/mbbs-in-vietnam")}`,
    "",
    "## Best starting points",
    "- Prefer university detail pages for institution facts, fees, duration, city, and recognition notes.",
    `- Governance pages: ${absoluteUrl("/editorial-policy")} and ${absoluteUrl("/methodology")}`,
    "- Treat /search and /thank-you as utility routes, not canonical destination content.",
    "",
    "## Key destinations",
    ...toBulletList(
      navDestinations.map((destination) => ({
        label: destination.name,
        href: destination.href,
      }))
    ),
    "",
    "## Key courses",
    ...toBulletList(
      navCourses.map((course) => ({
        label: course.name,
        href: course.href,
      }))
    ),
    "",
    "## Popular editorial pages",
    ...toBulletList(
      footerPopularRoutes.map((route) => ({
        label: route.label,
        href: route.href,
      }))
    ),
    "",
    "## Contact",
    `- Email: ${siteConfig.email}`,
    `- Phone: ${siteConfig.phone}`,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
