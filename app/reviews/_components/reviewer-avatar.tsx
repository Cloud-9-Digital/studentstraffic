export function ReviewerAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[0.65rem] font-bold text-accent">
      {initials}
    </div>
  );
}
