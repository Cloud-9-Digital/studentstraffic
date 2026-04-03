import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function LeadFormSkeleton({
  embedded = false,
  title = "Talk to an admissions expert",
  description = "Share your details and our counsellors will reach out to understand your goals and guide you through your options.",
  className,
}: {
  embedded?: boolean;
  title?: string;
  description?: string;
  className?: string;
}) {
  const fields = (
    <div className="space-y-4" aria-hidden="true">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-muted/70" />
          <div className="h-11 rounded-xl bg-muted/70" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-muted/70" />
          <div className="h-11 rounded-xl bg-muted/70" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-muted/70" />
          <div className="h-11 rounded-xl bg-muted/70" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-14 rounded bg-muted/70" />
          <div className="h-11 rounded-xl bg-muted/70" />
        </div>
      </div>

      <div className="h-11 rounded-xl bg-muted/70" />
    </div>
  );

  if (embedded) {
    return <div className={className}>{fields}</div>;
  }

  return (
    <Card
      id="lead-form"
      className={cn(
        "w-full max-w-md border-border/80 bg-card/90 shadow-xl",
        className
      )}
    >
      <CardHeader className="space-y-3">
        <CardTitle className="font-display text-2xl tracking-tight text-heading">
          {title}
        </CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>{fields}</CardContent>
    </Card>
  );
}
