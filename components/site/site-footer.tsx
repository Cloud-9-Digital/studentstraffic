import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
import {
  footerCityGuides,
  footerPopularRoutes,
  guideNav,
  navCourses,
  navDestinations,
  siteConfig,
} from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="bg-surface-dark text-white">
      <div className="border-b border-white/10 bg-surface-dark-2">
        <div className="container-shell flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              Free expert counselling
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-semibold text-heading-contrast sm:text-3xl">
              Know which university to apply to — before the cycle closes.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/60">
              Our counsellors have placed Indian students in universities across Georgia, Kyrgyzstan, Uzbekistan, Russia, and Vietnam. Book a free call and get a direct answer for your NEET score and budget.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <CounsellingDialog
              triggerContent={
                <>
                  Get Free Counselling
                  <ArrowRight className="size-4" />
                </>
              }
              triggerVariant="accent"
            />
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/18"
            >
              Browse universities
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
              medical study-abroad options, understand the differences between
              countries and universities, and get guidance throughout the
              admissions journey.
            </p>
            <div className="space-y-2">
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2.5 text-sm text-white/75 transition-colors hover:text-white"
              >
                <Phone className="size-3.5 shrink-0" />
                {siteConfig.phone}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2.5 text-sm text-white/75 transition-colors hover:text-white"
              >
                <Mail className="size-3.5 shrink-0" />
                {siteConfig.email}
              </a>
            </div>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
              Start Here
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "Universities", href: "/universities" },
                { label: "Talk to Students", href: "/students" },
                { label: "Reviews", href: "/reviews" },
                { label: "Become a Student Guide", href: "/join" },
                { label: "All Guides", href: "/guides" },
                { label: "Contact", href: "/contact" },
                { label: "Search", href: "/search" },
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
              Guides
            </p>
            <ul className="space-y-2.5">
              {guideNav.filter((item) => item.href !== "/guides").map((item) => (
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
                { label: "How it works", href: "/methodology" },
                { label: "Editorial policy", href: "/editorial-policy" },
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
          <div>
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
              Popular Guides
            </p>
            <div className="flex flex-wrap gap-x-1 gap-y-1">
              {footerPopularRoutes.map((route, index) => (
                <span key={route.href} className="flex items-center">
                  <Link
                    href={route.href}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {route.label}
                  </Link>
                  {index < footerPopularRoutes.length - 1 ? (
                    <span className="mx-2.5 text-white/15">·</span>
                  ) : null}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                Country Guides
              </p>
              <div className="flex flex-wrap gap-x-1 gap-y-1">
                {navDestinations.map((destination, index) => (
                  <span key={destination.href} className="flex items-center">
                    <Link
                      href={destination.href}
                      className="text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {destination.name}
                    </Link>
                    {index < navDestinations.length - 1 ? (
                      <span className="mx-2.5 text-white/15">·</span>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                Course Guides
              </p>
              <div className="flex flex-wrap gap-x-1 gap-y-1">
                {navCourses.map((course, index) => (
                  <span key={course.href} className="flex items-center">
                    <Link
                      href={course.href}
                      className="text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {course.name}
                    </Link>
                    {index < navCourses.length - 1 ? (
                      <span className="mx-2.5 text-white/15">·</span>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
              City Guides
            </p>
            <div className="flex flex-wrap gap-x-1 gap-y-1">
              {footerCityGuides.map((city, index) => (
                <span key={city.href} className="flex items-center">
                  <Link
                    href={city.href}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {city.name}
                  </Link>
                  {index < footerCityGuides.length - 1 ? (
                    <span className="mx-2.5 text-white/15">·</span>
                  ) : null}
                </span>
              ))}
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
