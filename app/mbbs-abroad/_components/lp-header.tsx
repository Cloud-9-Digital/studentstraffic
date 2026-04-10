"use client";

import Image from "next/image";
import { Phone } from "lucide-react";

import { TrackedContactLink } from "@/components/site/tracked-contact-link";
import { useLpDialog } from "./lp-dialog";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function LpHeader() {
  const { open } = useLpDialog();

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#071428]/96 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex shrink-0 items-center">
          <Image src="/logo-white.png" alt="Students Traffic" width={180} height={22} className="h-5 w-auto" priority />
        </div>

        <nav className="hidden items-center gap-5 text-xs font-medium text-white/55 lg:flex">
          <a href="#countries" className="transition hover:text-white">Countries</a>
          <a href="#eligibility" className="transition hover:text-white">Eligibility</a>
          <a href="#faq" className="transition hover:text-white">FAQs</a>
        </nav>

        <div className="flex items-center gap-2">
          <TrackedContactLink
            channel="call"
            location="mbbs_lp_header_call"
            href="tel:+919176162888"
            className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
          >
            <Phone className="size-3.5" />
            <span className="hidden sm:inline">+91 91761 62888</span>
            <span className="sm:hidden">Call</span>
          </TrackedContactLink>

          <TrackedContactLink
            channel="whatsapp"
            location="mbbs_lp_header_whatsapp"
            href="https://wa.me/919176162888?text=Hi%2C+I%27m+interested+in+MBBS+abroad.+Can+you+help+me%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-3 py-2 text-xs font-semibold text-[#25D366] transition hover:bg-[#25D366]/20"
          >
            <WhatsAppIcon className="size-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </TrackedContactLink>

          <button
            onClick={open}
            className="hidden items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-[#071428] transition hover:opacity-90 sm:flex"
            style={{ background: "#F5A623" }}
          >
            Free Counselling
          </button>
        </div>
      </div>
    </header>
  );
}
