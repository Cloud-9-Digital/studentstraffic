import type { ReactNode } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { LocationMedia } from "@/lib/location-media";
import { cn } from "@/lib/utils";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-6 w-[3px] shrink-0 rounded-full bg-accent" aria-hidden />
      <h2 className="font-display text-xl font-semibold text-heading md:text-2xl">
        {children}
      </h2>
    </div>
  );
}

export function GlanceStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-2xl bg-muted/40 p-4">
      <div className="flex items-center gap-1.5">
        <span className="text-accent [&_svg]:size-3.5">{icon}</span>
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="text-sm font-bold text-foreground leading-tight">{value}</p>
    </div>
  );
}

export function InfoCard({
  icon,
  title,
  body,
  linkHref,
  linkLabel,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-muted/35 p-5">
      <div className="flex items-center gap-2">
        <span className="text-accent [&_svg]:size-4">{icon}</span>
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <p className="text-sm leading-7 text-muted-foreground">{body}</p>
      {linkHref && linkLabel ? (
        <a
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
        >
          {linkLabel}
          <ExternalLink className="size-3.5" />
        </a>
      ) : null}
    </div>
  );
}

export function FitCard({
  title,
  items,
  dotClass,
  className,
}: {
  title: string;
  items: string[];
  dotClass: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 rounded-2xl border p-5", className)}>
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2.5 text-sm leading-6 text-muted-foreground"
          >
            <span className={`mt-[0.4rem] size-1.5 shrink-0 rounded-full ${dotClass}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProgramMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1 rounded-xl bg-muted/40 px-3 py-2.5">
      <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export function LocationMediaCard({
  media,
  title,
}: {
  media: LocationMedia;
  title: string;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-[16/8] overflow-hidden bg-muted/30">
        <Image
          src={media.url}
          alt={media.alt}
          fill
          sizes="(max-width: 768px) 100vw, 1120px"
          className="object-cover"
        />
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
        <span className="font-medium text-foreground">{title}</span>
        {media.sourceLabel && media.sourceUrl ? (
          <a
            href={media.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground hover:text-primary"
          >
            {media.sourceLabel}
            <ExternalLink className="size-3.5" />
          </a>
        ) : null}
      </figcaption>
    </figure>
  );
}

export function UniversityLogoBadge({
  name,
  logoUrl,
  initials,
  className,
}: {
  name: string;
  logoUrl?: string;
  initials: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border font-semibold",
        className,
      )}
    >
      {logoUrl ? (
        <span className="flex h-full w-full items-center justify-center p-[18%]">
          <Image
            src={logoUrl}
            alt={`${name} logo`}
            width={64}
            height={64}
            className="h-full w-full object-contain"
          />
        </span>
      ) : (
        <span className="text-sm font-bold tracking-wide">{initials}</span>
      )}
    </div>
  );
}

export { Badge };
