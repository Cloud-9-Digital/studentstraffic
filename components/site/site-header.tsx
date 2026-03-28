"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Phone, X } from "lucide-react";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { SearchPalette } from "@/components/site/search-palette";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/constants";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function SiteLogo({ onClick, showTagline = false }: { onClick?: () => void; showTagline?: boolean }) {
  return (
    <Link href="/" onClick={onClick} className="flex shrink-0 items-center gap-2.5">
      <Image
        src="/logo.webp"
        alt="Students Traffic"
        width={180}
        height={48}
        className="h-4 w-auto"
        priority
      />
      {showTagline && (
        <>
          <span className="h-5 w-px shrink-0 bg-foreground/20" aria-hidden />
          <span className="text-[9px] font-medium leading-snug text-foreground/45">
            India&apos;s Trusted<br />Study Abroad Platform
          </span>
        </>
      )}
    </Link>
  );
}

const navLinks = [
  { href: "/universities", label: "Universities" },
  { href: "/countries",    label: "Countries" },
  { href: "/courses",      label: "Courses" },
  { href: "/guides",       label: "Guides" },
  { href: "/about",        label: "About" },
  { href: "/contact",      label: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.08)]" : "border-b border-white/60",
        )}
        style={{
          background: scrolled
            ? "rgba(255, 255, 255, 0.75)"
            : "rgba(255, 255, 255, 0.60)",
          backdropFilter: "blur(24px) saturate(180%) brightness(1.06)",
          WebkitBackdropFilter: "blur(24px) saturate(180%) brightness(1.06)",
        }}
      >
        <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <SiteLogo showTagline />

          {/* Desktop nav */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive(href)
                    ? "bg-primary/8 text-primary"
                    : "text-foreground/70 hover:bg-black/5 hover:text-foreground",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <SearchPalette />
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              aria-label="Call us"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/8 text-primary transition-all hover:bg-primary/14 hover:border-primary/30"
            >
              <Phone className="size-[18px]" strokeWidth={1.75} />
            </a>
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-whatsapp/25 bg-whatsapp/10 text-whatsapp-dark transition-all hover:bg-whatsapp/18 hover:border-whatsapp/35"
            >
              <WhatsAppIcon className="size-[18px]" />
            </a>
            <CounsellingDialog
              triggerVariant="accent"
              triggerSize="sm"
              triggerClassName="gap-1.5 px-5 shadow-cta hover:shadow-cta-hover"
              triggerContent={
                <>
                  Free Counselling
                  <ArrowRight className="size-3.5" />
                </>
              }
            />
          </div>

          {/* Mobile toggle */}
          <div className="ml-auto flex items-center gap-1 lg:hidden">
            <SearchPalette />
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-black/5"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={closeMobile}
      />

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-[min(340px,90vw)] flex-col bg-background shadow-drawer transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border px-5">
          <SiteLogo onClick={closeMobile} />
          <button
            onClick={closeMobile}
            aria-label="Close navigation"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-black/5"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-0.5 p-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMobile}
                className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-black/5"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex-shrink-0 space-y-2.5 border-t border-border p-4">
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-whatsapp/25 bg-whatsapp/8 py-3 text-sm font-semibold text-whatsapp-dark transition-colors hover:bg-whatsapp/14"
            >
              <WhatsAppIcon className="size-4" />
              Chat on WhatsApp
            </a>
            <CounsellingDialog
              triggerVariant="accent"
              triggerClassName="w-full gap-2"
              onTriggerClick={closeMobile}
              triggerContent={
                <>
                  Free Counselling
                  <ArrowRight className="size-4" />
                </>
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
