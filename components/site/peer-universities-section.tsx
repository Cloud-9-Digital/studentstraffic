import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Cover image */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden bg-gradient-to-br from-primary/12 to-primary/5">
        {hasCover ? (
          <Image
            src={university.coverImageUrl!}
            alt={`${university.name} campus`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="select-none font-display text-5xl font-semibold text-primary/10">
              {initials}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

        {/* Country badge */}
        <div className="absolute right-2.5 top-2.5">
          <span className="inline-flex items-center rounded-md border border-white/20 bg-black/35 px-2 py-0.5 text-[0.65rem] font-medium text-white/90 backdrop-blur-sm">
            {university.countryName}
          </span>
        </div>

        {/* Peer count badge */}
        <div className="absolute bottom-2.5 right-2.5">
          <span className="flex items-center gap-1 rounded-full bg-[#25d366] px-2.5 py-1 text-[0.65rem] font-semibold text-white shadow-sm">
            <MessageCircle className="size-3" />
            {university.peerCount} student{university.peerCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Logo */}
        <div className="absolute bottom-2.5 left-2.5 flex size-9 items-center justify-center overflow-hidden rounded-lg border border-white/80 bg-white shadow-md">
          {university.logoUrl ? (
            <Image
              src={university.logoUrl}
              alt={`${university.name} logo`}
              fill
              sizes="36px"
              className="object-contain p-1"
            />
          ) : (
            <span className="text-[0.6rem] font-bold text-primary">{initials}</span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-sm font-semibold leading-snug text-heading transition-colors group-hover:text-primary">
          {university.name}
        </h3>
        <span className="mt-auto flex items-center gap-1 text-xs font-medium text-accent">
          Talk to a student
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export async function PeerUniversitiesSection() {
  const universities = await getUniversitiesWithActivePeers(6);

  if (universities.length === 0) return null;

  return (
    <section className="border-t border-border py-16 md:py-20">
      <div className="container-shell">
        <SectionHeading
          title="Talk to real students"
          description="Connect directly on WhatsApp with Indian students already studying at these universities — honest answers on fees, hostels, and daily life."
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
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
