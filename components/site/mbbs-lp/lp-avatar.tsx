import Image from "next/image";

type Props = {
  name: string;
  photoUrl?: string;
  size?: number;
  className?: string;
};

/**
 * Renders a real photo when photoUrl is supplied. Until then, falls back to
 * an initials avatar so the layout already reserves the right space —
 * drop a photoUrl in the testimonial/team data to swap it in later.
 */
export function LpAvatar({ name, photoUrl, size = 48, className }: Props) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt={name}
        width={size}
        height={size}
        className={`shrink-0 rounded-full object-cover ${className ?? ""}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${className ?? ""}`}
      style={{ width: size, height: size, background: "#0f3d37" }}
    >
      {initials}
    </div>
  );
}
