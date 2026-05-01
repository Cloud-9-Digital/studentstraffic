"use client";

import { useEffect, useState } from "react";
import { Headphones, Phone } from "lucide-react";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { TrackedContactLink } from "@/components/site/tracked-contact-link";
import { siteConfig } from "@/lib/constants";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function MobileStickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const threshold = window.innerHeight * 0.5;
    const onScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300 ease-in-out"
      style={{
        transform: visible ? "translateY(0)" : "translateY(100%)",
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(24px) saturate(180%) brightness(1.08)",
        WebkitBackdropFilter: "blur(24px) saturate(180%) brightness(1.08)",
        borderTop: "1px solid rgba(0, 0, 0, 0.07)",
      }}
    >
      <div className="flex items-center gap-2.5 px-4 py-3">
        {/* Book call — primary CTA */}
        <CounsellingDialog
          triggerContent={
            <span className="flex items-center justify-center gap-2 text-white!">
              <Headphones className="size-4 shrink-0" strokeWidth={1.75} />
              Request counselling
            </span>
          }
          triggerClassName="flex-1 rounded-xl bg-accent py-2.5 text-sm! font-semibold! text-white! shadow-sm shadow-accent/30 transition-all active:scale-[0.97]"
          plainTrigger
          ctaVariant="mobile_sticky"
        />

        {/* Call */}
        <TrackedContactLink
          channel="call"
          location="mobile_sticky_call"
          href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
          aria-label={`Call ${siteConfig.phone}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/8 bg-white/80 text-primary! transition-colors active:bg-black/8"
        >
          <Phone className="size-[18px]" />
        </TrackedContactLink>

        {/* WhatsApp */}
        <TrackedContactLink
          channel="whatsapp"
          location="mobile_sticky_whatsapp"
          href={`https://wa.me/${siteConfig.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-whatsapp/25 bg-whatsapp/10 text-whatsapp-dark! transition-colors active:bg-whatsapp/20"
        >
          <WhatsAppIcon className="size-[18px]" />
        </TrackedContactLink>
      </div>
    </div>
  );
}
