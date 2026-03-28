import type { NextConfig } from "next";

const mediaHostnames = (process.env.MEDIA_HOSTNAMES ?? "")
  .split(",")
  .map((hostname) => hostname.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  cacheComponents: true,
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
      ...mediaHostnames.map((hostname) => ({
        protocol: "https" as const,
        hostname,
      })),
    ],
  },
};

export default nextConfig;
