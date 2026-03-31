export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex gap-1.5">
        <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
        <span className="size-2 rounded-full bg-primary animate-bounce" />
      </div>
    </div>
  );
}
