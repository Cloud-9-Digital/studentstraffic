import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { LeadForm } from "@/components/site/lead-form";
import { Button } from "@/components/ui/button";
import {
  catalogReviewedAt,
  governancePublishedAt,
} from "@/lib/content-governance";
import { siteConfig } from "@/lib/constants";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Contact",
  description:
    "Contact Students Traffic for university shortlisting, study-abroad guidance, and admissions support.",
  path: "/contact",
});


export default function ContactPage() {
  const path = "/contact";
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Contact", path },
    ]),
    getWebPageStructuredData({
      path,
      name: "Contact Students Traffic",
      description:
        "Ways to reach Students Traffic for study-abroad and admissions guidance.",
      datePublished: governancePublishedAt,
      dateModified: catalogReviewedAt,
    }),
  ];

  return (
    <>
      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <section className="border-b border-border py-14 md:py-20">
        <div className="container-shell">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Contact us
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-heading sm:text-5xl">
            Get in touch
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Our counsellors have guided 2,000+ students to the right university
            abroad. Reach out — there&apos;s no fee, no commitment, and no rush.
          </p>
        </div>
      </section>

      {/* ── Form + contact info ───────────────────────────────────────────────── */}
      <section className="section-space">
        <div className="container-shell">
          <div className="grid gap-16 lg:grid-cols-[1fr_360px] lg:items-start">

            {/* Left — form */}
            <LeadForm
              sourcePath={path}
              ctaVariant="contact-page"
              title="Send us a message"
              description="Fill in your details and a counsellor will reach out within a few hours."
              submitLabel="Send message"
            />

            {/* Right — contact methods + trust */}
            <div className="space-y-8">

              {/* Contact methods */}
              <div>
                <h2 className="mb-5 text-sm font-semibold text-foreground">
                  Other ways to reach us
                </h2>
                <div className="space-y-5">

                  {/* WhatsApp */}
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#25d366]/12 text-[#25d366]">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4.5" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">WhatsApp</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Fastest way to reach us — we respond daily, including weekends.
                      </p>
                      <Button asChild size="sm" className="mt-2.5">
                        <Link
                          href={`https://wa.me/${siteConfig.whatsappNumber}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Message us
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                      <Phone className="size-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Phone</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Available Mon – Sat, 9 am to 7 pm IST.
                      </p>
                      <Button asChild size="sm" variant="outline" className="mt-2.5">
                        <Link href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                          Call us
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                      <Mail className="size-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Email</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Best for detailed queries or document questions.
                      </p>
                      <Button asChild size="sm" variant="outline" className="mt-2.5">
                        <Link href={`mailto:${siteConfig.email}`}>
                          Email us
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
