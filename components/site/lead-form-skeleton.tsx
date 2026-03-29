import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LeadFormSkeleton({
  embedded = false,
  title = "Talk to an admissions expert",
  description = "Share your details and our counsellors will reach out to understand your goals and guide you through your options.",
}: {
  embedded?: boolean;
  title?: string;
  description?: string;
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
    return fields;
  }

  return (
    <Card id="lead-form" className="border-border/80 bg-card/90 shadow-xl">
      <CardHeader className="space-y-3">
        <CardTitle className="font-display text-3xl tracking-tight text-heading">
          {title}
        </CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>{fields}</CardContent>
    </Card>
  );
}
