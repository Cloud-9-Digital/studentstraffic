import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";

import { listFinderPrograms } from "@/lib/data/catalog";
import {
  footerPopularRoutes,
  navCourses,
  navDestinations,
  siteConfig,
} from "@/lib/constants";
import { getUniversityHref } from "@/lib/routes";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

async function getAllUniversities() {
  const programs = await listFinderPrograms({});
  const seen = new Set<string>();
  const result: Array<{ slug: string; name: string; countryName: string }> = [];
  for (const p of programs) {
    if (!seen.has(p.university.slug)) {
      seen.add(p.university.slug);
      result.push({ slug: p.university.slug, name: p.university.name, countryName: p.country.name });
    }
  }
  return result;
}

export async function SiteFooter() {
  const allUniversities = await getAllUniversities();

  return (
    <footer className="bg-surface-dark text-white">

      {/* ── CTA banner ────────────────────────────────────────────────────── */}
      <div className="border-b border-white/10 bg-surface-dark-2">
        <div className="container-shell flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              Free · No obligations
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-semibold text-heading-contrast sm:text-3xl">
              Not sure where to start?{" "}
              <span className="text-accent">We&apos;ll help.</span>
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Our counsellors build a personalised university shortlist for you — at no cost.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/18"
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp
            </a>
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong"
            >
              Get Free Counselling
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main columns ──────────────────────────────────────────────────── */}
      <div className="container-shell py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr_1fr] lg:gap-10">

          {/* Brand */}
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
            <p className="max-w-xs text-sm leading-6 text-white/50">
              Helping Indian students explore, compare, and apply to medical universities
              abroad — with verified data and free expert guidance.
            </p>
            <div className="space-y-2">
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 text-sm text-white/55 transition-colors hover:text-white">
                <Phone className="size-3.5 shrink-0" />
                {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2.5 text-sm text-white/55 transition-colors hover:text-white">
                <Mail className="size-3.5 shrink-0" />
                {siteConfig.email}
              </a>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Destinations
            </p>
            <ul className="space-y-2.5">
              {navDestinations.map((d) => (
                <li key={d.href}>
                  <Link href={d.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {d.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/countries" className="text-sm font-medium text-accent/80 transition-colors hover:text-accent">
                  All countries →
                </Link>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Courses
            </p>
            <ul className="space-y-2.5">
              {navCourses.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {c.name}
                    <span className="ml-1.5 text-xs text-white/30">{c.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* MBBS Guides */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
              MBBS Guides
            </p>
            <ul className="space-y-2.5">
              {footerPopularRoutes.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {r.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/universities" className="text-sm font-medium text-accent/80 transition-colors hover:text-accent">
                  All universities →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Company
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "University Finder", href: "/universities" },
                { label: "Destinations", href: "/countries" },
                { label: "Courses", href: "/courses" },
                { label: "Compare Guides", href: "/compare" },
                { label: "Budget Guides", href: "/budget" },
                { label: "Search", href: "/search" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mb-4 mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Support
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "How it works", href: "/methodology" },
                { label: "Editorial policy", href: "/editorial-policy" },
                { label: "WhatsApp us", href: `https://wa.me/${siteConfig.whatsappNumber}` },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Crawl index ───────────────────────────────────────────────────── */}
      <div className="border-t border-white/8">
        <div className="container-shell space-y-6 py-10">

          {/* Destinations row */}
          <div>
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
              Study Destinations
            </p>
            <div className="flex flex-wrap gap-x-1 gap-y-1">
              {navDestinations.map((d, i) => (
                <span key={d.href} className="flex items-center">
                  <Link href={d.href} className="text-sm text-white/45 transition-colors hover:text-white/80">
                    {d.name}
                  </Link>
                  {i < navDestinations.length - 1 && <span className="mx-2.5 text-white/15">·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Courses row */}
          <div>
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
              Medical Courses Abroad
            </p>
            <div className="flex flex-wrap gap-x-1 gap-y-1">
              {navCourses.map((c, i) => (
                <span key={c.href} className="flex items-center">
                  <Link href={c.href} className="text-sm text-white/45 transition-colors hover:text-white/80">
                    {c.name}
                  </Link>
                  {i < navCourses.length - 1 && <span className="mx-2.5 text-white/15">·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Popular routes row */}
          <div>
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
              Popular Routes
            </p>
            <div className="flex flex-wrap gap-x-1 gap-y-1">
              {footerPopularRoutes.map((r, i) => (
                <span key={r.href} className="flex items-center">
                  <Link href={r.href} className="text-sm text-white/45 transition-colors hover:text-white/80">
                    {r.label}
                  </Link>
                  {i < footerPopularRoutes.length - 1 && <span className="mx-2.5 text-white/15">·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Universities row */}
          {allUniversities.length > 0 && (
            <div>
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                All Universities
              </p>
              <div className="flex flex-wrap gap-x-1 gap-y-1">
                {allUniversities.map((u, i) => (
                  <span key={u.slug} className="flex items-center">
                    <Link href={getUniversityHref(u.slug)} className="text-sm text-white/45 transition-colors hover:text-white/80">
                      {u.name}
                    </Link>
                    {i < allUniversities.length - 1 && <span className="mx-2.5 text-white/15">·</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <div className="border-t border-white/8">
        <div className="container-shell flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/30">
            © {siteConfig.copyrightYear} Students Traffic. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-white/30">
            <Link href="/privacy" className="transition-colors hover:text-white/60">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-white/60">Terms of Service</Link>
            <Link href="/sitemap.xml" className="transition-colors hover:text-white/60">Sitemap</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
