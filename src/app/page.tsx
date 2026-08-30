import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Placeholder scope note: this file is intentionally minimal.
 * The full Landing experience (live corridor stats, the journey
 * planner form, smart-match preview) is built in Phase 2 — this
 * pass only proves out typography, theming, spacing and the
 * responsive shell the rest of the app will sit inside.
 */
export default function Home() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:px-6 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">
        Coastal Karnataka mobility network
      </span>
      <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.05] text-foreground md:text-5xl lg:text-6xl">
        Every return journey matters.
      </h1>
      <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
        ReturnGo matches a driver&apos;s empty return leg to a passenger
        already waiting for that exact journey — from Bhatkal to Goa
        Airport, before a booking ever happens.
      </p>
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/plan">
            Plan a journey <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/driver/publish">Publish as a driver</Link>
        </Button>
      </div>
    </section>
  );
}
