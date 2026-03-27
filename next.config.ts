import type { NextConfig } from "next";

const mediaHostnames = (process.env.MEDIA_HOSTNAMES ?? "")
  .split(",")
  .map((hostname) => hostname.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      ...mediaHostnames.map((hostname) => ({
        protocol: "https" as const,
        hostname,
      })),
    ],
  },
};

export default nextConfig;
