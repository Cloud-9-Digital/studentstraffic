"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { TrackedContactLink } from "@/components/site/tracked-contact-link";
import { useNavCourses } from "@/components/app/nav-courses-client-provider";
import { siteConfig } from "@/lib/constants";
import { useNavCountries } from "@/components/app/nav-countries-client-provider";

export function SiteFooter() {
  const navCountries = useNavCountries();
  const navCourses = useNavCourses();
  const programmeStreams = [
    "computing-information-systems",
    "engineering",
    "business",
    "medicine",
    "nursing",
    "law",
    "design-creative-arts",
    "public-health-allied-health",
  ];
  const featuredProgrammes = programmeStreams.flatMap((stream) =>
    navCourses.filter((course) => course.stream === stream).slice(0, 2),
  );
  const footerProgrammes =
    featuredProgrammes.length >= 8 ? featuredProgrammes : navCourses.slice(0, 12);

  return (
    <footer className="bg-surface-dark text-white">
      <div className="border-b border-white/10 bg-surface-dark-2">
        <div className="container-shell flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              Free counselling support
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-semibold text-heading-contrast sm:text-3xl">
              Get clarity on colleges, fees, and admission steps before you decide.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/60">
              Our counsellors help Indian students and parents compare countries, shortlist universities, understand scholarships, and move forward with the right admission plan. Request counselling and get practical guidance for your profile, budget, and next step.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <CounsellingDialog
              triggerContent={
                <>
                  Request Free Counselling
                  <ArrowRight className="size-4" />
                </>
              }
              triggerVariant="accent"
            />
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/18"
            >
              Browse colleges
            </Link>
          </div>
        </div>
      </div>

      <div className="container-shell py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr] lg:gap-10">
          <div className="space-y-5 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.webp"
                alt="Students Traffic"
                width={256}
                height={28}
                className="h-7 w-auto brightness-0 invert"
              />
            </Link>
            <p className="max-w-sm text-sm leading-6 text-white/70">
              Students Traffic helps Indian students and parents explore
              study-abroad options, compare countries and universities, and get
              trusted guidance through counseling, shortlisting, applications,
              and admissions.
            </p>
            <div className="space-y-2">
              <TrackedContactLink
                channel="call"
                location="site_footer_call"
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2.5 text-sm text-white/75 transition-colors hover:text-white"
              >
                <Phone className="size-3.5 shrink-0" />
                {siteConfig.phone}
              </TrackedContactLink>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2.5 text-sm text-white/75 transition-colors hover:text-white"
              >
                <Mail className="size-3.5 shrink-0" />
                {siteConfig.email}
              </a>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={siteConfig.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-opacity hover:opacity-85"
              >
                <Image
                  src="/images/badges/google-play-badge.png"
                  alt="Get it on Google Play"
                  width={360}
                  height={120}
                  className="h-10 w-auto"
                />
              </a>
              <a
                href={siteConfig.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-opacity hover:opacity-85"
              >
                <Image
                  src="/images/badges/app-store-badge.png"
                  alt="Download on the App Store"
                  width={360}
                  height={120}
                  className="h-10 w-auto"
                />
              </a>
            </div>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
              Start Here
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "Universities Abroad", href: "/universities" },
                { label: "Explore Countries", href: "/countries" },
                { label: "Explore Programmes", href: "/courses" },
                { label: "Talk to Students", href: "/students" },
                { label: "Compare Universities", href: "/compare" },
                { label: "Guides", href: "/guides" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
              Plan your move
            </p>
            <ul className="space-y-2.5">
              {[
                { href: "/budget", label: "Plan your budget" },
                { href: "/scholarships-for-indian-students-to-study-abroad", label: "Find scholarships" },
                { href: "/compare", label: "Compare your options" },
                { href: "/cities", label: "Explore student cities" },
                { href: "/guides", label: "Read planning guides" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
              Trust & Support
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "How We Work", href: "/methodology" },
                { label: "Editorial Policy", href: "/editorial-policy" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="container-shell space-y-6 py-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                Explore destinations
              </p>
              <div className="flex flex-wrap gap-x-1 gap-y-1">
                {navCountries.map((destination, index) => (
                  <span key={destination.href} className="flex items-center">
                    <Link
                      href={destination.href}
                      className="text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {destination.name}
                    </Link>
                    {index < navCountries.length - 1 ? (
                      <span className="mx-2.5 text-white/15">·</span>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                Explore programmes
              </p>
              <div className="flex flex-wrap gap-x-1 gap-y-1">
                {footerProgrammes.map((course, index) => (
                  <span key={course.href} className="flex items-center">
                    <Link
                      href={course.href}
                      className="text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {course.name}
                    </Link>
                    {index < footerProgrammes.length - 1 ? (
                      <span className="mx-2.5 text-white/15">·</span>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="container-shell flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            © {siteConfig.copyrightYear} Students Traffic. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-white/50">
            <Link href="/privacy" className="transition-colors hover:text-white/80">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white/80">
              Terms of Service
            </Link>
            <Link href="/sitemap.xml" className="transition-colors hover:text-white/80">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
