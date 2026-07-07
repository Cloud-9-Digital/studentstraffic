import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { AppChrome } from "@/components/app/app-chrome";
import { NavCountriesClientProvider } from "@/components/app/nav-countries-client-provider";
import { NavCoursesClientProvider } from "@/components/app/nav-courses-client-provider";
import { NavUniversitiesClientProvider } from "@/components/app/nav-universities-client-provider";
import { Providers } from "@/components/app/providers";
import { getNavCountries, getNavCountriesByRegion } from "@/lib/data/nav-countries";
import { getNavCourses } from "@/lib/data/nav-courses";
import { getNavUniversitiesByCountry } from "@/lib/data/nav-universities";
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
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f3d37",
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navCountries, navCountriesByRegion, navUniversitiesByCountry, navCourses] = await Promise.all([
    getNavCountries(),
    getNavCountriesByRegion(),
    getNavUniversitiesByCountry(),
    getNavCourses(),
  ]);

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
        <Providers>
          <Suspense><GoogleAnalytics /></Suspense>
          <Suspense><MetaPixel /></Suspense>
          <NavCountriesClientProvider countries={navCountries} regionGroups={navCountriesByRegion}>
            <NavCoursesClientProvider courses={navCourses}>
              <NavUniversitiesClientProvider countryGroups={navUniversitiesByCountry}>
                <AppChrome>{children}</AppChrome>
              </NavUniversitiesClientProvider>
            </NavCoursesClientProvider>
          </NavCountriesClientProvider>
        </Providers>
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
