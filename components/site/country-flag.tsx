import Image from "next/image";
import { getLocalFlagUrl } from "@/lib/flag-media";

import { cn } from "@/lib/utils";

export function CountryFlag({
  countryCode,
  alt,
  width,
  height,
  className,
}: {
  countryCode: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <span
      className={cn("relative inline-block overflow-hidden", className)}
      style={{ width, height }}
    >
      <Image
        src={getLocalFlagUrl(countryCode)}
        alt={alt}
        fill
        sizes={`${width}px`}
        className="object-cover"
      />
    </span>
  );
}
