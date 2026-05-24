import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

import { SectionHeading } from "@/components/site/section-heading";
import { getUniversityInitials, isRealUniversityImageUrl } from "@/lib/university-media";
import { getUniversitiesWithActivePeers, type PeerUniversity } from "@/lib/university-community";
import { getUniversityHref } from "@/lib/routes";

function PeerUniversityCard({ university }: { university: PeerUniversity }) {
  const href = `${getUniversityHref(university.slug)}#talk-to-peers`;
  const initials = getUniversityInitials(university.name);
  const hasCover = isRealUniversityImageUrl(university.coverImageUrl);

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
    >
      {/* Cover image */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-gradient-to-br from-primary/12 to-primary/5">
        {hasCover ? (
          <Image
            src={university.coverImageUrl!}
            alt={`${university.name} campus`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="select-none font-display text-6xl font-semibold text-primary/10">
              {initials}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Country badge */}
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-lg border border-white/20 bg-black/40 px-2.5 py-1 text-xs font-medium text-white/95 backdrop-blur-sm">
            {university.countryName}
          </span>
        </div>

        {/* Peer count badge - WhatsApp green */}
        <div className="absolute bottom-3 right-3">
          <span className="flex items-center gap-1.5 rounded-full bg-[#25d366] px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
            <WhatsAppIcon className="size-3.5" />
            {university.peerCount} online
          </span>
        </div>

        {/* Logo */}
        <div className="absolute bottom-3 left-3 flex size-10 items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-white shadow-lg">
          {university.logoUrl ? (
            <Image
              src={university.logoUrl}
              alt={`${university.name} logo`}
              fill
              sizes="40px"
              className="object-contain p-1"
            />
          ) : (
            <span className="text-xs font-bold text-primary">{initials}</span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-heading transition-colors group-hover:text-primary md:text-base">
          {university.name}
        </h3>
        <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-accent md:text-sm">
          Connect on WhatsApp
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export async function PeerUniversitiesSection() {
  const universities = await getUniversitiesWithActivePeers(6);

  if (universities.length === 0) return null;

  return (
    <section className="border-y border-border/40 bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
      <div className="container-shell px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-heading md:text-4xl lg:text-5xl">
            Talk to real students
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Connect directly on WhatsApp with Indian students already studying at these universities. Get honest answers on fees, hostels, and daily life.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:mt-16 md:gap-6 lg:grid-cols-3">
          {universities.map((university) => (
            <PeerUniversityCard key={university.slug} university={university} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/universities"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-accent"
          >
            View all universities
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
