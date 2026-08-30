import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-start gap-4 px-4 py-32 sm:px-6 lg:px-8">
      <Compass className="size-8 text-secondary" aria-hidden="true" />
      <h1 className="font-display text-3xl font-semibold text-foreground">
        This route doesn&apos;t exist.
      </h1>
      <p className="text-muted-foreground">
        The page you&apos;re looking for may have moved, or the journey link has
        expired. Head back and plan a fresh one.
      </p>
      <Button asChild size="lg" className="mt-2">
        <Link href="/">Back to ReturnGo</Link>
      </Button>
    </section>
  );
}
