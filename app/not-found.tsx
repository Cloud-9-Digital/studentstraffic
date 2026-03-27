import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <Card className="mx-auto max-w-2xl text-center">
          <CardHeader className="space-y-4">
            <CardTitle className="font-display text-heading text-5xl tracking-tight">
              That page is not part of the current Students Traffic launch map.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <p>
              Try the university finder or return to the homepage to explore the
              live routes in this build.
            </p>
            <div className="flex justify-center gap-3">
              <Button asChild>
                <Link href="/">Go home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/universities">Open finder</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
