import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LandingPage } from "@/lib/data/types";

export function LandingCard({ page }: { page: LandingPage }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <Badge>{page.kicker}</Badge>
        <CardTitle>{page.title}</CardTitle>
        <CardDescription>{page.summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {page.heroHighlights.slice(0, 3).map((highlight) => (
            <li key={highlight} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link
          href={`/${page.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground"
        >
          Open page
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
