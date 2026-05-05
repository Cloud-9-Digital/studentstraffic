import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";

import { AppChrome } from "@/components/app/app-chrome";
import { GoogleAnalytics } from "@/components/google-analytics";
import { MetaPixel } from "@/components/meta-pixel";
import { JsonLd } from "@/components/shared/json-ld";
import { Toaster } from "@/components/ui/sonner";
import { defaultMetadata } from "@/lib/metadata";
import {
  getAuthorStructuredData,
  getOrganizationStructuredData,
  getStructuredDataGraph,
  getWebsiteStructuredData,
} from "@/lib/structured-data";
import "./globals.css";

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f3d37",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-background text-foreground"
      >
        <Suspense fallback={null}>
          <GoogleAnalytics />
          <MetaPixel />
          <AppChrome>{children}</AppChrome>
        </Suspense>
        <Analytics />
        <Toaster position="top-center" />
        <JsonLd
          data={getStructuredDataGraph([
            getOrganizationStructuredData(),
            getAuthorStructuredData(),
            getWebsiteStructuredData(),
          ])}
        />
      </body>
    </html>
  );
}
