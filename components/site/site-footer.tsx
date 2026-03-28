import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
import {
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
              Free Guidance
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-semibold text-heading-contrast sm:text-3xl">
              Get clearer information and expert support.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/60">
              Explore universities, read detailed guides, and reach out when
              you want help understanding fees, recognition, countries, or the
              next admissions step.
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
              Explore universities
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
                width={180}
                height={48}
                className="h-7 w-auto brightness-0 invert"
              />
            </Link>
            <p className="max-w-sm text-sm leading-6 text-white/50">
              Students Traffic helps Indian students and parents explore
              medical study-abroad options, understand the differences between
              countries and universities, and get guidance throughout the
              admissions journey.
            </p>
            <div className="space-y-2">
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2.5 text-sm text-white/55 transition-colors hover:text-white"
              >
                <Phone className="size-3.5 shrink-0" />
                {siteConfig.phone}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2.5 text-sm text-white/55 transition-colors hover:text-white"
              >
                <Mail className="size-3.5 shrink-0" />
                {siteConfig.email}
              </a>
            </div>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Start Here
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "Universities", href: "/universities" },
                { label: "All Guides", href: "/guides" },
                { label: "Contact", href: "/contact" },
                { label: "Search", href: "/search" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Guides
            </p>
            <ul className="space-y-2.5">
              {guideNav.filter((item) => item.href !== "/guides").map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
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
                    className="text-sm text-white/60 transition-colors hover:text-white"
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
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
              Popular Guides
            </p>
            <div className="flex flex-wrap gap-x-1 gap-y-1">
              {footerPopularRoutes.map((route, index) => (
                <span key={route.href} className="flex items-center">
                  <Link
                    href={route.href}
                    className="text-sm text-white/45 transition-colors hover:text-white/80"
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
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                Country Guides
              </p>
              <div className="flex flex-wrap gap-x-1 gap-y-1">
                {navDestinations.map((destination, index) => (
                  <span key={destination.href} className="flex items-center">
                    <Link
                      href={destination.href}
                      className="text-sm text-white/45 transition-colors hover:text-white/80"
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
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                Course Guides
              </p>
              <div className="flex flex-wrap gap-x-1 gap-y-1">
                {navCourses.map((course, index) => (
                  <span key={course.href} className="flex items-center">
                    <Link
                      href={course.href}
                      className="text-sm text-white/45 transition-colors hover:text-white/80"
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
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="container-shell flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/30">
            © {siteConfig.copyrightYear} Students Traffic. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-white/30">
            <Link href="/privacy" className="transition-colors hover:text-white/60">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white/60">
              Terms of Service
            </Link>
            <Link href="/sitemap.xml" className="transition-colors hover:text-white/60">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
