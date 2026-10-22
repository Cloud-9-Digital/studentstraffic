import { Linking } from "react-native";
import type { Router } from "expo-router";

import { mobileClient } from "../../api/mobileClient";
import { mapWebLinkPath } from "../../navigation/webLinkPath";

// Mira writes website paths, because the same answers serve the website. In the
// app each one opens the screen that shows the same thing; only pages the app
// has no screen for (guides, articles, course hubs) open on the website.

const SITE_URL = "https://www.studentstraffic.com";

/** Website paths that are app screens under another name. */
const APP_EQUIVALENTS: Record<string, string> = {
  "/dashboard/shortlist": "/shortlists",
  "/dashboard": "/plan",
  "/login": "/login",
  "/register": "/register",
  "/universities": "/search",
};

export async function openMiraLink(href: string, router: Router) {
  let url: URL;
  try {
    url = new URL(href, SITE_URL);
  } catch {
    return;
  }

  // Off-site links leave the app, as they leave the site on the web.
  if (url.origin !== SITE_URL && url.hostname !== "studentstraffic.com") {
    await Linking.openURL(url.toString()).catch(() => {});
    return;
  }

  const path = url.pathname.replace(/\/$/, "") || "/";
  const equivalent = APP_EQUIVALENTS[path];
  if (equivalent) {
    router.push(equivalent as never);
    return;
  }

  if (/^\/(university|countries)(\/|$)/.test(path)) {
    router.push(mapWebLinkPath(path) as never);
    return;
  }

  // A bare /{slug} is a programme page on the web, or a guide, or an article —
  // only the catalogue can say which.
  if (/^\/[a-z0-9-]+$/.test(path)) {
    const target = await mobileClient.resolveMiraLink(path).catch(() => null);
    if (target) {
      router.push({ pathname: "/university/[slug]", params: { slug: target.universitySlug, program: target.programSlug } });
      return;
    }
  }

  await Linking.openURL(`${SITE_URL}${url.pathname}${url.search}${url.hash}`).catch(() => {});
}
