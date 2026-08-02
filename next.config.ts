import type { NextConfig } from "next";

const mediaHostnames = (process.env.MEDIA_HOSTNAMES ?? "")
  .split(",")
  .map((hostname) => hostname.trim())
  .filter(Boolean);
const isDevelopment = process.env.NODE_ENV !== "production";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://connect.facebook.net https://www.googletagmanager.com${
    isDevelopment ? " 'unsafe-eval'" : ""
  }`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  `connect-src 'self' https: wss:${isDevelopment ? " http: ws:" : ""}`,
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  ...(isDevelopment
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]),
] satisfies Array<{ key: string; value: string }>;

const nextConfig: NextConfig = {
  // Keep Turbopack scoped to this app when other projects have lockfiles
  // higher in the Documents tree.
  turbopack: {
    root: process.cwd(),
  },
  allowedDevOrigins: ["192.168.1.8"],
  serverExternalPackages: ["ably"],
  logging: {
    browserToTerminal: "error",
    serverFunctions: false,
  },
  cacheComponents: true,
  // Cache Components enables prerender source maps by default. Keeping them
  // disabled prevents static-generation workers from retaining source-map
  // data while rendering the production catalog.
  enablePrerenderSourceMaps: false,
  cacheLife: {
    // Catalog entities only change when an editorial/data publish runs, and
    // every publish path already invalidates the exact tags it touched
    // (publishCatalogPayload fans out `country:<slug>`, `university:<slug>`,
    // `course-programs:<slug>`, ... via scripts/lib/trigger-revalidate).
    //
    // So there is no reason to refresh on a timer: a time-based revalidate
    // just re-runs every catalog query on a schedule and re-renders pages
    // whose content did not change. That timer was regenerating ~586 pages an
    // hour and was the single largest source of steady database load.
    //
    // `revalidate` is a year and `expire` is deliberately omitted, which Next
    // treats as INFINITE_CACHE - entries never expire on their own. Tag
    // invalidation is the only thing that refreshes them. `expire` must stay
    // omitted (or exceed `revalidate`) or Next rejects the config.
    catalog: {
      stale: 300,
      revalidate: 60 * 60 * 24 * 365,
    },
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
    // Catalog pages retain substantial database-backed render state. Render
    // one page at a time per worker to keep peak heap below Next's isolated
    // worker limit while still using multiple workers.
    staticGenerationMaxConcurrency: 1,
  },
  async redirects() {
    return [
      {
        source: "/universities/:slug([^/]+)",
        destination: "/university/:slug",
        permanent: true,
      },
      {
        source: "/mbbs-in-vietnam-a-to-z-guide-for-indian-students-2025",
        destination: "/blog/mbbs-in-vietnam-2026-complete-guide",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, max-age=0",
          },
        ],
      },
      {
        source: "/login",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, max-age=0",
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons**",
      },
      ...mediaHostnames.map((hostname) => ({
        protocol: "https" as const,
        hostname,
      })),
    ],
  },
};

export default nextConfig;
