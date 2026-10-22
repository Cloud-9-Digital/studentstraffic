// Maps an incoming studentstraffic.com URL (Universal Link / App Link) to the
// app route that shows the same entity. Only /university/* and /countries*
// are claimed by the app (see lib/app-links.ts on the website); every other
// path, including the app's own studentstraffic:// links, passes through.

// Section pages of a university live at /university/{slug}-{section} on the
// web; the app shows them all on one screen.
const UNIVERSITY_SECTION_SUFFIXES = ["-programs", "-student-life", "-hostel", "-faq"];

function stripSectionSuffix(slug: string) {
  const suffix = UNIVERSITY_SECTION_SUFFIXES.find((value) => slug.endsWith(value));
  return suffix ? slug.slice(0, -suffix.length) : slug;
}

export function mapWebLinkPath(path: string): string {
  // `path` may be a full URL or a bare path; resolve it against a dummy origin.
  const url = new URL(path, "https://www.studentstraffic.com");
  const segments = url.pathname.split("/").filter(Boolean);

  if (segments[0] === "university" && segments[1]) {
    const slug = segments[1].replace(/\.md$/, "");
    return `/university/${encodeURIComponent(stripSectionSuffix(decodeURIComponent(slug)))}`;
  }

  if (segments[0] === "countries") {
    // Web /countries/{slug} is the app's /country/{slug}; the index matches.
    return segments[1] ? `/country/${segments[1]}` : "/countries";
  }

  return path;
}
